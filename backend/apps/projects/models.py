from django.db import models
from django.core.validators import MinValueValidator, MaxValueValidator


class Project(models.Model):
    """
    Project model.
    """
    STATUS_CHOICES = (
        ('En cours', 'En cours'),
        ('Terminé', 'Terminé'),
        ('En pause', 'En pause'),
        ('Annulé', 'Annulé'),
    )
    
    code = models.CharField(max_length=50, unique=True)
    intitule = models.CharField(max_length=255)
    client = models.CharField(max_length=255)
    chef_projet = models.CharField(max_length=255)
    date_debut = models.DateField()
    date_fin = models.DateField()
    description = models.TextField(blank=True, null=True)
    progression = models.IntegerField(default=0, validators=[MinValueValidator(0), MaxValueValidator(100)])
    statut = models.CharField(max_length=20, choices=STATUS_CHOICES, default='En cours')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'Project'
        ordering = ['-created_at']
    
    def __str__(self):
        return f"{self.code} - {self.intitule}"
