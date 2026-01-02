from django.db import models

class Employee(models.Model):
    STATUT_CHOICES = [
        ("Actif", "Actif"),
        ("Inactif", "Inactif"),
        ("En congé", "En congé"),
    ]

    code = models.CharField(max_length=50, unique=True)
    nom = models.CharField(max_length=100)
    prenom = models.CharField(max_length=100)
    email = models.EmailField(unique=True)
    poste = models.CharField(max_length=100)
    departement = models.CharField(max_length=100)
    dateEmbauche = models.DateField()
    salaire = models.DecimalField(max_digits=10, decimal_places=2)
    statut = models.CharField(max_length=20, choices=STATUT_CHOICES, default="Actif")
    
    # Link to the User model for authentication
    user = models.OneToOneField('users.CustomUser', on_delete=models.SET_NULL, null=True, blank=True, related_name='employee_profile')

    def __str__(self):
        return f"{self.nom} {self.prenom}"


class LeaveRequest(models.Model):
    STATUT_CHOICES = [
        ("En attente", "En attente"),
        ("Approuvé", "Approuvé"),
        ("Refusé", "Refusé"),
    ]

    code = models.CharField(max_length=50, unique=True)
    employe = models.ForeignKey(Employee, on_delete=models.CASCADE, related_name="leaves")
    debut = models.DateField()
    fin = models.DateField()
    # jours could be calculated, but stored for now as per frontend
    jours = models.DecimalField(max_digits=5, decimal_places=1)
    type = models.CharField(max_length=50) # e.g. "Congé payé", "Maladie"
    motif = models.TextField(blank=True, null=True)
    statut = models.CharField(max_length=20, choices=STATUT_CHOICES, default="En attente")

    def __str__(self):
        return f"{self.code} - {self.employe}"

class TimeRecord(models.Model):
    employe = models.ForeignKey(Employee, on_delete=models.CASCADE, related_name="time_records")
    code = models.CharField(max_length=50, unique=True) # To match frontend ID/Code
    date = models.DateField()
    heureEntree = models.TimeField()
    heureSortie = models.TimeField()
    lieu = models.CharField(max_length=100, default="Bureau")
    heures = models.DecimalField(max_digits=5, decimal_places=2) # e.g. 8.5
    type = models.CharField(max_length=50, default="Normal")
    statut = models.CharField(max_length=50, default="Présent")
    hsValide = models.BooleanField(default=False)

    def __str__(self):
        return f"{self.employe} - {self.date}"

class ExpenseReport(models.Model):
    STATUT_CHOICES = [
        ("En attente", "En attente"),
        ("Validé", "Validé"),
        ("Refusé", "Refusé"),
    ]

    code = models.CharField(max_length=50, unique=True)
    employe = models.ForeignKey(Employee, on_delete=models.CASCADE, related_name="expenses")
    date = models.DateField()
    designation = models.CharField(max_length=200)
    montant = models.DecimalField(max_digits=10, decimal_places=2)
    projet = models.CharField(max_length=100) # Storing as string for now, could be FK
    type = models.CharField(max_length=50) # e.g. "Transport", "Repas"
    statut = models.CharField(max_length=20, choices=STATUT_CHOICES, default="En attente")
    
    def __str__(self):
        return f"{self.code} - {self.montant}"

class Authorization(models.Model):
    STATUT_CHOICES = [
        ("En attente", "En attente"),
        ("Approuvé", "Approuvé"),
        ("Refusé", "Refusé"),
    ]

    code = models.CharField(max_length=50, unique=True)
    employe = models.ForeignKey(Employee, on_delete=models.CASCADE, related_name="authorizations")
    date = models.DateField()
    duree = models.CharField(max_length=20) # Keeping as string "2h" to match frontend, or could calculate
    type = models.CharField(max_length=50)
    motif = models.TextField(blank=True, null=True)
    statut = models.CharField(max_length=20, choices=STATUT_CHOICES, default="En attente")

    def __str__(self):
        return f"{self.code} - {self.employe}"
