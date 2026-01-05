# Frontend-Backend Integration Guide

## Overview

This document describes the integration between the VisioPro Frontend (React + TypeScript) and Backend (Django REST Framework).

## What Has Been Implemented

### 1. Backend Updates

#### Dependencies Added
- `djangorestframework-simplejwt==5.3.0` - JWT authentication
- `drf-yasg==1.21.7` - Swagger/OpenAPI documentation
- `django-filter==23.5` - Filtering support

#### Models & Serializers
- **Users**: Added `users/me/` endpoint to get current user data
- **Notifications**: Updated serializer to match frontend notification types
- **RH**: Added TrainingSession model and serializer
- **Projects**: Existing serializers match frontend types

#### API Endpoints
All endpoints are now available at `http://localhost:8000/api`:

**Authentication:**
- `POST /api/token/` - Login and get JWT tokens
- `POST /api/token/refresh/` - Refresh access token

**Users:**
- `GET /api/users/` - List all users (admin only)
- `GET /api/users/me/` - Get current user
- `GET /api/users/{id}/` - Get user details

**Notifications:**
- `GET /api/notifications/` - Get user notifications
- `POST /api/notifications/` - Create notification
- `PUT /api/notifications/{id}/` - Update notification
- `DELETE /api/notifications/{id}/` - Delete notification

**Employees:**
- `GET /api/employees/` - List all employees
- `POST /api/employees/` - Create employee (with auto user creation)
- `PUT /api/employees/{id}/` - Update employee
- `DELETE /api/employees/{id}/` - Delete employee

**Leave Requests:**
- `GET /api/leaves/` - List leave requests
- `POST /api/leaves/` - Create leave request
- `PUT /api/leaves/{id}/` - Update leave request
- `DELETE /api/leaves/{id}/` - Delete leave request

**Time Records:**
- `GET /api/time-records/` - List time records
- `POST /api/time-records/` - Create time record
- `PUT /api/time-records/{id}/` - Update time record
- `DELETE /api/time-records/{id}/` - Delete time record

**Expense Reports:**
- `GET /api/expenses/` - List expense reports
- `POST /api/expenses/` - Create expense report
- `PUT /api/expenses/{id}/` - Update expense report
- `DELETE /api/expenses/{id}/` - Delete expense report

**Authorizations:**
- `GET /api/authorizations/` - List authorizations
- `POST /api/authorizations/` - Create authorization
- `PUT /api/authorizations/{id}/` - Update authorization
- `DELETE /api/authorizations/{id}/` - Delete authorization

**Training Sessions:**
- `GET /api/training-sessions/` - List training sessions
- `POST /api/training-sessions/` - Create training session
- `PUT /api/training-sessions/{id}/` - Update training session
- `DELETE /api/training-sessions/{id}/` - Delete training session

**Projects:**
- `GET /api/projects/` - List projects
- `POST /api/projects/` - Create project
- `PUT /api/projects/{id}/` - Update project
- `DELETE /api/projects/{id}/` - Delete project

**Project Documents:**
- `GET /api/project-docs/` - List project documents
- `POST /api/project-docs/` - Create project document
- `PUT /api/project-docs/{id}/` - Update project document
- `DELETE /api/project-docs/{id}/` - Delete project document

**Documentation:**
- `GET /swagger/` - Interactive Swagger UI
- `GET /redoc/` - ReDoc documentation

### 2. Frontend Updates

#### API Client (`src/lib/api.ts`)
- Base URL: `http://localhost:8000/api`
- JWT token storage in localStorage
- Automatic token refresh on 401 errors
- Token management (access and refresh tokens)

#### Authentication Context (`src/context/AuthContext.tsx`)
- Real JWT authentication via API
- Current user data from `/api/users/me/`
- Token-based session management
- Loading state during authentication

#### API Hooks (`src/hooks/useApi.ts`)
React Query hooks for all API endpoints:
- `useCurrentUser`, `useUsers`, `useUser`
- `useNotifications`, `useCreateNotification`, `useUpdateNotification`, `useDeleteNotification`
- `useEmployees`, `useCreateEmployee`, `useUpdateEmployee`, `useDeleteEmployee`
- `useLeaveRequests`, `useCreateLeaveRequest`, `useUpdateLeaveRequest`, `useDeleteLeaveRequest`
- `useTimeRecords`, `useCreateTimeRecord`, `useUpdateTimeRecord`, `useDeleteTimeRecord`
- `useExpenseReports`, `useCreateExpenseReport`, `useUpdateExpenseReport`, `useDeleteExpenseReport`
- `useAuthorizations`, `useCreateAuthorization`, `useUpdateAuthorization`, `useDeleteAuthorization`
- `useTrainingSessions`, `useCreateTrainingSession`, `useUpdateTrainingSession`, `useDeleteTrainingSession`
- `useProjects`, `useCreateProject`, `useUpdateProject`, `useDeleteProject`
- `useProjectDocs`, `useCreateProjectDoc`, `useUpdateProjectDoc`, `useDeleteProjectDoc`

