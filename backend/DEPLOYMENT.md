# VisioPro Backend Deployment Guide

## Docker Deployment (Recommended)

### Prerequisites
- Docker 20.10+
- Docker Compose 1.29+

### Steps

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd VisioPro/backend
   ```

2. **Configure environment**
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` and configure:
   - Generate a strong `SECRET_KEY`
   - Set `DEBUG=False` for production
   - Configure `ALLOWED_HOSTS` with your domain
   - Set database credentials
   - Configure CORS origins for your frontend

3. **Build and start containers**
   ```bash
   docker-compose up -d --build
   ```

4. **Create initial users**
   ```bash
   docker-compose exec backend python manage.py create_initial_users
   ```

5. **Verify deployment**
   ```bash
   curl http://localhost:8000/api/docs/
   ```

### Production Configuration

For production, update `docker-compose.yml`:

```yaml
version: '3.8'

services:
  db:
    image: postgres:16-alpine
    restart: always
    volumes:
      - postgres_data:/var/lib/postgresql/data
    environment:
      POSTGRES_DB: ${DB_NAME}
      POSTGRES_USER: ${DB_USER}
      POSTGRES_PASSWORD: ${DB_PASSWORD}
    networks:
      - backend_network

  backend:
    build: .
    restart: always
    command: gunicorn --bind 0.0.0.0:8000 --workers 4 visioproj.wsgi:application
    volumes:
      - static_volume:/app/staticfiles
      - media_volume:/app/media
    expose:
      - 8000
    env_file:
      - .env
    environment:
      - DB_HOST=db
    depends_on:
      - db
    networks:
      - backend_network

  nginx:
    image: nginx:alpine
    restart: always
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf:ro
      - static_volume:/staticfiles:ro
      - media_volume:/media:ro
      - ./ssl:/etc/nginx/ssl:ro
    depends_on:
      - backend
    networks:
      - backend_network

volumes:
  postgres_data:
  static_volume:
  media_volume:

networks:
  backend_network:
    driver: bridge
```

### Nginx Configuration

Create `nginx.conf`:

```nginx
events {
    worker_connections 1024;
}

http {
    include /etc/nginx/mime.types;
    default_type application/octet-stream;

    upstream backend {
        server backend:8000;
    }

    server {
        listen 80;
        server_name your-domain.com;

        # Redirect HTTP to HTTPS
        return 301 https://$server_name$request_uri;
    }

    server {
        listen 443 ssl http2;
        server_name your-domain.com;

        # SSL Configuration
        ssl_certificate /etc/nginx/ssl/cert.pem;
        ssl_certificate_key /etc/nginx/ssl/key.pem;
        ssl_protocols TLSv1.2 TLSv1.3;
        ssl_ciphers HIGH:!aNULL:!MD5;

        # Security headers
        add_header X-Frame-Options "SAMEORIGIN" always;
        add_header X-Content-Type-Options "nosniff" always;
        add_header X-XSS-Protection "1; mode=block" always;

        # Proxy settings
        location / {
            proxy_pass http://backend;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
        }

        # Static files
        location /static/ {
            alias /staticfiles/;
            expires 30d;
            add_header Cache-Control "public, immutable";
        }

        # Media files
        location /media/ {
            alias /media/;
            expires 7d;
        }
    }
}
```

## Manual Deployment (VPS/Cloud)

### Prerequisites
- Ubuntu 20.04+ or similar Linux distribution
- Python 3.11+
- PostgreSQL 16+
- Nginx
- Supervisor (for process management)

### Steps

1. **Install system dependencies**
   ```bash
   sudo apt update
   sudo apt install python3-pip python3-venv postgresql postgresql-contrib nginx supervisor
   ```

2. **Create PostgreSQL database**
   ```bash
   sudo -u postgres psql
   CREATE DATABASE visioprodb;
   CREATE USER visiopro WITH PASSWORD 'secure_password';
   ALTER ROLE visiopro SET client_encoding TO 'utf8';
   ALTER ROLE visiopro SET default_transaction_isolation TO 'read committed';
   ALTER ROLE visiopro SET timezone TO 'UTC';
   GRANT ALL PRIVILEGES ON DATABASE visioprodb TO visiopro;
   \q
   ```

3. **Clone and setup application**
   ```bash
   cd /var/www
   git clone <repository-url> visioproj
   cd visioproj/backend
   
   python3 -m venv venv
   source venv/bin/activate
   pip install -r requirements.txt
   
   cp .env.example .env
   # Edit .env with production settings
   
   python manage.py migrate
   python manage.py collectstatic --noinput
   python manage.py create_initial_users
   ```

