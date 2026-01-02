from rest_framework import serializers
from .models import Employee, TimeRecord, LeaveRequest, Authorization, ExpenseReport
from apps.common.models import CodeCounter


class EmployeeSerializer(serializers.ModelSerializer):
    """
    Serializer for Employee model.
    """
    class Meta:
        model = Employee
        fields = '__all__'
        read_only_fields = ('id', 'code', 'created_at', 'updated_at')
    
    def create(self, validated_data):
        validated_data['code'] = CodeCounter.generate_code('EMP', 'EMPL')
        return super().create(validated_data)


class TimeRecordSerializer(serializers.ModelSerializer):
    """
    Serializer for TimeRecord model.
    """
    employe = serializers.SerializerMethodField()
    
    class Meta:
        model = TimeRecord
        fields = '__all__'
        read_only_fields = ('id', 'code', 'created_at', 'updated_at')
    
    def get_employe(self, obj):
        return f"{obj.employee.prenom} {obj.employee.nom}"
    
    def create(self, validated_data):
        validated_data['code'] = CodeCounter.generate_code('HR', 'TEMPS')
        return super().create(validated_data)
    
    def to_representation(self, instance):
        representation = super().to_representation(instance)
        representation['employee_id'] = instance.employee.id
        return representation


class LeaveRequestSerializer(serializers.ModelSerializer):
    """
    Serializer for LeaveRequest model.
    """
    employe = serializers.SerializerMethodField()
    
    class Meta:
        model = LeaveRequest
        fields = '__all__'
        read_only_fields = ('id', 'code', 'created_at', 'updated_at')
    
    def get_employe(self, obj):
        return f"{obj.employee.prenom} {obj.employee.nom}"
    
    def create(self, validated_data):
        validated_data['code'] = CodeCounter.generate_code('HR', 'CONGE')
        return super().create(validated_data)
    
    def to_representation(self, instance):
        representation = super().to_representation(instance)
        representation['employee_id'] = instance.employee.id
        return representation


class AuthorizationSerializer(serializers.ModelSerializer):
    """
    Serializer for Authorization model.
    """
    employe = serializers.SerializerMethodField()
    
    class Meta:
        model = Authorization
        fields = '__all__'
        read_only_fields = ('id', 'code', 'created_at', 'updated_at')
    
    def get_employe(self, obj):
        return f"{obj.employee.prenom} {obj.employee.nom}"
    
    def create(self, validated_data):
        validated_data['code'] = CodeCounter.generate_code('HR', 'AUTH')
        return super().create(validated_data)
    
    def to_representation(self, instance):
        representation = super().to_representation(instance)
        representation['employee_id'] = instance.employee.id
        return representation


class ExpenseReportSerializer(serializers.ModelSerializer):
    """
    Serializer for ExpenseReport model.
    """
    employe = serializers.SerializerMethodField()
    
    class Meta:
        model = ExpenseReport
        fields = '__all__'
        read_only_fields = ('id', 'code', 'created_at', 'updated_at')
    
    def get_employe(self, obj):
        return f"{obj.employee.prenom} {obj.employee.nom}"
    
    def create(self, validated_data):
        validated_data['code'] = CodeCounter.generate_code('HR', 'FRAIS')
        return super().create(validated_data)
    
    def to_representation(self, instance):
        representation = super().to_representation(instance)
        representation['employee_id'] = instance.employee.id
        return representation
