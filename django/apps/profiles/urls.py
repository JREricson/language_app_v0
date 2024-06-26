from django.urls import path

from .views import (GetCurrentProfileAPIView, ListAllProfilesAPIView,
                    UpdateProfileAPIView)

urlpatterns = [
    path("all/", ListAllProfilesAPIView.as_view(), name="all-profiles"),
    path("myprofile/", GetCurrentProfileAPIView.as_view(), name="get_profile"),
    path(
        "update/<str:username>/", UpdateProfileAPIView.as_view(), name="update_profile"
    ),
]
