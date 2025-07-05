@echo off
echo 🔄 Stopping any existing Node.js processes...
taskkill /f /im node.exe 2>nul

echo 🔄 Starting VanLife Backend Server...
cd /d "%~dp0backend"

echo ⚡ Starting on port 3005...
set PORT=3005
node simple-test-server.js

pause
