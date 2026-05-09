import logging


from drf_spectacular.utils import extend_schema
from rest_framework import status, permissions
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.exceptions import NotFound, ValidationError
from django.db import transaction, IntegrityError

import json
from django.core.exceptions import ValidationError


from django.conf.global_settings import LANGUAGES

from .models import WordStat, WordList, Definition, WordUserData
from ..dictionary.models import DictDetail

from .serializers import (
    GetWordDetailResSerializer,
    ManyWordRequestSerializer,
    ManyWordDetailSerializer,
    RenameThisResSerializer,
    RenameUserWordDetailSerializer,
    UserWordDetailsPostSerializer,
    UserWordDetailSerializer,
    WordDefinitionSerializer,
    WordStatSerializer,
    UserWordDetailsResSerializer,
    WordStatsSerializer,
)

logger = logging.getLogger(__name__)




 
### TODO double check all that are below
###########################################
#####################################
class GetManyWordStatsAPIView(APIView):

    @extend_schema(
        summary="""Return statistical details on words or word fragments from a list""",
        responses=WordStatSerializer,
    )
    # Acts as GET method, why -> GET methods are not supposed to have a body
    def post(self, request):
        data = request.data
        serializer = ManyWordRequestSerializer(data=data)
        serializer.is_valid(raise_exception=True)

        result = WordStat.objects.filter(
            lang_code=data["lang_code"], word__in=data["words"]
        )

        out_serializer = ManyWordDetailSerializer(result, many=True)
        res = {}
        for item in out_serializer.data:
            res[item["word"]] = {
                "lemma": item["lemma"],
                "lemma_morph": item["lemma_morph"],
                "word_prct": item["word_prct"],
                "lemma_prct": item["lemma_prct"],
            }

        for word in data["words"]:
            if word not in res:
                res[word] = None

        return Response(res, status=status.HTTP_200_OK)



class UserWordDataAPIView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    @extend_schema(
        summary="""Adds UserWordDetails. These store information about each word that the user is keeping track of.""",  # TODO -make this so that it is correct
    )
    def post(self, request):
        owner = self.request.user
        err_msgs = []
        new_defn_objs = []
        word_list_objs = []
        words_seen = set()
        # TODO - change this and the serializer to create multiple lists or no list
        # -- data extraction -- #
        list_names, source_lang, trans_lang, req_word_details = (
            self.extract_details_or_throw_err(request)
        )
        print(f"req is <{request.data}>")

        print(f"word req <{req_word_details }>")
        res = {}

        word_list_obj = self.create_word_list_obj(
            owner, list_names, source_lang, trans_lang, word_list_objs
        )

        word_detail_db_objs = []
        for detail in req_word_details:

            word = detail["word"]
            if word in words_seen:
                # repeated words will be skipped entirely
                err_msgs.append(f"<{word}> was included more than once.")
                continue
            else:
                words_seen.add(word)
            definitions = detail["definitions"]
            #  TODO - want to make sure that all old definitions are not written more than once => Want to be idempotent

            try:
                word_detail_db_obj = WordUserData.objects.get(
                    source_lang=source_lang,
                    owner=owner,
                    trans_lang=trans_lang,
                    word=word,
                )
            except WordUserData.DoesNotExist:
                word_detail_db_obj = WordUserData(
                    source_lang=source_lang,
                    owner=owner,
                    word=word,
                    trans_lang=trans_lang,
                )

            if "notes" in detail:
                word_detail_db_obj.notes = detail["notes"]
            if "img_uri" in detail:
                word_detail_db_obj.img_uri = detail["img_uri"]
            if "familiarity_level" in detail:
                word_detail_db_obj.familiarity_level = detail["familiarity_level"]

            else:
                err_msgs.append(request.data)

            word_detail_db_objs.append(word_detail_db_obj)

            defn_set = set()
            for defn in definitions:

                db_dfen = Definition.objects.filter(
                    gender=defn["gender"],
                    pos=defn["pos"],
                    definition=defn["definition"],
                    list_det_fkey=word_detail_db_obj,
                )

                if (
                    not db_dfen
                    and (defn["gender"], defn["pos"], defn["definition"])
                    not in defn_set
                ):
                    # TODO -test
                    new_defn_obj = Definition(
                        gender=defn["gender"],
                        pos=defn["pos"],
                        definition=defn["definition"],
                        list_det_fkey=word_detail_db_obj,
                    )
                    new_defn_objs.append(new_defn_obj)
                    defn_set.add((defn["gender"], defn["pos"], defn["definition"]))
                else:
                    err_msgs.append(
                        f"Skipping repeated definition for word <{word}> found in database/request def: <{str(defn)}>"
                    )

        # -- committing changes -- #
        try:
            self.commit_changes_as_transaction(
                new_defn_objs, word_list_objs, word_list_obj, word_detail_db_objs
            )
            # TODO test to make sure that everything is deleted when deleting a user
        except IntegrityError as e:
            logging.error(f"A transaction failed while adding a new word list <{e}>")
            return Response(
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )

        if len(err_msgs) > 0:
            res["errors"] = err_msgs

        return Response(
            res,
            status=status.HTTP_200_OK,
        )

    def commit_changes_as_transaction(
        self, new_defn_objs, word_list_objs, word_list_obj, word_detail_db_objs
    ):
        with transaction.atomic():
            for wd_obj in word_detail_db_objs:
                wd_obj.save()
            for d_obj in new_defn_objs:
                d_obj.save()

            for wl_obj in word_list_objs:
                wl_obj.save()
                word_list_obj.save()

    def create_word_list_obj(
        self, owner, list_names, source_lang, trans_lang, word_list_objs
    ):
        for list_name in list_names:
            # TODO - can I do this all as one SQL query?
            try:
                word_list_obj = WordList.objects.get(
                    source_lang=source_lang,
                    trans_lang=trans_lang,
                    list_name=list_name,
                    owner=owner,
                )
                logger.error(f"List name <{list_name}> found")  # delete this
            except WordList.DoesNotExist:
                word_list_obj = WordList(
                    source_lang=source_lang,
                    trans_lang=trans_lang,
                    list_name=list_name,
                    owner=owner,
                )

            word_list_objs.append(word_list_obj)
        return word_list_obj

    def extract_details_or_throw_err(self, request):

        serializer = UserWordDetailsPostSerializer(
            data=request.data, 
        )
        serializer.is_valid(raise_exception=True)

        if "list_names" in request.data:
            list_names = request.data["list_names"]
        else:
            list_names = None
        source_lang = request.data["source_lang"]
        trans_lang = request.data["trans_lang"]
        req_word_details = request.data["user_word_details"]
        print(f"serializer data <{serializer.data}>")



        if list_names and not isinstance(list_names, list):
            # ideally this should be in the serializer
            # TODO - check for similar items to fix
            return Response(
                "list_names must be a list",
                status=status.HTTP_400_BAD_REQUEST,
            )

        return list_names, source_lang, trans_lang, req_word_details

    @extend_schema(
        summary="""Creates a new list of words. Repeated words will only be added for the first occurrence""",
    )
    def get(self, request):

        pass


