from rest_framework import viewsets, filters
from django_filters.rest_framework import DjangoFilterBackend

from .models import EngineeringIntervention
from .serializers import EngineeringInterventionSerializer
from apps.common.permissions import IsManagerOrAdmin
from apps.common.pagination import StandardResultsSetPagination


class EngineeringInterventionViewSet(viewsets.ModelViewSet):
    """
    ViewSet for EngineeringIntervention CRUD operations.
    """
    queryset = EngineeringIntervention.objects.all()
    serializer_class = EngineeringInterventionSerializer
    permission_classes = [IsManagerOrAdmin]
    pagination_class = StandardResultsSetPagination
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['statut', 'type']
    search_fields = ['code', 'client', 'site', 'technicien']
    ordering_fields = ['date', 'created_at']
    ordering = ['-date']
