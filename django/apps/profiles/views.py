import logging

from django_filters.rest_framework import DjangoFilterBackend
from drf_spectacular.utils import extend_schema
from rest_framework import filters, generics, permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView

from ..common.shared_properties import DefaultPagination
from .exceptions import (InvalidCredentialsForProfileException,
                         ProfileNotFoundException)
from .models import Profile
from .renderers import ProfileJSONRenderer
from .serializers import (ProfilePrivateSerializer, ProfilePublicSerializer,
                          UpdateProfileSerializer)

logger = logging.getLogger(__name__)

# class ProfileFilter(django_filters.FilterSet):
#     # TODO !important fix this

#     advert_type = django_filters.CharFilter(
#         field_name="advert_type", lookup_expr="iexact"
#     )

#     property_type = django_filters.CharFilter(
#         field_name="property_type", lookup_expr="iexact"
#     )

#     price = django_filters.NumberFilter()
#     price__gt = django_filters.NumberFilter(field_name="price", lookup_expr="gt")
#     price__lt = django_filters.NumberFilter(field_name="price", lookup_expr="lt")

#     class Meta:
#         model = Property
#         fields = ["advert_type", "property_type", "price"]

# TODO add single profile view


class GetCurrentProfileAPIView(APIView):
    permission_classes = [permissions.IsAuthenticated]
    renderer_classes = [ProfileJSONRenderer]

    @extend_schema(
        summary="Returns profile details of user currently logged in.",
        responses=ProfilePrivateSerializer,
    )
    def get(self, request):
        user = self.request.user
        user_profile = Profile.objects.get(user=user)
        serializer = ProfilePrivateSerializer(
            user_profile, context={"request": request}
        )
        return Response(serializer.data, status=status.HTTP_200_OK)


class ListAllProfilesAPIView(generics.ListAPIView):
    serializer_class = ProfilePublicSerializer
    queryset = Profile.objects.all().order_by("-created_at")
    pagination_class = DefaultPagination
    # filter_backends = [
    #     DjangoFilterBackend,
    #     filters.SearchFilter,
    #     filters.OrderingFilter,
    # ]

    # filterset_class = ProfileFilter
    # search_fields = [
    #     "username",
    #     "first_name",
    #     "last_name",
    #     "country",
    # ]
    # ordering_fields = ["created_at"]


class UpdateProfileAPIView(APIView):
    permission_classes = [permissions.IsAuthenticated]
    renderer_classes = [ProfileJSONRenderer]

    serializer_class = UpdateProfileSerializer

    @extend_schema(
        summary="Update user profile",
        description="All fields supplied will be updated. Fields that do not need to be changed do not need to be submitted",
        request=UpdateProfileSerializer,
        responses=ProfilePrivateSerializer,
    )
    def patch(self, request, username):
        try:
            Profile.objects.get(user__username=username)
        except Profile.DoesNotExist:
            raise ProfileNotFoundException

        user_name = request.user.username
        if user_name != username:
            raise InvalidCredentialsForProfileException

        data = request.data
        serializer = UpdateProfileSerializer(
            instance=request.user.profile, data=data, partial=True
        )

        serializer.is_valid()
        serializer.save()  # TODO will throw Assertion error if data is invalid
        return Response(serializer.data, status=status.HTTP_200_OK)
