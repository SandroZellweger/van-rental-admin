@echo off
echo.
echo ========================================
echo   VanLife Admin Dashboard Server
echo ========================================
echo.
echo Starting development server...
echo.
echo The server will be available at:
echo   http://localhost:8000/admin-index.html  (Main landing page)
echo   http://localhost:8000/admin.html        (Modular dashboard)
echo   http://localhost:8000/admin-legacy.html (Legacy dashboard)
echo   http://localhost:8000/test-modular-dashboard.html (Module testing)
echo.
echo ========================================
echo   Press Ctrl+C to stop the server
echo ========================================
echo.

cd /d "%~dp0"

echo Starting Python HTTP server on port 8000...
timeout /t 2 /nobreak >nul

echo Opening browser...
start http://localhost:8000/admin-index.html

python -m http.server 8000
