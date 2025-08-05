# 🚀 Sorbo Ingénierie - Backend API

Backend Node.js/Express pour le site web de Sorbo Ingénierie avec MongoDB, Redis, et optimisations de performance.

## 📋 Table des Matières

- [Prérequis](#prérequis)
- [Installation](#installation)
- [Configuration](#configuration)
- [Base de Données](#base-de-données)
- [Cache Redis](#cache-redis)
- [Démarrage](#démarrage)
- [API Endpoints](#api-endpoints)
- [Tests](#tests)
- [Déploiement](#déploiement)
- [Monitoring](#monitoring)
- [Troubleshooting](#troubleshooting)

## 🔧 Prérequis

- **Node.js** 18.x ou supérieur
- **npm** ou **yarn**
- **MongoDB** (local ou Atlas)
- **Redis** (optionnel, pour le cache)

### Vérification des prérequis

```bash
# Vérifier Node.js
node --version  # Doit être >= 18.0.0

# Vérifier npm
npm --version

# Vérifier MongoDB (si local)
mongod --version
```

## 📦 Installation

### 1. Cloner le projet

```bash
cd backend
```

### 2. Installer les dépendances

```bash
npm install
```

### 3. Créer le fichier d'environnement

```bash
# Copier le fichier d'exemple
cp .env.example .env

# Ou créer manuellement
touch .env
```

## ⚙️ Configuration

### Variables d'Environnement (.env)

```env
# Configuration de la base de données
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/sorbo-ingenierie?retryWrites=true&w=majority

# Configuration Redis (optionnel)
REDIS_URL=redis://username:password@redis-server:port

# Configuration JWT
JWT_SECRET=votre_secret_jwt_tres_securise
JWT_EXPIRE=30d

# Configuration Email
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=votre_email@gmail.com
EMAIL_PASS=votre_mot_de_passe_app

# Configuration CORS
FRONTEND_URL=https://sorbo-ingenierie.netlify.app

# Configuration du serveur
PORT=5000
NODE_ENV=development

# Configuration des logs
LOG_LEVEL=info

# Configuration de sécurité
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# Configuration du cache
CACHE_TTL=3600
```

### Configuration MongoDB Atlas (Recommandé)

1. **Créer un compte MongoDB Atlas**
   - Aller sur [mongodb.com/cloud/atlas](https://mongodb.com/cloud/atlas)
   - Créer un compte gratuit

2. **Créer un cluster**
   - Choisir le plan gratuit (M0)
   - Sélectionner un provider (AWS, Google Cloud, Azure)
   - Choisir une région proche

3. **Configurer l'accès réseau**
   - Aller dans "Network Access"
   - Ajouter `0.0.0.0/0` pour permettre l'accès depuis n'importe où
   - Ou ajouter votre IP spécifique

4. **Créer un utilisateur DB**
   - Aller dans "Database Access"
   - Créer un nouvel utilisateur
   - Noter le nom d'utilisateur et mot de passe

5. **Obtenir l'URI de connexion**
   - Aller dans "Database"
   - Cliquer sur "Connect"
   - Choisir "Connect your application"
   - Copier l'URI et remplacer `<password>` par votre mot de passe

### Configuration Redis (Optionnel)

1. **Redis Local**
   ```bash
   # Installer Redis
   # Windows: Télécharger depuis redis.io
   # macOS: brew install redis
   # Linux: sudo apt-get install redis-server
   
   # Démarrer Redis
   redis-server
   ```

2. **Redis Cloud (Recommandé)**
   - Aller sur [redis.com/try-free](https://redis.com/try-free)
   - Créer un compte gratuit
   - Créer une base de données
   - Copier l'URL de connexion

## 🗄️ Base de Données

### Migration et Index

```bash
# Créer les index et migrer les données
npm run migrate

# Vérifier les index
npm run test-api
```

### Structure des Collections

#### Formations
```javascript
{
  titre: String,
  description: String,
  categorie: String,
  prix: Number,
  duree: String,
  niveau: String,
  dateDebut: Date,
  inscriptions: Array,
  createdAt: Date
}
```

#### Contacts
```javascript
{
  name: String,
  email: String,
  phone: String,
  subject: String,
  message: String,
  status: String,
  createdAt: Date
}
```

#### Utilisateurs
```javascript
{
  name: String,
  email: String,
  password: String,
  role: String,
  createdAt: Date
}
```

## 🚀 Démarrage

### Mode Développement

```bash
# Démarrer avec nodemon (rechargement automatique)
npm run dev

# Ou démarrer normalement
npm start
```

### Mode Production

```bash
# Démarrer le serveur optimisé
node server-optimized.js

# Ou utiliser le script de déploiement
chmod +x deploy.sh
./deploy.sh
```

### Vérification du démarrage

```bash
# Tester l'API
curl http://localhost:5000/api/health

# Réponse attendue
{
  "status": "OK",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "uptime": 123.456,
  "memory": {...},
  "redis": "connected"
}
```

## 📡 API Endpoints

### 🔐 Authentification

```bash
# Inscription
POST /api/auth/register
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}

# Connexion
POST /api/auth/login
{
  "email": "john@example.com",
  "password": "password123"
}
```

### 📞 Contact

```bash
# Créer un contact
POST /api/contact
{
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "+1234567890",
  "subject": "formation",
  "message": "Bonjour, je souhaite..."
}
```

### 🎓 Formations

```bash
# Lister toutes les formations
GET /api/formations

# Obtenir une formation
GET /api/formations/:id

# Inscription à une formation
POST /api/formations/:id/inscription
{
  "nom": "John",
  "prenom": "Doe",
  "email": "john@example.com",
  "telephone": "+1234567890",
  "entreprise": "Ma Société"
}
```

### 💼 Emplois

```bash
# Lister les emplois
GET /api/emplois

# Créer un emploi
POST /api/emplois
{
  "titre": "Ingénieur Civil",
  "description": "Description du poste...",
  "entreprise": "Sorbo Ingénierie"
}
```

### 🏗️ Projets

```bash
# Lister les projets
GET /api/projets

# Créer un projet
POST /api/projets
{
  "titre": "Pont de la Concorde",
  "description": "Construction d'un pont...",
  "client": "Ville de Paris"
}
```

### 💻 Logiciels

```bash
# Lister les logiciels
GET /api/logiciels

# Créer un logiciel
POST /api/logiciels
{
  "nom": "Sorbo Struct",
  "description": "Logiciel de calcul...",
  "version": "2.1.0"
}
```

## 🧪 Tests

### Test de l'API

```bash
# Tester tous les endpoints
npm run test-api

# Tester un endpoint spécifique
curl -X GET http://localhost:5000/api/formations
```

### Test de Performance

```bash
# Installer Apache Bench (ab)
# Windows: Télécharger depuis httpd.apache.org
# macOS: brew install httpd
# Linux: sudo apt-get install apache2-utils

# Test de charge
ab -n 1000 -c 10 http://localhost:5000/api/health
```

### Test de Cache

```bash
# Vérifier le cache Redis
redis-cli
> KEYS *
> GET cache:api/formations
```

## 📊 Monitoring

### Logs

```bash
# Voir les logs en temps réel
tail -f logs/api.log

# Voir les erreurs
tail -f logs/error.log

# Voir tous les logs
tail -f logs/combined.log
```

### Métriques

```bash
# Statistiques de l'API
GET /api/stats

# Santé du système
GET /api/health
```

### Monitoring MongoDB

```bash
# Voir les connexions actives
db.serverStatus().connections

# Voir les index
db.formations.getIndexes()
```

## 🚀 Déploiement

### Déploiement Local

```bash
# Installer les dépendances
npm install

# Configurer l'environnement
cp .env.example .env
# Éditer .env avec vos paramètres

# Migrer la base de données
npm run migrate

# Démarrer
npm start
```

### Déploiement Production

```bash
# Utiliser le script de déploiement
chmod +x deploy.sh
./deploy.sh

# Ou déployer manuellement
NODE_ENV=production npm start
```

### Variables d'Environnement Production

```env
NODE_ENV=production
MONGODB_URI=mongodb+srv://...
REDIS_URL=redis://...
JWT_SECRET=secret_tres_securise_production
```

## 🔧 Troubleshooting

### Erreurs Communes

#### 1. Erreur de connexion MongoDB
```bash
# Vérifier l'URI MongoDB
echo $MONGODB_URI

# Tester la connexion
node -e "
const mongoose = require('mongoose');
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('✅ MongoDB connecté'))
  .catch(err => console.error('❌ Erreur:', err.message));
"
```

#### 2. Erreur Redis
```bash
# Vérifier Redis
redis-cli ping
# Doit répondre PONG

# Si Redis n'est pas disponible, l'API fonctionne sans cache
```

#### 3. Erreur CORS
```bash
# Vérifier les origines autorisées
curl -H "Origin: http://localhost:3000" \
     -H "Access-Control-Request-Method: POST" \
     -H "Access-Control-Request-Headers: Content-Type" \
     -X OPTIONS http://localhost:5000/api/contact
```

#### 4. Erreur JWT
```bash
# Vérifier le secret JWT
echo $JWT_SECRET

# Régénérer un secret
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

### Logs de Debug

```bash
# Activer les logs détaillés
LOG_LEVEL=debug npm run dev

# Voir les logs en temps réel
tail -f logs/combined.log | grep ERROR
```

### Performance

```bash
# Vérifier l'utilisation mémoire
node -e "
const mem = process.memoryUsage();
console.log('RSS:', Math.round(mem.rss / 1024 / 1024) + ' MB');
console.log('Heap Total:', Math.round(mem.heapTotal / 1024 / 1024) + ' MB');
console.log('Heap Used:', Math.round(mem.heapUsed / 1024 / 1024) + ' MB');
"
```

## 📚 Ressources

- [Documentation Express.js](https://expressjs.com/)
- [Documentation Mongoose](https://mongoosejs.com/)
- [Documentation MongoDB Atlas](https://docs.atlas.mongodb.com/)
- [Documentation Redis](https://redis.io/documentation)
- [Documentation Winston](https://github.com/winstonjs/winston)

## 🤝 Support

Pour toute question ou problème :

1. Vérifier les logs : `tail -f logs/error.log`
2. Tester l'API : `npm run test-api`
3. Vérifier la configuration : `.env`
4. Consulter ce README

---

**🚀 Votre backend est maintenant prêt à être utilisé !** 