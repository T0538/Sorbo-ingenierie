@echo off
echo ========================================
echo    Configuration d'OH-Route
echo    Sorbo-Ingenierie
echo ========================================
echo.

echo 1. Installation des dependances...
npm install mongodb
echo.

echo 2. Mise a jour de la base de donnees...
node update-oh-route.js
echo.

echo 3. Test de la configuration...
node test-oh-route.js
echo.

echo 4. Verification des fichiers...
if exist "OH-Route v1.1.rar" (
    echo    [OK] Fichier OH-Route v1.1.rar present
) else (
    echo    [ATTENTION] Fichier OH-Route v1.1.rar manquant
    echo    Placez le vrai fichier RAR dans ce repertoire
)
echo.

echo ========================================
echo    Configuration terminee !
echo ========================================
echo.
echo Prochaines etapes :
echo 1. Remplacer le fichier placeholder par le vrai fichier RAR
echo 2. Tester le telechargement sur la page des logiciels
echo 3. Verifier que le bouton affiche "Telecharger"
echo.
pause
