from django.db import models


class TrainingSession(models.Model):
    """
    Training session model for formations.
    """
    STATUS_CHOICES = (
        ('Planifiée', 'Planifiée'),
        ('En cours', 'En cours'),
        ('Terminée', 'Terminée'),
    )
    
    code = models.CharField(max_length=50, unique=True)
    titre = models.CharField(max_length=255)
    formateur = models.CharField(max_length=255)
    date = models.DateField()
    participants = models.IntegerField(default=0)
    duree = models.CharField(max_length=50)  # e.g., "2 jours", "8h"
    description = models.TextField(blank=True, null=True)
    statut = models.CharField(max_length=20, choices=STATUS_CHOICES, default='Planifiée')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'TrainingSession'
        ordering = ['-date']
    
    def __str__(self):
        return f"{self.code} - {self.titre}"
