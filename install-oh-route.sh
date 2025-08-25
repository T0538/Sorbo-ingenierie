#!/bin/bash

echo "========================================"
echo "    Configuration d'OH-Route"
echo "    Sorbo-Ingenierie"
echo "========================================"
echo

echo "1. Installation des dépendances..."
npm install mongodb
echo

echo "2. Mise à jour de la base de données..."
node update-oh-route.js
echo

echo "3. Test de la configuration..."
node test-oh-route.js
echo

echo "4. Vérification des fichiers..."
if [ -f "OH-Route v1.1.exe" ]; then
    echo "    [OK] Fichier OH-Route v1.1.exe présent"
else
    echo "    [ATTENTION] Fichier OH-Route v1.1.exe manquant"
    echo "    Placez le vrai fichier exécutable dans ce répertoire"
fi
echo

echo "========================================"
echo "    Configuration terminée !"
echo "========================================"
echo
echo "Prochaines étapes :"
echo "1. Remplacer le fichier placeholder par le vrai exécutable"
echo "2. Tester le téléchargement sur la page des logiciels"
echo "3. Vérifier que le bouton affiche 'Télécharger'"
echo
