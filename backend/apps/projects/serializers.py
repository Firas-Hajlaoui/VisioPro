from rest_framework import serializers
from .models import Project
from apps.common.models import CodeCounter


class ProjectSerializer(serializers.ModelSerializer):
    """
    Serializer for Project model.
    """
    class Meta:
        model = Project
        fields = '__all__'
        read_only_fields = ('id', 'code', 'created_at', 'updated_at')
    
    def create(self, validated_data):
        validated_data['code'] = CodeCounter.generate_code('PROJ', 'PRJ')
        return super().create(validated_data)
