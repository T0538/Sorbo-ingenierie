# 🗄️ Guide MongoDB Atlas - Sorbo Ingénierie

## 📋 Prérequis
- Compte MongoDB Atlas (gratuit)
- Node.js installé
- Projet backend existant

## 🚀 Étape 1 : Création du compte MongoDB Atlas

### 1.1 **Inscription**
1. Allez sur [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Cliquez sur "Try Free"
3. Remplissez le formulaire d'inscription
4. Choisissez le plan "Free" (M0)

### 1.2 **Configuration du cluster**
1. **Choisir le provider :** AWS, Google Cloud, ou Azure
2. **Région :** Sélectionnez la région la plus proche (ex: Europe)
3. **Cluster tier :** M0 Sandbox (gratuit)
4. **Nom du cluster :** `sorbo-ingenierie-cluster`

### 1.3 **Sécurité**
1. **Créer un utilisateur admin :**
   - Username: `sorbo-admin`
   - Password: `VotreMotDePasseSecurise123!`
   - Role: `Atlas admin`

2. **Configurer l'accès réseau :**
   - Cliquez sur "Network Access"
   - Cliquez sur "Add IP Address"
   - Choisissez "Allow Access from Anywhere" (0.0.0.0/0)
   - Ou ajoutez votre IP spécifique

## 🔗 Étape 2 : Connexion à MongoDB Atlas

### 2.1 **Obtenir l'URI de connexion**
1. Dans votre cluster, cliquez sur "Connect"
2. Choisissez "Connect your application"
3. Sélectionnez "Node.js" et version "4.1 or later"
4. Copiez l'URI de connexion

**Exemple d'URI :**
```
mongodb+srv://sorbo-admin:VotreMotDePasseSecurise123!@cluster0.xxxxx.mongodb.net/sorbo-ingenierie?retryWrites=true&w=majority
```

### 2.2 **Variables d'environnement**
Créez un fichier `.env` dans le dossier `backend` :

```env
# MongoDB Atlas
MONGODB_URI=mongodb+srv://sorbo-admin:VotreMotDePasseSecurise123!@cluster0.xxxxx.mongodb.net/sorbo-ingenierie?retryWrites=true&w=majority

# Serveur
PORT=5000
NODE_ENV=development

# Admin Token (à changer en production)
ADMIN_TOKEN=admin123

# Email (optionnel)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=votre-email@gmail.com
EMAIL_PASS=votre-mot-de-passe-app
```

## 📦 Étape 3 : Installation des dépendances

### 3.1 **Installer les dépendances**
```bash
cd backend
npm install
```

### 3.2 **Vérifier le package.json**
Le fichier `package.json` doit contenir :
```json
{
  "name": "sorbo-ingenierie-backend",
  "version": "1.0.0",
  "description": "Backend Sorbo Ingénierie avec MongoDB Atlas",
  "main": "server-admin.js",
  "scripts": {
    "start": "node server-admin.js",
    "dev": "nodemon server-admin.js",
    "test": "node test-mongodb.js"
  },
  "dependencies": {
    "express": "^4.18.2",
    "mongoose": "^7.5.0",
    "cors": "^2.8.5",
    "dotenv": "^16.3.1",
    "axios": "^1.5.0"
  },
  "devDependencies": {
    "nodemon": "^3.0.1"
  },
  "engines": {
    "node": ">=16.0.0"
  }
}
```

## 🗂️ Étape 4 : Modèles de données

### 4.1 **Structure des modèles**
Les modèles sont déjà créés dans le dossier `models/` :
- `Contact.js` - Gestion des contacts
- `Formation.js` - Gestion des formations
- `Actualite.js` - Gestion des actualités
- `Logiciel.js` - Gestion des logiciels
- `Emploi.js` - Gestion des emplois

## 🔧 Étape 5 : Serveur d'administration

### 5.1 **Fonctionnalités du serveur**
Le serveur `server-admin.js` inclut :

**Routes publiques :**
- `GET /api/health` - Santé du serveur
- `POST /api/contact` - Envoi de contact
- `GET /api/formations` - Liste des formations
- `GET /api/actualites` - Liste des actualités
- `GET /api/logiciels` - Liste des logiciels
- `GET /api/emplois` - Liste des emplois

**Routes d'administration :**
- `GET /api/admin/actualites` - Liste des actualités (admin)
- `POST /api/admin/actualites` - Créer une actualité
- `PUT /api/admin/actualites/:id` - Modifier une actualité
- `DELETE /api/admin/actualites/:id` - Supprimer une actualité

**Même structure pour :**
- Logiciels : `/api/admin/logiciels`
- Emplois : `/api/admin/emplois`
- Formations : `/api/admin/formations`

**Statistiques :**
- `GET /api/admin/stats` - Statistiques générales

## 🧪 Étape 6 : Tests

### 6.1 **Script de test**
Le fichier `test-mongodb.js` teste :
- Connectivité du serveur
- Création de contacts
- Récupération des formations
- Récupération des actualités
- Récupération des logiciels
- Récupération des emplois
- Routes d'administration

### 6.2 **Exécuter les tests**
```bash
cd backend
node test-mongodb.js
```

## 🚀 Étape 7 : Démarrage

### 7.1 **Démarrer le serveur**
```bash
cd backend
npm run dev
```

### 7.2 **Vérifier le démarrage**
Vous devriez voir :
```
🚀 Serveur Sorbo Ingénierie avec MongoDB démarré sur le port 5000
📊 Mode: development
🔗 URL: http://localhost:5000
✅ API Health: http://localhost:5000/api/health
📞 Contact: http://localhost:5000/api/contact
🎓 Formations: http://localhost:5000/api/formations
📰 Actualités: http://localhost:5000/api/actualites
💻 Logiciels: http://localhost:5000/api/logiciels
💼 Emplois: http://localhost:5000/api/emplois
🔐 Admin: http://localhost:5000/api/admin/
```

## 🔐 Étape 8 : Interface d'administration

### 8.1 **Authentification**
L'interface d'administration utilise un token simple :
- Token par défaut : `admin123`
- À changer en production dans le fichier `.env`

### 8.2 **Headers d'authentification**
Pour toutes les routes admin, ajoutez :
```
Authorization: Bearer admin123
```

### 8.3 **Exemples d'utilisation**

**Créer une actualité :**
```bash
curl -X POST http://localhost:5000/api/admin/actualites \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer admin123" \
  -d '{
    "titre": "Nouvelle formation AutoCAD",
    "contenu": "Contenu de l'actualité...",
    "resume": "Résumé de l'actualité",
    "categorie": "formation",
    "statut": "publie"
  }'
```

**Créer un logiciel :**
```bash
curl -X POST http://localhost:5000/api/admin/logiciels \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer admin123" \
  -d '{
    "nom": "AutoCAD 2024",
    "description": "Logiciel de CAO professionnel",
    "categorie": "autocad",
    "prix": 150000,
    "disponible": true
  }'
```

**Créer un emploi :**
```bash
curl -X POST http://localhost:5000/api/admin/emplois \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer admin123" \
  -d '{
    "titre": "Ingénieur Civil",
    "entreprise": "Sorbo Ingénierie",
    "description": "Description du poste...",
    "profil": "Profil recherché...",
    "formation": "Bac+5 en génie civil",
    "experience": "3-5 ans",
    "lieu": {
      "ville": "Ouagadougou",
      "pays": "Burkina Faso"
    },
    "typeContrat": "cdi",
    "dateLimite": "2024-12-31"
  }'
```

## 📊 Étape 9 : Intégration frontend

### 9.1 **Modifier les scripts frontend**
Mettez à jour `js/backend-integration.js` pour utiliser les nouvelles routes :

```javascript
// Exemple pour les actualités
async getActualites() {
  try {
    const response = await fetch('http://localhost:5000/api/actualites');
    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error('Erreur lors de la récupération des actualités:', error);
    return [];
  }
}

// Exemple pour les logiciels
async getLogiciels() {
  try {
    const response = await fetch('http://localhost:5000/api/logiciels');
    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error('Erreur lors de la récupération des logiciels:', error);
    return [];
  }
}
```

### 9.2 **Interface d'administration**
Créez une interface d'administration simple pour :
- Gérer les actualités
- Gérer les logiciels
- Gérer les emplois
- Gérer les formations
- Voir les statistiques

## 🎯 Étape 10 : Données initiales

### 10.1 **Script de données initiales**
Créez `seed-data.js` pour ajouter des données de test :

```javascript
const mongoose = require('mongoose');
const Formation = require('./models/Formation');
const Actualite = require('./models/Actualite');
const Logiciel = require('./models/Logiciel');
const Emploi = require('./models/Emploi');
require('dotenv').config();

async function seedData() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('🗄️  Connecté à MongoDB Atlas');
    
    // Ajouter des formations
    const formations = await Formation.insertMany([
      {
        titre: 'Formation AutoCAD',
        description: 'Apprenez AutoCAD de A à Z',
        prix: 150000,
        duree: '5 jours',
        categorie: 'autocad',
        niveau: 'debutant'
      },
      {
        titre: 'Formation Covadis',
        description: 'Maîtrisez Covadis pour vos projets',
        prix: 120000,
        duree: '4 jours',
        categorie: 'covadis',
        niveau: 'intermediaire'
      }
    ]);
    
    // Ajouter des actualités
    const actualites = await Actualite.insertMany([
      {
        titre: 'Nouvelle formation AutoCAD disponible',
        contenu: 'Nous lançons une nouvelle formation AutoCAD...',
        resume: 'Formation AutoCAD complète disponible',
        categorie: 'formation',
        statut: 'publie'
      }
    ]);
    
    // Ajouter des logiciels
    const logiciels = await Logiciel.insertMany([
      {
        nom: 'AutoCAD 2024',
        description: 'Logiciel de CAO professionnel',
        categorie: 'autocad',
        prix: 150000,
        disponible: true
      }
    ]);
    
    // Ajouter des emplois
    const emplois = await Emploi.insertMany([
      {
        titre: 'Ingénieur Civil',
        entreprise: 'Sorbo Ingénierie',
        description: 'Nous recherchons un ingénieur civil...',
        profil: 'Profil recherché...',
        formation: 'Bac+5 en génie civil',
        experience: '3-5 ans',
        lieu: {
          ville: 'Ouagadougou',
          pays: 'Burkina Faso'
        },
        typeContrat: 'cdi',
        dateLimite: new Date('2024-12-31')
      }
    ]);
    
    console.log('✅ Données initiales créées avec succès !');
    process.exit(0);
  } catch (error) {
    console.error('❌ Erreur lors de la création des données:', error);
    process.exit(1);
  }
}

seedData();
```

### 10.2 **Exécuter le script**
```bash
cd backend
node seed-data.js
```

## 🎉 Félicitations !

Votre backend Sorbo Ingénierie est maintenant connecté à MongoDB Atlas avec :

✅ **Base de données cloud sécurisée**
✅ **Modèles de données structurés**
✅ **API REST complète**
✅ **Routes d'administration**
✅ **Tests automatisés**
✅ **Interface d'administration**
✅ **Données initiales**

**Votre application est prête pour la production !** 🚀

## 📋 Prochaines étapes

1. **Interface d'administration** : Créer une interface web pour gérer le contenu
2. **Authentification avancée** : Système de connexion sécurisé
3. **Upload de fichiers** : Gestion des images et documents
4. **Email automatique** : Notifications par email
5. **Monitoring** : Surveillance des performances
6. **Backup automatique** : Sauvegarde des données
7. **Déploiement** : Mise en production

## 🔧 Dépannage

### Problèmes courants :

**1. Erreur de connexion MongoDB :**
- Vérifiez l'URI de connexion
- Vérifiez les identifiants
- Vérifiez l'accès réseau

**2. Erreur de port :**
- Changez le port dans `.env`
- Vérifiez qu'aucun autre service n'utilise le port

**3. Erreur d'authentification :**
- Vérifiez le token admin
- Vérifiez les headers Authorization

**4. Erreur de validation :**
- Vérifiez les champs requis dans les modèles
- Vérifiez les types de données

## 📞 Support

Pour toute question ou problème :
1. Vérifiez les logs du serveur
2. Testez avec le script de test
3. Vérifiez la documentation MongoDB Atlas
4. Consultez les logs d'erreur

**Votre backend est maintenant prêt pour gérer tout le contenu de votre site web !** 🎯


