@echo off

echo Building Docker images...
docker-compose build

echo Starting Docker containers...
docker-compose up -d
