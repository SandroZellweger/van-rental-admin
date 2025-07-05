@echo off
echo 🗄️ MongoDB Atlas Quick Setup for VanLife Dashboard
echo =====================================================
echo.

echo 📋 STEP-BY-STEP SETUP:
echo.
echo 1. Go to: https://www.mongodb.com/atlas
echo 2. Click "Try Free" and create account
echo 3. Create M0 Sandbox cluster (FREE)
echo 4. Setup database user: vanlife-admin
echo 5. Add your IP to network access
echo 6. Get connection string
echo.

echo 🔧 AFTER GETTING CONNECTION STRING:
echo.
echo 1. Copy your connection string from Atlas
echo 2. This script will help update your .env file
echo.

set /p connection_string="📝 Paste your MongoDB Atlas connection string here: "

echo.
echo 💾 Updating .env file...
echo.

rem Backup original .env
copy .env .env.backup >nul 2>&1

rem Update MONGODB_URI in .env file
powershell -Command "(Get-Content .env) -replace '^MONGODB_URI=.*', 'MONGODB_URI=%connection_string%' | Set-Content .env"

echo ✅ .env file updated!
echo.

echo 🧪 Testing database connection...
echo.

npm run seed

if %ERRORLEVEL% EQU 0 (
    echo.
    echo 🎉 SUCCESS! MongoDB Atlas is connected and working!
    echo.
    echo 🚀 Starting the server...
    npm run dev
) else (
    echo.
    echo ❌ Connection failed. Please check:
    echo   1. Connection string is correct
    echo   2. Database user password is correct
    echo   3. IP address is whitelisted
    echo   4. Internet connection is working
    echo.
    echo 🔄 You can try again or use mock mode: npm run mock
)

pause
