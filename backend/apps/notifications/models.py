from django.db import models
from apps.authentication.models import User


class Notification(models.Model):
    """
    Notification model.
    """
    AUDIENCE_CHOICES = (
        ('all', 'All'),
        ('admin', 'Admin'),
        ('employee', 'Employee'),
        ('specific', 'Specific'),
    )
    
    STATUS_CHOICES = (
        ('sent', 'Sent'),
        ('scheduled', 'Scheduled'),
        ('draft', 'Draft'),
    )
    
    TYPE_CHOICES = (
        ('info', 'Info'),
        ('warning', 'Warning'),
        ('success', 'Success'),
        ('error', 'Error'),
    )
    
    PRIORITY_CHOICES = (
        ('low', 'Low'),
        ('normal', 'Normal'),
        ('high', 'High'),
    )
    
    subject = models.CharField(max_length=255)
    message = models.TextField()
    audience = models.CharField(max_length=20, choices=AUDIENCE_CHOICES)
    recipients = models.ManyToManyField(User, related_name='notifications', blank=True)
    sent_at = models.DateTimeField(auto_now_add=True)
    sender = models.ForeignKey(User, on_delete=models.CASCADE, related_name='sent_notifications')
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='sent')
    type = models.CharField(max_length=20, choices=TYPE_CHOICES, default='info')
    priority = models.CharField(max_length=20, choices=PRIORITY_CHOICES, default='normal')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'Notification'
        ordering = ['-sent_at']
    
    def __str__(self):
        return f"{self.subject} - {self.audience}"


class NotificationReadStatus(models.Model):
    """
    Track read status for each user and notification.
    """
    notification = models.ForeignKey(Notification, on_delete=models.CASCADE, related_name='read_statuses')
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='notification_read_statuses')
    read = models.BooleanField(default=False)
    read_at = models.DateTimeField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        db_table = 'NotificationReadStatus'
        unique_together = ('notification', 'user')
    
    def __str__(self):
        return f"{self.notification.subject} - {self.user.email} - {'Read' if self.read else 'Unread'}"
