from rest_framework import serializers
from .models import CustomUser, Notification

class UserSerializer(serializers.ModelSerializer):
    id = serializers.CharField(source='employee_id', read_only=True)
    firstName = serializers.CharField(source='first_name')
    lastName = serializers.CharField(source='last_name')

    class Meta:
        model = CustomUser
        fields = ['id', 'firstName', 'lastName', 'email', 'role', 'departement']

class NotificationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Notification
        fields = ['id', 'user', 'title', 'message', 'read', 'created_at']
