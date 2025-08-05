# 🚀 Backend Simplifié - Sorbo Ingénierie

**Version pour débutant avec technologies simples et rapides**

## 🎯 **Technologies Utilisées (Simples)**

- ✅ **Express.js** - Framework web simple
- ✅ **MongoDB** - Base de données
- ✅ **Mongoose** - Pour MongoDB
- ✅ **CORS** - Pour les requêtes web
- ✅ **JWT** - Authentification simple
- ✅ **Nodemailer** - Envoi d'emails

## ⚡ **Installation Rapide (2 minutes)**

### 1. Installer les dépendances
```bash
# Copier le package simplifié
cp package-simple.json package.json

# Installer (beaucoup plus rapide !)
npm install
```

### 2. Configuration minimale
```bash
# Créer le fichier .env
echo "MONGODB_URI=mongodb://localhost:27017/sorbo-ingenierie
JWT_SECRET=secret_simple_pour_test
PORT=5000
NODE_ENV=development" > .env
```

### 3. Démarrer le serveur
```bash
# Mode développement
npm run dev

# Ou mode production
npm start
```

### 4. Tester
```bash
# Dans un autre terminal
npm test
```

## 📊 **Endpoints Disponibles**

### GET (Lecture)
```bash
# Santé du serveur
GET http://localhost:5000/api/health

# Test de l'API
GET http://localhost:5000/api/test

# Formations
GET http://localhost:5000/api/formations
```

### POST (Création)
```bash
# Créer un contact
POST http://localhost:5000/api/contact
{
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "+1234567890",
  "subject": "formation",
  "message": "Bonjour..."
}
```

## 🔧 **Configuration MongoDB**

### Option 1 : MongoDB Local (Simple)
```bash
# Installer MongoDB localement
# Windows : Télécharger depuis mongodb.com
# macOS : brew install mongodb-community
# Linux : sudo apt-get install mongodb

# Démarrer MongoDB
mongod
```

### Option 2 : MongoDB Atlas (Cloud - Recommandé)
1. Aller sur [mongodb.com/cloud/atlas](https://mongodb.com/cloud/atlas)
2. Créer un compte gratuit
3. Créer un cluster M0 (gratuit)
4. Obtenir l'URI de connexion
5. Mettre dans `.env` :
   ```
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/sorbo-ingenierie
   ```

## 🧪 **Tests Rapides**

### Test avec curl
```bash
# Test de santé
curl http://localhost:5000/api/health

# Test de l'API
curl http://localhost:5000/api/test
```

### Test avec Postman
1. Ouvrir Postman
2. Créer une nouvelle requête
3. Tester : `GET http://localhost:5000/api/health`

## 🐛 **Dépannage Simple**

### Erreur "Cannot find module"
```bash
# Réinstaller
rm -rf node_modules package-lock.json
npm install
```

### Erreur MongoDB
```bash
# Vérifier que MongoDB est démarré
# Ou utiliser MongoDB Atlas
```

### Erreur de port
```bash
# Changer le port
echo "PORT=5001" >> .env
```

## 📈 **Avantages de cette Version**

### ✅ **Plus Rapide**
- Moins de dépendances
- Installation plus rapide
- Démarrage plus rapide

### ✅ **Plus Simple**
- Code plus facile à comprendre
- Moins de configuration
- Moins de fichiers

### ✅ **Plus Stable**
- Moins de points de défaillance
- Compatible avec Node.js v16+
- Moins d'erreurs possibles

## 🎯 **Prochaines Étapes**

### 1. Apprendre les bases
- [ ] Comprendre Express.js
- [ ] Comprendre MongoDB
- [ ] Comprendre les routes API

### 2. Ajouter des fonctionnalités
- [ ] Authentification
- [ ] Upload de fichiers
- [ ] Validation des données

### 3. Optimiser
- [ ] Cache simple
- [ ] Logs simples
- [ ] Tests unitaires

## 📚 **Ressources pour Débutant**

- [Express.js Guide](https://expressjs.com/en/guide/routing.html)
- [MongoDB Tutorial](https://docs.mongodb.com/manual/tutorial/)
- [Node.js Guide](https://nodejs.org/en/docs/guides/)

---

**🎉 Votre backend simplifié est prêt !**

**Temps d'installation : ~2 minutes au lieu de 10+ minutes** 