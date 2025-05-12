import logging


from drf_spectacular.utils import extend_schema, extend_schema_view
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.exceptions import NotFound, NotAuthenticated, ValidationError


from django.core.exceptions import ValidationError

from ..common.shared_properties import CustomPagination, DefaultPagination


from .models import WordDetail
from .serializers import (
    ManyWordRequestSerializer,
    ManyWordResponseSerializer,
    WordDetailSerializer,
)

logger = logging.getLogger(__name__)


class GetWordDetailsAPIView(APIView):
    # todo - put permissions back in
    # permission_classes = [permissions.IsAuthenticated]
    renderer_classes = [WordDetailSerializer]

    @extend_schema(
        summary="""Return information on words or word fragments, such as word frequency and lemma""",  # TODO - fill this in
        responses=WordDetailSerializer,
    )
    def get(self, request):
        word = self.request.query_params.get("word")
        raise_exceptions_based_on_invalid_id(word)
        # todo - include language code???
        selected_word = WordDetail.objects.get(word=word)
        serializer = WordDetailSerializer(selected_word, context={"request": request})
        return Response(serializer.data, status=status.HTTP_200_OK)


def raise_exceptions_based_on_invalid_id(word):
    try:
        WordDetail.objects.get(word=word)
    except WordDetail.DoesNotExist:
        raise NotFound(f"Word <{word}> not found.")
    except ValidationError:
        # End user does not need to know it is a validation error
        raise NotFound(f"Word <{word}> not found.")
    except Exception as e:
        logger.warning(f"Unknown exception occurred<{e}> type <{type(e)}>.")
        # Not found on unknown to keep user from knowing what the issue was.
        raise NotFound(f"Word <{word}> not found.")


class GetManyWordDetailsAPIView(APIView):

    @extend_schema(
        summary="""Return information on words or word fragments form a list""",  # TODO - fill this in
        responses=WordDetailSerializer,
    )
    # Get methods are not supposed to have a body
    def post(self, request):
        data = request.data
        serializer = ManyWordRequestSerializer(data=data)
        serializer.is_valid(raise_exception=True)

        result = WordDetail.objects.filter(
            lang_code=data["lang_code"], word__in=data["words"]
        )

        out_serializer = ManyWordResponseSerializer(result, many=True)

        res = {}
        for item in out_serializer.data:

            res[item["word"]] = {
                "lemma": item["lemma"],
                "lemma_morph": item["lemma_morph"],
                "word_prct": item["word_prct"],
                "lemma_prct": item["lemma_prct"],
            }

        return Response(res, status=status.HTTP_200_OK)
