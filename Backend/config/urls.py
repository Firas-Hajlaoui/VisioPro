from django.contrib import admin
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from users.views import UserViewSet
from rh.views import (
    EmployeeViewSet, LeaveRequestViewSet, TimeRecordViewSet,
    ExpenseReportViewSet, AuthorizationViewSet
)
from projects.views import ProjectViewSet, ProjectDocViewSet

router = DefaultRouter()
router.register(r'users', UserViewSet)
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
]
