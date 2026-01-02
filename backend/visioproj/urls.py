"""
URL configuration for visioproj project.
"""
from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from drf_spectacular.views import SpectacularAPIView, SpectacularSwaggerView, SpectacularRedocView
from rest_framework.routers import DefaultRouter

# Import all viewsets
from apps.hr.views import (
    EmployeeViewSet, TimeRecordViewSet, LeaveRequestViewSet,
    AuthorizationViewSet, ExpenseReportViewSet
)
from apps.formation.views import TrainingSessionViewSet
from apps.engineering.views import EngineeringInterventionViewSet
from apps.projects.views import ProjectViewSet
from apps.documents.views import DocumentViewSet
from apps.notifications.views import NotificationViewSet

# Create a single router for all API endpoints
router = DefaultRouter()

# HR Module
router.register(r'rh/employees', EmployeeViewSet, basename='employee')
router.register(r'rh/temps', TimeRecordViewSet, basename='timerecord')
router.register(r'rh/conges', LeaveRequestViewSet, basename='leaverequest')
router.register(r'rh/autorisations', AuthorizationViewSet, basename='authorization')
router.register(r'rh/frais', ExpenseReportViewSet, basename='expensereport')

# Formation
router.register(r'formation', TrainingSessionViewSet, basename='trainingsession')

# Engineering
router.register(r'engineering', EngineeringInterventionViewSet, basename='engineeringintervention')

# Projects
router.register(r'projects', ProjectViewSet, basename='project')

# Documents
router.register(r'documents', DocumentViewSet, basename='document')

# Notifications
router.register(r'notifications', NotificationViewSet, basename='notification')

urlpatterns = [
    # Admin
    path('admin/', admin.site.urls),
    
    # API Documentation
    path('api/schema/', SpectacularAPIView.as_view(), name='schema'),
    path('api/docs/', SpectacularSwaggerView.as_view(url_name='schema'), name='swagger-ui'),
    path('api/redoc/', SpectacularRedocView.as_view(url_name='schema'), name='redoc'),
    
    # Authentication
    path('api/auth/', include('apps.authentication.urls')),
    
    # All API endpoints through the router
    path('api/', include(router.urls)),
]

# Serve media files in development
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
