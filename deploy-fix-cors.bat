@echo off
echo 🚀 Déploiement de la correction CORS pour sorbo-ingenierie.ci
echo.

echo 📝 Ajout des fichiers modifiés...
git add .

echo 💾 Commit des changements...
git commit -m "🔧 Fix CORS pour nouveau domaine sorbo-ingenierie.ci - Support complet"

echo 🚀 Push vers Railway...
git push origin main

echo.
echo ✅ Déploiement terminé !
echo 🌐 Votre API sera mise à jour sur Railway dans quelques minutes
echo 🔗 Testez ensuite: https://sorbo-api-production.up.railway.app/api/health
echo.
echo 📋 Prochaines étapes:
echo    1. Attendez 2-3 minutes que Railway redéploie
echo    2. Testez votre site https://sorbo-ingenierie.ci
echo    3. Vérifiez que les données se chargent correctement
echo.
pause