from rest_framework import serializers
from .models import DictDetail
from ..words.models import WordStat
from ..words.serializers import WordStatSerializer


class DictDetailSerializer(serializers.ModelSerializer):
    ref_translations = serializers.SerializerMethodField()

    class Meta:
        model = DictDetail
        fields = [
            "word",
            "gender",
            "pos",
            "translation",
            "refer_to",
            "ref_translations",
        ]

    def get_ref_translations(self, obj):
        if obj.refer_to:
            related_defs = DictDetail.objects.filter(
                word=obj.refer_to,
                source_lang_code=obj.source_lang_code,
                trans_lang_code=obj.trans_lang_code,
            )
            return ReferenceDictDetailSerializer(related_defs, many=True).data
        return None


class ReferenceDictDetailSerializer(serializers.ModelSerializer):
    class Meta:
        model = DictDetail
        fields = [
            "gender",
            "pos",
            "translation",
            "refer_to",
        ]


class ManyDictItemRequestSerializer(serializers.Serializer):
    source_lang_code = serializers.CharField(max_length=7)
    trans_lang_code = serializers.CharField(max_length=7)
    words = serializers.ListField(child=serializers.CharField(max_length=100))
    do_include_stats = serializers.BooleanField(default=False)


class WordEntrySerializer(serializers.Serializer):
    definitions = DictDetailSerializer(many=True)
    source_word_stats = WordStatSerializer(allow_null=True)


class DictionaryResponseSerializer(serializers.Serializer):
    def to_representation(self, instance):
        """
        instance should be a dictionary where keys are words and values are dicts
        with 'definitions' and 'source_word_stats'
        """
        return {
            word: WordEntrySerializer(value).data for word, value in instance.items()
        }
