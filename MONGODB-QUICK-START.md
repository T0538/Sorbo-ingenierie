# 🚀 MONGODB - GUIDE RAPIDE

## 📋 **COMMANDES ESSENTIELLES**

### **1. AJOUTER UN LOGICIEL**
```javascript
db.logiciels.insertOne({
  "nom": "Drainage Pro",
  "description": "Logiciel de drainage routier",
  "categorie": "HYDRAULIQUE",
  "version": "V3.2",
  "prix": "299€",
  "headerImage": "https://example.com/image.jpg",
  "fonctionnalites": ["Réseaux", "Calculs", "3D"],
  "downloadUrl": "https://example.com/download",
  "actif": true
})
```

### **2. VOIR TOUS LES LOGICIELS**
```javascript
db.logiciels.find().pretty()
```

### **3. MODIFIER UN LOGICIEL**
```javascript
db.logiciels.updateOne(
  {"nom": "OH - Route"},
  {$set: {"version": "V2024.2"}}
)
```

### **4. SUPPRIMER UN LOGICIEL**
```javascript
db.logiciels.deleteOne({"nom": "Nom du logiciel"})
```

## 🎯 **EXEMPLES CONCRETS**

### **Ajouter "Drainage Pro"**
```javascript
db.logiciels.insertOne({
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
  "dateCreation": new Date(),
  "actif": true
})
```

### **Ajouter "BIM Constructor"**
```javascript
db.logiciels.insertOne({
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
  "dateCreation": new Date(),
  "actif": true
})
```

## 🔍 **RECHERCHES UTILES**

### **Trouver par catégorie**
```javascript
db.logiciels.find({"categorie": "HYDRAULIQUE"})
```

### **Trouver par nom (recherche partielle)**
```javascript
db.logiciels.find({"nom": {$regex: "Drainage", $options: "i"}})
```

### **Compter les logiciels**
```javascript
db.logiciels.countDocuments()
```

## ⚠️ **ATTENTION**

- **Sauvegardez** avant de supprimer
- **Testez** vos requêtes d'abord
- **Vérifiez** la syntaxe des commandes

## 🎯 **PROCHAINES ÉTAPES**

1. **Connectez-vous** à MongoDB
2. **Ajoutez** vos logiciels avec les exemples
3. **Testez** l'affichage sur votre site
4. **Personnalisez** les images d'en-tête