class UserWordDetailsAPIView(APIView):
    permission_classes = [permissions.IsAuthenticated]
    # renderer_classes = [] # TODO - fill in with correct one

    @extend_schema(
        summary="""Returns user detail for words. Adding the boolean field `do_include_stats` as true will return word and lemma frequency statistics,
          which is set to false if not include. Adding the field "do_include_dates will show the date the item was last seen and when it is expected
          to be shown again.""",
        responses=GetWordDetailResSerializer(),  # Todo - verify that this works
    )
    def post(self, request):
        # -- json validation -- #
        serializer = self.validate_req_or_throw_err(request)
        (
            owner,
            words,
            source_lang,
            trans_lang,
            do_include_dates,
            do_include_stats,
            do_include_definitions,
            do_include_user_word_details,
        ) = self.extract_data_from_req(serializer)
        # user_word_dets = self.get_user_word_details(
        #     owner,
        #     words,
        #     source_lang,
        #     trans_lang,
        #     do_include_dates,
        #     do_include_user_word_details,
        # )

        # todo create func for this
        # if do_include_stats:
        #     word_stats_q_obj = WordDetail.objects.filter(
        #         lang_code=source_lang, word__in=words
        #     )

        # else:
        #     word_stats_q_obj = None
        # out_serializer = ManyWordResponseSerializer(word_stats_q_obj, many=True)

        # for item in out_serializer.data:
        #     logging.error(item)
        #     s_word = item["word"]
        #     res[s_word]["stats"] = {
        #         "lemma": item["lemma"],
        #         "lemma_morph": item["lemma_morph"],
        #         "word_prct": item["word_prct"],
        #         "lemma_prct": item["lemma_prct"],
        #         # "user_definitions": item["definitions"],
        #     }

        # todo create func for this
        # if do_include_definitions:
        #     logging.error("including defn")  # todo remove this

        #     definitions_query_set = DictDetail.objects.filter(
        #         source_lang_code=source_lang,
        #         trans_lang_code=trans_lang,
        #         word__in=words,
        #     ).all()
        # else:
        #     definitions_query_set = None

        # all_queries = []
        # for word in words:
        #     if user_word_dets:
        #         user_details = user_word_dets.filter(word=word).first()
        #     else:
        #         logging.error("no word details")
        #         user_details = None

        #     # if not do_include_dates:
        #     #         user_details.pop("last_seen")
        #     if word_stats_q_obj:
        #         stats = word_stats_q_obj.filter(word=word).first()
        #     else:
        #         stats = None

        #     if definitions_query_set:
        #         definitions = definitions_query_set.filter(word=word).all()
        #         logging.error(" def below")
        #         logging.error(definitions)
        #     else:
        #         definitions = None

        #     user_details = (
        #         RenameUserWordDetailSerializer(user_details).data
        #         if user_details
        #         else None
        #     )
        #     if user_details and not do_include_dates:
        #         del user_details["last_seen"]
        #         del user_details["show_next"]

        #     new_item = {
        #         "word": word,
        #         # "stats": (WordStatsSerializer(stats).data if stats else None),
        #         # "definitions": (D),
        #         # 'stats': WordStatsSerializer(stats).data if stats else None
        #     }
        #     if do_include_stats:
        #         new_item["stats"] = WordStatsSerializer(stats).data if stats else None
        #     if do_include_user_word_details:
        #         new_item["user_details"] = user_details
        #     if do_include_definitions:
        #         new_item["definitions"] = (
        #             WordDefinitionSerializer(definitions, many=True).data if definitions else None
        #         )

        #     all_queries.append(new_item)

        # # Serialize the combined data
        # rename_serializer = RenameThisResSerializer(all_queries, many=True).data

        # res = rename_serializer
        # for u_detail in list(user_word_dets):
        #     u_detail.pop("word", None)
        #     word = u_detail["word"]  # todo check that this works
        #     # del u_detail[
        #     #     "word"
        #     # ]  # todo - check that this is something th
        res = {}
        return Response(
            res,
            status=status.HTTP_200_OK,
        )

    def get_user_word_details(
        self,
        owner,
        words,
        source_lang,
        trans_lang,
        do_include_dates,
        do_include_user_word_details,
    ):
        if do_include_user_word_details:
            user_w_det_values = ["notes", "word", "familiarity_level", "img_uri"]
            if do_include_dates:
                user_w_det_values += ["last_seen", "show_next"]

            user_word_dets = WordUserData.objects.filter(
                owner=owner,
                source_lang=source_lang,
                trans_lang=trans_lang,
                word__in=words,
            ).values(*user_w_det_values)
        else:
            user_word_dets = None
        return user_word_dets

    def extract_data_from_req(self, serializer):
        owner = self.request.user
        do_include_stats = serializer.data["do_include_stats"]
        words = serializer.data["words"]
        source_lang = serializer.data["source_lang"]
        trans_lang = serializer.data["trans_lang"]
        do_include_dates = serializer.data["do_include_dates"]
        do_include_definitions = serializer.data["do_include_definitions"]
        do_include_user_word_details = serializer.data["do_include_user_word_details"]
        return (
            owner,
            words,
            source_lang,
            trans_lang,
            do_include_dates,
            do_include_stats,
            do_include_definitions,
            do_include_user_word_details,
        )

    def validate_req_or_throw_err(self, request):
        serializer = UserWordDetailsPostSerializer(
            data=request.data,
        )
        serializer.is_valid(raise_exception=True)
        return serializer


