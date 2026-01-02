from rest_framework import serializers
from .models import Project, ProjectDoc

class ProjectDocSerializer(serializers.ModelSerializer):
    id = serializers.CharField(source='id', read_only=True)

    class Meta:
        model = ProjectDoc
        fields = ['id', 'name', 'type', 'date', 'size']

class ProjectSerializer(serializers.ModelSerializer):
    docsList = ProjectDocSerializer(many=True, read_only=True)
    id = serializers.IntegerField(read_only=True)
    stats = serializers.SerializerMethodField()

    class Meta:
        model = Project
        fields = ['id', 'code', 'intitule', 'client', 'chefProjet', 'dateDebut', 'dateFin', 'description', 'progression', 'statut', 'stats', 'docsList']
    
    def get_stats(self, obj):
        # Mock calculation or based on actual docs types
        return {
            "devis": obj.docsList.filter(type="Devis").count(),
            "fiches": obj.docsList.filter(type="Autre").count(), # Mapping assumptions
            "technique": obj.docsList.filter(type="Technique").count(),
            "backup": 0
        }
