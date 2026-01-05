from django.db import models

class TrainingSession(models.Model):
    STATUT_CHOICES = [
        ("Planifiée", "Planifiée"),
        ("En cours", "En cours"),
        ("Terminée", "Terminée"),
    ]

    code = models.CharField(max_length=50, unique=True)
    titre = models.CharField(max_length=200)
    formateur = models.CharField(max_length=100)
    date = models.DateField()
    participants = models.IntegerField(default=0)
    duree = models.CharField(max_length=50)  # e.g. "2h", "1 jour"
    description = models.TextField(blank=True, null=True)
    statut = models.CharField(max_length=20, choices=STATUT_CHOICES, default="Planifiée")

    def __str__(self):
        return f"{self.code} - {self.titre}"
