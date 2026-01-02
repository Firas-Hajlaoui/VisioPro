from django.db import models

class Project(models.Model):
    STATUT_CHOICES = [
        ("En cours", "En cours"),
        ("Terminé", "Terminé"),
        ("En pause", "En pause"),
        ("Annulé", "Annulé"),
    ]

    code = models.CharField(max_length=50, unique=True)
    intitule = models.CharField(max_length=200)
    client = models.CharField(max_length=100)
    chefProjet = models.CharField(max_length=100) # Storing name as per frontend
    dateDebut = models.DateField()
    dateFin = models.DateField()
    description = models.TextField(blank=True, null=True)
    progression = models.IntegerField(default=0) # 0 to 100
    statut = models.CharField(max_length=20, choices=STATUT_CHOICES, default="En cours")

    def __str__(self):
        return f"{self.code} - {self.intitule}"

class ProjectDoc(models.Model):
    TYPE_CHOICES = [
        ("Devis", "Devis"),
        ("Technique", "Technique"),
        ("Administratif", "Administratif"),
        ("Autre", "Autre"),
    ]

    project = models.ForeignKey(Project, on_delete=models.CASCADE, related_name="docsList")
    name = models.CharField(max_length=200)
    type = models.CharField(max_length=50, choices=TYPE_CHOICES)
    date = models.DateField()
    size = models.CharField(max_length=20) # e.g "2.4 MB"

    def __str__(self):
        return self.name
