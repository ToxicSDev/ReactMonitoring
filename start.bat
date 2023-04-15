@echo off

where docker >nul 2>&1
if %ERRORLEVEL% EQU 1 (
    echo WARNING: Docker is not installed.
    where npm >nul 2>&1
    if %ERRORLEVEL% EQU 1 (
        echo ERROR: Please install Docker or npm before running this script.
        exit /B 1
    ) else (
        echo Running server and client using npm...
        cd .\server || exit /B
        npm i
        start npm start

        cd ..

        cd .\client || exit /B
        npm i
        start npm start
    )
) else (
    cd .\server || exit /B
    docker stop server
    docker rm server
    docker image rm backend-service
    docker build -t backend-service -f Dockerfile.server .
    docker run -d --name server -p 3031:3031 backend-service

    if %ERRORLEVEL% NEQ 0 (
        echo Failed to start backend service using Docker. Running server using npm...
        npm i
        start npm start
    )

    cd ..

    cd .\client || exit /B
    docker stop client
    docker rm client
    docker image rm frontend-service
    docker build -t frontend-service -f Dockerfile.client .
    docker run -d --name client -p 3030:3030 frontend-service

    if %ERRORLEVEL% NEQ 0 (
        echo Failed to start frontend service using Docker. Running client using npm...
        npm i
        start npm start
    )

    cd ..
)
