#!/bin/bash

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${YELLOW}🐳 Docker Setup Script for Entreprise Project${NC}\n"

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo -e "${RED}❌ Docker is not installed. Please install Docker first.${NC}"
    exit 1
fi

echo -e "${GREEN}✓ Docker is installed${NC}"

# Check if Docker Compose is installed
if ! command -v docker-compose &> /dev/null; then
    echo -e "${RED}❌ Docker Compose is not installed. Please install Docker Compose first.${NC}"
    exit 1
fi

echo -e "${GREEN}✓ Docker Compose is installed${NC}\n"

# Create .env file if it doesn't exist
if [ ! -f .env ]; then
    echo -e "${YELLOW}📝 Creating .env file from template...${NC}"
    cp .env.example .env
    echo -e "${GREEN}✓ .env file created. Please update it with your settings.${NC}\n"
else
    echo -e "${GREEN}✓ .env file already exists${NC}\n"
fi

# Build images
echo -e "${YELLOW}🔨 Building Docker images...${NC}"
docker-compose build

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓ Images built successfully${NC}\n"
else
    echo -e "${RED}❌ Failed to build images${NC}"
    exit 1
fi

# Start containers
echo -e "${YELLOW}🚀 Starting containers...${NC}"
docker-compose up -d

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓ Containers started successfully${NC}\n"
else
    echo -e "${RED}❌ Failed to start containers${NC}"
    exit 1
fi

# Wait for services to be ready
echo -e "${YELLOW}⏳ Waiting for services to be ready...${NC}"
sleep 10

# Check if services are running
echo -e "\n${YELLOW}📊 Service Status:${NC}"
docker-compose ps

echo -e "\n${GREEN}✅ Setup completed successfully!${NC}\n"

echo -e "${YELLOW}📍 Access your services:${NC}"
echo "   • Frontend:  ${GREEN}http://localhost:3000${NC}"
echo "   • Backend:   ${GREEN}http://localhost:8000${NC}"
echo "   • Adminer:   ${GREEN}http://localhost:8080${NC}"
echo "   • API Docs:  ${GREEN}http://localhost:8000/api/docs${NC}\n"

echo -e "${YELLOW}💡 Useful commands:${NC}"
echo "   • View logs:        ${GREEN}docker-compose logs -f${NC}"
echo "   • Stop services:    ${GREEN}docker-compose down${NC}"
echo "   • Restart service:  ${GREEN}docker-compose restart <service>${NC}"
echo "   • Create superuser: ${GREEN}docker-compose exec backend python manage.py createsuperuser${NC}"
