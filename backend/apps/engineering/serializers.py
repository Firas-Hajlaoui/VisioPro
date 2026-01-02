from rest_framework import serializers
from .models import EngineeringIntervention
from apps.common.models import CodeCounter


class EngineeringInterventionSerializer(serializers.ModelSerializer):
    """
    Serializer for EngineeringIntervention model.
    """
    class Meta:
        model = EngineeringIntervention
        fields = '__all__'
        read_only_fields = ('id', 'code', 'created_at', 'updated_at')
    
    def create(self, validated_data):
        validated_data['code'] = CodeCounter.generate_code('ENG', 'INT')
        return super().create(validated_data)
