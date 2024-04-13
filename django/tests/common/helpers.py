from apps.profiles.models import User


def create_new_user(
    first_name="jj",
    last_name="ee",
    username="je",
    email="jjee@j.com",
    password="1234Pass!@#$",
):
    new_user = User.objects.create_user(
        first_name=first_name,
        last_name=last_name,
        username=username,
        email=email,
        password=password,
    )
    return new_user
