from rest_framework import serializers
from .models import Employee, LeaveRequest, TimeRecord, ExpenseReport, Authorization

class EmployeeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Employee
        fields = '__all__' # id, code, nom, prenom, email, poste, departement, dateEmbauche, salaire, statut

class LeaveRequestSerializer(serializers.ModelSerializer):
    employe = serializers.StringRelatedField() # Returns "Nom Prenom"

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
