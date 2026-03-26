@echo off
REM Script de démarrage rapide pour le projet Sanabel Dhahabia avec PHP (Windows)

setlocal enabledelayedexpansion

echo.
echo ╔══════════════════════════════════════════════════════════════╗
echo ║   Sanabel Dhahabia - Script de Démarrage Rapide (Windows)    ║
echo ╚══════════════════════════════════════════════════════════════╝
echo.

REM Vérifier PHP
echo Vérification des prérequis...
php --version >nul 2>&1
if errorlevel 1 (
    echo ✗ PHP n'est pas installé ou non dans le PATH
    echo   Installez PHP depuis https://www.php.net/downloads
    pause
    exit /b 1
)

for /f "tokens=2" %%i in ('php --version ^| find /v ""') do (
    echo   ✓ PHP %%i trouvé
    goto :php_found
)

:php_found

REM Vérifier Node.js
node --version >nul 2>&1
if errorlevel 1 (
    echo ✗ Node.js n'est pas installé ou non dans le PATH
    echo   Installez Node.js depuis https://nodejs.org/
    pause
    exit /b 1
)

for /f %%i in ('node --version') do (
    echo   ✓ Node.js %%i trouvé
)

echo.
echo ╔══════════════════════════════════════════════════════════════╗
echo ║   CONFIGURATION REQUISE                                      ║
echo ╚══════════════════════════════════════════════════════════════╝
echo.
echo ⚠ IMPORTANT:
echo.
echo 1. Assurez-vous que MySQL est en cours d'exécution
echo    - Démarrez XAMPP, WAMP ou le service MySQL
echo.
echo 2. Importer le script SQL:
echo    - backend\database.sql
echo    - Utilisez phpMyAdmin ou MySQL Workbench
echo.
echo 3. Configurer la connexion:
echo    - Modifiez: backend\config\Database.php
echo    - Entrez votre mot de passe MySQL
echo.
set /p ready="Avez-vous effectué ces étapes? (oui/non): "

if /i not "%ready%"=="oui" (
    echo.
    echo Configuration de la base de données requise!
    echo Consultez: PHP_INTEGRATION.md ou INSTALLATION_PHP.md
    pause
    exit /b 1
)

echo.
echo ╔══════════════════════════════════════════════════════════════╗
echo ║   DÉMARRAGE DES SERVEURS                                     ║
echo ╚══════════════════════════════════════════════════════════════╝
echo.

REM Démarrer le serveur PHP
echo ► Démarrage du serveur PHP sur http://localhost:8000...
echo.
cd /d "%~dp0backend"

echo. > server-running.txt

echo   ✓ Serveur PHP lancé
echo   → Frontend Angel: http://localhost:4200
echo   → Backend PHP:   http://localhost:8000
echo.
echo Appuyez sur Ctrl+C pour arrêter le serveur PHP
echo.

php -S localhost:8000

REM Retour au répertoire initial
cd /d "%~dp0"

REM Nettoyer
del backend\server-running.txt >nul 2>&1

pause
