from django_countries.fields import CountryField

from apps.common.models import TimeStampedUUIDModel
from django.conf.global_settings import LANGUAGES
from django.contrib.auth import get_user_model
from django.db import models
from django.utils.translation import gettext_lazy as _

User = get_user_model()


class LanguageFluency(models.TextChoices):
    NONE = "None", _("None")
    FEMALE = "Elementary", _("Elementary")
    LIMITED = (
        "Limited",
        _("Limited"),
    )
    PROFESSIONAL = (
        "Professional",
        _("Professional"),
    )
    FULL_PROFESSIONAL = (
        "Full Professional",
        _("Full Professional"),
    )
    NATIVE_OR_BILINGUAL = (
        "Native Or Bilingual",
        _("Native Or Bilingual"),
    )


class Profile(TimeStampedUUIDModel):
    user = models.OneToOneField(User, related_name="profile", on_delete=models.CASCADE)

    about_me = models.TextField(
        verbose_name=_("About me"), default="say something about yourself"
    )

    profile_photo = models.ImageField(
        verbose_name=_("Profile Photo"),
        default="/profile_default.png",
        blank=False,
        null=False,
    )

    # language_fluency = models.CharField(
    #     verbose_name=_("Language Fluency"),
    #     choices=LanguageFluency.choices,
    #     default=LanguageFluency.NONE,
    #     max_length=19,
    #     blank=False,
    #     null=False,
    # )

    country = CountryField(
        verbose_name=_("Current Country"), default="USA", blank=False, null=False
    )

    # native_language = models.CharField(
    #     verbose_name=_("Native Language"),
    #     max_length=7,
    #     choices=LANGUAGES,
    #     blank=False,
    #     null=False,
    # )

    def __str__(self):
        return f"{self.user.username}'s profile"
