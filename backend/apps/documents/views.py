from rest_framework import viewsets, filters, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend
from django.http import FileResponse
from django.conf import settings
import os

from .models import Document
from .serializers import DocumentSerializer
from apps.common.permissions import IsManagerOrAdmin
from apps.common.pagination import StandardResultsSetPagination
from apps.common.exceptions import error_response


class DocumentViewSet(viewsets.ModelViewSet):
    """
    ViewSet for Document CRUD operations with file upload support.
    """
    queryset = Document.objects.all()
    serializer_class = DocumentSerializer
    permission_classes = [IsManagerOrAdmin]
    pagination_class = StandardResultsSetPagination
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['type', 'departement']
    search_fields = ['code', 'nom']
    ordering_fields = ['date', 'created_at']
    ordering = ['-created_at']
    
    @action(detail=True, methods=['get'])
    def download(self, request, pk=None):
        """Download a document file."""
        document = self.get_object()
        
        if not document.file:
            return error_response(
                message='No file attached to this document',
                status_code=status.HTTP_404_NOT_FOUND
            )
        
        try:
            file_path = document.file.path
            if os.path.exists(file_path):
                return FileResponse(
                    open(file_path, 'rb'),
                    as_attachment=True,
                    filename=document.nom
                )
            else:
                return error_response(
                    message='File not found on server',
                    status_code=status.HTTP_404_NOT_FOUND
                )
        except Exception as e:
            return error_response(
                message=f'Error downloading file: {str(e)}',
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
