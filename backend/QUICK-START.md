# ⚡ Démarrage Rapide - Backend Sorbo Ingénierie

## 🚀 Test Immédiat (5 minutes)

### 1. Vérifier les prérequis
```bash
# Vérifier Node.js
node --version  # Doit être >= 18.0.0

# Vérifier npm
npm --version
```

### 2. Installer les dépendances
```bash
cd backend
npm install
```

### 3. Configuration minimale
```bash
# Créer le fichier .env
cp .env.example .env

# Éditer .env avec les valeurs minimales
echo "MONGODB_URI=mongodb://localhost:27017/sorbo-ingenierie
JWT_SECRET=secret_temporaire_pour_test
PORT=5000
NODE_ENV=development" > .env
```

### 4. Démarrer le serveur
```bash
# Mode développement
npm run dev

# Ou mode production
npm start
```

### 5. Tester l'API
```bash
# Dans un autre terminal
npm run quick-test
```

## ✅ Vérification Rapide

### Test manuel avec curl
```bash
# Test de santé
curl http://localhost:5000/api/health

# Test des formations
curl http://localhost:5000/api/formations

# Test des statistiques
curl http://localhost:5000/api/stats
```

### Test avec Postman
1. Ouvrir Postman
2. Créer une nouvelle collection "Sorbo Ingénierie"
3. Ajouter les requêtes :
   - `GET http://localhost:5000/api/health`
   - `GET http://localhost:5000/api/formations`
   - `POST http://localhost:5000/api/contact`

## 🔧 Configuration Avancée

### MongoDB Atlas (Recommandé)
1. Aller sur [mongodb.com/cloud/atlas](https://mongodb.com/cloud/atlas)
2. Créer un compte gratuit
3. Créer un cluster M0
4. Obtenir l'URI de connexion
5. Remplacer dans `.env` :
   ```
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/sorbo-ingenierie
   ```

### Redis (Optionnel)
1. Installer Redis localement ou utiliser Redis Cloud
2. Ajouter dans `.env` :
   ```
   REDIS_URL=redis://localhost:6379
   ```

## 📊 Endpoints de Test

### Endpoints GET (Lecture)
```bash
# Santé du serveur
GET /api/health

# Statistiques
GET /api/stats

# Formations
GET /api/formations

# Emplois
GET /api/emplois

# Projets
GET /api/projets

# Logiciels
GET /api/logiciels
```

### Endpoints POST (Création)
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

# Inscription à une formation
POST /api/formations/:id/inscription
{
  "nom": "John",
  "prenom": "Doe",
  "email": "john@example.com",
  "telephone": "+1234567890"
}
```

## 🐛 Dépannage Rapide

### Erreur "Cannot find module"
```bash
# Réinstaller les dépendances
rm -rf node_modules package-lock.json
npm install
```

### Erreur de connexion MongoDB
```bash
# Vérifier que MongoDB est démarré
mongod --version

# Ou utiliser MongoDB Atlas
# Mettre à jour MONGODB_URI dans .env
```

### Erreur de port déjà utilisé
```bash
# Changer le port dans .env
PORT=5001

# Ou tuer le processus
lsof -ti:5000 | xargs kill -9
```

### Erreur CORS
```bash
# Vérifier les origines dans server.js
# Ajouter votre domaine à allowedOrigins
```

## 📈 Métriques de Performance

### Objectifs
- Temps de réponse < 200ms
- Uptime > 99.9%
- Utilisation mémoire < 512MB

### Monitoring
```bash
# Voir les logs en temps réel
tail -f logs/api.log

# Voir les erreurs
tail -f logs/error.log

# Statistiques du serveur
curl http://localhost:5000/api/health
```

## 🎯 Prochaines Étapes

### 1. Configuration Production
- [ ] MongoDB Atlas
- [ ] Redis Cloud
- [ ] Variables d'environnement sécurisées
- [ ] SSL/TLS

### 2. Tests Complets
- [ ] Tests unitaires
- [ ] Tests d'intégration
- [ ] Tests de performance

### 3. Déploiement
- [ ] Configuration serveur
- [ ] CI/CD pipeline
- [ ] Monitoring production

## 📞 Support

### Logs utiles
```bash
# Logs de l'application
npm run dev

# Logs de test
npm run quick-test

# Logs de migration
npm run migrate
```

### Commandes utiles
```bash
# Redémarrer le serveur
npm run dev

# Tester l'API
npm run quick-test

# Migrer la base de données
npm run migrate

# Voir les logs
tail -f logs/combined.log
```

---

**🎉 Votre backend est maintenant prêt pour le développement !**

Pour plus d'informations, consultez le [README.md](README.md) complet. 