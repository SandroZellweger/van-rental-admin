# Quick Backend Startup Script
# Run this to start the simple backend server

Write-Host "🔄 Stopping any existing Node.js processes..." -ForegroundColor Yellow
Get-Process -Name "node" -ErrorAction SilentlyContinue | Stop-Process -Force

Write-Host "🚀 Starting VanLife Backend Server..." -ForegroundColor Green
Set-Location "$PSScriptRoot\backend"

Write-Host "⚡ Starting simple server on port 3005..." -ForegroundColor Cyan
$env:PORT = "3005"
node simple-test-server.js

Read-Host "Press Enter to exit"
