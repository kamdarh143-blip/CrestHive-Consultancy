@echo off
echo ==============================================
echo   STARTING CRESTHIVE FULL-STACK APPLICATION
echo ==============================================
echo.
echo Starting the Node.js Database Backend...
start "Backend Server" cmd /k "node backend/server.js"

echo Starting the Frontend Website...
start "Frontend Website" cmd /k "npx serve -l 8080"

echo.
echo Both servers are starting in separate windows!
echo DO NOT CLOSE those black windows while using the website.
echo.
pause
