@echo off

where.exe npm >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: Please install npm before running this script.
    exit /b 1
) else (
    echo Running server and client using npm...

    cd .\server || exit /b
    npm i
    start npm start

    cd ..

    cd .\client || exit /b
    npm i
    start npm start
    
    cd ..
)
