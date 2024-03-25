from drf_spectacular.views import SpectacularAPIView, SpectacularSwaggerView
from rest_framework import permissions

from django.conf import settings
from django.conf.urls.static import static
from django.contrib import admin
from django.urls import include, path

urlpatterns = [
    path(settings.ADMIN_PATH, admin.site.urls),
    path("api/v0/auth/", include("djoser.urls")),
    path("api/v0/auth/", include("djoser.urls.jwt")),
    path("api/v0/profile/", include("apps.profiles.urls")),
    # swagger
    path("api/v0/schema/", SpectacularAPIView.as_view(), name="schema"),
    path(
        "api/v0/documentation/",
        SpectacularSwaggerView.as_view(url_name="schema"),
        name="swagger-doc",
    ),
]
# TODO find a better place for these
admin.site.site_header = f"{settings.SITE_NAME} Admin"
admin.site.site_title = f"{settings.SITE_NAME} Admin Portal"
admin.site.index_title = f"Welcome to the {settings.SITE_NAME} Portal"
