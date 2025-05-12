from django.urls import path
from .views import GetManyWordDetailsAPIView, GetWordDetailsAPIView

urlpatterns = [
    path("stats", GetWordDetailsAPIView.as_view(), name="word_stats"),
    path("stats/many", GetManyWordDetailsAPIView.as_view(), name="word_many"),
]
