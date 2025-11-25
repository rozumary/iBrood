@echo off
echo Starting iBrood PWA with ngrok tunnel...
echo.

REM Start Next.js server
echo Step 1: Starting Next.js dev server...
npm run dev

REM Wait 5 seconds
timeout /t 5

REM Start ngrok
echo Step 2: Starting ngrok tunnel...
ngrok http 3000

pause
cd