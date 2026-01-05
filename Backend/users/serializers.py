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
    subject = serializers.CharField(source='title', read_only=True)
    recipientNames = serializers.SerializerMethodField(read_only=True)
    sentAt = serializers.DateTimeField(source='created_at', read_only=True)
    sender = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = Notification
        fields = ['id', 'subject', 'message', 'recipientNames', 'sentAt', 'sender', 'read', 'created_at']

    def get_recipientNames(self, obj):
        return f"{obj.user.first_name} {obj.user.last_name}"

    def get_sender(self, obj):
        return "System"
