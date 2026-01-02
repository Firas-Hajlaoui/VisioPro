from rest_framework import viewsets, filters
from django_filters.rest_framework import DjangoFilterBackend

from .models import Project
from .serializers import ProjectSerializer
from apps.common.permissions import IsManagerOrAdmin
from apps.common.pagination import StandardResultsSetPagination


class ProjectViewSet(viewsets.ModelViewSet):
    """
    ViewSet for Project CRUD operations.
    """
    queryset = Project.objects.all()
    serializer_class = ProjectSerializer
    permission_classes = [IsManagerOrAdmin]
    pagination_class = StandardResultsSetPagination
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['statut']
    search_fields = ['code', 'intitule', 'client', 'chef_projet']
    ordering_fields = ['date_debut', 'date_fin', 'progression', 'created_at']
    ordering = ['-created_at']
