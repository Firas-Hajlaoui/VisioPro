#!/bin/bash

# Backend Setup Script

echo "Setting up VisioPro Backend..."

# Create virtual environment if it doesn't exist
if [ ! -d "venv" ]; then
    echo "Creating virtual environment..."
    python3 -m venv venv
fi

# Activate virtual environment
echo "Activating virtual environment..."
source venv/bin/activate

# Install dependencies
echo "Installing dependencies..."
pip install -r requirements.txt

# Run migrations
echo "Running migrations..."
python manage.py makemigrations
python manage.py makemigrations rh
python manage.py makemigrations users
python manage.py makemigrations projects
python manage.py migrate

# Create admin user
echo "Creating admin user..."
python create_admin.py

echo "Backend setup complete!"
echo ""
echo "To run the server:"
echo "  source venv/bin/activate"
echo "  python manage.py runserver"
