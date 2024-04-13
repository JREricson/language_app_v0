from django.urls import path

from .views import GetCurrentProfileAPIView, ListAllProfilesAPIView, ProfileAPIView

urlpatterns = [
    path("all/", ListAllProfilesAPIView.as_view(), name="all-profiles"),
    path(
        "current_user/", GetCurrentProfileAPIView.as_view(), name="get_current_profile"
    ),
    path("<str:user_id>/", ProfileAPIView.as_view(), name="profile_views"),
]
