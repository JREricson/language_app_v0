from django_countries.fields import CountryField

from apps.common.models import TimeStampedUUIDModel
from django.conf.global_settings import LANGUAGES
from django.contrib.auth import get_user_model
from django.db import models
from django.utils.translation import gettext_lazy as _
import uuid



class DictDetail(models.Model):

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    word = models.CharField(
        verbose_name=_("Word"),
        blank=False,
        null=False,
        max_length=100,
        db_index=True,
    )

    source_lang_code = models.CharField(
        verbose_name=_("Source language code"),
        choices=LANGUAGES,
        blank=False,
        null=True,
        max_length=8,
    )

    trans_lang_code = models.CharField(
        verbose_name=_("Translation language code"),
        choices=LANGUAGES,
        blank=False,
        null=True,
        max_length=8,
    )

    gender = models.CharField(
        verbose_name=_("Gender"),
        blank=False,
        null=True,
        max_length=50,  # may change
    )

    pos = models.CharField(
        verbose_name=_("Part of speech"),
        blank=False,
        null=True,
        max_length=100,
    )

    translation = models.TextField(
        verbose_name=_("Translation"),
        blank=False,
        null=True,
    )
    refer_to = models.CharField(
        verbose_name=_("Refer to"),
        blank=False,
        null=True,
        max_length=100,
    )

    def __str__(self):
        return f"{self.word}"
