from django.contrib.auth.base_user import BaseUserManager
from django.core.exceptions import ValidationError
from django.core.validators import validate_email
from django.utils.translation import gettext_lazy as _


class CustomUserManager(BaseUserManager):
    def email_validator(self, email):
        try:
            validate_email(email)
        except ValidationError:
            raise ValueError(_("Email address must be valid."))

    def create_user(
        self, username, first_name, last_name, email, password, **extra_fields
    ):
        if not username:
            raise ValueError(_("Value <username> is required."))

        if not first_name:
            raise ValueError(_("Value <first name> is required."))

        if not last_name:
            raise ValueError(_("Value  <last name> is required."))

        # TODO add password validator

        if email:
            email = self.normalize_email(email)
            self.email_validator(email)
        else:
            raise ValueError(_("Base User Account: An email address is required."))

        user = self.model(
            username=username,
            first_name=first_name,
            last_name=last_name,
            email=email,
            **extra_fields
        )

        user.set_password(password)
        extra_fields.setdefault("is_staff", False)
        extra_fields.setdefault("is_superuser", False)
        user.save(using=self._db)
        return user

    def create_superuser(
        self, username, first_name, last_name, email, password, **extra_fields
    ):
        extra_fields.setdefault("is_staff", True)
        extra_fields.setdefault("is_superuser", True)
        extra_fields.setdefault("is_active", True)

        if extra_fields.get("is_staff") is not True:
            raise ValueError(_("Superusers must have is_staff=True"))

        if extra_fields.get("is_superuser") is not True:
            raise ValueError(_("Superusers must have is_superuser=True"))

        if email:
            email = self.normalize_email(email)
            self.email_validator(email)
        else:
            raise ValueError(_("Admin Account: An email address is required"))

        user = self.create_user(
            username, first_name, last_name, email, password, **extra_fields
        )
        # self._db i s the default database https://stackoverflow.com/questions/57667334/what-is-the-value-of-self-db-by-default-in-django
        user.save(using=self._db)
        return user
