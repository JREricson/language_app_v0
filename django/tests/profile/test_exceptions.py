from rest_framework import status


from apps.profiles.exceptions import (
    InvalidCredentialsForProfileException,
    ProfileNotFoundException,
)


def test_ProfileNotFoundException():
    try:
        raise ProfileNotFoundException
    except Exception as e:
        assert e.status_code == status.HTTP_404_NOT_FOUND
        assert e.default_detail == "The requested profile does not exist."


def test_InvalidCredentialsForProfileException():
    try:
        raise InvalidCredentialsForProfileException
    except Exception as e:
        assert e.status_code == status.HTTP_403_FORBIDDEN
        assert e.default_detail == "Invalid credentials to access this Profile."