class WordDefinitionsAPIView(APIView):
    permission_classes = [permissions.IsAuthenticated]
    # TODO  create this view
    pass


def raise_exceptions_based_on_invalid_id(word):
    try:
        WordStat.objects.get(word=word)
    except WordStat.DoesNotExist:
        raise NotFound(f"Word <{word}> not found.")
    except ValidationError:
        # End user does not need to know it is a validation error
        raise NotFound(f"Word <{word}> not found.")
    except Exception as e:
        logger.warning(f"Unknown exception occurred<{e}> type <{type(e)}>.")
        # Not found on unknown to keep user from knowing what the issue was.
        raise NotFound(f"Word <{word}> not found.")


# TODO - what is this? get rid of it???
# class UserWordDetailsAPIView2(APIView):
#     permission_classes = [permissions.IsAuthenticated]
#     # renderer_classes = [] # TODO - fill in with correct one

#     @extend_schema(
#         summary="""Returns user detail for words. Adding the boolean field `do_include_stats` as true will return word and lemma frequency statistics,
#           which is set to false if not include. Adding the field "do_include_dates will show the date the item was last seen and when it is expected
#           to be shown again.""",
#         responses=GetWordDetailResSerializer(),  # Todo - verify that this works
#     )
#     def post(self, request):
#         # -- json validation -- #
#         serializer = self.validate_req_or_throw_err(request)
#         owner, do_include_stats, words, source_lang, trans_lang, do_include_dates = (
#             self.extract_data_from_req(serializer)
#         )

