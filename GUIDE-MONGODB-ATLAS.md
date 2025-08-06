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

# Email (optionnel)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=votre-email@gmail.com
EMAIL_PASS=votre-mot-de-passe-app
```

## 📦 Étape 3 : Installation des dépendances

### 3.1 **Mettre à jour package.json**
```bash
cd backend
npm install mongoose dotenv
```

### 3.2 **Nouveau package.json**
```json
{
  "name": "sorbo-ingenierie-backend",
  "version": "1.0.0",
  "description": "Backend Sorbo Ingénierie avec MongoDB Atlas",
  "main": "server.js",
  "scripts": {
    "start": "node server.js",
    "dev": "nodemon server.js",
    "test": "node test.js"
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

### 4.1 **Créer le dossier models**
```bash
mkdir models
```

### 4.2 **Modèle Contact**
Créez `models/Contact.js` :

```javascript
const mongoose = require('mongoose');

const contactSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Le nom est requis'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'L\'email est requis'],
    lowercase: true,
    trim: true
  },
  phone: {
    type: String,
    trim: true
  },
  subject: {
    type: String,
    required: [true, 'Le sujet est requis'],
    enum: ['ingenierie', 'formation', 'logiciel', 'carriere', 'autre']
  },
  message: {
    type: String,
    required: [true, 'Le message est requis'],
    trim: true
  },
  // Champs dynamiques pour projets d'ingénierie
  projectType: String,
  projectDescription: String,
  projectLocation: String,
  projectBudget: String,
  projectDeadline: Date,
  // Champs dynamiques pour formations
  formationType: String,
  formationParticipants: Number,
  formationStart: Date,
  formationDuration: String,
  // Métadonnées
  status: {
    type: String,
    enum: ['nouveau', 'en_cours', 'traite', 'archive'],
    default: 'nouveau'
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Middleware pour mettre à jour updatedAt
contactSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Contact', contactSchema);
```

### 4.3 **Modèle Formation**
Créez `models/Formation.js` :

```javascript
const mongoose = require('mongoose');

const formationSchema = new mongoose.Schema({
  titre: {
    type: String,
    required: [true, 'Le titre est requis'],
    trim: true
  },
  description: {
    type: String,
    required: [true, 'La description est requise'],
    trim: true
  },
  prix: {
    type: Number,
    required: [true, 'Le prix est requis'],
    min: 0
  },
  duree: {
    type: String,
    required: [true, 'La durée est requise']
  },
  categorie: {
    type: String,
    enum: ['autocad', 'covadis', 'robot', 'revit', 'genie-civil', 'hydraulique', 'autre'],
    default: 'autre'
  },
  niveau: {
    type: String,
    enum: ['debutant', 'intermediaire', 'avance'],
    default: 'debutant'
  },
  disponible: {
    type: Boolean,
    default: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Formation', formationSchema);
```

## 🔧 Étape 5 : Configuration de la base de données

### 5.1 **Créer config/database.js**
```javascript
const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log(`🗄️  MongoDB connecté: ${conn.connection.host}`);
    console.log(`📊 Base de données: ${conn.connection.name}`);
    
    return conn;
  } catch (error) {
    console.error('❌ Erreur de connexion MongoDB:', error.message);
    process.exit(1);
  }
};

module.exports = connectDB;
```

## 🚀 Étape 6 : Nouveau serveur avec MongoDB

### 6.1 **Créer server.js**
```javascript
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/database');
require('dotenv').config();

// Initialisation de l'application Express
const app = express();

// Connexion à MongoDB
connectDB();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Import des modèles
const Contact = require('./models/Contact');
const Formation = require('./models/Formation');

// Routes

// Route de santé
app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    message: 'Serveur Sorbo Ingénierie avec MongoDB',
    database: 'MongoDB Atlas',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// Route de test
app.get('/api/test', async (req, res) => {
  try {
    const contactsCount = await Contact.countDocuments();
    const formationsCount = await Formation.countDocuments();
    
    res.json({
      success: true,
      message: 'API fonctionnelle avec MongoDB !',
      data: {
        contacts: contactsCount,
        formations: formationsCount,
        date: new Date().toISOString()
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erreur lors du test',
      error: error.message
    });
  }
});

// Route de contact avec MongoDB
app.post('/api/contact', async (req, res) => {
  try {
    const { name, email, phone, subject, message, ...otherFields } = req.body;
    
    // Validation
    if (!name || !email || !message) {
      return res.status(400).json({
        success: false,
        message: 'Nom, email et message sont requis'
      });
    }
    
    // Créer le contact
    const contact = new Contact({
      name,
      email,
      phone,
      subject,
      message,
      ...otherFields
    });
    
    await contact.save();
    
    console.log('📞 Nouveau contact enregistré:', {
      id: contact._id,
      name: contact.name,
      email: contact.email,
      subject: contact.subject
    });
    
    res.status(201).json({
      success: true,
      message: 'Contact enregistré avec succès',
      data: {
        id: contact._id,
        name: contact.name,
        email: contact.email,
        phone: contact.phone,
        subject: contact.subject,
        createdAt: contact.createdAt
      }
    });
  } catch (error) {
    console.error('❌ Erreur lors de l\'enregistrement:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de l\'enregistrement',
      error: error.message
    });
  }
});

// Route des formations avec MongoDB
app.get('/api/formations', async (req, res) => {
  try {
    const formations = await Formation.find({ disponible: true })
      .select('titre description prix duree categorie niveau')
      .sort({ createdAt: -1 });
    
    res.json({
      success: true,
      data: formations
    });
  } catch (error) {
    console.error('❌ Erreur lors de la récupération des formations:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération des formations',
      error: error.message
    });
  }
});

// Route pour ajouter une formation (admin)
app.post('/api/formations', async (req, res) => {
  try {
    const { titre, description, prix, duree, categorie, niveau } = req.body;
    
    const formation = new Formation({
      titre,
      description,
      prix,
      duree,
      categorie,
      niveau
    });
    
    await formation.save();
    
    res.status(201).json({
      success: true,
      message: 'Formation ajoutée avec succès',
      data: formation
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erreur lors de l\'ajout de la formation',
      error: error.message
    });
  }
});

// Middleware de gestion des erreurs
app.use((err, req, res, next) => {
  console.error('❌ Erreur serveur:', err.message);
  res.status(500).json({
    success: false,
    message: 'Erreur serveur',
    error: process.env.NODE_ENV === 'development' ? err.message : 'Erreur interne'
  });
});

// Port et démarrage
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Serveur Sorbo Ingénierie avec MongoDB démarré sur le port ${PORT}`);
  console.log(`📊 Mode: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🔗 URL: http://localhost:${PORT}`);
  console.log(`✅ API Health: http://localhost:${PORT}/api/health`);
  console.log(`📞 Contact: http://localhost:${PORT}/api/contact`);
  console.log(`🎓 Formations: http://localhost:${PORT}/api/formations`);
});
```

## 🧪 Étape 7 : Script de test avec MongoDB

### 7.1 **Créer test-mongodb.js**
```javascript
const axios = require('axios');

