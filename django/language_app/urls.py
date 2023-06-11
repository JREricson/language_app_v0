from django.conf import settings
from django.conf.urls.static import static
from django.contrib import admin
from django.urls import include, path
from drf_spectacular.views import SpectacularAPIView, SpectacularSwaggerView
from rest_framework import permissions




urlpatterns = [
    path("admin/", admin.site.urls),
    path("api/v0/auth/", include("djoser.urls")),
    path("api/v0/auth/", include("djoser.urls.jwt")),
    path("api/v0/profile/", include("apps.profiles.urls")),
    # path("api/v1/properties/", include("apps.properties.urls")),
    # path("api/v1/ratings/", include("apps.ratings.urls")),
    # path("api/v1/enquiries/", include("apps.enquiries.urls")),
    # swagger
    path('api/v0/schema/', SpectacularAPIView.as_view(), name='schema'),
    path('api/v0/documentation/', SpectacularSwaggerView.as_view(url_name='schema'), name='swagger-doc'),

] 
