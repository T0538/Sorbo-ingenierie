# 🗄️ GUIDE COMPLET MONGODB - Gestion des Logiciels

## 📋 **Structure de la Base de Données**

### **Collection : `logiciels`**

Chaque logiciel est un document avec la structure suivante :

```json
{
  "_id": "ObjectId généré automatiquement",
  "nom": "Nom du logiciel",
  "description": "Description détaillée",
  "categorie": "Catégorie du logiciel",
  "version": "Version du logiciel",
  "prix": "Prix ou 'Gratuit'",
  "headerImage": "URL de l'image d'en-tête",
  "fonctionnalites": ["Fonction 1", "Fonction 2", "Fonction 3"],
  "downloadUrl": "URL de téléchargement",
  "trialUrl": "URL de version d'essai (optionnel)",
  "dateCreation": "Date de création",
  "actif": true
}
```

---

## 🚀 **EXEMPLES DE LOGICIELS À AJOUTER**

### **1. Logiciel "OH - Route" (existant)**
```json
{
  "nom": "OH - Route",
  "description": "Construire rapidement des modèles HEC-RAS 1D/2D pour l'analyse hydraulique et la cartographie des inondations.",
  "categorie": "AUTRE",
  "version": "V2024",
  "prix": "Gratuit",
  "headerImage": "https://images.unsplash.com/photo-1555066931-4365d14bab8c?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80",
  "fonctionnalites": [
    "Modèles 1D/2D",
    "Cartes inondations",
    "Analyse hydraulique",
    "Gestion des projets"
  ],
  "downloadUrl": "https://example.com/oh-route-download",
  "trialUrl": "https://example.com/oh-route-trial",
  "dateCreation": "2024-01-15",
  "actif": true
}
```

### **2. Nouveau Logiciel "Drainage Pro"**
```json
{
  "nom": "Drainage Pro",
  "description": "Logiciel professionnel pour la conception et l'analyse des systèmes de drainage routier et urbain avec calculs hydrauliques avancés.",
  "categorie": "HYDRAULIQUE",
  "version": "V3.2",
  "prix": "299€",
  "headerImage": "https://images.unsplash.com/photo-1555066931-4365d14bab8c?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80",
  "fonctionnalites": [
    "Conception de réseaux",
    "Calculs hydrauliques",
    "Simulation 3D",
    "Rapports automatiques"
  ],
  "downloadUrl": "https://example.com/drainage-pro-download",
  "trialUrl": "https://example.com/drainage-pro-trial",
  "dateCreation": "2024-01-20",
  "actif": true
}
```

### **3. Logiciel "BIM Constructor"**
```json
{
  "nom": "BIM Constructor",
  "description": "Plateforme BIM complète pour la modélisation 3D, la collaboration et la gestion de projets de construction.",
  "categorie": "BIM",
  "version": "V2024.1",
  "prix": "599€",
  "headerImage": "https://images.unsplash.com/photo-1555066931-4365d14bab8c?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80",
  "fonctionnalites": [
    "Modélisation 3D",
    "Collaboration en temps réel",
    "Gestion des conflits",
    "Export multi-formats"
  ],
  "downloadUrl": "https://example.com/bim-constructor-download",
  "trialUrl": "https://example.com/bim-constructor-trial",
  "dateCreation": "2024-01-25",
  "actif": true
}
```

---

## 🛠️ **COMMANDES MONGODB ESSENTIELLES**

### **Connexion à MongoDB**
```bash
# Connexion locale
mongosh

# Connexion à MongoDB Atlas
mongosh "mongodb+srv://username:password@cluster.mongodb.net/database"
```

### **Sélection de la base de données**
```javascript
use sorbo_logiciels
```

---

## ➕ **AJOUTER UN LOGICIEL**

### **Méthode 1 : Insertion simple**
```javascript
db.logiciels.insertOne({
  "nom": "Nouveau Logiciel",
  "description": "Description du nouveau logiciel",
  "categorie": "CATEGORIE",
  "version": "V1.0",
  "prix": "Gratuit",
  "headerImage": "https://example.com/image.jpg",
  "fonctionnalites": ["Fonction 1", "Fonction 2"],
  "downloadUrl": "https://example.com/download",
  "dateCreation": new Date(),
  "actif": true
})
```

### **Méthode 2 : Insertion multiple**
```javascript
db.logiciels.insertMany([
  {
    "nom": "Logiciel 1",
    "description": "Description 1",
    "categorie": "CAT1",
    "version": "V1.0",
    "prix": "Gratuit",
    "headerImage": "https://example.com/img1.jpg",
    "fonctionnalites": ["F1", "F2"],
    "downloadUrl": "https://example.com/dl1",
    "dateCreation": new Date(),
    "actif": true
  },
  {
    "nom": "Logiciel 2",
    "description": "Description 2",
    "categorie": "CAT2",
    "version": "V2.0",
    "prix": "199€",
    "headerImage": "https://example.com/img2.jpg",
    "fonctionnalites": ["F3", "F4"],
    "downloadUrl": "https://example.com/dl2",
    "dateCreation": new Date(),
    "actif": true
  }
])
```

---

