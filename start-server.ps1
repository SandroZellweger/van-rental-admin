# VanLife Admin Dashboard Development Server
Write-Host "Starting VanLife Admin Dashboard Development Server..." -ForegroundColor Green
Write-Host ""
Write-Host "The server will be available at:" -ForegroundColor Yellow
Write-Host "  http://localhost:8000/admin-index.html" -ForegroundColor Cyan -NoNewline
Write-Host "  (Main landing page)" -ForegroundColor Gray
Write-Host "  http://localhost:8000/admin.html" -ForegroundColor Cyan -NoNewline
Write-Host "          (Modular dashboard)" -ForegroundColor Gray
Write-Host "  http://localhost:8000/admin-legacy.html" -ForegroundColor Cyan -NoNewline
Write-Host "     (Legacy dashboard)" -ForegroundColor Gray
Write-Host "  http://localhost:8000/test-modular-dashboard.html" -ForegroundColor Cyan -NoNewline
Write-Host " (Module testing)" -ForegroundColor Gray
Write-Host ""
Write-Host "Press Ctrl+C to stop the server" -ForegroundColor Red
Write-Host ""

# Change to script directory
Set-Location $PSScriptRoot

# Start Python HTTP server
python -m http.server 8000
