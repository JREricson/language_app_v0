import pytest
from django_countries.fields import Country
from rest_framework import status

from apps.profiles.exceptions import ProfileNotFoundException
from apps.profiles.models import Profile
from apps.profiles.views import (
    ListAllProfilesAPIView,
    raise_exceptions_based_on_invalid_id,
)
from apps.users.models import User
from django.urls import reverse
from tests.common.helpers import create_new_user

ROOT_URL = "api/v0/"


def test_profile_str(profile):
    """Test that the profile model string representation."""
    assert profile.__str__() == f"{profile.user.username}'s profile"


@pytest.mark.django_db
def test_user_creates_profile():
    user = create_new_user()
    assert Profile.objects.count() == 1
    assert User.objects.count() == 1

    user_profile = Profile.objects.get(user__id=user.id)

    assert user_profile.about_me == "Say something about yourself."
    assert str(user_profile.profile_photo).endswith(".svg")
    assert isinstance(user_profile.country, Country("USA"))
    assert user_profile.native_language is None


@pytest.mark.django_db
def test_get_profile_endpoint(api_client):
    user = create_new_user()
    assert Profile.objects.count() == 1
    assert User.objects.count() == 1

    profile_url = reverse("profile_views", args=[user.id])
    response = api_client.get(profile_url)

    assert response.status_code == status.HTTP_200_OK
    assert response.data["username"] == user.username
    assert response.data["first_name"] == user.first_name
    assert response.data["last_name"] == user.last_name
    assert isinstance(response.data["profile_photo"], str)
    assert response.data["about_me"] == "Say something about yourself."
    assert isinstance(response.data["profile_photo", str])
    assert response.data["native_language"] is None


@pytest.mark.django_db
def test_user_can_update_profile(api_client):
    cur_user = create_new_user(email="j@j.com", password="1234BadPass!@#$")
    api_client.force_authenticate(user=cur_user)

    # TODO - test image upload "profile_photo": "/mediafiles/profile_default.svg",
    long_string = "a long string" * 60000
    update_payload = {
        "about_me": long_string,
        "country": "United Kingdom",
        "native_language": "en",
    }

    profile_url = reverse("profile_views", args=[cur_user.id])
    response = api_client.patch(
        profile_url,
        update_payload,
        format="json",
    )

    assert response.status_code == status.HTTP_200_OK
    assert response.data["country"] == "United Kingdom"
    assert response.data["about_me"] == long_string
    assert response.data["native_language"] == "en"


@pytest.mark.django_db
def test_user_update_bad_data_return_bad_request_code(api_client):
    cur_user = create_new_user(email="j@j.com", password="1234BadPass!@#$")
    api_client.force_authenticate(user=cur_user)

    profile_url = reverse("profile_views", args=[cur_user.id])
    response = api_client.patch(
        # esp is not a valid option
        profile_url,
        {"native_language": "esp"},
        format="json",
    )

    assert response.status_code == status.HTTP_400_BAD_REQUEST


@pytest.mark.django_db
def test_user_cant_update_another_profile(api_client):
    cur_user = create_new_user(email="j@j.com", password="1234BadPass!@#$")
    other_user = create_new_user(
        username="2", email="j2@j.com", password="1234BadPass!@#$"
    )
    api_client.force_authenticate(user=cur_user)

    # TODO - test image upload "profile_photo": "/mediafiles/profile_default.svg",
    long_string = "a long string" * 60000
    update_payload = {
        "about_me": long_string,
        "country": "United Kingdom",
        "native_language": "en",
    }

    profile_url = reverse("profile_views", args=[other_user.id])
    response = api_client.patch(
        profile_url,
        update_payload,
        format="json",
    )
    assert response.status_code == status.HTTP_403_FORBIDDEN


@pytest.mark.django_db
def test_list_all_profiles_api_view(api_client):
    ITEMS_TO_ADD = 30
    for n in range(ITEMS_TO_ADD):
        create_new_user(
            username=str(n), email=str(n) + "j@j.com", password="1234BadPass!@#$"
        )
    assert Profile.objects.count() == ITEMS_TO_ADD
    assert User.objects.count() == ITEMS_TO_ADD

    profile_url = reverse("all-profiles")
    response = api_client.get(profile_url)
    assert response.status_code == status.HTTP_200_OK

    item_count = ListAllProfilesAPIView.pagination_class.page_size

    if ITEMS_TO_ADD > item_count:
        assert len(response.data["results"]) == item_count
    else:
        assert len(response.data["results"]) == ITEMS_TO_ADD


@pytest.mark.django_db
def test_get_cur_user_profile(api_client):
    new_user = create_new_user()
    api_client.force_authenticate(user=new_user)
    profile_url = reverse("get_current_profile")
    response = api_client.get(profile_url)
    print(response.data)
    assert response.status_code == status.HTTP_200_OK
    assert response.data["username"] == "je"


@pytest.mark.django_db
def test_get_cur_user_profile_with_no_user(api_client):
    create_new_user()

    profile_url = reverse("get_current_profile")
    response = api_client.get(profile_url)
    assert response.status_code == status.HTTP_401_UNAUTHORIZED


@pytest.mark.django_db
def test_get_cur_user_profile_throw_profile_not_found_exception(api_client):
    new_user = create_new_user()
    api_client.force_authenticate(user=new_user)
    with pytest.raises(ProfileNotFoundException):
        raise_exceptions_based_on_invalid_id("1bd715ea-bc30-48a4-aaa8-c0800c0a2da8")


@pytest.mark.django_db
def test_get_cur_user_profile_throw_profile_not_found_exception_with_valid_err(
    api_client,
):
    new_user = create_new_user()
    api_client.force_authenticate(user=new_user)
    with pytest.raises(ProfileNotFoundException):
        raise_exceptions_based_on_invalid_id(
            "1bd715ea-bc30-48a4-aaa8-c0800c0a2da8more-chars"
        )
