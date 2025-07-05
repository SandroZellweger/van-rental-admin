@echo off
echo 🔧 MongoDB Atlas Connection String Fixer
echo ========================================
echo.

echo ⚠️  ISSUE DETECTED: Your connection string has 'xxxxx' in it
echo This needs to be replaced with your actual cluster identifier.
echo.

echo 📋 TO GET THE CORRECT CONNECTION STRING:
echo 1. Go to: https://cloud.mongodb.com/
echo 2. Login to your MongoDB Atlas account
echo 3. Click "Connect" on your vanlife-cluster
echo 4. Choose "Connect your application"
echo 5. Select "Node.js" driver
echo 6. Copy the complete connection string
echo.

echo 💡 EXAMPLE OF CORRECT FORMAT:
echo mongodb+srv://vanlife-admin:SkGfrUwvaeuGv6zt@vanlife-cluster.abc123.mongodb.net/vanlife_admin?retryWrites=true^&w=majority
echo.
echo Notice: 'abc123' instead of 'xxxxx'
echo.

set /p correct_string="📝 Paste your CORRECT connection string from Atlas here: "

echo.
echo 💾 Updating .env file...

rem Backup original .env
copy .env .env.backup >nul 2>&1

rem Update MONGODB_URI in .env file using PowerShell
powershell -Command "(Get-Content .env) -replace '^MONGODB_URI=.*', 'MONGODB_URI=%correct_string%' | Set-Content .env"

echo ✅ .env file updated!
echo.

echo 🧪 Testing connection...
npm run seed

if %ERRORLEVEL% EQU 0 (
    echo.
    echo 🎉 SUCCESS! MongoDB Atlas is connected!
    echo.
    echo 🚀 Starting the server...
    npm run dev
) else (
    echo.
    echo ❌ Connection still failed. Please verify:
    echo   1. Connection string is complete and correct
    echo   2. Password is correct (no ^< ^> brackets)
    echo   3. Cluster identifier replaces 'xxxxx'
    echo   4. Your IP is whitelisted in Atlas
    echo.
    echo 🧪 You can test with mock mode: npm run mock
    echo 📚 Check: ATLAS_CONNECTION_FIX.md for detailed help
)

pause
