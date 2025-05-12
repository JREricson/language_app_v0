from django.urls import path
from .views import GetManyDictDetailsAPIView

urlpatterns = [
    path("many", GetManyDictDetailsAPIView.as_view(), name="Many_dict_details"),
]
