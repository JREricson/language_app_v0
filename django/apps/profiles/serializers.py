from django_countries.serializer_fields import CountryField
from rest_framework import serializers

from .models import Profile


class ProfileSerializer(serializers.ModelSerializer):
    username = serializers.CharField(source="user.username")
    first_name = serializers.CharField(source="user.first_name")
    last_name = serializers.CharField(source="user.last_name")
    email = serializers.EmailField(source="user.email")
    date_joined = serializers.DateTimeField(source="user.date_joined")
    full_name = serializers.SerializerMethodField(read_only=True)
    country = CountryField(
        name_only=True
    )  # name_only gives county name instead of country code

    class Meta:
        model = Profile
        fields = [
            "username",
            "first_name",
            "last_name",
            "full_name",
            "email",
            "date_joined",
            "id",
            "profile_photo",
            "about_me",
            "country",
            "native_language",
        ]

    def get_full_name(self, obj):
        first_name = obj.user.first_name.title()
        last_name = obj.user.last_name.title()
        return f"{first_name} {last_name}"


class UpdateProfileSerializer(serializers.ModelSerializer):
    country = CountryField(name_only=True)

    class Meta:
        model = Profile
        fields = [
            "profile_photo",
            "about_me",
            "country",
            "spanish_fluency",
            "native_language",
        ]
