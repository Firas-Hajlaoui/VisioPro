from django.db import models


class Document(models.Model):
    """
    Document model matching the PostgreSQL schema.
    """
    TYPE_CHOICES = (
        ('Devis', 'Devis'),
        ('Technique', 'Technique'),
        ('Administratif', 'Administratif'),
        ('Autre', 'Autre'),
    )
    
    code = models.CharField(max_length=50, unique=True)
    nom = models.CharField(max_length=255)
    type = models.CharField(max_length=50, choices=TYPE_CHOICES)
    departement = models.CharField(max_length=255)
    date = models.DateTimeField(auto_now_add=True)
    taille = models.CharField(max_length=50)
    minio_path = models.CharField(max_length=500, null=True, blank=True, db_column='minioPath')
    file = models.FileField(upload_to='documents/%Y/%m/', null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True, db_column='createdAt')
    updated_at = models.DateTimeField(auto_now=True, db_column='updatedAt')
    
    class Meta:
        db_table = 'Document'
        ordering = ['-created_at']
    
    def __str__(self):
        return f"{self.code} - {self.nom}"
