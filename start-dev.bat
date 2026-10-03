@echo off
echo =======================================================
echo Starting Nivesh Suraksha (SANGYAN Hackathon Prototype)
echo =======================================================

start "Nivesh Suraksha - Backend Server" cmd /k "cd /d %~dp0server && npm start"
timeout /t 3 /nobreak >nul
start "Nivesh Suraksha - Frontend Client" cmd /k "cd /d %~dp0client && npm run dev"

echo.
echo Backend running on: http://localhost:5000
echo Frontend running on: http://localhost:5173
echo.
pause