const BASE_URL = 'http://localhost:5000';

console.log('🧪 Test MongoDB - Backend Sorbo Ingénierie\n');

// Test de connectivité
async function testHealth() {
  try {
    console.log('🔗 Test de connectivité...');
    const response = await axios.get(`${BASE_URL}/api/health`);
    console.log('✅ Serveur accessible');
    console.log(`   Status: ${response.data.status}`);
    console.log(`   Database: ${response.data.database}`);
    return true;
  } catch (error) {
    console.log('❌ Serveur inaccessible');
    console.log(`   Erreur: ${error.message}`);
    return false;
  }
}

// Test de l'API
async function testAPI() {
  try {
    console.log('\n📡 Test de l\'API...');
    const response = await axios.get(`${BASE_URL}/api/test`);
    console.log('✅ API fonctionnelle');
    console.log(`   Message: ${response.data.message}`);
    console.log(`   Contacts: ${response.data.data.contacts}`);
    console.log(`   Formations: ${response.data.data.formations}`);
    return true;
  } catch (error) {
    console.log('❌ API non fonctionnelle');
    console.log(`   Erreur: ${error.message}`);
    return false;
  }
}

// Test de création d'un contact
async function testContact() {
  try {
    console.log('\n📞 Test de création d\'un contact...');
    const contactData = {
      name: 'Test User MongoDB',
      email: 'test-mongodb@sorbo-ingenierie.com',
      phone: '+1234567890',
      subject: 'formation',
      message: 'Test avec MongoDB Atlas'
    };
    
    const response = await axios.post(`${BASE_URL}/api/contact`, contactData);
    console.log('✅ Contact créé avec succès');
    console.log(`   Status: ${response.status}`);
    console.log(`   ID: ${response.data.data.id}`);
    console.log(`   Message: ${response.data.message}`);
    return true;
  } catch (error) {
    console.log('❌ Erreur lors de la création du contact');
    console.log(`   Erreur: ${error.response?.data?.message || error.message}`);
    return false;
  }
}

