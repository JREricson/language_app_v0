import uuid
from enum import IntEnum
from django.db import models
from django.db.models import Q
from django.contrib.auth import get_user_model
from django.utils.translation import gettext_lazy as _
from django.conf.global_settings import LANGUAGES
from apps.common.models import TimeStampedUUIDModel

User = get_user_model()


class WordStat(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    word = models.CharField(
        verbose_name=_("Word"),
        blank=False,
        null=False,
        max_length=100,
        db_index=True,
    )

    lang_code = models.CharField(
        verbose_name=_("Language code"),
        choices=LANGUAGES,
        blank=False,
        null=True,
        max_length=7,
    )

    lemma = models.CharField(
        verbose_name=_("Lemma"), blank=False, null=True, max_length=100
    )

    word_count = models.IntegerField(verbose_name=_("Word count"), null=True)

    lemma_count = models.IntegerField(
        verbose_name=_("Lemma count"), null=True, default=None
    )

    lemma_morph = models.CharField(
        verbose_name=_("Lemma morphology"), null=True, default=None, max_length=150
    )
    word_prct = models.FloatField(
        verbose_name=_("Word percent"), null=True, default=None
    )

    lemma_prct = models.FloatField(
        verbose_name=_("Lemma percent"), null=True, default=None
    )

    class Meta:
        unique_together = (("lang_code", "word"),)

    def __str__(self):
        return f"{self.word}"


class FamiliarityLevelTypes(IntEnum):
    UNKNOWN = 0
    VAGUELY_FAMILIAR = 1
    SLIGHTLY_FAMILIAR = 2
    MODERATELY_FAMILIAR = 3
    VERY_FAMILIAR = 4
    EXTREMELY_FAMILIAR = 5
    COMPLETELY_FAMILIAR = 6

    @classmethod
    def choices(cls):
        return [(key.value, key.name) for key in cls]


class WordUserData(models.Model):
    owner = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        null=False,
        blank=False,
        verbose_name=_("Word detail owner"),
        related_name="user_definitions",
    )
    word = models.CharField(
        max_length=100, blank=True, verbose_name=_("Word"), db_index=True
    )

    last_seen = models.DateTimeField(
        null=True, default=None, blank=True, verbose_name=_("Last seen")
    )

    show_next = models.DateTimeField(
        null=True, default=None, blank=True, verbose_name=_("Show next")
    )

    familiarity_level = models.IntegerField(
        choices=FamiliarityLevelTypes.choices(), default=FamiliarityLevelTypes.UNKNOWN
    )

    notes = models.TextField(
        verbose_name=_("Notes"),
        blank=True,
        null=True,
        default=None,
    )

    img_uri = models.URLField(
        verbose_name=_("Image URI"), blank=True, null=True, default=None
    )

    source_lang = models.CharField(
        verbose_name=_("Source language"),
        max_length=7,
        choices=LANGUAGES,
        blank=False,
        null=False,
    )
    trans_lang = models.CharField(
        verbose_name=_("Translation language"),
        max_length=7,
        choices=LANGUAGES,
        blank=False,
        null=False,
    )

    def __str__(self):
        return (
            f"{self.owner.username}-{self.source_lang}-{self.trans_lang}--{self.word}"
        )

    class Meta:
        unique_together = (("word", "source_lang", "trans_lang", "owner"),)


class Definition(models.Model):
    user_word_data = models.ForeignKey(
        WordUserData, on_delete=models.CASCADE, null=False, blank=False
    )

    gender = models.CharField(
        verbose_name=_("Gender"),
        blank=True,
        null=True,
        max_length=50,
    )

    pos = models.CharField(
        verbose_name=_("Part of speech"),
        blank=True,
        null=True,
        max_length=100,
    )

    definition = models.TextField(
        verbose_name=_("Definition"),
        blank=True,
        null=True,
    )

    class Meta:
        unique_together = (("user_word_data", "gender", "pos", "definition"),)


class ExampleSentence(models.Model):
    definition = models.ForeignKey(
        Definition,
        on_delete=models.CASCADE,
        related_name="sentences",
        verbose_name=_("Definition"),
    )
    sentence_text = models.TextField(verbose_name=_("Sentence"))
    sentence_translation = models.TextField(
        blank=True, null=True, verbose_name=_("Sentence translation")
    )

    def __str__(self):
        return self.sentence_text[:50]


class WordList(TimeStampedUUIDModel):
    list_name = models.CharField(
        verbose_name=_("List name"),
        max_length=50,
        blank=False,
        null=False,
        db_index=True,
    )
    source_lang = models.CharField(
        verbose_name=_("Source language"),
        max_length=7,
        choices=LANGUAGES,
        blank=False,
        null=False,
    )
    trans_lang = models.CharField(
        verbose_name=_("Translation language"),
        max_length=7,
        choices=LANGUAGES,
        blank=False,
        null=False,
    )
    owner = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        null=True,
        blank=True,
        verbose_name=_("Word list owner"),
    )

    is_public = models.BooleanField(
        default=False,
        verbose_name=_("Public list"),
    )

    word_data = models.ManyToManyField(WordUserData)

    class Meta:
        constraints = [
            models.CheckConstraint(
                condition=(  # Revert from 'check' to 'condition'
                    models.Q(owner__isnull=False, is_public=False)
                    | models.Q(owner__isnull=True, is_public=True)
                ),
                name="owner_xor_public_check",
            ),
            models.UniqueConstraint(
                fields=["list_name", "source_lang", "trans_lang", "owner"],
                condition=models.Q(owner__isnull=False),
                name="unique_private_list",
            ),
            models.UniqueConstraint(
                fields=["list_name", "source_lang", "trans_lang"],
                condition=models.Q(owner__isnull=True),
                name="unique_public_list",
            ),
        ]

    def __str__(self):
        return f"{self.source_lang}-{self.trans_lang}-{self.list_name}"
