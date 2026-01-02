# Docker Compose Documentation

## 📋 Services

### 1. **PostgreSQL (db)**
- **Image**: postgres:16-alpine
- **Port**: 5432 (accessible locally)
- **Environment Variables**:
  - `POSTGRES_DB`: Database name (default: entreprise_db)
  - `POSTGRES_USER`: Database user (default: postgres)
  - `POSTGRES_PASSWORD`: Database password
- **Volumes**: `postgres_data` - persists database
- **Health Check**: Enabled

### 2. **Adminer**
- **Image**: adminer:latest
- **Port**: 8080
- **Purpose**: Web interface for database management and SQL queries
- **Access**: http://localhost:8080
- **Login**: Use PostgreSQL credentials (server: db, user: postgres)

### 3. **Django REST Framework Backend**
- **Build**: `./Backend/Dockerfile`
- **Port**: 8000
- **Depends on**: PostgreSQL database
- **Features**:
  - Automatic migrations on startup
  - Gunicorn with 4 workers
  - Static files and media management
- **Environment Variables**: See `.env.example`
- **Volumes**: Source code, static files, media

### 4. **React + Vite Frontend**
- **Build**: `./Frontend/Dockerfile`
- **Port**: 3000
- **Features**:
  - Multi-stage build for optimization
  - Served with `serve` package
  - Environment variable configuration
- **Volumes**: Source code, node_modules

### 5. **Redis (Optional)**
- **Image**: redis:7-alpine
- **Port**: 6379
- **Purpose**: Caching and Celery task queue
- **Volumes**: `redis_data` - persists data

## 🚀 Quick Start

### Prerequisites
- Docker and Docker Compose installed
- Git

### Setup Instructions

1. **Clone/Navigate to project**
   ```bash
   cd c:\Projects\Entreprise
   ```

2. **Create environment file**
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

3. **Build and start services**
   ```bash
   docker-compose up -d
   # or with build
   docker-compose up --build -d
   ```

4. **Access services**
   - **Frontend**: http://localhost:3000
   - **Backend API**: http://localhost:8000/api
   - **Adminer DB Manager**: http://localhost:8080
   - **Redis**: localhost:6379

5. **Check logs**
   ```bash
   # All services
   docker-compose logs -f
   
   # Specific service
   docker-compose logs -f backend
   docker-compose logs -f frontend
   ```

6. **Stop services**
   ```bash
   docker-compose down
   ```

## 📦 Building Images Manually

```bash
# Build backend
docker build -t entreprise-backend ./Backend

# Build frontend
docker build -t entreprise-frontend ./Frontend

# Build all
docker-compose build
```

## 🔧 Useful Commands

### Database Management
```bash
# Access PostgreSQL CLI
docker-compose exec db psql -U postgres -d entreprise_db

# Create database backup
docker-compose exec db pg_dump -U postgres entreprise_db > backup.sql

# Restore database
docker-compose exec -T db psql -U postgres entreprise_db < backup.sql
```

### Django Management
```bash
# Create superuser
docker-compose exec backend python manage.py createsuperuser

# Run migrations
docker-compose exec backend python manage.py migrate

# Create static files
docker-compose exec backend python manage.py collectstatic --noinput
```

### Frontend Development
```bash
# Rebuild frontend
docker-compose build frontend

# Restart frontend
docker-compose restart frontend
```

## 🔐 Security Notes

### Development
- Change `SECRET_KEY` in `.env`
- Set `DEBUG=False` in production
- Change default database passwords
- Update `ALLOWED_HOSTS` for your domain

### Production
- Use strong, unique passwords
- Enable HTTPS/SSL
- Use environment-specific `.env` files
- Never commit `.env` to version control
- Use Docker secrets for sensitive data
- Configure CORS properly
- Set up proper logging and monitoring

## 🌐 Environment Variables

Key variables in `.env`:

```env
# Database
DB_NAME=entreprise_db
DB_USER=postgres
DB_PASSWORD=your_secure_password

# Django
SECRET_KEY=your-secret-key
DEBUG=False
ALLOWED_HOSTS=localhost,yourdomain.com

# CORS
CORS_ALLOWED_ORIGINS=http://localhost:3000

# API
VITE_API_URL=http://localhost:8000/api
```

## 📝 Network Configuration

- **Network Name**: `entreprise_network`
- **Type**: Bridge network
- **Services communicate**: `http://service_name:port`

Example:
- Backend to DB: `postgresql://postgres:password@db:5432/entreprise_db`
- Frontend to Backend: `http://backend:8000`

## 🐛 Troubleshooting

### Port conflicts
```bash
# Check if ports are in use
netstat -ano | findstr :3000    # Windows
lsof -i :3000                   # macOS/Linux

# Use different ports in docker-compose.yml
```

### Database connection issues
```bash
# Check database container
docker-compose ps
docker-compose logs db

# Verify database is healthy
docker-compose exec db pg_isready -U postgres
```

### Frontend not updating
```bash
# Clear Docker volumes and rebuild
docker-compose down -v
docker-compose up --build -d
```

## 📊 Monitoring

### View running containers
```bash
docker-compose ps
```

### View container stats
```bash
docker stats
```

### View specific logs
```bash
docker-compose logs backend -f --tail=100
```

## 🔄 Development Workflow

1. Make changes to Frontend or Backend code
2. Frontend changes: Auto-reload (with hot module replacement in dev mode)
3. Backend changes: Restart container or enable auto-reload
4. Push changes to version control
5. CI/CD pipeline tests and deploys

## 🚀 Deployment

For production deployment:
1. Use external database service (AWS RDS, Azure Database)
2. Configure proper domain and HTTPS
3. Use environment-specific docker-compose files
4. Set up CI/CD pipeline
5. Configure monitoring and logging
6. Use Docker registries (Docker Hub, AWS ECR)
7. Implement proper backup strategy
