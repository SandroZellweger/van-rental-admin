# VanLife Admin Dashboard Development Server
Write-Host ""
Write-Host "========================================"
Write-Host "   VanLife Admin Dashboard Server" -ForegroundColor Green
Write-Host "========================================"
Write-Host ""
Write-Host "Starting development server..." -ForegroundColor Yellow
Write-Host ""
Write-Host "The server will be available at:" -ForegroundColor Yellow
Write-Host "  http://localhost:8000/admin-index.html" -ForegroundColor Cyan -NoNewline
Write-Host "  (Main landing page)" -ForegroundColor Gray
Write-Host "  http://localhost:8000/admin.html" -ForegroundColor Cyan -NoNewline
Write-Host "        (Modular dashboard)" -ForegroundColor Gray
Write-Host "  http://localhost:8000/admin-legacy.html" -ForegroundColor Cyan -NoNewline
Write-Host "     (Legacy dashboard)" -ForegroundColor Gray
Write-Host "  http://localhost:8000/test-modular-dashboard.html" -ForegroundColor Cyan -NoNewline
Write-Host " (Module testing)" -ForegroundColor Gray
Write-Host ""
Write-Host "========================================" -ForegroundColor Green
Write-Host "   Press Ctrl+C to stop the server" -ForegroundColor Red
Write-Host "========================================" -ForegroundColor Green
Write-Host ""

# Change to script directory
Set-Location $PSScriptRoot

Write-Host "Starting Python HTTP server on port 8000..." -ForegroundColor Yellow
Start-Sleep -Seconds 2

Write-Host "Opening browser..." -ForegroundColor Yellow
Start-Process "http://localhost:8000/admin-index.html"

# Start Python HTTP server
python -m http.server 8000
