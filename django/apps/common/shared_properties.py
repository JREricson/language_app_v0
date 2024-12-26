from rest_framework.pagination import PageNumberPagination
from rest_framework import pagination


class DefaultPagination(PageNumberPagination):
    page_size = 10  # TODO change back


class CustomPagination(pagination.LimitOffsetPagination):
    default_limit = 2
    limit_query_param = "limit"
    offset_query_param = "offset"
    max_limit = 50
