from rest_framework import viewsets, filters, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend
from drf_spectacular.utils import extend_schema, OpenApiParameter

from .models import Employee, TimeRecord, LeaveRequest, Authorization, ExpenseReport
from .serializers import (
    EmployeeSerializer, TimeRecordSerializer, LeaveRequestSerializer,
    AuthorizationSerializer, ExpenseReportSerializer
)
from apps.common.permissions import IsAdminUser, IsManagerOrAdmin
from apps.common.pagination import StandardResultsSetPagination


class EmployeeViewSet(viewsets.ModelViewSet):
    """
    ViewSet for Employee CRUD operations.
    """
    queryset = Employee.objects.all()
    serializer_class = EmployeeSerializer
    permission_classes = [IsManagerOrAdmin]
    pagination_class = StandardResultsSetPagination
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['statut', 'departement', 'poste']
    search_fields = ['nom', 'prenom', 'email', 'code']
    ordering_fields = ['created_at', 'nom', 'date_embauche']
    ordering = ['-created_at']
    
    @extend_schema(
        summary='Get employee statistics',
        tags=['HR - Employees']
    )
    @action(detail=False, methods=['get'])
    def stats(self, request):
        """Get employee statistics."""
        total = self.queryset.count()
        actif = self.queryset.filter(statut='Actif').count()
        inactif = self.queryset.filter(statut='Inactif').count()
        en_conge = self.queryset.filter(statut='En congé').count()
        
        return Response({
            'success': True,
            'data': {
                'total': total,
                'actif': actif,
                'inactif': inactif,
                'en_conge': en_conge
            },
            'message': 'Statistics retrieved successfully',
            'errors': None
        })


class TimeRecordViewSet(viewsets.ModelViewSet):
    """
    ViewSet for TimeRecord CRUD operations.
    """
    queryset = TimeRecord.objects.all()
    serializer_class = TimeRecordSerializer
    permission_classes = [IsManagerOrAdmin]
    pagination_class = StandardResultsSetPagination
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['statut', 'type', 'employee', 'hs_valide']
    search_fields = ['code', 'employee__nom', 'employee__prenom']
    ordering_fields = ['date', 'created_at']
    ordering = ['-date']
    
    @extend_schema(
        summary='Validate time record',
        tags=['HR - Time Records']
    )
    @action(detail=True, methods=['patch'], url_path='validate')
    def validate_record(self, request, pk=None):
        """Validate time record."""
        time_record = self.get_object()
        hs_valide = request.data.get('hsValide', request.data.get('hs_valide', False))
        notes = request.data.get('notes', '')
        
        time_record.hs_valide = hs_valide
        time_record.statut = 'Validé' if hs_valide else 'En attente'
        time_record.save()
        
        serializer = self.get_serializer(time_record)
        return Response({
            'success': True,
            'data': serializer.data,
            'message': 'Time record validated',
            'errors': None
        })


class LeaveRequestViewSet(viewsets.ModelViewSet):
    """
    ViewSet for LeaveRequest CRUD operations.
    """
    queryset = LeaveRequest.objects.all()
    serializer_class = LeaveRequestSerializer
    permission_classes = [IsManagerOrAdmin]
    pagination_class = StandardResultsSetPagination
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['statut', 'type', 'employee']
    search_fields = ['code', 'employee__nom', 'employee__prenom']
    ordering_fields = ['debut', 'created_at']
    ordering = ['-created_at']
    
    @extend_schema(
        summary='Approve leave request',
        tags=['HR - Leave Requests']
    )
    @action(detail=True, methods=['post'])
    def approve(self, request, pk=None):
        """Approve a leave request."""
        leave_request = self.get_object()
        leave_request.statut = 'Approuvé'
        leave_request.save()
        
        serializer = self.get_serializer(leave_request)
        return Response({
            'success': True,
            'data': serializer.data,
            'message': 'Leave request approved',
            'errors': None
        })
    
    @extend_schema(
        summary='Reject leave request',
        tags=['HR - Leave Requests']
    )
    @action(detail=True, methods=['post'])
    def reject(self, request, pk=None):
        """Reject a leave request."""
        leave_request = self.get_object()
        leave_request.statut = 'Refusé'
        leave_request.save()
        
        serializer = self.get_serializer(leave_request)
        return Response({
            'success': True,
            'data': serializer.data,
            'message': 'Leave request rejected',
            'errors': None
        })
    
    @extend_schema(
        summary='Update leave request status',
        tags=['HR - Leave Requests']
    )
    @action(detail=True, methods=['patch'], url_path='status')
    def update_status(self, request, pk=None):
        """Update leave request status (approve/reject)."""
        leave_request = self.get_object()
        statut = request.data.get('statut')
        notes = request.data.get('notes', '')
        
        if statut not in ['Approuvé', 'Refusé']:
            return Response({
                'success': False,
                'data': None,
                'message': 'Invalid status',
                'errors': {'statut': 'Must be Approuvé or Refusé'}
            }, status=status.HTTP_400_BAD_REQUEST)
        
        leave_request.statut = statut
        leave_request.save()
        
        serializer = self.get_serializer(leave_request)
        return Response({
            'success': True,
            'data': serializer.data,
            'message': f'Leave request {statut.lower()}',
            'errors': None
        })


