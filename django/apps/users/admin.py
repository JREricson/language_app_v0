from django.contrib import admin

from .models import User


class UserAdmin(admin.ModelAdmin):
    list_display = [
        "id",
        "pkid",
        "username",
        "first_name",
        "last_name",
        "email",
        "is_staff",
        "is_active",
        "date_joined",
    ]
    list_filter = [
        "id",
        "pkid",
        "username",
        "first_name",
        "last_name",
        "email",
        "is_staff",
        "is_active",
        "date_joined",
    ]
    list_display_links = [
        "id",
        "pkid",
        "username",
        "first_name",
        "last_name",
        "email",
        "is_staff",
        "is_active",
        "date_joined",
    ]


admin.site.register(User, UserAdmin)
