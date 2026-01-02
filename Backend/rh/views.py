from rest_framework import viewsets
from .models import Employee, LeaveRequest, TimeRecord, ExpenseReport, Authorization
from .serializers import (
    EmployeeSerializer, LeaveRequestSerializer, TimeRecordSerializer,
    ExpenseReportSerializer, AuthorizationSerializer
)

class EmployeeViewSet(viewsets.ModelViewSet):
    queryset = Employee.objects.all()
    serializer_class = EmployeeSerializer

class LeaveRequestViewSet(viewsets.ModelViewSet):
    queryset = LeaveRequest.objects.all()
    serializer_class = LeaveRequestSerializer

class TimeRecordViewSet(viewsets.ModelViewSet):
    queryset = TimeRecord.objects.all()
    serializer_class = TimeRecordSerializer

class ExpenseReportViewSet(viewsets.ModelViewSet):
    queryset = ExpenseReport.objects.all()
    serializer_class = ExpenseReportSerializer

class AuthorizationViewSet(viewsets.ModelViewSet):
    queryset = Authorization.objects.all()
    serializer_class = AuthorizationSerializer
