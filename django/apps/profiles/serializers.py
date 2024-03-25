from django_countries.serializer_fields import CountryField
from rest_framework import serializers

from .models import Profile


class ProfilePublicSerializer(serializers.ModelSerializer):
    username = serializers.CharField(source="user.username")
    first_name = serializers.CharField(source="user.first_name")
    last_name = serializers.CharField(source="user.last_name")
    date_joined = serializers.DateTimeField(source="user.date_joined")

    # name_only gives county name instead of country code
    country = CountryField(name_only=True)

    class Meta:
        model = Profile
        fields = [
            "username",
            "first_name",
            "last_name",
            "date_joined",
            "id",
            "profile_photo",
            "about_me",
            "country",
            "native_language",
        ]


class ProfilePrivateSerializer(ProfilePublicSerializer):
    email = serializers.EmailField(source="user.email")

    class Meta(ProfilePublicSerializer.Meta):
        fields = ProfilePublicSerializer.Meta.fields + [
            "email",
        ]


class UpdateProfileSerializer(serializers.ModelSerializer):
    country = CountryField(name_only=True)

    class Meta:
        model = Profile
        fields = [
            "profile_photo",
            "about_me",
            "country",
            "native_language",
        ]
