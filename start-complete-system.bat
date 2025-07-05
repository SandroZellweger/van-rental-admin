@echo off
echo 🚐 VanLife Admin Dashboard - Complete Stack Startup
echo ================================================

echo.
echo 🔄 Step 1: Starting Backend Server with Database...
cd /d "%~dp0backend"
start "VanLife Backend" cmd /k "npm run dev"

echo.
echo ⏳ Waiting 5 seconds for backend to start...
timeout /t 5 /nobreak > nul

echo.
echo 🔄 Step 2: Starting Frontend Server...
cd /d "%~dp0"
start "VanLife Frontend" cmd /k "python -m http.server 8000"

echo.
echo ⏳ Waiting 3 seconds for frontend to start...
timeout /t 3 /nobreak > nul

echo.
echo 🌐 Opening Admin Dashboard...
start "" "http://localhost:8000/admin.html"

echo.
echo ✅ VanLife Admin Dashboard Started Successfully!
echo.
echo 📊 Available URLs:
echo   • Admin Dashboard: http://localhost:8000/admin.html
echo   • Integration Tests: http://localhost:8000/test-backend-integration.html
echo   • API Documentation: http://localhost:3000/api
echo   • Health Check: http://localhost:3000/health
echo.
echo 🛑 To stop servers: Close the terminal windows
echo.
pause
