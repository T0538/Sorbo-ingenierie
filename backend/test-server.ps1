# Script PowerShell pour tester le serveur ultra-simple
Write-Host "🧪 Test du serveur Sorbo Ingénierie..." -ForegroundColor Green

# Vérifier si Node.js est installé
try {
    $nodeVersion = node --version
    Write-Host "✅ Node.js détecté: $nodeVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ Node.js n'est pas installé. Veuillez l'installer depuis https://nodejs.org/" -ForegroundColor Red
    exit 1
}

# Vérifier si les dépendances sont installées
if (-not (Test-Path "node_modules")) {
    Write-Host "📦 Installation des dépendances..." -ForegroundColor Yellow
    npm install
}

# Vérifier si le serveur est en cours d'exécution
Write-Host "🔍 Vérification du serveur..." -ForegroundColor Yellow

try {
    $response = Invoke-WebRequest -Uri "http://localhost:5000/api/health" -TimeoutSec 5
    Write-Host "✅ Serveur accessible!" -ForegroundColor Green
} catch {
    Write-Host "❌ Serveur non accessible. Démarrage du serveur..." -ForegroundColor Red
    
    # Démarrer le serveur en arrière-plan
    Start-Process -NoNewWindow node -ArgumentList "server-ultra-simple.js"
    
    # Attendre que le serveur démarre
    Write-Host "⏳ Attente du démarrage du serveur..." -ForegroundColor Yellow
    Start-Sleep -Seconds 3
}

# Lancer les tests
Write-Host "🚀 Lancement des tests..." -ForegroundColor Green
Write-Host ""

node test-ultra-simple.js

Write-Host ""
Write-Host "🎯 Test terminé!" -ForegroundColor Green 