from django.contrib.auth.models import AbstractUser
from django.db import models

class CustomUser(AbstractUser):
    ROLE_CHOICES = [
        ("admin", "Admin"),
        ("employee", "Employee"),
        ("manager", "Manager"),
    ]
    
    # Existing fields in AbstractUser: username, first_name, last_name, email
    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default="employee")
    departement = models.CharField(max_length=100, blank=True, null=True)
    employee_id = models.CharField(max_length=50, blank=True, null=True, unique=True, help_text="e.g. emp-001")

    def __str__(self):
        return self.username
