from django.db import models


class EngineeringIntervention(models.Model):
    """
    Engineering intervention model.
    """
    STATUS_CHOICES = (
        ('Planifiée', 'Planifiée'),
        ('En cours', 'En cours'),
        ('Terminée', 'Terminée'),
    )
    
    TYPE_CHOICES = (
        ('Maintenance', 'Maintenance'),
        ('Audit', 'Audit'),
        ('Installation', 'Installation'),
        ('Réparation', 'Réparation'),
        ('Autre', 'Autre'),
    )
    
    code = models.CharField(max_length=50, unique=True)
    client = models.CharField(max_length=255)
    site = models.CharField(max_length=255)
    technicien = models.CharField(max_length=255)
    date = models.DateField()
    type = models.CharField(max_length=50, choices=TYPE_CHOICES)
    description = models.TextField(blank=True, null=True)
    statut = models.CharField(max_length=20, choices=STATUS_CHOICES, default='Planifiée')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'EngineeringIntervention'
        ordering = ['-date']
    
    def __str__(self):
        return f"{self.code} - {self.client} - {self.site}"
