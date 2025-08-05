# Script PowerShell pour démarrer le serveur ultra-simple
Write-Host "🚀 Démarrage du serveur Sorbo Ingénierie..." -ForegroundColor Green

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

# Vérifier si le fichier .env existe
if (-not (Test-Path ".env")) {
    Write-Host "⚙️  Création du fichier .env..." -ForegroundColor Yellow
    "PORT=5000`nNODE_ENV=development" | Out-File -FilePath ".env" -Encoding UTF8
}

# Démarrer le serveur
Write-Host "🚀 Démarrage du serveur sur http://localhost:5000..." -ForegroundColor Green
Write-Host "📡 Endpoints disponibles:" -ForegroundColor Cyan
Write-Host "   - http://localhost:5000/api/health" -ForegroundColor White
Write-Host "   - http://localhost:5000/api/test" -ForegroundColor White
Write-Host "   - http://localhost:5000/api/contact" -ForegroundColor White
Write-Host "   - http://localhost:5000/api/formations" -ForegroundColor White
Write-Host ""
Write-Host "🛑 Pour arrêter le serveur, appuyez sur Ctrl+C" -ForegroundColor Yellow
Write-Host ""

node server-ultra-simple.js 