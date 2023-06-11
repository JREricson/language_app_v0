from rest_framework import permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView
from drf_spectacular.utils import extend_schema

from .exceptions import InvalidCredentialsForProfileException, ProfileNotFoundException
from .models import Profile
from .renderers import ProfileJSONRenderer
from .serializers import ProfileSerializer, UpdateProfileSerializer


class GetProfileAPIView(APIView):
    permission_classes = [permissions.IsAuthenticated]
    renderer_classes = [ProfileJSONRenderer]

    @extend_schema(
        summary="Returns profile details of user currently logged in",
        responses=ProfileSerializer,
    )
    def get(self, request):
        user = self.request.user
        user_profile = Profile.objects.get(user=user)
        serializer = ProfileSerializer(user_profile, context={"request": request})
        return Response(serializer.data, status=status.HTTP_200_OK)


class UpdateProfileAPIView(APIView):
    permission_classes = [permissions.IsAuthenticated]
    renderer_classes = [ProfileJSONRenderer]

    serializer_class = UpdateProfileSerializer

    @extend_schema(
        summary="Updates user profile",
        description="All fields supplied will be updated. Fields that do not need to be changed do not need to be submitted",
        request=UpdateProfileSerializer,
        responses=ProfileSerializer,
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
