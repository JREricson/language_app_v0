from rest_framework.pagination import PageNumberPagination
from rest_framework import pagination


class DefaultPagination(PageNumberPagination):
    page_size = 10 # TODO change back


class CustomPagination(pagination.LimitOffsetPagination):
    default_limit = 2
    limit_query_param = 'l'
    offset_query_param = 'o'
    max_limit = 50