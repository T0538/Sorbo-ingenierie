@echo off
echo Demarrage du serveur local pour Sorbo-Ingenierie...
echo.
echo Le site sera accessible a l'adresse: http://localhost:8000
echo.
echo Appuyez sur Ctrl+C pour arreter le serveur
echo.
python -m http.server 8000
