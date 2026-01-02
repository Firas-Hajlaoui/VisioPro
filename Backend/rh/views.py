from rest_framework import viewsets
from .models import Employee, LeaveRequest, TimeRecord, ExpenseReport, Authorization
from .serializers import (
    EmployeeSerializer, LeaveRequestSerializer, TimeRecordSerializer,
    ExpenseReportSerializer, AuthorizationSerializer
)
from users.permissions import IsAdmin, IsManager, IsEmployee, IsOwnerOrReadOnly

class EmployeeViewSet(viewsets.ModelViewSet):
    queryset = Employee.objects.all()
    serializer_class = EmployeeSerializer
    # Admin and Manager can manage employees. 
    # Regular employees can maybe view only (or implemented differently)
    permission_classes = [IsManager] 

class LeaveRequestViewSet(viewsets.ModelViewSet):
    queryset = LeaveRequest.objects.all()
    serializer_class = LeaveRequestSerializer
    # Logic: Owner can create/view own. Manager/Admin can view/edit all.
    # For simplicity, using IsEmployee for now, but ideal would be IsOwnerOrManager
    permission_classes = [IsEmployee]

    def get_queryset(self):
        user = self.request.user
        if user.role in ['admin', 'manager']:
            return LeaveRequest.objects.all()
        # Filter for current employee
        if hasattr(user, 'employee_profile'):
             return LeaveRequest.objects.filter(employe=user.employee_profile)
        return LeaveRequest.objects.none()

class TimeRecordViewSet(viewsets.ModelViewSet):
    queryset = TimeRecord.objects.all()
    serializer_class = TimeRecordSerializer
    permission_classes = [IsEmployee]

    def get_queryset(self):
        user = self.request.user
        if user.role in ['admin', 'manager']:
            return TimeRecord.objects.all()
        if hasattr(user, 'employee_profile'):
             return TimeRecord.objects.filter(employe=user.employee_profile)
        return TimeRecord.objects.none()

class ExpenseReportViewSet(viewsets.ModelViewSet):
    queryset = ExpenseReport.objects.all()
    serializer_class = ExpenseReportSerializer
    permission_classes = [IsEmployee]

    def get_queryset(self):
        user = self.request.user
        if user.role in ['admin', 'manager']:
            return ExpenseReport.objects.all()
        if hasattr(user, 'employee_profile'):
             return ExpenseReport.objects.filter(employe=user.employee_profile)
        return ExpenseReport.objects.none()

class AuthorizationViewSet(viewsets.ModelViewSet):
    queryset = Authorization.objects.all()
    serializer_class = AuthorizationSerializer
    permission_classes = [IsEmployee]

    def get_queryset(self):
        user = self.request.user
        if user.role in ['admin', 'manager']:
            return Authorization.objects.all()
        if hasattr(user, 'employee_profile'):
             return Authorization.objects.filter(employe=user.employee_profile)
        return Authorization.objects.none()
