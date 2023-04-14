#!/bin/bash

if ! command -v docker &> /dev/null; then
    echo "WARNING: Docker is not installed."
    if ! command -v npm &> /dev/null; then
        echo "ERROR: Please install Docker or npm before running this script."
        exit 1
    else
        echo "Running server and client using npm..."

        cd ./server
        npm i
        npm start &

        cd ..

        cd ./client
        npm i
        npm start &
    fi
else
    cd ./server
    docker build -t backend-service -f Dockerfile.server .
    docker run -d --name server -p 3031:3031 backend-service

    if [ $? -ne 0 ]; then
        echo "Failed to start backend service using Docker. Running server using npm..."
        npm i
        npm start &
    fi

    cd ..

    cd ./client
    docker build -t frontend-service -f Dockerfile.client .
    docker run -d --name client -p 3030:3030 frontend-service

    if [ $? -ne 0 ]; then
        echo "Failed to start frontend service using Docker. Running client using npm..."
        npm i
        npm start &
    fi

    cd ..
fi
