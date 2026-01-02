from rest_framework import serializers
from .models import TrainingSession
from apps.common.models import CodeCounter


class TrainingSessionSerializer(serializers.ModelSerializer):
    """
    Serializer for TrainingSession model.
    """
    class Meta:
        model = TrainingSession
        fields = '__all__'
        read_only_fields = ('id', 'code', 'created_at', 'updated_at')
    
    def create(self, validated_data):
        validated_data['code'] = CodeCounter.generate_code('FORM', 'SESS')
        return super().create(validated_data)
