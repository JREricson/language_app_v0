from rest_framework import serializers
from .models import WordDetail


class WordDetailSerializer(serializers.ModelSerializer):

    class Meta:
        model = WordDetail
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


class ManyWordRequestSerializer(serializers.Serializer):
    lang_code = serializers.CharField(max_length=8)
    words = serializers.ListField(child=serializers.CharField(max_length=100))


class ManyWordResponseSerializer(serializers.ModelSerializer):
    
    class Meta:
        model = WordDetail
        fields = [
            "word",
            "lang_code",
            "lemma",
            "lemma_morph",
            "word_prct",
            "lemma_prct",
        ]
