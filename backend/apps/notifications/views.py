from rest_framework import viewsets, filters, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django_filters.rest_framework import DjangoFilterBackend
from django.utils import timezone

from .models import Notification, NotificationReadStatus
from .serializers import NotificationSerializer, NotificationReadStatusSerializer
from apps.common.permissions import IsManagerOrAdmin
from apps.common.pagination import StandardResultsSetPagination


class NotificationViewSet(viewsets.ModelViewSet):
    """
    ViewSet for Notification CRUD operations.
    """
    queryset = Notification.objects.all()
    serializer_class = NotificationSerializer
    permission_classes = [IsAuthenticated]
    pagination_class = StandardResultsSetPagination
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['audience', 'status', 'type', 'priority']
    search_fields = ['subject', 'message']
    ordering_fields = ['sent_at', 'created_at']
    ordering = ['-sent_at']
    
    def get_queryset(self):
        """Filter notifications based on user role and audience."""
        user = self.request.user
        queryset = super().get_queryset()
        
        if user.role == 'admin':
            return queryset
        
        # Filter by audience or specific recipients
        return queryset.filter(
            audience__in=['all', user.role]
        ) | queryset.filter(recipients=user)
    
    @action(detail=False, methods=['get'])
    def my_notifications(self, request):
        """Get notifications for the current user."""
        user = request.user
        notifications = self.get_queryset()
        
        # Add read status for each notification
        notification_data = []
        for notification in notifications:
            read_status = NotificationReadStatus.objects.filter(
                notification=notification,
                user=user
            ).first()
            
            data = NotificationSerializer(notification).data
            data['read'] = read_status.read if read_status else False
            data['read_at'] = read_status.read_at if read_status else None
            notification_data.append(data)
        
        page = self.paginate_queryset(notification_data)
        if page is not None:
            return self.get_paginated_response(page)
        
        return Response({
            'success': True,
            'data': notification_data,
            'message': 'Notifications retrieved successfully',
            'errors': None
        })
    
    @action(detail=True, methods=['post'])
    def mark_as_read(self, request, pk=None):
        """Mark a notification as read for the current user."""
        notification = self.get_object()
        user = request.user
        
        read_status, created = NotificationReadStatus.objects.get_or_create(
            notification=notification,
            user=user,
            defaults={'read': True, 'read_at': timezone.now()}
        )
        
        if not created and not read_status.read:
            read_status.read = True
            read_status.read_at = timezone.now()
            read_status.save()
        
        return Response({
            'success': True,
            'data': NotificationReadStatusSerializer(read_status).data,
            'message': 'Notification marked as read',
            'errors': None
        })
    
    @action(detail=False, methods=['post'])
    def mark_all_as_read(self, request):
        """Mark all notifications as read for the current user."""
        user = request.user
        notifications = self.get_queryset()
        
        updated_count = 0
        for notification in notifications:
            read_status, created = NotificationReadStatus.objects.get_or_create(
                notification=notification,
                user=user,
                defaults={'read': True, 'read_at': timezone.now()}
            )
            
            if not created and not read_status.read:
                read_status.read = True
                read_status.read_at = timezone.now()
                read_status.save()
                updated_count += 1
            elif created:
                updated_count += 1
        
        return Response({
            'success': True,
            'data': {'marked_as_read': updated_count},
            'message': f'{updated_count} notifications marked as read',
            'errors': None
        })
    
    @action(detail=False, methods=['get'])
    def unread_count(self, request):
        """Get count of unread notifications for current user."""
        user = request.user
        notifications = self.get_queryset()
        
        # Count notifications without read status or with read=False
        unread = 0
        for notification in notifications:
            read_status = NotificationReadStatus.objects.filter(
                notification=notification,
                user=user
            ).first()
            
            if not read_status or not read_status.read:
                unread += 1
        
        return Response({
            'success': True,
            'data': {'count': unread},
            'message': 'Unread count retrieved successfully',
            'errors': None
        })
    
    def perform_create(self, serializer):
        """Set the sender to the current user when creating a notification."""
        serializer.save(sender=self.request.user)
