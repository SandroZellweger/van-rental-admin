@echo off
echo Starting VanLife Admin Dashboard Development Server...
echo.
echo The server will be available at:
echo http://localhost:8000/admin-index.html (Main landing page)
echo http://localhost:8000/admin.html (Modular dashboard)
echo http://localhost:8000/admin-legacy.html (Legacy dashboard)
echo http://localhost:8000/test-modular-dashboard.html (Module testing)
echo.
echo Press Ctrl+C to stop the server
echo.
cd /d "%~dp0"
python -m http.server 8000
