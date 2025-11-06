@echo off
echo ========================================
echo   Restarting SafeBytes Backend Server
echo ========================================
echo.

echo [1/3] Stopping existing node processes...
taskkill /F /IM node.exe >nul 2>&1
timeout /t 2 /nobreak >nul
echo ✓ Stopped

echo.
echo [2/3] Navigating to backend folder...
cd backend
echo ✓ Ready

echo.
echo [3/3] Starting server...
echo.
echo ========================================
echo   Server Starting...
echo ========================================
echo.
npm start
