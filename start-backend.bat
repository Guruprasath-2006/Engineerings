@echo off
echo ========================================
echo Starting Velan Engineering Backend
echo ========================================
echo.

cd /d "%~dp0backend"

echo Checking if node_modules exists...
if not exist "node_modules" (
    echo Installing dependencies...
    call npm install
    echo.
)

echo Starting server...
echo Backend will run on http://localhost:5000
echo Press Ctrl+C to stop
echo.

node server.js
