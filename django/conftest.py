import pytest
from pytest_factoryboy import register
from rest_framework.test import APIClient

from tests.factories import ProfileFactory, UserFactory

register(ProfileFactory)
register(UserFactory)


@pytest.fixture
def base_user(db, user_factory):
    """A user with NO additional permissions."""
    new_user = user_factory.create()
    return new_user


@pytest.fixture
def super_user(db, user_factory):
    """A user with super_user permissions."""

    new_user = user_factory.create(is_staff=True, is_superuser=True)
    return new_user


@pytest.fixture
def profile(db, profile_factory):
    """A profile with no additional data added."""
    user_profile = profile_factory.create()
    return user_profile


@pytest.fixture(scope="function")
def api_client():
    return APIClient()
