import logging


from drf_spectacular.utils import extend_schema
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView


from ..common.exceptions import InvalidJsonException
from django.core.exceptions import ValidationError


# from .exceptions import InvalidCredentialsForProfileException, ProfileNotFoundException
# from .models import Profile
# from .renderers import ProfileJSONRenderer, ProfilesJSONRenderer

from .serializers import (
    DictionaryResponseSerializer,
    ManyDictItemRequestSerializer,
)
from .models import DictDetail
from ..words.models import WordDetail
from ..words.serializers import WordDetailSerializer


class GetManyDictDetailsAPIView(APIView):
    @extend_schema(
        summary="""given a source language and a target language, api will return a list of translations""",
        responses=DictionaryResponseSerializer,  # todo fill out
    )
    # POST because GET methods are not supposed to have a body
    def post(self, request):
        # todo add filtering for for accepted language translations and test this

        source_lang_code = request.data.get("source_lang_code")
        trans_lang_code = request.data.get("trans_lang_code")
        words = request.data.get("words", [])
        do_include_stats = request.data.get("do_include_stats", False)
        serializer = ManyDictItemRequestSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        dict_details = DictDetail.objects.filter(
            source_lang_code=source_lang_code,
            trans_lang_code=trans_lang_code,
            word__in=words,
        )
        words = request.data.get("words", [])

        res = {}
        for word in words:
            definitions = DictDetail.objects.filter(
                word=word,
                source_lang_code=source_lang_code,
                trans_lang_code=trans_lang_code,
            )
            word_stats = WordDetail.objects.filter(
                word=word, lang_code=source_lang_code
            ).first()

            if definitions.exists() or word_stats:
                res[word] = {
                    "definitions": definitions,
                    "source_word_stats": (
                        word_stats if do_include_stats and word_stats else None
                    ),
                }

        return Response(
            DictionaryResponseSerializer().to_representation(res),
            status=status.HTTP_200_OK,
        )
