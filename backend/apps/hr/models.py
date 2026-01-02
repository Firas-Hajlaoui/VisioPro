from django.db import models
from django.core.validators import MinValueValidator
from apps.common.models import CodeCounter


class Employee(models.Model):
    """
    Employee model matching the PostgreSQL schema.
    """
    STATUS_CHOICES = (
        ('Actif', 'Actif'),
        ('Inactif', 'Inactif'),
        ('En congé', 'En congé'),
    )
    
    code = models.CharField(max_length=50, unique=True)
    nom = models.CharField(max_length=255)
    prenom = models.CharField(max_length=255)
    email = models.EmailField(unique=True)
    poste = models.CharField(max_length=255)
    departement = models.CharField(max_length=255)
    date_embauche = models.DateTimeField()
    salaire = models.FloatField(validators=[MinValueValidator(0)])
    statut = models.CharField(max_length=20, choices=STATUS_CHOICES, default='Actif')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'Employee'
        ordering = ['-created_at']
    
    def __str__(self):
        return f"{self.code} - {self.prenom} {self.nom}"


class TimeRecord(models.Model):
    """
    Time tracking records for employees.
    """
    STATUS_CHOICES = (
        ('En attente', 'En attente'),
        ('Validé', 'Validé'),
        ('Refusé', 'Refusé'),
    )
    
    TYPE_CHOICES = (
        ('Normal', 'Normal'),
        ('Heures supplémentaires', 'Heures supplémentaires'),
        ('Télétravail', 'Télétravail'),
    )
    
    code = models.CharField(max_length=50, unique=True)
    employee = models.ForeignKey(Employee, on_delete=models.CASCADE, related_name='time_records')
    date = models.DateField()
    heure_entree = models.TimeField()
    heure_sortie = models.TimeField()
    lieu = models.CharField(max_length=255)
    heures = models.FloatField(validators=[MinValueValidator(0)])
    type = models.CharField(max_length=50, choices=TYPE_CHOICES, default='Normal')
    statut = models.CharField(max_length=20, choices=STATUS_CHOICES, default='En attente')
    hs_valide = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'TimeRecord'
        ordering = ['-date']
    
    def __str__(self):
        return f"{self.code} - {self.employee.prenom} {self.employee.nom} - {self.date}"


class LeaveRequest(models.Model):
    """
    Leave requests (congés) for employees.
    """
    STATUS_CHOICES = (
        ('En attente', 'En attente'),
        ('Approuvé', 'Approuvé'),
        ('Refusé', 'Refusé'),
    )
    
    TYPE_CHOICES = (
        ('Congé annuel', 'Congé annuel'),
        ('Congé maladie', 'Congé maladie'),
        ('Congé sans solde', 'Congé sans solde'),
        ('Congé maternité', 'Congé maternité'),
        ('Congé paternité', 'Congé paternité'),
    )
    
    code = models.CharField(max_length=50, unique=True)
    employee = models.ForeignKey(Employee, on_delete=models.CASCADE, related_name='leave_requests')
    debut = models.DateField()
    fin = models.DateField()
    jours = models.IntegerField(validators=[MinValueValidator(1)])
    type = models.CharField(max_length=50, choices=TYPE_CHOICES)
    motif = models.TextField(blank=True, null=True)
    statut = models.CharField(max_length=20, choices=STATUS_CHOICES, default='En attente')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'LeaveRequest'
        ordering = ['-created_at']
    
    def __str__(self):
        return f"{self.code} - {self.employee.prenom} {self.employee.nom} - {self.type}"


class Authorization(models.Model):
    """
    Authorization requests for employees (autorisations).
    """
    STATUS_CHOICES = (
        ('En attente', 'En attente'),
        ('Approuvé', 'Approuvé'),
        ('Refusé', 'Refusé'),
    )
    
    TYPE_CHOICES = (
        ('Sortie', 'Sortie'),
        ('Retard', 'Retard'),
        ('Mission', 'Mission'),
        ('Autre', 'Autre'),
    )
    
    code = models.CharField(max_length=50, unique=True)
    employee = models.ForeignKey(Employee, on_delete=models.CASCADE, related_name='authorizations')
    date = models.DateField()
    duree = models.CharField(max_length=20)  # e.g., "2h", "30min"
    type = models.CharField(max_length=50, choices=TYPE_CHOICES)
    motif = models.TextField(blank=True, null=True)
    statut = models.CharField(max_length=20, choices=STATUS_CHOICES, default='En attente')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'Authorization'
        ordering = ['-created_at']
    
    def __str__(self):
        return f"{self.code} - {self.employee.prenom} {self.employee.nom} - {self.type}"


class ExpenseReport(models.Model):
    """
    Expense reports (notes de frais) for employees.
    """
    STATUS_CHOICES = (
        ('En attente', 'En attente'),
        ('Validé', 'Validé'),
        ('Refusé', 'Refusé'),
    )
    
    TYPE_CHOICES = (
        ('Transport', 'Transport'),
        ('Repas', 'Repas'),
        ('Hébergement', 'Hébergement'),
        ('Fournitures', 'Fournitures'),
        ('Autre', 'Autre'),
    )
    
    code = models.CharField(max_length=50, unique=True)
    employee = models.ForeignKey(Employee, on_delete=models.CASCADE, related_name='expense_reports')
    date = models.DateField()
    designation = models.CharField(max_length=255)
    montant = models.FloatField(validators=[MinValueValidator(0)])
    projet = models.CharField(max_length=255)
    type = models.CharField(max_length=50, choices=TYPE_CHOICES)
    statut = models.CharField(max_length=20, choices=STATUS_CHOICES, default='En attente')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'ExpenseReport'
        ordering = ['-created_at']
    
    def __str__(self):
        return f"{self.code} - {self.employee.prenom} {self.employee.nom} - {self.designation}"