#         # -- Creating payload -- #
#         # Django ORM does not support full outer joins because there is no related model for the result, adding each model separately
#         # and letting server instead of database deal with joining the data
#         res = self.init_res(do_include_stats, words)
#         self.add_user_details_to_res(
#             owner, words, source_lang, trans_lang, do_include_dates, res
#         )
#         self.add_stats_to_get_res(do_include_stats, words, source_lang, res)
#         do_include_definitions = False  # TODO - put this is payload
#         self.add_defns_to_get_res(do_include_definitions, source_lang, trans_lang, res)
#         res_serializer = GetWordDetailResSerializer(
#             data=res,
#         )
#         try:
#             res_serializer.is_valid(raise_exception=True)
#         except Exception as e:
#             logging.error(f"A request failed that should not have. Res<{res}> e<{e}>")
#             return Response(
#                 "An unknown error occurred",
#                 status=status.HTTP_500_INTERNAL_SERVER_ERROR,
#             )

#         return Response(
#             res,
#             status=status.HTTP_200_OK,
#         )

#     def validate_req_or_throw_err(self, request):
#         serializer = UserWordDetailsReqSerializer(
#             data=request.data,
#         )
#         serializer.is_valid(raise_exception=True)
#         return serializer

#     def extract_data_from_req(self, serializer):
#         owner = self.request.user
#         do_include_stats = serializer.data["do_include_stats"]
#         words = serializer.data["words"]
#         source_lang = serializer.data["source_lang"]
#         trans_lang = serializer.data["trans_lang"]
#         do_include_dates = serializer.data["do_include_dates"]
#         return owner, do_include_stats, words, source_lang, trans_lang, do_include_dates

#     def add_stats_to_get_res(self, do_include_stats, words, source_lang, res):
#         if do_include_stats:
#             word_stats_q_obj = WordDetail.objects.filter(
#                 lang_code=source_lang, word__in=words
#             )
#             out_serializer = ManyWordResponseSerializer(word_stats_q_obj, many=True)

#             for item in out_serializer.data:
#                 logging.error(item)
#                 s_word = item["word"]
#                 res[s_word]["stats"] = {
#                     "lemma": item["lemma"],
#                     "lemma_morph": item["lemma_morph"],
#                     "word_prct": item["word_prct"],
#                     "lemma_prct": item["lemma_prct"],
#                     # "user_definitions": item["definitions"],
#                 }

#     def add_defns_to_get_res(
#         self, do_include_definitions, source_lang, trans_lang, res
#     ):

#         if do_include_definitions:
#             logging.error("including defn")  # todo remove this

#             for word in res:
#                 res[word]["definitions"] = []

#             definitions_query_set = DictDetail.objects.filter(
#                 source_lang_code=source_lang,
#                 trans_lang_code=trans_lang,
#                 word__in=res.keys(),
#             ).all()
#             db_defn_data = DictDetailSerializer(definitions_query_set, many=True)
#             for defn_obj in db_defn_data.data:
#                 obj_word = defn_obj["word"]
#                 del defn_obj["word"]  # make sure I can do this in the language
#                 res[obj_word]["definitions"].append(defn_obj)

#             # for item in defn_obj.data:

#         # else:
#         #     res[word]["definitions"] = None

#     def add_user_details_to_res(
#         self, owner, words, source_lang, trans_lang, do_include_dates, res
#     ):
#         values = ["notes", "word", "familiarity_level", "img_uri"]
#         if do_include_dates:
#             values += ["last_seen", "show_next"]

#         user_word_dets = UserWordDetail.objects.filter(
#             owner=owner, source_lang=source_lang, trans_lang=trans_lang, word__in=words
#         ).values(*values)

#         # Todo - there is no serializer for this. create one and add the user definitions to it

#         for u_detail in list(user_word_dets):
#             u_detail.pop("word", None)
#             word = u_detail["word"]  # todo check that this works
#             # del u_detail[
#             #     "word"
#             # ]  # todo - check that this is something that the language safely allows
#             res[word]["user_details"] = u_detail

#     def init_res(self, do_include_stats, words):
#         res = {}
#         default_res_val = {"user_details": None}
#         if do_include_stats:
#             default_res_val["stats"] = (None,)
#         for word in words:
#             res[word] = {"user_details": None}
#         return res


# class GetWordDetailsAPIView(APIView):
#     # todo - put permissions back in
#     # permission_classes = [permissions.IsAuthenticated]
#     renderer_classes = [WordDetailSerializer]

#     @extend_schema(
#         summary="""Return information on words or word fragments, such as word frequency and lemma""",  # TODO - fill this in
#         responses=WordDetailSerializer,
#     )
#     def get(self, request):
#         ## TODO - is this endpoint still used???
#         word = self.request.query_params.get("word")
#         raise_exceptions_based_on_invalid_id(word)
#         # todo - include language code???
#         selected_word = WordDetail.objects.get(word=word)
#         serializer = WordDetailSerializer(selected_word, context={"request": request})
#         return Response(serializer.data, status=status.HTTP_200_OK)
