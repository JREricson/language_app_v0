from rest_framework import status
from rest_framework.exceptions import APIException


class ProfileNotFoundException(APIException):
    status_code = status.HTTP_404_NOT_FOUND
    default_detail = "The requested profile does not exist."


class InvalidCredentialsForProfileException(APIException):
    """For Authorization"""

    status_code = status.HTTP_403_FORBIDDEN
    default_detail = "Invalid credentials to access this Profile."
