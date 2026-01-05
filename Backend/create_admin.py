#!/usr/bin/env python
import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from django.contrib.auth import get_user_model

User = get_user_model()

# Create admin user if it doesn't exist
if not User.objects.filter(username='admin').exists():
    admin = User.objects.create_user(
        username='admin',
        email='admin@visiopro.com',
        password='admin123',
        first_name='Admin',
        last_name='System',
        role='admin',
        departement='Administration',
        employee_id='admin-001'
    )
    print("Admin user created successfully")
    print(f"Username: admin")
    print(f"Password: admin123")
else:
    print("Admin user already exists")

# Create a test employee if it doesn't exist
if not User.objects.filter(username='ahmed.bennani').exists():
    employee = User.objects.create_user(
        username='ahmed.bennani',
        email='ahmed.bennani@company.com',
        password='employee123',
        first_name='Ahmed',
        last_name='Bennani',
        role='employee',
        departement='IT',
        employee_id='emp-001'
    )
    print("Test employee created successfully")
    print(f"Username: ahmed.bennani")
    print(f"Password: employee123")
else:
    print("Test employee already exists")
