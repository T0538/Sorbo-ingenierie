# 🚀 Guide de Déploiement Railway - Sorbo Ingénierie

## 📋 Prérequis

- Compte Railway (https://railway.app)
- Projet GitHub connecté
- MongoDB Atlas configuré

## 🔧 Configuration Railway

### 1. Créer un nouveau projet Railway

1. Allez sur https://railway.app
2. Cliquez sur "New Project"
3. Sélectionnez "Deploy from GitHub repo"
4. Choisissez votre repository Sorbo-Ingenierie

### 2. Configuration des Variables d'Environnement

Dans votre projet Railway, allez dans l'onglet "Variables" et ajoutez :

```env
NODE_ENV=production
PORT=5000
MONGODB_URI=mongodb+srv://kevinyameogo01:wBLR2n5hAPNZM93Y@sorbo-ingenierie.ol32tmy.mongodb.net/?retryWrites=true&w=majority&appName=Sorbo-ingenierie
FRONTEND_URL=https://sorbo-ingenierie.netlify.app
JWT_SECRET=sorbo-ingenierie-production-secret-key-2024
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
LOG_LEVEL=info
```

### 3. Configuration du Déploiement

Railway détectera automatiquement :
- **Root Directory**: `backend/`
- **Build Command**: `npm install`
- **Start Command**: `npm start`

### 4. Déploiement

1. Railway déploiera automatiquement à chaque push sur GitHub
2. Le build se fait automatiquement
3. Le serveur démarre avec `npm start` (server-production.js)

## 🔒 Sécurité Configurée

### Rate Limiting
- 100 requêtes max par IP par 15 minutes
- Protection contre les attaques DDoS

### Helmet Security
- Headers de sécurité configurés
- Protection XSS, CSRF, etc.

### CORS Sécurisé
- Origines autorisées uniquement
- Credentials supportés

### Validation des Données
- Validation Express-Validator
- Protection contre les injections

## 📊 Monitoring

### Health Check
- Endpoint: `/api/health`
- Timeout: 300 secondes
- Restart automatique en cas d'échec

### Logs
- Logs automatiques Railway
- Niveau: INFO
- Rotation automatique

## 🚀 URLs de Production

Une fois déployé, vous aurez :
- **API**: `https://votre-projet.railway.app`
- **Health Check**: `https://votre-projet.railway.app/api/health`
- **Formations**: `https://votre-projet.railway.app/api/formations`
- **Logiciels**: `https://votre-projet.railway.app/api/logiciels`
- **Actualités**: `https://votre-projet.railway.app/api/actualites`
- **Emplois**: `https://votre-projet.railway.app/api/emplois`

## 🔄 Mise à Jour du Frontend

Après le déploiement Railway, mettez à jour les URLs dans le frontend :

```javascript
// Dans js/formations-mongodb-simple.js
const API_BASE_URL = 'https://votre-projet.railway.app';

// Dans js/logiciels-loader.js
const API_BASE_URL = 'https://votre-projet.railway.app';

// Dans js/actualites-loader.js
const API_BASE_URL = 'https://votre-projet.railway.app';
```

## 🧪 Tests Post-Déploiement

### 1. Test de Santé
```bash
curl https://votre-projet.railway.app/api/health
```

### 2. Test des Formations
```bash
curl https://votre-projet.railway.app/api/formations
```

### 3. Test des Logiciels
```bash
curl https://votre-projet.railway.app/api/logiciels
```

### 4. Test des Actualités
```bash
curl https://votre-projet.railway.app/api/actualites
```

## 🛠️ Troubleshooting

### Erreur de Build
- Vérifiez que `package.json` est dans le dossier `backend/`
- Vérifiez les dépendances installées

### Erreur de Connexion MongoDB
- Vérifiez `MONGODB_URI` dans les variables d'environnement
- Testez la connexion MongoDB Atlas

### Erreur CORS
- Vérifiez `FRONTEND_URL` dans les variables
- Ajoutez votre domaine dans les origines autorisées

### Erreur de Port
- Railway définit automatiquement `PORT`
- Vérifiez que le serveur écoute sur `process.env.PORT`

## 📈 Monitoring Avancé

### Métriques Railway
- CPU/Mémoire utilisés
- Temps de réponse
- Nombre de requêtes

### Logs en Temps Réel
```bash
railway logs
```

### Redémarrage Manuel
```bash
railway service restart
```

## 🎯 Prochaines Étapes

1. ✅ Déployer sur Railway
2. 🔄 Mettre à jour URLs frontend
3. 🧪 Tester toutes les APIs
4. 📊 Configurer monitoring
5. 🔐 Ajouter authentification admin
6. 📝 Documenter pour le client

## 📞 Support

En cas de problème :
1. Vérifiez les logs Railway
2. Testez les endpoints individuellement
3. Vérifiez les variables d'environnement
4. Contactez le support Railway si nécessaire
