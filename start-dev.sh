#!/bin/bash
# Script de démarrage rapide pour le projet Sanabel Dhahabia avec PHP

echo "╔══════════════════════════════════════════════════════════════╗"
echo "║   Sanabel Dhahabia - Script de Démarrage Rapide PHP          ║"
echo "╚══════════════════════════════════════════════════════════════╝"
echo ""

# Vérifier les prérequis
echo "✓ Vérification des prérequis..."

# Vérifier PHP
if ! command -v php &> /dev/null; then
    echo "✗ PHP n'est pas installé"
    echo "  Installez PHP depuis https://www.php.net/downloads"
    exit 1
fi

PHP_VERSION=$(php -r 'echo phpversion();')
echo "  ✓ PHP $PHP_VERSION trouvé"

# Vérifier MySQL
if ! command -v mysql &> /dev/null; then
    echo "⚠ MySQL n'est pas trouvé dans PATH"
    echo "  Installez MySQL depuis https://www.mysql.com/downloads/"
    echo "  Ou utilisez phpMyAdmin pour importer la base de données"
fi

# Vérifier Node.js
if ! command -v node &> /dev/null; then
    echo "✗ Node.js n'est pas installé"
    echo "  Installez Node.js depuis https://nodejs.org/"
    exit 1
fi

NODE_VERSION=$(node -v)
echo "  ✓ Node.js $NODE_VERSION trouvé"

# Vérifier Angular CLI
if ! command -v ng &> /dev/null; then
    echo "✗ Angular CLI n'est pas installé globalement"
    echo "  Installez-le: npm install -g @angular/cli"
    exit 1
fi

echo ""
echo "╔══════════════════════════════════════════════════════════════╗"
echo "║   CONFIGURATION                                              ║"
echo "╚══════════════════════════════════════════════════════════════╝"
echo ""
echo "1. Assurez-vous que MySQL est en cours d'exécution"
echo "2. Importer le script: backend/database.sql"
echo "3. Modifier les paramètres dans: backend/config/Database.php"
echo ""

read -p "Avez-vous configuré la base de données? (y/n) " -n 1 -r
echo ""

if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo ""
    echo "╔══════════════════════════════════════════════════════════════╗"
    echo "║   DÉMARRAGE DES SERVEURS                                     ║"
    echo "╚══════════════════════════════════════════════════════════════╝"
    echo ""
    
    # Démarrer le serveur PHP en arrière-plan
    echo "→ Démarrage du serveur PHP..."
    cd backend
    php -S localhost:8000 > php-server.log 2>&1 &
    PHP_PID=$!
    echo "  ✓ Serveur PHP lancé (PID: $PHP_PID)"
    echo "  → Accéder à: http://localhost:8000"
    cd ..
    
    sleep 2
    
    # Démarrer Angular
    echo ""
    echo "→ Démarrage du serveur Angular..."
    npm start
    
    # Cleanup
    trap "kill $PHP_PID" EXIT
else
    echo ""
    echo "Configuration de la base de données requise!"
    echo "Consultez: PHP_INTEGRATION.md"
    exit 1
fi
