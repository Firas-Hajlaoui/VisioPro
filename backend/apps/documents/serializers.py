from rest_framework import serializers
from .models import Document
from apps.common.models import CodeCounter


class DocumentSerializer(serializers.ModelSerializer):
    """
    Serializer for Document model.
    """
    class Meta:
        model = Document
        fields = '__all__'
        read_only_fields = ('id', 'code', 'created_at', 'updated_at', 'date')
    
    def create(self, validated_data):
        validated_data['code'] = CodeCounter.generate_code(
            validated_data.get('departement', 'DOC'),
            validated_data.get('type', 'GEN')
        )
        
        # Calculate file size if file is uploaded
        if 'file' in validated_data and validated_data['file']:
            file_size = validated_data['file'].size
            if file_size < 1024:
                validated_data['taille'] = f"{file_size} B"
            elif file_size < 1024 * 1024:
                validated_data['taille'] = f"{file_size / 1024:.1f} KB"
            else:
                validated_data['taille'] = f"{file_size / (1024 * 1024):.1f} MB"
        
        return super().create(validated_data)
