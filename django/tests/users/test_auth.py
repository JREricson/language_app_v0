import pytest
from rest_framework.test import APIRequestFactory

from tests.common.helpers import create_new_user

BASE_URL = "/api/v0/"


# Using the standard RequestFactory API to create a form POST request
factory = APIRequestFactory()


@pytest.mark.django_db
def test_valid_user_login(api_client):
    # request = factory.post(BASE_URL+'auth/jwt/create/', {'title': 'new idea'})
    # print("output")
    # print(view(request))
    create_new_user(email="j@j.com", password="1234BadPass!@#$")
    response = api_client.post(
        BASE_URL + "auth/jwt/create/",
        {"email": "j@j.com", "password": "1234BadPass!@#$"},
        format="json",
    )
    print(response.data["access"])
    assert response.data["access"] is not None
    assert response.data["refresh"] is not None
