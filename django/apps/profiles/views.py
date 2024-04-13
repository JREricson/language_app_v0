import logging

from django_filters.rest_framework import DjangoFilterBackend
from drf_spectacular.utils import extend_schema, extend_schema_view
from rest_framework import filters, generics, permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView

from django.core.exceptions import ValidationError

from ..common.shared_properties import DefaultPagination
from .exceptions import InvalidCredentialsForProfileException, ProfileNotFoundException
from .models import Profile
from .renderers import ProfileJSONRenderer, ProfilesJSONRenderer
from .serializers import (
    ProfilePrivateSerializer,
    ProfilePublicSerializer,
    UpdateProfileSerializer,
)

logger = logging.getLogger(__name__)


class GetCurrentProfileAPIView(APIView):
    permission_classes = [permissions.IsAuthenticated]
    renderer_classes = [ProfileJSONRenderer]

    @extend_schema(
        summary="""Returns profile details of user currently logged in.""",
        responses=ProfilePrivateSerializer,
    )
    def get(self, request):
        user = self.request.user
        user_profile = Profile.objects.get(user=user)
        serializer = ProfilePrivateSerializer(
            user_profile, context={"request": request}
        )
        return Response(serializer.data, status=status.HTTP_200_OK)


@extend_schema_view(
    get=extend_schema(
        summary="Returns list of all profiles. ",
        description="""

    Search fields include :"user__username", "user__first_name", "user__last_name", "country", "about_me".

    Ordering includes: "country", "native_language", "user__username", "user__first_name", "user__last_name", "id", "date_joined".

    Example: /api/v0/profile/all?search=home&ordering=native_language,-country
    """,
        responses=ProfilePublicSerializer,
    )
)
class ListAllProfilesAPIView(generics.ListAPIView):
    renderer_classes = [ProfilesJSONRenderer]
    serializer_class = ProfilePublicSerializer
    queryset = Profile.objects.all().order_by("-created_at")
    pagination_class = DefaultPagination
    filter_backends = [
        DjangoFilterBackend,
        filters.SearchFilter,
        filters.OrderingFilter,
    ]

    # filterset_class = ProfileFilter
    search_fields = [
        "user__username",
        "user__first_name",
        "user__last_name",
        "country",
        "about_me",
    ]
    ordering_fields = [
        "country",
        "native_language",
        "user__username",
        "user__first_name",
        "user__last_name",
        "id",
        "date_joined",
    ]


class ProfileAPIView(APIView):
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]
    renderer_classes = [ProfileJSONRenderer]

    serializer_class = UpdateProfileSerializer

    @extend_schema(
        summary="Update user profile",
        description="All fields supplied will be updated. Fields that do not need to be changed do not need to be submitted",
        request=UpdateProfileSerializer,
        responses=ProfilePrivateSerializer,
    )
    def patch(self, request, user_id):
        raise_exceptions_based_on_invalid_id(user_id)

        cur_user_id = request.user.id

        if str(cur_user_id) != user_id:
            raise InvalidCredentialsForProfileException

        data = request.data

        serializer = UpdateProfileSerializer(
            instance=request.user.profile, data=data, partial=True
        )

        if serializer.is_valid(raise_exception=True):
            serializer.save()

        return Response(serializer.data, status=status.HTTP_200_OK)

    @extend_schema(
        summary="Get user profile",
        description="Show the profile for a user with the given user_id.",
        request=ProfilePublicSerializer,
        responses=ProfilePublicSerializer,
    )
    def get(self, request, user_id):
        raise_exceptions_based_on_invalid_id(user_id)
        user_profile = Profile.objects.get(user__id=user_id)
        serializer = ProfilePublicSerializer(user_profile, context={"request": request})
        return Response(serializer.data, status=status.HTTP_200_OK)


def raise_exceptions_based_on_invalid_id(user_id):
    try:
        Profile.objects.get(user__id=user_id)
    except Profile.DoesNotExist:
        raise ProfileNotFoundException
    except ValidationError:
        # End user does not need to know it is a validation error
        raise ProfileNotFoundException
    except Exception as e:
        logger.warning(f"Unknown exception occurred<{e}> type <{type(e)}>.")
        raise ProfileNotFoundException
