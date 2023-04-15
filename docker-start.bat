@echo off

echo Stopping any running Docker containers...
docker-compose down

echo Building Docker images...
docker-compose build

echo Starting Docker containers...
docker-compose up -d