## 🔍 **CONSULTER LES LOGICIELS**

### **Afficher tous les logiciels**
```javascript
db.logiciels.find()
```

### **Afficher avec formatage**
```javascript
db.logiciels.find().pretty()
```

### **Filtrer par catégorie**
```javascript
db.logiciels.find({"categorie": "HYDRAULIQUE"})
```

### **Rechercher par nom**
```javascript
db.logiciels.find({"nom": {$regex: "Route", $options: "i"}})
```

### **Compter les logiciels**
```javascript
db.logiciels.countDocuments()
```

---

## ✏️ **MODIFIER UN LOGICIEL**

### **Mettre à jour un champ spécifique**
```javascript
db.logiciels.updateOne(
  {"nom": "OH - Route"},
  {$set: {"version": "V2024.2"}}
)
```

### **Mettre à jour plusieurs champs**
```javascript
db.logiciels.updateOne(
  {"nom": "OH - Route"},
  {
    $set: {
      "version": "V2024.2",
      "description": "Nouvelle description mise à jour",
      "prix": "99€"
    }
  }
)
```

### **Mettre à jour plusieurs documents**
```javascript
db.logiciels.updateMany(
  {"categorie": "HYDRAULIQUE"},
  {$set: {"categorie": "EAU"}}
)
```

---

## 🗑️ **SUPPRIMER UN LOGICIEL**

### **Supprimer un logiciel spécifique**
```javascript
db.logiciels.deleteOne({"nom": "Logiciel à supprimer"})
```

### **Supprimer par ID**
```javascript
db.logiciels.deleteOne({"_id": ObjectId("64f8a1b2c3d4e5f6a7b8c9d0")})
```

### **Supprimer plusieurs logiciels**
```javascript
db.logiciels.deleteMany({"categorie": "CATEGORIE"})
```

### **Supprimer tous les logiciels (⚠️ ATTENTION !)**
```javascript
db.logiciels.deleteMany({})
```

---

## 📊 **REQUÊTES AVANCÉES**

### **Trier par nom**
```javascript
db.logiciels.find().sort({"nom": 1})  // 1 = ascendant, -1 = descendant
```

### **Limiter le nombre de résultats**
```javascript
db.logiciels.find().limit(5)
```

### **Pagination**
```javascript
db.logiciels.find().skip(10).limit(5)  // Page 3 (résultats 11-15)
```

### **Agrégation - Compter par catégorie**
```javascript
db.logiciels.aggregate([
  {
    $group: {
      "_id": "$categorie",
      "count": {$sum: 1}
    }
  }
])
```

### **Recherche textuelle**
```javascript
db.logiciels.find({
  $text: {
    $search: "hydraulique inondation"
  }
})
```

---

## 🔧 **GESTION DES INDEXES**

### **Créer un index sur le nom**
```javascript
db.logiciels.createIndex({"nom": 1})
```

### **Créer un index textuel**
```javascript
db.logiciels.createIndex({
  "nom": "text",
  "description": "text"
})
```

### **Lister les index**
```javascript
db.logiciels.getIndexes()
```

---

## 📱 **INTERFACE WEB - MongoDB Compass**

### **Avantages de MongoDB Compass :**
- ✅ Interface graphique intuitive
- ✅ Visualisation des données
- ✅ Éditeur de requêtes visuel
- ✅ Gestion des index
- ✅ Monitoring des performances

### **Téléchargement :**
```
https://www.mongodb.com/try/download/compass
```

---

## 🚨 **BONNES PRATIQUES**

### **1. Sécurité**
- Utilisez des utilisateurs avec des permissions limitées
- Activez l'authentification
- Utilisez des connexions SSL/TLS

### **2. Sauvegarde**
```bash
# Sauvegarde locale
mongodump --db sorbo_logiciels --out backup/

# Restauration
mongorestore --db sorbo_logiciels backup/sorbo_logiciels/
```

### **3. Validation des données**
```javascript
db.createCollection("logiciels", {
  validator: {
    $jsonSchema: {
      required: ["nom", "description", "categorie"],
      properties: {
        nom: { type: "string", minLength: 2 },
        prix: { type: "string" },
        actif: { type: "bool" }
      }
    }
  }
})
```

---

## 📞 **SUPPORT ET AIDE**

### **En cas de problème :**
1. Vérifiez la connexion à MongoDB
2. Consultez les logs d'erreur
3. Testez vos requêtes dans MongoDB Compass
4. Vérifiez la syntaxe des commandes

### **Ressources utiles :**
- 📚 [Documentation MongoDB officielle](https://docs.mongodb.com/)
- 🎥 [Tutoriels vidéo MongoDB](https://university.mongodb.com/)
- 💬 [Forum MongoDB](https://developer.mongodb.com/community/forums/)

---

## 🎯 **PROCHAINES ÉTAPES**

1. **Testez les commandes** dans MongoDB Compass
2. **Ajoutez vos logiciels** avec la structure fournie
3. **Personnalisez les images** d'en-tête
4. **Testez l'affichage** sur votre site web
5. **Mettez en place** des sauvegardes régulières

**Bonne gestion de votre base de données ! 🚀**
