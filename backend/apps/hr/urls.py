from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

router = DefaultRouter()
router.register(r'employees', views.EmployeeViewSet, basename='employee')
router.register(r'temps', views.TimeRecordViewSet, basename='timerecord')
router.register(r'conges', views.LeaveRequestViewSet, basename='leaverequest')
router.register(r'autorisations', views.AuthorizationViewSet, basename='authorization')
router.register(r'frais', views.ExpenseReportViewSet, basename='expensereport')

urlpatterns = router.urls
