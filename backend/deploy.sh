#!/bin/bash

echo "🚀 Déploiement de Sorbo Ingénierie Backend"

# Vérifier les variables d'environnement
if [ -z "$MONGODB_URI" ]; then
    echo "❌ MONGODB_URI non définie"
    exit 1
fi

if [ -z "$JWT_SECRET" ]; then
    echo "❌ JWT_SECRET non définie"
    exit 1
fi

# Installer les dépendances
echo "📦 Installation des dépendances..."
npm install

# Créer les dossiers de logs
echo "📁 Création des dossiers de logs..."
mkdir -p logs

# Exécuter les migrations
echo "🔄 Exécution des migrations..."
npm run migrate

# Démarrer le serveur
echo "🚀 Démarrage du serveur..."
if [ "$NODE_ENV" = "production" ]; then
    npm start
else
    npm run dev
fi 