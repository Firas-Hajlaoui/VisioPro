#!/bin/bash

# Exit on error
set -e

echo "Waiting for PostgreSQL to be ready..."
while ! pg_isready -h ${DB_HOST:-db} -p ${DB_PORT:-5432} -U ${DB_USER:-visiopro}; do
  sleep 1
done

echo "PostgreSQL is ready!"

# Run migrations
echo "Running database migrations..."
python manage.py makemigrations --noinput
python manage.py migrate --noinput

# Collect static files
echo "Collecting static files..."
python manage.py collectstatic --noinput --clear

# Create superuser if it doesn't exist
echo "Creating superuser if it doesn't exist..."
python manage.py shell << END
from apps.authentication.models import User
if not User.objects.filter(email='admin@company.com').exists():
    User.objects.create_superuser(
        email='admin@company.com',
        password='admin123',
        first_name='Admin',
        last_name='System',
        role='admin',
        department='Administration'
    )
    print('Superuser created successfully!')
else:
    print('Superuser already exists.')
END

echo "Starting application..."
exec "$@"
