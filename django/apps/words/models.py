from django_countries.fields import CountryField

from apps.common.models import TimeStampedUUIDModel
from django.conf.global_settings import LANGUAGES
from django.contrib.auth import get_user_model
from django.db import models
from django.utils.translation import gettext_lazy as _
import uuid


class WordDetail(models.Model):

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
        max_length=8,
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

    lemma_prct = models.FloatField(verbose_name=_("Lemma percent"), default=None)

    class Meta:
        unique_together = (("lang_code", "word"),)

    def __str__(self):
        return f"{self.word}"
