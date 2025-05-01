# Check if npm is installed
if (-not (Get-Command npm -ErrorAction SilentlyContinue)) {
    Write-Error "npm is not installed. Please install Node.js and npm."
    exit 1
}

# Initialize npm project if package.json doesn't exist
if (-not (Test-Path "package.json")) {
    Write-Host "Creating a new npm project..."
    npm init -y
}

Write-Host "Installing npm dependencies..."
npm install