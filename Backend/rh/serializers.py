from rest_framework import serializers
from .models import Employee, LeaveRequest, TimeRecord, ExpenseReport, Authorization
from django.contrib.auth import get_user_model
from django.db import transaction

User = get_user_model()

class EmployeeSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=False, allow_blank=True)

    class Meta:
        model = Employee
        fields = '__all__'
        extra_kwargs = {'user': {'read_only': True}}
    
    def create(self, validated_data):
        password = validated_data.pop('password', None)
        with transaction.atomic():
            employee = Employee.objects.create(**validated_data)
            
            # Create a corresponding User if password is provided or auto-generate one
            if password:
                username = normalized_username = f"{employee.prenom.lower()}.{employee.nom.lower()}"
                
                # Check uniqueness of username
                counter = 1
                while User.objects.filter(username=username).exists():
                    username = f"{normalized_username}{counter}"
                    counter += 1
                
                user = User.objects.create_user(
                    username=username,
                    email=employee.email,
                    password=password,
                    first_name=employee.prenom,
                    last_name=employee.nom,
                    role='employee', # Default role
                    departement=employee.departement,
                    employee_id=employee.code
                )
                employee.user = user
                employee.save()
                
        return employee

class LeaveRequestSerializer(serializers.ModelSerializer):
    employe = serializers.StringRelatedField() 

    class Meta:
        model = LeaveRequest
        fields = ['id', 'code', 'employe', 'debut', 'fin', 'jours', 'type', 'motif', 'statut']

class TimeRecordSerializer(serializers.ModelSerializer):
    employe = serializers.StringRelatedField()

    class Meta:
        model = TimeRecord
        fields = ['id', 'code', 'employe', 'date', 'heureEntree', 'heureSortie', 'lieu', 'heures', 'type', 'statut', 'hsValide']

class ExpenseReportSerializer(serializers.ModelSerializer):
    employe = serializers.StringRelatedField()

    class Meta:
        model = ExpenseReport
        fields = ['id', 'code', 'employe', 'date', 'designation', 'montant', 'projet', 'type', 'statut']

class AuthorizationSerializer(serializers.ModelSerializer):
    employe = serializers.StringRelatedField()

    class Meta:
        model = Authorization
        fields = ['id', 'code', 'employe', 'date', 'duree', 'type', 'motif', 'statut']
