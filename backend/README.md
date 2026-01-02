# VisioPro Backend API

Complete Django REST API backend for VisioPro HR Management System with JWT authentication, PostgreSQL database, and Docker containerization.

## Features

- 🔐 JWT-based authentication with token refresh and blacklisting
- 👥 Role-based access control (Admin, Manager, Employee)
- 📊 Complete HR management (Employees, Time tracking, Leave requests, Authorizations, Expense reports)
- 📚 Formation (Training sessions)
- 🔧 Engineering interventions
- 📁 Project management
- 📄 Document management with file upload/download
- 🔔 Notifications system
- 📖 Auto-generated API documentation (Swagger/OpenAPI)
- 🐳 Docker & Docker Compose support
- 🔢 Automatic code generation for entities (ISO 9001 compliant)

## Tech Stack

- **Backend**: Django 4.2+
- **API**: Django REST Framework
- **Database**: PostgreSQL 16+
- **Authentication**: JWT (djangorestframework-simplejwt)
- **API Docs**: drf-spectacular (Swagger/OpenAPI)
- **Containerization**: Docker & Docker Compose
- **Server**: Gunicorn (production)

## Prerequisites

- Python 3.11+
- PostgreSQL 16+ (or use Docker)
- Docker & Docker Compose (optional)

## Quick Start with Docker

1. **Clone the repository and navigate to backend directory**
   ```bash
   cd backend
   ```

2. **Copy environment file**
   ```bash
   cp .env.example .env
   ```

3. **Update `.env` file with your configuration**
   - Set a secure `SECRET_KEY`
   - Configure database credentials
   - Set CORS allowed origins for your frontend

4. **Build and start containers**
   ```bash
   docker-compose up --build
   ```

5. **Access the application**
   - API: http://localhost:8000/api/
   - Admin Panel: http://localhost:8000/admin/
   - API Documentation: http://localhost:8000/api/docs/
   - Default admin credentials:
     - Email: `admin@company.com`
     - Password: `admin123`

## Local Development Setup

1. **Create virtual environment**
   ```bash
   python3 -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

2. **Install dependencies**
   ```bash
   pip install -r requirements.txt
   ```

3. **Copy and configure environment file**
   ```bash
   cp .env.example .env
   # Edit .env and set DB_HOST=localhost
   ```

4. **Create PostgreSQL database**
   ```bash
   createdb visioprodb
   ```

5. **Run migrations**
   ```bash
   python manage.py makemigrations
   python manage.py migrate
   ```

6. **Create superuser**
   ```bash
   python manage.py createsuperuser
   ```

7. **Collect static files**
   ```bash
   python manage.py collectstatic --noinput
   ```

8. **Run development server**
   ```bash
   python manage.py runserver
   ```

## API Endpoints

### Authentication
- `POST /api/auth/login/` - Login (returns JWT tokens)
- `POST /api/auth/logout/` - Logout (blacklist refresh token)
- `POST /api/auth/refresh/` - Refresh access token
- `GET /api/auth/me/` - Get current user info
- `POST /api/auth/register/` - Register new user
- `POST /api/auth/change-password/` - Change password

### HR Module
- `GET/POST /api/rh/employees/` - List/Create employees
- `GET/PUT/PATCH/DELETE /api/rh/employees/{id}/` - Retrieve/Update/Delete employee
- `GET /api/rh/employees/stats/` - Get employee statistics
- `GET/POST /api/rh/temps/` - List/Create time records
- `GET/POST /api/rh/conges/` - List/Create leave requests
- `POST /api/rh/conges/{id}/approve/` - Approve leave request
- `POST /api/rh/conges/{id}/reject/` - Reject leave request
- `GET/POST /api/rh/autorisations/` - List/Create authorizations
- `GET/POST /api/rh/frais/` - List/Create expense reports

### Formation
- `GET/POST /api/formation/` - List/Create training sessions
- `GET/PUT/PATCH/DELETE /api/formation/{id}/` - Retrieve/Update/Delete session

### Engineering
- `GET/POST /api/engineering/` - List/Create engineering interventions
- `GET/PUT/PATCH/DELETE /api/engineering/{id}/` - Retrieve/Update/Delete intervention

### Projects
- `GET/POST /api/projects/` - List/Create projects
- `GET/PUT/PATCH/DELETE /api/projects/{id}/` - Retrieve/Update/Delete project

### Documents
- `GET/POST /api/documents/` - List/Create documents
- `GET /api/documents/{id}/download/` - Download document file

### Notifications
- `GET/POST /api/notifications/` - List/Create notifications
- `GET /api/notifications/my_notifications/` - Get user's notifications
- `POST /api/notifications/{id}/mark_as_read/` - Mark as read

## Query Parameters

All list endpoints support:
- **Pagination**: `?page=1&limit=20`
- **Filtering**: `?statut=Actif&departement=IT`
- **Search**: `?search=john`
- **Ordering**: `?ordering=-created_at`

## Authentication

Include JWT token in the Authorization header:
```
Authorization: Bearer <your_access_token>
```

## Code Generation

The system automatically generates unique codes for:
- Employees: `EMP-EMPL-2025-001`
- Time records: `HR-TEMPS-2025-001`
- Leave requests: `HR-CONGE-2025-001`
- Documents: `{DEPT}-{TYPE}-2025-001`

Format: `DEPARTMENT-DOCTYPE-YEAR-COUNTER`

## Environment Variables

See `.env.example` for all available variables:

- `SECRET_KEY` - Django secret key
- `DEBUG` - Debug mode (True/False)
- `ALLOWED_HOSTS` - Comma-separated list of allowed hosts
- `DB_*` - Database configuration
- `JWT_*` - JWT token lifetime settings
- `CORS_ALLOWED_ORIGINS` - Frontend URLs for CORS

## Docker Commands

```bash
# Start services
docker-compose up -d

# View logs
docker-compose logs -f backend

# Stop services
docker-compose down

# Rebuild and start
docker-compose up --build

# Run migrations
docker-compose exec backend python manage.py migrate

# Create superuser
docker-compose exec backend python manage.py createsuperuser

# Access shell
docker-compose exec backend python manage.py shell
```

## Testing

```bash
# Run tests
pytest

# With coverage
pytest --cov=apps
```

## Production Deployment

1. Set `DEBUG=False` in `.env`
2. Set a strong `SECRET_KEY`
3. Configure `ALLOWED_HOSTS`
4. Use PostgreSQL (not SQLite)
5. Set up proper CORS origins
6. Use environment variables for sensitive data
7. Enable HTTPS
8. Set up proper logging
9. Use gunicorn or uwsgi as WSGI server

## API Documentation

Access interactive API documentation:
- **Swagger UI**: http://localhost:8000/api/docs/
- **ReDoc**: http://localhost:8000/api/redoc/
- **OpenAPI Schema**: http://localhost:8000/api/schema/

## Project Structure

```
backend/
├── apps/
│   ├── authentication/    # User authentication & JWT
│   ├── hr/               # Employee, time tracking, leaves, etc.
│   ├── formation/        # Training sessions
│   ├── engineering/      # Engineering interventions
│   ├── projects/         # Project management
│   ├── documents/        # Document management
│   ├── notifications/    # Notifications system
│   └── common/           # Shared utilities, permissions, pagination
├── visioproj/
│   ├── settings.py       # Django settings
│   ├── urls.py          # Main URL configuration
│   └── wsgi.py          # WSGI configuration
├── manage.py
├── requirements.txt
├── Dockerfile
├── docker-compose.yml
└── .env.example
```

## Support

For issues or questions, please create an issue in the repository.

## License

Proprietary - All rights reserved
