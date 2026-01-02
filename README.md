# VisioPro - Complete HR Management System

Full-stack HR Management System with Django REST API backend and React frontend.

## Project Structure

```
VisioPro/
├── Frontend/          # React + TypeScript frontend with Vite
│   ├── src/
│   │   ├── components/
│   │   ├── contexts/
│   │   ├── hooks/
│   │   ├── lib/
│   │   ├── pages/
│   │   ├── types/
│   │   └── App.tsx
│   ├── package.json
│   └── vite.config.ts
│
└── backend/           # Django REST API backend
├── apps/
│   ├── authentication/    # JWT auth & user management
│   ├── hr/               # Employees, time, leaves, expenses
│   ├── formation/        # Training sessions
│   ├── engineering/      # Engineering interventions
│   ├── projects/         # Project management
│   ├── documents/        # Document management
│   ├── notifications/    # Notification system
│   └── common/           # Shared utilities
├── visioproj/
│   ├── settings.py
│   ├── urls.py
│   └── wsgi.py
├── Dockerfile
├── docker-compose.yml
├── requirements.txt
└── manage.py
```

## Features

### Backend (Django REST API)
- ✅ JWT-based authentication with token refresh
- ✅ Role-based access control (Admin, Manager, Employee)
- ✅ Complete HR module (Employees, Time tracking, Leaves, Authorizations, Expenses)
- ✅ Formation management (Training sessions)
- ✅ Engineering interventions
- ✅ Project management
- ✅ Document management with file upload/download
- ✅ Notifications system with read tracking
- ✅ Auto-generated codes (ISO 9001 compliant)
- ✅ Swagger/OpenAPI documentation
- ✅ PostgreSQL database support
- ✅ Docker containerization

### Frontend (React + TypeScript)
- ✅ Modern React 18 with TypeScript
- ✅ Tailwind CSS + shadcn/ui components
- ✅ React Query for data fetching
- ✅ React Router for navigation
- ✅ Protected routes with auth context
- ✅ Admin and Employee dashboards
- ✅ Responsive design
- ✅ Form validation
- ✅ Toast notifications

## Quick Start

### Backend

1. **Navigate to backend directory**
   ```bash
   cd backend
   ```

2. **Using Docker (Recommended)**
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   docker-compose up --build
   ```

3. **Or run locally**
   ```bash
   python3 -m venv venv
   source venv/bin/activate
   pip install -r requirements.txt
   cp .env.example .env
   python manage.py migrate
   python manage.py create_initial_users
   python manage.py runserver
   ```

4. **Access backend**
   - API: http://localhost:8000/api/
   - Admin Panel: http://localhost:8000/admin/
   - API Docs: http://localhost:8000/api/docs/

5. **Default credentials**
   - Admin: `admin@company.com` / `admin123`
   - Manager: `manager@company.com` / `manager123`
   - Employee: `employee@company.com` / `employee123`

### Frontend

1. **Navigate to frontend directory**
   ```bash
   cd Frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Access frontend**
   - URL: http://localhost:5173

5. **Login credentials**
   - Admin: `admin@company.com` / `admin123`
   - Employee: `employee@company.com` / `employee123`

## API Endpoints

### Authentication
- `POST /api/auth/login/` - Login
- `POST /api/auth/logout/` - Logout
- `POST /api/auth/refresh/` - Refresh token
- `GET /api/auth/me/` - Get current user

### HR Module
- `GET/POST /api/rh/employees/` - Employees
- `GET/POST /api/rh/temps/` - Time records
- `GET/POST /api/rh/conges/` - Leave requests
- `GET/POST /api/rh/autorisations/` - Authorizations
- `GET/POST /api/rh/frais/` - Expense reports

### Other Modules
- `/api/formation/` - Training sessions
- `/api/engineering/` - Engineering interventions
- `/api/projects/` - Projects
- `/api/documents/` - Documents
- `/api/notifications/` - Notifications

## Environment Variables

### Backend (.env)
```env
SECRET_KEY=your-secret-key
DEBUG=True
ALLOWED_HOSTS=localhost,127.0.0.1
DB_NAME=visioprodb
DB_USER=visiopro
DB_PASSWORD=visiopro_password
DB_HOST=db
DB_PORT=5432
CORS_ALLOWED_ORIGINS=http://localhost:5173,http://localhost:3000
```

### Frontend
Update API base URL in frontend configuration to point to backend:
```typescript
const API_BASE_URL = 'http://localhost:8000/api'
```

## Technology Stack

### Backend
- Django 4.2+
- Django REST Framework
- PostgreSQL 16+
- JWT Authentication
- Docker & Docker Compose
- drf-spectacular (API docs)

### Frontend
- React 18
- TypeScript
- Vite
- Tailwind CSS
- shadcn/ui
- React Query
- React Router

## Development

### Running Tests
```bash
# Backend
cd backend
pytest

# Frontend
cd Frontend
npm test
```

### Code Generation
The system automatically generates unique codes for entities:
- Format: `DEPT-DOCTYPE-YEAR-COUNTER`
- Example: `EMP-EMPL-2026-001`, `HR-TEMPS-2026-001`

### API Documentation
Interactive API documentation available at:
- Swagger UI: http://localhost:8000/api/docs/
- ReDoc: http://localhost:8000/api/redoc/

## Production Deployment

### Backend
1. Set `DEBUG=False`
2. Configure proper `SECRET_KEY`
3. Set up PostgreSQL database
4. Configure CORS for your frontend domain
5. Use environment variables for secrets
6. Run with gunicorn or uwsgi
7. Set up HTTPS

### Frontend
1. Build production bundle: `npm run build`
2. Deploy to static hosting (Netlify, Vercel, etc.)
3. Update API base URL to production backend

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

Proprietary - All rights reserved

## Support

For issues or questions, please create an issue in the repository.
