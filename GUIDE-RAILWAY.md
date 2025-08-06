# 🚂 Guide Railway - Sorbo Ingénierie

## 📋 Configuration Railway

### 1. **Connexion à Railway**
- Allez sur [railway.app](https://railway.app)
- Connectez-vous avec votre compte GitHub
- Cliquez sur "New Project"

### 2. **Import du projet**
- Sélectionnez "Deploy from GitHub repo"
- Choisissez le repository `T0538/Sorbo-ingénierie`
- Cliquez sur "Deploy Now"

### 3. **Configuration automatique**
Le fichier `railway.json` est déjà configuré :
```json
{
  "$schema": "https://railway.app/railway.schema.json",
  "build": {
    "builder": "NIXPACKS"
  },
  "deploy": {
    "startCommand": "cd backend && npm start",
    "healthcheckPath": "/api/health",
    "healthcheckTimeout": 300,
    "restartPolicyType": "ON_FAILURE",
    "restartPolicyMaxRetries": 10
  }
}
```

### 4. **Variables d'environnement**
Dans Railway, ajoutez ces variables :
```
PORT=10000
NODE_ENV=production
MONGODB_URI=mongodb+srv://kevinyameogo01:wBLR2n5hAPNZM93Y@sorbo-ingenierie.ol32tmy.mongodb.net/?retryWrites=true&w=majority&appName=Sorbo-ingenierie
JWT_SECRET=c670766d50129c7b7e59455fc7608991666bdeb5f5984ef6915b8a358a90c9c4
JWT_EXPIRES_IN=30d
FRONTEND_URL=https://sorbo-ingenierie.netlify.app
API_URL=https://votre-projet-railway.railway.app/api
```

### 5. **URL de l'API**
Une fois déployé, Railway vous donnera une URL comme :
`https://votre-projet-railway.railway.app`

### 6. **Test de l'API**
Testez ces endpoints :
- `https://votre-projet-railway.railway.app/api/health`
- `https://votre-projet-railway.railway.app/api/formations`

## 🔧 Serveur Local (pour tests)

### Démarrage local
```bash
cd backend
npm run local
```

### Test local
- API Health: `http://localhost:5000/api/health`
- Formations: `http://localhost:5000/api/formations`
- Frontend: `http://localhost:5000`

## 📊 Structure du projet

### Fichiers principaux
- `backend/server.js` - Serveur principal (Railway)
- `backend/server-local.js` - Serveur local (tests)
- `railway.json` - Configuration Railway
- `js/formations-mongodb-simple.js` - Frontend loader

### Scripts disponibles
```bash
npm start          # Serveur principal (Railway)
npm run local      # Serveur local (tests)
npm run dev        # Développement avec nodemon
```

## 🎯 Prochaines étapes

1. **Déployer sur Railway** avec le guide ci-dessus
2. **Tester l'API** Railway
3. **Mettre à jour le frontend** avec l'URL Railway
4. **Attendre le paiement** pour activer Railway

## ✅ Avantages Railway

- ✅ **Démarrage rapide** (pas de cold start)
- ✅ **Configuration simple** avec `railway.json`
- ✅ **Variables d'environnement** intégrées
- ✅ **Monitoring** automatique
- ✅ **Logs** en temps réel

## 🔗 Liens utiles

- [Railway Documentation](https://docs.railway.app/)
- [Railway Dashboard](https://railway.app/dashboard)
- [GitHub Repository](https://github.com/T0538/Sorbo-ingenierie) 