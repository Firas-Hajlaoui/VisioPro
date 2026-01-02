from rest_framework import serializers
from .models import CustomUser

class UserSerializer(serializers.ModelSerializer):
    # Mapping 'id' to 'employee_id' to match frontend expected string ID if present, else fallback to str(id)
    id = serializers.CharField(source='employee_id', read_only=True)
    firstName = serializers.CharField(source='first_name')
    lastName = serializers.CharField(source='last_name')

    class Meta:
        model = CustomUser
        fields = ['id', 'firstName', 'lastName', 'email', 'role', 'departement']
