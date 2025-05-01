#!/bin/bash

# Check if npm is installed
if ! command -v npm >/dev/null 2>&1; then
    echo "npm is not installed. Please install Node.js and npm." >&2
    exit 1
fi

# Initialize npm project if package.json doesn't exist
if [ ! -f "package.json" ]; then
    echo "Creating a new npm project..."
    npm init -y
fi

echo "Installing npm dependencies..."
npm install