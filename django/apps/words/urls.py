from django.urls import path
from .views import (
    GetManyWordStatsAPIView,
    UserWordDataAPIView,
    UserWordDetailsAPIView,
    WordDefinitionsAPIView,
)

urlpatterns = [
    # Get: Q has word,
    
    path("user_word_data", UserWordDataAPIView.as_view(), name="user_word_details"),
    path("user_word_data/many", UserWordDataAPIView.as_view(), name="user_word_details"),
    
    # Get  Q= word, lang= 
    # Post, do as fixture
    path("stats/many", GetManyWordStatsAPIView.as_view(), name="word_many"),
    path("lists", GetManyWordStatsAPIView.as_view(), name="word_many"),
    # GET: take in user, lang, as query, options to incude definitions, word details, etc-> return list 
    path("data/many", GetManyWordStatsAPIView.as_view(), name="word_many"),
    path("data/many", GetManyWordStatsAPIView.as_view(), name="word_many"),
    path("word_definitions", WordDefinitionsAPIView.as_view(), name="word_definitions"),
]
