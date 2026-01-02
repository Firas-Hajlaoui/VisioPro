@echo off
REM Colors for output (Windows batch)
setlocal enabledelayedexpansion

echo.
echo ======================================
echo Docker Setup Script for Entreprise
echo ======================================
echo.

REM Check if Docker is installed
docker --version >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] Docker is not installed. Please install Docker first.
    pause
    exit /b 1
)

echo [OK] Docker is installed

REM Check if Docker Compose is installed
docker-compose --version >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] Docker Compose is not installed. Please install Docker Compose first.
    pause
    exit /b 1
)

echo [OK] Docker Compose is installed
echo.

REM Create .env file if it doesn't exist
if not exist .env (
    echo [INFO] Creating .env file from template...
    copy .env.example .env
    echo [OK] .env file created. Please update it with your settings.
    echo.
) else (
    echo [OK] .env file already exists
    echo.
)

REM Build images
echo [INFO] Building Docker images...
docker-compose build

if %errorlevel% neq 0 (
    echo [ERROR] Failed to build images
    pause
    exit /b 1
)

echo [OK] Images built successfully
echo.

REM Start containers
echo [INFO] Starting containers...
docker-compose up -d

if %errorlevel% neq 0 (
    echo [ERROR] Failed to start containers
    pause
    exit /b 1
)

echo [OK] Containers started successfully
echo.

REM Wait for services to be ready
echo [INFO] Waiting for services to be ready...
timeout /t 10

REM Check if services are running
echo.
echo [INFO] Service Status:
docker-compose ps

echo.
echo ======================================
echo Setup completed successfully!
echo ======================================
echo.
echo Access your services:
echo   * Frontend:  http://localhost:3000
echo   * Backend:   http://localhost:8000
echo   * Adminer:   http://localhost:8080
echo   * API Docs:  http://localhost:8000/api/docs
echo.
echo Useful commands:
echo   * View logs:        docker-compose logs -f
echo   * Stop services:    docker-compose down
echo   * Restart service:  docker-compose restart [service]
echo   * Create superuser: docker-compose exec backend python manage.py createsuperuser
echo.
pause
