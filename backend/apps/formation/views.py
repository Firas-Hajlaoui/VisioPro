from rest_framework import viewsets, filters
from django_filters.rest_framework import DjangoFilterBackend

from .models import TrainingSession
from .serializers import TrainingSessionSerializer
from apps.common.permissions import IsManagerOrAdmin
from apps.common.pagination import StandardResultsSetPagination


class TrainingSessionViewSet(viewsets.ModelViewSet):
    """
    ViewSet for TrainingSession CRUD operations.
    """
    queryset = TrainingSession.objects.all()
    serializer_class = TrainingSessionSerializer
    permission_classes = [IsManagerOrAdmin]
    pagination_class = StandardResultsSetPagination
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['statut']
    search_fields = ['code', 'titre', 'formateur']
    ordering_fields = ['date', 'created_at']
    ordering = ['-date']
