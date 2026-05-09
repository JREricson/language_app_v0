from rest_framework import serializers
from .models import WordUserData, Definition, WordStat, WordList
from django.conf.global_settings import LANGUAGES
from ..dictionary.models import DictDetail


class WordStatSerializer(serializers.ModelSerializer):
    class Meta:
        model = WordStat
        fields = [
            "word",
            "lang_code",
            "lemma",
            "word_count",
            "lemma_count",
            "lemma_morph",
            "word_prct",
            "lemma_prct",
        ]


## double check all below
###############################################
################################

class ManyWordRequestSerializer(serializers.Serializer):
    lang_code = serializers.CharField(max_length=7)
    words = serializers.ListField(child=serializers.CharField(max_length=100))


class WordDefinitionSerializer(serializers.ModelSerializer):
    class Meta:
        model = DictDetail
        fields = [
            "gender",
            "pos",
            "translation",
        ]


class ManyWordDetailSerializer(serializers.ModelSerializer):
    class Meta:
        model = WordStat
        fields = [
            "word",
            "lang_code",
            "lemma",
            "lemma_morph",
            "word_prct",
            "lemma_prct",
        ]


class UserWordDetailSerializer(serializers.Serializer):
    word = serializers.CharField(max_length=100)
    familiarity_level = serializers.IntegerField()
    definitions = WordDefinitionSerializer(
        many=True,  # default=None, allow_null=True, allow_blank=False
        #   TODO - see if way to make this unique
    )
    notes = serializers.CharField(required=False, allow_null=True, allow_blank=True)
    img_uri = serializers.URLField(required=False, allow_null=True)
    last_seen = serializers.DateTimeField(required=False, allow_null=True)
    show_next = serializers.DateTimeField(required=False, allow_null=True)


class UserWordDetailReqItemSerializer(serializers.Serializer):
    word = serializers.CharField()


class UserWordDetailsPostSerializer(serializers.Serializer):
    do_include_stats = serializers.BooleanField(default=False)
    do_include_dates = serializers.BooleanField(default=False)
    do_include_definitions = serializers.BooleanField(default=False)
    do_include_user_word_details = serializers.BooleanField(default=False)
    source_lang = serializers.CharField()
    trans_lang = serializers.CharField()
    words = serializers.ListField(child=serializers.CharField(max_length=100))

    def validate(self, data):
        is_stats = data.get("do_include_stats", False)
        is_defs = data.get("do_include_definitions", False)
        is_user_det = data.get("do_include_user_word_details", False)

        if not (is_stats or is_defs or is_user_det):
            raise serializers.ValidationError(
                "One of the following fields needs to be set as true:<do_include_definitions, do_include_user_word_details, do_include_stats>"
            )
        return data

    # if not (do_include_definitions or do_include_user_word_details or do_include_stats):
    #     raise serializers.ValidationError(
    #         "One of the following fields needs to be set as true:<do_include_definitions, do_include_user_word_details, do_include_stats>"
    #     )




class WordDetailSerializerRes(serializers.ModelSerializer):

    class Meta:
        model = WordStat
        fields = [
            "lemma",
            "word_count",
            "lemma_count",
            "lemma_morph",
            "word_prct",
            "lemma_prct",
        ]


class UserWordDetailsResSerializer(serializers.Serializer):
    familiarity_level = serializers.IntegerField(required=False, allow_null=True)
    definitions = WordDefinitionSerializer(
        many=True,  # default=None, allow_null=True, allow_blank=False
        required=False,
        #   TODO - see if way to make this unique
    )
    notes = serializers.CharField(required=False, allow_null=True, allow_blank=True)
    img_uri = serializers.URLField(required=False, allow_null=True)
    last_seen = serializers.DateTimeField(required=False, allow_null=True)
    show_next = serializers.DateTimeField(required=False, allow_null=True)


class GetWordDetailSerializer(serializers.Serializer):
    user_details = UserWordDetailsResSerializer(allow_null=True, required=False)
    stats = WordDetailSerializerRes(allow_null=True, required=False)


class GetWordDetailResSerializer(serializers.Serializer):
    def to_internal_value(self, data):
        if not isinstance(data, dict):
            raise serializers.ValidationError("Expected a dictionary of word entries.")

        validated_data = {}
        for word, entry in data.items():
            serializer = GetWordDetailSerializer(data=entry)
            serializer.is_valid(raise_exception=True)
            validated_data[word] = serializer.validated_data
        return validated_data


class WordStatsSerializer(serializers.ModelSerializer):
    # user definitions need to be added here or elsewhere

    class Meta:
        model = WordStat
        fields = [
            "lemma",
            "word_count",
            "lemma_count",
            "lemma_morph",
            "word_prct",
            "lemma_prct",
        ]


## TODO - want to remove the content below


class RenameUserWordDetailSerializer(serializers.ModelSerializer):
    # user definitons need to be added here or elsewhere

    class Meta:
        model = WordUserData
        fields = ["notes", "familiarity_level", "img_uri", "last_seen", "show_next"]


class RenameThisResSerializer(serializers.Serializer):
    user_details = RenameUserWordDetailSerializer()
    stats = WordStatsSerializer()
    definitions = WordDefinitionSerializer()

    def to_representation(self, instance):
        # Assuming 'instance' is a dictionary with 'word' as the key
        word = instance["word"]
        user_details = instance.get("user_details", None)
        stats = instance.get("stats", None)
        definitions = instance.get("definitions")

        res = {
            word: {
                # "user_details": user_details,
            }
        }
        if "user_details" in instance:
            res[word]["user_details"] = user_details

        if "definitions" in instance:
            res[word]["definitions"] = definitions
        if "stats" in instance:
            res[word]["stats"] = stats
        return res

class StrictListField(serializers.ListField):
    def to_internal_value(self, data):
        if not isinstance(data, list):
            raise serializers.ValidationError("Expected a list of items.")
        return super().to_internal_value(data)


class UserWordDetailsResSerializer(serializers.Serializer):
    list_name = (serializers.CharField(max_length=50),)
    list_names = (
        serializers.ListField(
            child=serializers.CharField(max_length=50), required=False
        ),
    )
    source_lang = serializers.ChoiceField(choices=LANGUAGES)
    trans_lang = serializers.ChoiceField(choices=LANGUAGES)
    user_word_details = UserWordDetailSerializer(many=True, required=True)