// Test des formations
async function testFormations() {
  try {
    console.log('\n🎓 Test de récupération des formations...');
    const response = await axios.get(`${BASE_URL}/api/formations`);
    console.log('✅ Formations récupérées avec succès');
    console.log(`   Nombre de formations: ${response.data.data.length}`);
    return true;
  } catch (error) {
    console.log('❌ Erreur lors de la récupération des formations');
    console.log(`   Erreur: ${error.response?.data?.message || error.message}`);
    return false;
  }
}

// Fonction principale
async function runTests() {
  console.log('🚀 Démarrage des tests MongoDB...\n');
  
  const tests = [
    { name: 'Connectivité', fn: testHealth },
    { name: 'API', fn: testAPI },
    { name: 'Contact', fn: testContact },
    { name: 'Formations', fn: testFormations }
  ];
  
  let passed = 0;
  let failed = 0;
  
  for (const test of tests) {
    const result = await test.fn();
    if (result) {
      passed++;
    } else {
      failed++;
    }
  }
  
  // Résumé
  console.log('\n📊 Résumé des tests');
  console.log(`✅ Tests réussis: ${passed}`);
  console.log(`❌ Tests échoués: ${failed}`);
  
  if (failed === 0) {
    console.log('\n🎉 Tous les tests sont passés !');
    console.log('\n🎯 Votre backend avec MongoDB Atlas fonctionne parfaitement !');
  } else {
    console.log('\n⚠️  Certains tests ont échoué.');
  }
}

// Exécuter les tests
runTests().catch(error => {
  console.log(`\n💥 Erreur lors des tests: ${error.message}`);
  process.exit(1);
});
```

## 📊 Étape 8 : Script de données initiales

### 8.1 **Créer seed-data.js**
```javascript
const mongoose = require('mongoose');
const Formation = require('./models/Formation');
require('dotenv').config();

