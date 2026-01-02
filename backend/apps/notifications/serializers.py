from rest_framework import serializers
from .models import Notification, NotificationReadStatus
from apps.authentication.models import User


class NotificationSerializer(serializers.ModelSerializer):
    """
    Serializer for Notification model.
    """
    recipient_names = serializers.SerializerMethodField()
    sender_name = serializers.SerializerMethodField()
    
    class Meta:
        model = Notification
        fields = '__all__'
        read_only_fields = ('id', 'sent_at', 'created_at', 'updated_at')
    
    def get_recipient_names(self, obj):
        if obj.audience == 'specific':
            return [f"{user.first_name} {user.last_name}" for user in obj.recipients.all()]
        return []
    
    def get_sender_name(self, obj):
        return f"{obj.sender.first_name} {obj.sender.last_name}"


class NotificationReadStatusSerializer(serializers.ModelSerializer):
    """
    Serializer for NotificationReadStatus model.
    """
    class Meta:
        model = NotificationReadStatus
        fields = '__all__'
        read_only_fields = ('id', 'created_at')
