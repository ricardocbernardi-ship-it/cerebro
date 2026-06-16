@echo off
cd /d "%~dp0"
echo.
echo ================================================
echo   NO B - porta 3002 (conecta ao NO A)
echo ================================================
echo.
node scripts/7-iniciar-no.js 3002 ws://localhost:3001
pause
