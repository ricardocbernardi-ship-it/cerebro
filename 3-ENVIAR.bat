@echo off
cd /d "%~dp0"
echo.
echo ================================================
echo   PASSO 3 - Enviar Moedas (transacao assinada)
echo ================================================
echo.
echo EDITE scripts/3-enviar-moedas.js para mudar
echo remetente, destinatario e quantia.
echo.
node scripts/3-enviar-moedas.js
pause
