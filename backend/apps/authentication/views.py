from rest_framework import status, generics
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.views import TokenRefreshView
from rest_framework_simplejwt.exceptions import TokenError, InvalidToken
from drf_spectacular.utils import extend_schema, OpenApiResponse

from .serializers import LoginSerializer, UserSerializer, RegisterSerializer, ChangePasswordSerializer
from apps.common.exceptions import success_response, error_response


@extend_schema(
    request=LoginSerializer,
    responses={
        200: OpenApiResponse(description='Login successful'),
        400: OpenApiResponse(description='Bad request'),
    },
    tags=['Authentication']
)
@api_view(['POST'])
@permission_classes([AllowAny])
def login_view(request):
    """
    User login endpoint. Returns access and refresh tokens.
    """
    serializer = LoginSerializer(data=request.data)
    
    if serializer.is_valid():
        user = serializer.validated_data['user']
        refresh = RefreshToken.for_user(user)
        
        user_data = UserSerializer(user).data
        
        return success_response(
            data={
                'user': user_data,
                'tokens': {
                    'access': str(refresh.access_token),
                    'refresh': str(refresh),
                }
            },
            message='Login successful',
            status_code=status.HTTP_200_OK
        )
    
    return error_response(
        message='Invalid credentials',
        errors=serializer.errors,
        status_code=status.HTTP_400_BAD_REQUEST
    )


@extend_schema(
    tags=['Authentication']
)
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def logout_view(request):
    """
    User logout endpoint. Blacklists the refresh token.
    """
    try:
        refresh_token = request.data.get('refresh')
        if refresh_token:
            token = RefreshToken(refresh_token)
            token.blacklist()
        
        return success_response(
            message='Logout successful',
            status_code=status.HTTP_200_OK
        )
    except Exception as e:
        return error_response(
            message='Logout failed',
            errors={'detail': str(e)},
            status_code=status.HTTP_400_BAD_REQUEST
        )


@extend_schema(
    tags=['Authentication']
)
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def me_view(request):
    """
    Get current user information.
    """
    serializer = UserSerializer(request.user)
    return success_response(
        data=serializer.data,
        message='User information retrieved successfully',
        status_code=status.HTTP_200_OK
    )


@extend_schema(
    request=RegisterSerializer,
    responses={
        201: OpenApiResponse(description='User registered successfully'),
        400: OpenApiResponse(description='Bad request'),
    },
    tags=['Authentication']
)
@api_view(['POST'])
@permission_classes([AllowAny])
def register_view(request):
    """
    User registration endpoint.
    """
    serializer = RegisterSerializer(data=request.data)
    
    if serializer.is_valid():
        user = serializer.save()
        user_data = UserSerializer(user).data
        
        return success_response(
            data=user_data,
            message='User registered successfully',
            status_code=status.HTTP_201_CREATED
        )
    
    return error_response(
        message='Registration failed',
        errors=serializer.errors,
        status_code=status.HTTP_400_BAD_REQUEST
    )


@extend_schema(
    request=ChangePasswordSerializer,
    tags=['Authentication']
)
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def change_password_view(request):
    """
    Change user password endpoint.
    """
    serializer = ChangePasswordSerializer(data=request.data, context={'request': request})
    
    if serializer.is_valid():
        user = request.user
        user.set_password(serializer.validated_data['new_password'])
        user.save()
        
        return success_response(
            message='Password changed successfully',
            status_code=status.HTTP_200_OK
        )
    
    return error_response(
        message='Password change failed',
        errors=serializer.errors,
        status_code=status.HTTP_400_BAD_REQUEST
    )
