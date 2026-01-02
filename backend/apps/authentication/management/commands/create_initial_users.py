from django.core.management.base import BaseCommand
from apps.authentication.models import User


class Command(BaseCommand):
    help = 'Create initial users for testing'

    def handle(self, *args, **kwargs):
        # Create admin user
        if not User.objects.filter(email='admin@company.com').exists():
            User.objects.create_superuser(
                email='admin@company.com',
                password='admin123',
                first_name='Admin',
                last_name='System',
                role='admin',
                department='Administration'
            )
            self.stdout.write(self.style.SUCCESS('Admin user created successfully!'))
        else:
            self.stdout.write(self.style.WARNING('Admin user already exists.'))
        
        # Create manager user
        if not User.objects.filter(email='manager@company.com').exists():
            User.objects.create_user(
                email='manager@company.com',
                password='manager123',
                first_name='Manager',
                last_name='Test',
                role='manager',
                department='RH'
            )
            self.stdout.write(self.style.SUCCESS('Manager user created successfully!'))
        else:
            self.stdout.write(self.style.WARNING('Manager user already exists.'))
        
        # Create employee user
        if not User.objects.filter(email='employee@company.com').exists():
            User.objects.create_user(
                email='employee@company.com',
                password='employee123',
                first_name='Employee',
                last_name='Test',
                role='employee',
                department='IT'
            )
            self.stdout.write(self.style.SUCCESS('Employee user created successfully!'))
        else:
            self.stdout.write(self.style.WARNING('Employee user already exists.'))
        
        self.stdout.write(self.style.SUCCESS('\nAll initial users created/checked!'))
        self.stdout.write(self.style.SUCCESS('\nCredentials:'))
        self.stdout.write('Admin: admin@company.com / admin123')
        self.stdout.write('Manager: manager@company.com / manager123')
        self.stdout.write('Employee: employee@company.com / employee123')
