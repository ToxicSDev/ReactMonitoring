#!/bin/bash

if ! command -v npm &> /dev/null; then
    echo "ERROR: Please install npm before running this script."
    exit 1
else
    echo "Stopping any running npm instances in the ./server and ./client folders..."
    
    for folder in "./server" "./client"; do
        pids=$(pgrep -f "npm start" | xargs pgrep -d ' ' -f -P $$ -a | grep "$folder" | awk '{print $1}')

        if [ ! -z "$pids" ]; then
            echo "Stopping npm instances in $folder..."
            kill "$pids"
        fi
    done

    echo "Running server and client using npm..."

    cd ./server || exit
    npm i
    npm start &

    cd ..

    cd ./client || exit
    npm i
    npm start &
fi