4. **Configure Gunicorn with Supervisor**
   
   Create `/etc/supervisor/conf.d/visioproj.conf`:
   ```ini
   [program:visioproj]
   directory=/var/www/visioproj/backend
   command=/var/www/visioproj/backend/venv/bin/gunicorn --workers 4 --bind 127.0.0.1:8000 visioproj.wsgi:application
   user=www-data
   autostart=true
   autorestart=true
   redirect_stderr=true
   stdout_logfile=/var/log/visioproj.log
   environment=PATH="/var/www/visioproj/backend/venv/bin"
   ```

   ```bash
   sudo supervisorctl reread
   sudo supervisorctl update
   sudo supervisorctl start visioproj
   ```

5. **Configure Nginx**
   
   Create `/etc/nginx/sites-available/visioproj`:
   ```nginx
   server {
       listen 80;
       server_name your-domain.com;

       location / {
           proxy_pass http://127.0.0.1:8000;
           proxy_set_header Host $host;
           proxy_set_header X-Real-IP $remote_addr;
           proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
       }

       location /static/ {
           alias /var/www/visioproj/backend/staticfiles/;
       }

       location /media/ {
           alias /var/www/visioproj/backend/media/;
       }
   }
   ```

   ```bash
   sudo ln -s /etc/nginx/sites-available/visioproj /etc/nginx/sites-enabled/
   sudo nginx -t
   sudo systemctl restart nginx
   ```

6. **Set up SSL with Let's Encrypt**
   ```bash
   sudo apt install certbot python3-certbot-nginx
   sudo certbot --nginx -d your-domain.com
   ```

## Environment Variables for Production

```env
# Django
SECRET_KEY=<generate-strong-secret-key>
DEBUG=False
ALLOWED_HOSTS=your-domain.com,www.your-domain.com

# Database
DB_ENGINE=django.db.backends.postgresql
DB_NAME=visioprodb
DB_USER=visiopro
DB_PASSWORD=<strong-password>
DB_HOST=localhost
DB_PORT=5432

# JWT
JWT_ACCESS_TOKEN_LIFETIME=15
JWT_REFRESH_TOKEN_LIFETIME=10080

# CORS
CORS_ALLOWED_ORIGINS=https://your-frontend-domain.com

# File Upload
MAX_UPLOAD_SIZE=10485760
ALLOWED_UPLOAD_EXTENSIONS=.pdf,.jpg,.jpeg,.png
```

## Security Checklist

- [ ] Set strong `SECRET_KEY`
- [ ] Set `DEBUG=False`
- [ ] Configure proper `ALLOWED_HOSTS`
- [ ] Use HTTPS (SSL certificate)
- [ ] Set up firewall (UFW or similar)
- [ ] Configure PostgreSQL to only accept local connections
- [ ] Use strong database passwords
- [ ] Set up regular database backups
- [ ] Configure log rotation
- [ ] Set up monitoring (e.g., Sentry for error tracking)
- [ ] Restrict file upload sizes
- [ ] Configure rate limiting
- [ ] Set up CSRF protection (enabled by default)
- [ ] Review and update CORS settings

## Monitoring

### Check application status
```bash
# Using supervisor
sudo supervisorctl status visioproj

# Check logs
sudo tail -f /var/log/visioproj.log

# Check Nginx logs
sudo tail -f /var/log/nginx/error.log
sudo tail -f /var/log/nginx/access.log
```

### Database backups
```bash
# Create backup
pg_dump -U visiopro visioprodb > backup_$(date +%Y%m%d).sql

# Restore backup
psql -U visiopro visioprodb < backup_20260102.sql
```

## Troubleshooting

### Application won't start
```bash
# Check logs
sudo supervisorctl tail -f visioproj

# Restart application
sudo supervisorctl restart visioproj
```

### Database connection issues
```bash
# Check PostgreSQL status
sudo systemctl status postgresql

# Check database connection
python manage.py dbshell
```

### Static files not loading
```bash
# Recollect static files
python manage.py collectstatic --noinput --clear

# Check Nginx configuration
sudo nginx -t
```

## Updates and Maintenance

### Updating the application
```bash
cd /var/www/visioproj/backend
git pull
source venv/bin/activate
pip install -r requirements.txt
python manage.py migrate
python manage.py collectstatic --noinput
sudo supervisorctl restart visioproj
```

### Database migrations
```bash
# Create migrations
python manage.py makemigrations

# Apply migrations
python manage.py migrate

# Restart application
sudo supervisorctl restart visioproj
```