const formationsData = [
  {
    titre: 'Formation AutoCAD',
    description: 'Apprenez AutoCAD de A à Z avec nos experts certifiés. Formation complète incluant la modélisation 2D et 3D.',
    prix: 150000,
    duree: '5 jours',
    categorie: 'autocad',
    niveau: 'debutant'
  },
  {
    titre: 'Formation Covadis',
    description: 'Maîtrisez Covadis pour vos projets de génie civil. Formation spécialisée en conception routière et hydraulique.',
    prix: 120000,
    duree: '4 jours',
    categorie: 'covadis',
    niveau: 'intermediaire'
  },
  {
    titre: 'Formation Robot Structural Analysis',
    description: 'Analysez vos structures avec Robot. Formation avancée en calcul de structures et dimensionnement.',
    prix: 200000,
    duree: '6 jours',
    categorie: 'robot',
    niveau: 'avance'
  },
  {
    titre: 'Formation Revit Architecture',
    description: 'Créez des modèles 3D avec Revit. Formation complète en BIM et modélisation architecturale.',
    prix: 180000,
    duree: '5 jours',
    categorie: 'revit',
    niveau: 'intermediaire'
  },
  {
    titre: 'Génie Civil - Fondations',
    description: 'Spécialisation en conception de fondations. Formation technique pour ingénieurs et techniciens.',
    prix: 100000,
    duree: '3 jours',
    categorie: 'genie-civil',
    niveau: 'avance'
  },
  {
    titre: 'Hydraulique Urbaine',
    description: 'Conception de réseaux d\'assainissement et d\'adduction d\'eau. Formation spécialisée en hydraulique.',
    prix: 130000,
    duree: '4 jours',
    categorie: 'hydraulique',
    niveau: 'intermediaire'
  }
];

async function seedData() {
  try {
    // Connexion à MongoDB
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    
    console.log('🗄️  Connecté à MongoDB Atlas');
    
    // Supprimer les données existantes
    await Formation.deleteMany({});
    console.log('🗑️  Anciennes formations supprimées');
    
    // Insérer les nouvelles données
    const formations = await Formation.insertMany(formationsData);
    console.log(`✅ ${formations.length} formations ajoutées`);
    
    // Afficher les formations ajoutées
    formations.forEach(formation => {
      console.log(`   - ${formation.titre} (${formation.prix} FCFA)`);
    });
    
    console.log('\n🎉 Données initiales créées avec succès !');
    process.exit(0);
  } catch (error) {
    console.error('❌ Erreur lors de la création des données:', error);
    process.exit(1);
  }
}

seedData();
```

## 🚀 Étape 9 : Instructions de déploiement

### 9.1 **Installation et configuration**
```bash
# 1. Installer les dépendances
cd backend
npm install

# 2. Configurer les variables d'environnement
# Créer le fichier .env avec vos données MongoDB Atlas

# 3. Ajouter les données initiales
node seed-data.js

# 4. Démarrer le serveur
npm run dev

# 5. Tester l'API
node test-mongodb.js
```

### 9.2 **Structure finale du projet**
```
backend/
├── config/
│   └── database.js
├── models/
│   ├── Contact.js
│   └── Formation.js
├── server.js
├── test-mongodb.js
├── seed-data.js
├── package.json
└── .env
```

## 🎯 Avantages de MongoDB Atlas

### ✅ **Avantages**
- **Gratuit** : 512MB de stockage gratuit
- **Scalable** : Évolue selon vos besoins
- **Sécurisé** : Chiffrement et authentification
- **Backup automatique** : Sauvegarde quotidienne
- **Monitoring** : Tableaux de bord intégrés
- **Géolocalisation** : Serveurs dans le monde entier

### 🔧 **Fonctionnalités**
- **CRUD complet** : Create, Read, Update, Delete
- **Validation** : Schémas avec validation
- **Indexation** : Recherche rapide
- **Agrégation** : Requêtes complexes
- **Transactions** : Intégrité des données

## 📈 Prochaines étapes

1. **Déploiement** : Mettre le backend en production
2. **Email** : Configurer l'envoi automatique
3. **Authentification** : Système de connexion admin
4. **Paiement** : Intégration de moyens de paiement
5. **Monitoring** : Surveillance des performances

## 🎉 Félicitations !

Votre backend Sorbo Ingénierie est maintenant connecté à MongoDB Atlas avec :
- ✅ Base de données cloud sécurisée
- ✅ Modèles de données structurés
- ✅ API REST complète
- ✅ Tests automatisés
- ✅ Données initiales
- ✅ Documentation complète

**Votre application est prête pour la production !** 🚀 