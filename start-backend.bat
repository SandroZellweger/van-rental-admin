@echo off
echo.
echo =======================================
echo   VanLife Admin Backend API Server
echo =======================================
echo.
echo Starting backend development server...
echo.

cd /d "%~dp0\backend"

echo Checking Node.js installation...
node --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Node.js not found! Please install Node.js from https://nodejs.org/
    pause
    exit /b 1
)

echo ✅ Node.js found
echo.

echo Checking if dependencies are installed...
if not exist node_modules (
    echo 📦 Installing dependencies...
    npm install
    if errorlevel 1 (
        echo ❌ Failed to install dependencies
        pause
        exit /b 1
    )
    echo ✅ Dependencies installed
    echo.
)

echo 🚀 Starting backend server...
echo.
echo The API will be available at:
echo   📍 Base URL: http://localhost:3000/api/v1
echo   💚 Health Check: http://localhost:3000/health
echo   📚 API Info: http://localhost:3000/api
echo.
echo =======================================
echo   Press Ctrl+C to stop the server
echo =======================================
echo.

npm run dev
