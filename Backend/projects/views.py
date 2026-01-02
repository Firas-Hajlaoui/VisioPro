from rest_framework import viewsets
from .models import Project, ProjectDoc
from .serializers import ProjectSerializer, ProjectDocSerializer

class ProjectViewSet(viewsets.ModelViewSet):
    queryset = Project.objects.all()
    serializer_class = ProjectSerializer

class ProjectDocViewSet(viewsets.ModelViewSet):
    queryset = ProjectDoc.objects.all()
    serializer_class = ProjectDocSerializer