#### Login Page (`src/pages/Login.tsx`)
- Updated to use real authentication
- Changed from email to username field
- JWT-based login flow
- Demo credentials updated

#### Type Definitions
- Updated `AuthUser` to include all user fields
- Added `isLoading` to AuthContextType
- Added login credentials and token response types

## Setup Instructions

### Backend Setup

1. Install dependencies:
```bash
cd Backend
pip install -r requirements.txt
```

2. Run migrations:
```bash
python manage.py makemigrations rh
python manage.py migrate
```

3. Create admin user:
```bash
python create_admin.py
```

4. Run development server:
```bash
python manage.py runserver
```

Backend will be available at `http://localhost:8000`

API documentation at `http://localhost:8000/swagger/`

### Frontend Setup

1. Install dependencies:
```bash
cd Frontend
npm install
```

2. Start development server:
```bash
npm run dev
```

Frontend will be available at `http://localhost:5173`

### Default Credentials

**Admin User:**
- Username: `admin`
- Password: `admin123`

**Test Employee:**
- Username: `ahmed.bennani`
- Password: `employee123`

## Authentication Flow

1. User logs in with username/password
2. Backend validates credentials and returns JWT tokens (access + refresh)
3. Frontend stores tokens in localStorage
4. All subsequent API requests include `Authorization: Bearer {access_token}` header
5. If access token expires (401 response), frontend automatically refreshes using refresh token
6. If refresh fails, user is logged out and redirected to login page

## Next Steps for Integration

### 1. Update Frontend Pages

Replace mock data with API hooks in the following pages:

**Admin Pages:**
- `src/pages/admin/Dashboard.tsx` - Use `useEmployees`, `useProjects`, `useNotifications`
- `src/pages/admin/GestionEmployee.tsx` - Use employee hooks
- `src/pages/admin/CongesPage.tsx` - Use leave request hooks
- `src/pages/admin/TempsPage.tsx` - Use time record hooks
- `src/pages/admin/NoteFrais.tsx` - Use expense report hooks
- `src/pages/admin/AutorisationsPage.tsx` - Use authorization hooks
- `src/pages/admin/FormationPage.tsx` - Use training session hooks
- `src/pages/admin/ProjetsPage.tsx` - Use project hooks
- `src/pages/admin/NotificationsPage.tsx` - Use notification hooks

**Employee Pages:**
- `src/pages/employee/Dashboard.tsx` - Use relevant hooks
- Similar updates for employee versions of the above pages

### 2. Implement Missing Backend Features

**Engineering/Interventions:**
Create model and API for interventions (from `src/types/intervention.ts`):
- Intervention model with fields: code, date, site, technicien, description, statut, etc.
- InterventionViewSet
- InterventionSerializer
- API endpoints

**Documents:**
Create file upload handling for:
- Project documents with actual file storage
- Intervention photos

### 3. Update Type Mappings

Ensure all backend serializers return data matching frontend types:
- Date fields in ISO format
- Boolean fields as true/false
- Numeric fields as numbers (not strings)
- Array fields as arrays

### 4. Add Error Handling

Implement proper error handling in frontend:
- Display backend validation errors in forms
- Handle network errors gracefully
- Show loading states during API calls

### 5. Add Loading States

All pages using API hooks should handle:
- Initial loading state
- Error state
- Empty state (no data)

## Troubleshooting

### CORS Issues
If you encounter CORS errors, ensure:
- Backend has `corsheaders.middleware.CorsMiddleware` in MIDDLEWARE
- `CORS_ALLOW_ALL_ORIGINS = True` in settings (for development)

### JWT Token Issues
If token refresh fails:
- Check refresh token is stored correctly
- Verify SIMPLE_JWT settings in backend
- Ensure token endpoints are accessible

### 401 Unauthorized Errors
If you get 401 errors:
- Verify tokens are being sent in Authorization header
- Check token expiration times in SIMPLE_JWT settings
- Verify user is authenticated

## API Response Formats

### User Object
```json
{
  "id": "emp-001",
  "firstName": "Ahmed",
  "lastName": "Bennani",
  "email": "ahmed.bennani@company.com",
  "role": "employee",
  "departement": "IT"
}
```

### Notification Object
```json
{
  "id": 1,
  "subject": "Notification Title",
  "message": "Notification message",
  "recipientNames": "Ahmed Bennani",
  "sentAt": "2024-01-01T12:00:00Z",
  "sender": "System",
  "read": false,
  "created_at": "2024-01-01T12:00:00Z"
}
```

### Leave Request Object
```json
{
  "id": 1,
  "code": "LEAVE-001",
  "employe": "Bennani Ahmed",
  "debut": "2024-01-01",
  "fin": "2024-01-05",
  "jours": 5.0,
  "type": "Congé payé",
  "motif": null,
  "statut": "En attente"
}
```

## Additional Notes

- The backend uses SQLite for development (db.sqlite3)
- Frontend uses React Query for data fetching and caching
- Token refresh is automatic on 401 errors
- All API hooks include toast notifications for success/error
- The implementation follows REST conventions
- Swagger documentation is available for all endpoints
