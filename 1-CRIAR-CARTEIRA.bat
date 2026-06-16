@echo off
cd /d "%~dp0"
echo.
echo ================================================
echo   PASSO 1 - Criar Carteira (chave publica/privada)
echo ================================================
echo.
node scripts/1-criar-carteira.js
pause