class AuthorizationViewSet(viewsets.ModelViewSet):
    """
    ViewSet for Authorization CRUD operations.
    """
    queryset = Authorization.objects.all()
    serializer_class = AuthorizationSerializer
    permission_classes = [IsManagerOrAdmin]
    pagination_class = StandardResultsSetPagination
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['statut', 'type', 'employee']
    search_fields = ['code', 'employee__nom', 'employee__prenom']
    ordering_fields = ['date', 'created_at']
    ordering = ['-created_at']
    
    @extend_schema(
        summary='Approve authorization',
        tags=['HR - Authorizations']
    )
    @action(detail=True, methods=['post'])
    def approve(self, request, pk=None):
        """Approve an authorization."""
        authorization = self.get_object()
        authorization.statut = 'Approuvé'
        authorization.save()
        
        serializer = self.get_serializer(authorization)
        return Response({
            'success': True,
            'data': serializer.data,
            'message': 'Authorization approved',
            'errors': None
        })
    
    @extend_schema(
        summary='Reject authorization',
        tags=['HR - Authorizations']
    )
    @action(detail=True, methods=['post'])
    def reject(self, request, pk=None):
        """Reject an authorization."""
        authorization = self.get_object()
        authorization.statut = 'Refusé'
        authorization.save()
        
        serializer = self.get_serializer(authorization)
        return Response({
            'success': True,
            'data': serializer.data,
            'message': 'Authorization rejected',
            'errors': None
        })
    
    @extend_schema(
        summary='Update authorization status',
        tags=['HR - Authorizations']
    )
    @action(detail=True, methods=['patch'], url_path='status')
    def update_status(self, request, pk=None):
        """Update authorization status (approve/reject)."""
        authorization = self.get_object()
        statut = request.data.get('statut')
        notes = request.data.get('notes', '')
        
        if statut not in ['Approuvé', 'Refusé']:
            return Response({
                'success': False,
                'data': None,
                'message': 'Invalid status',
                'errors': {'statut': 'Must be Approuvé or Refusé'}
            }, status=status.HTTP_400_BAD_REQUEST)
        
        authorization.statut = statut
        authorization.save()
        
        serializer = self.get_serializer(authorization)
        return Response({
            'success': True,
            'data': serializer.data,
            'message': f'Authorization {statut.lower()}',
            'errors': None
        })


class ExpenseReportViewSet(viewsets.ModelViewSet):
    """
    ViewSet for ExpenseReport CRUD operations.
    """
    queryset = ExpenseReport.objects.all()
    serializer_class = ExpenseReportSerializer
    permission_classes = [IsManagerOrAdmin]
    pagination_class = StandardResultsSetPagination
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['statut', 'type', 'employee']
    search_fields = ['code', 'designation', 'employee__nom', 'employee__prenom']
    ordering_fields = ['date', 'montant', 'created_at']
    ordering = ['-created_at']
    
    @extend_schema(
        summary='Validate expense report',
        tags=['HR - Expense Reports']
    )
    @action(detail=True, methods=['post'])
    def validate(self, request, pk=None):
        """Validate an expense report."""
        expense = self.get_object()
        expense.statut = 'Validé'
        expense.save()
        
        serializer = self.get_serializer(expense)
        return Response({
            'success': True,
            'data': serializer.data,
            'message': 'Expense report validated',
            'errors': None
        })
    
    @extend_schema(
        summary='Reject expense report',
        tags=['HR - Expense Reports']
    )
    @action(detail=True, methods=['post'])
    def reject(self, request, pk=None):
        """Reject an expense report."""
        expense = self.get_object()
        expense.statut = 'Refusé'
        expense.save()
        
        serializer = self.get_serializer(expense)
        return Response({
            'success': True,
            'data': serializer.data,
            'message': 'Expense report rejected',
            'errors': None
        })
    
    @extend_schema(
        summary='Update expense report status',
        tags=['HR - Expense Reports']
    )
    @action(detail=True, methods=['patch'], url_path='status')
    def update_status(self, request, pk=None):
        """Update expense report status (validate/reject)."""
        expense = self.get_object()
        statut = request.data.get('statut')
        notes = request.data.get('notes', '')
        montant_autorise = request.data.get('montantAutorise', request.data.get('montant_autorise'))
        
        if statut not in ['Validé', 'Refusé']:
            return Response({
                'success': False,
                'data': None,
                'message': 'Invalid status',
                'errors': {'statut': 'Must be Validé or Refusé'}
            }, status=status.HTTP_400_BAD_REQUEST)
        
        expense.statut = statut
        # Optionally update montant if montant_autorise is provided
        if montant_autorise is not None:
            expense.montant = montant_autorise
        expense.save()
        
        serializer = self.get_serializer(expense)
        return Response({
            'success': True,
            'data': serializer.data,
            'message': f'Expense report {statut.lower()}',
            'errors': None
        })
