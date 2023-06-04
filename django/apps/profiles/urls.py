from django.urls import path

from .views import (GetProfileAPIView, UpdateProfileAPIView)

urlpatterns = [
    path("myprofile/", GetProfileAPIView.as_view(), name="get_profile"),
    path(
        "update/<str:username>/", UpdateProfileAPIView.as_view(), name="update_profile"
    ),
]