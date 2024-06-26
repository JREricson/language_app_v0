from django.contrib import admin

from .models import Profile


class ProfileAdmin(admin.ModelAdmin):
    list_display = ["id", "pkid", "user", "country"]
    list_filter = [
        "id",
        "pkid",
        "user",
    ]
    ist_display_links = ["id", "pkid", "user"]


admin.site.register(Profile, ProfileAdmin)
