#!/bin/bash
echo "Démarrage du serveur local pour Sorbo-Ingénierie..."
echo ""
echo "Le site sera accessible à l'adresse: http://localhost:8000"
echo ""
echo "Appuyez sur Ctrl+C pour arrêter le serveur"
echo ""
python3 -m http.server 8000
