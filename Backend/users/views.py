from rest_framework import viewsets, permissions
from .models import CustomUser, Notification
from .serializers import UserSerializer, NotificationSerializer
from .permissions import IsAdmin, IsManager, IsEmployee

class UserViewSet(viewsets.ModelViewSet):
    queryset = CustomUser.objects.all()
    serializer_class = UserSerializer
    permission_classes = [IsAdmin] # Only admins can manage users directly

class NotificationViewSet(viewsets.ModelViewSet):
    serializer_class = NotificationSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        # Users see only their own notifications
        return Notification.objects.filter(user=self.request.user).order_by('-created_at')
