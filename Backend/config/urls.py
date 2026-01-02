from django.contrib import admin
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from rest_framework import permissions
from drf_yasg.views import get_schema_view
from drf_yasg import openapi
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)

from users.views import UserViewSet, NotificationViewSet
from rh.views import (
    EmployeeViewSet, LeaveRequestViewSet, TimeRecordViewSet,
    ExpenseReportViewSet, AuthorizationViewSet
)
from projects.views import ProjectViewSet, ProjectDocViewSet


schema_view = get_schema_view(
    openapi.Info(
        title="Entreprise API",
        default_version='v1',
        description="API documentation for Entreprise application",
    ),
    public=True,
    permission_classes=(permissions.AllowAny,),
)

router = DefaultRouter()
router.register(r'users', UserViewSet)
router.register(r'notifications', NotificationViewSet, basename='notification')
router.register(r'employees', EmployeeViewSet)

router.register(r'leaves', LeaveRequestViewSet)
router.register(r'time-records', TimeRecordViewSet)
router.register(r'expenses', ExpenseReportViewSet)
router.register(r'authorizations', AuthorizationViewSet)
router.register(r'projects', ProjectViewSet)
router.register(r'project-docs', ProjectDocViewSet)

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include(router.urls)),
    
    # JWT Authentication
    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),

    # Swagger Documentation
    path('swagger/', schema_view.with_ui('swagger', cache_timeout=0), name='schema-swagger-ui'),
    path('redoc/', schema_view.with_ui('redoc', cache_timeout=0), name='schema-redoc'),
]
