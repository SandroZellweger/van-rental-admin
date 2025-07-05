# VanLife Admin Dashboard - Complete Stack Startup
# PowerShell Version

Write-Host "🚐 VanLife Admin Dashboard - Complete Stack Startup" -ForegroundColor Cyan
Write-Host "================================================" -ForegroundColor Cyan
Write-Host ""

Write-Host "🔄 Step 1: Starting Backend Server with Database..." -ForegroundColor Yellow
Set-Location "$PSScriptRoot\backend"
Start-Process powershell -ArgumentList "-NoExit", "-Command", "npm run dev" -WindowStyle Normal

Write-Host ""
Write-Host "⏳ Waiting 5 seconds for backend to start..." -ForegroundColor Yellow
Start-Sleep -Seconds 5

Write-Host ""
Write-Host "🔄 Step 2: Starting Frontend Server..." -ForegroundColor Yellow
Set-Location $PSScriptRoot
Start-Process powershell -ArgumentList "-NoExit", "-Command", "python -m http.server 8000" -WindowStyle Normal

Write-Host ""
Write-Host "⏳ Waiting 3 seconds for frontend to start..." -ForegroundColor Yellow
Start-Sleep -Seconds 3

Write-Host ""
Write-Host "🌐 Opening Admin Dashboard..." -ForegroundColor Yellow
Start-Process "http://localhost:8000/admin.html"

Write-Host ""
Write-Host "✅ VanLife Admin Dashboard Started Successfully!" -ForegroundColor Green
Write-Host ""
Write-Host "📊 Available URLs:" -ForegroundColor Cyan
Write-Host "  • Admin Dashboard: http://localhost:8000/admin.html" -ForegroundColor White
Write-Host "  • Integration Tests: http://localhost:8000/test-backend-integration.html" -ForegroundColor White
Write-Host "  • API Documentation: http://localhost:3000/api" -ForegroundColor White
Write-Host "  • Health Check: http://localhost:3000/health" -ForegroundColor White
Write-Host ""
Write-Host "🛑 To stop servers: Close the PowerShell windows" -ForegroundColor Red
Write-Host ""
Read-Host "Press Enter to continue..."
