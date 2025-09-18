# 📚 Guide d'Administration MongoDB Atlas - Formations

## 🎯 **Méthode 1 : Interface Web MongoDB Atlas (Recommandée)**

### **Étape 1 : Accéder à MongoDB Atlas**
1. Allez sur [https://cloud.mongodb.com](https://cloud.mongodb.com)
2. Connectez-vous avec vos identifiants
3. Sélectionnez votre cluster "Sorbo-ingenierie"

### **Étape 2 : Accéder aux données**
1. Cliquez sur **"Browse Collections"** dans le menu de gauche
2. Sélectionnez la base de données **"test"**
3. Cliquez sur la collection **"formations"**

### **Étape 3 : Ajouter une formation**
1. Cliquez sur **"Insert Document"**
2. Copiez ce modèle et modifiez les valeurs :

```json
{
  "title": "Nouvelle Formation",
  "category": "technique",
  "type": "autocad",
  "description": "Description de la formation",
  "objectives": ["Objectif 1", "Objectif 2"],
  "prerequisites": ["Prérequis 1"],
  "duration": 5,
  "price": 150000,
  "discount": 0,
  "locations": ["nos-locaux"],
  "image": "",
  "syllabus": [
    {
      "title": "Module 1",
      "content": ["Contenu 1", "Contenu 2"]
    }
  ],
  "upcomingSessions": [
    {
      "startDate": "2025-01-15T00:00:00.000Z",
      "endDate": "2025-01-20T00:00:00.000Z",
      "location": "nos-locaux",
      "availableSeats": 12,
      "status": "planifiee"
    }
  ],
  "rating": {
    "average": 0,
    "count": 0
  },
  "testimonials": [],
  "active": true,
  "featured": false
}
```

### **Étape 4 : Modifier une formation**
1. Cliquez sur le document à modifier
2. Modifiez les champs souhaités
3. Cliquez sur **"Update"**

### **Étape 5 : Supprimer une formation**
1. Cliquez sur le document à supprimer
2. Cliquez sur **"Delete"**
3. Confirmez la suppression

---

## 🎯 **Méthode 2 : Scripts Node.js (Pour utilisateurs avancés)**

### **Script pour ajouter une formation**
```javascript
// add-formation.js
const mongoose = require('mongoose');
require('dotenv').config();

const Formation = require('./models/Formation');

async function addFormation() {
    try {
        // Connexion à MongoDB
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('✅ Connecté à MongoDB Atlas');

        // Nouvelle formation
        const newFormation = new Formation({
            title: "Formation AutoCAD Avancé",
            category: "logiciel",
            type: "autocad",
            description: "Formation avancée sur AutoCAD pour professionnels",
            objectives: ["Maîtriser les fonctionnalités avancées", "Automatiser les tâches répétitives"],
            prerequisites: ["Connaissance de base d'AutoCAD"],
            duration: 7,
            price: 250000,
            discount: 10,
            locations: ["nos-locaux", "client"],
            active: true,
            featured: true
        });

        // Sauvegarder
        const savedFormation = await newFormation.save();
        console.log('✅ Formation ajoutée:', savedFormation.title);
        
        mongoose.connection.close();
    } catch (error) {
        console.error('❌ Erreur:', error);
    }
}

addFormation();
```

### **Script pour supprimer une formation**
```javascript
// delete-formation.js
const mongoose = require('mongoose');
require('dotenv').config();

const Formation = require('./models/Formation');

async function deleteFormation(formationId) {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('✅ Connecté à MongoDB Atlas');

        const deletedFormation = await Formation.findByIdAndDelete(formationId);
        
        if (deletedFormation) {
            console.log('✅ Formation supprimée:', deletedFormation.title);
        } else {
            console.log('❌ Formation non trouvée');
        }
        
        mongoose.connection.close();
    } catch (error) {
        console.error('❌ Erreur:', error);
    }
}

// Utilisation: deleteFormation('ID_DE_LA_FORMATION');
```

---

## 🎯 **Méthode 3 : API REST (Pour développeurs)**

### **Ajouter une formation via API**
```bash
curl -X POST http://localhost:5000/api/formations \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Nouvelle Formation",
    "category": "technique",
    "type": "autocad",
    "description": "Description",
    "duration": 5,
    "price": 150000,
    "active": true
  }'
```

### **Supprimer une formation via API**
```bash
curl -X DELETE http://localhost:5000/api/formations/FORMATION_ID
```

---

## 📊 **Types de formations disponibles**

### **Catégories (category) :**
- `logiciel` - Formations logiciels
- `technique` - Formations techniques
- `methodologie` - Méthodologies
- `certification` - Certifications

### **Types (type) :**
- `autocad` - AutoCAD
- `covadis` - Covadis
- `robot` - Robot Structural Analysis
- `revit` - Revit Architecture
- `genie-civil` - Génie Civil
- `hydraulique` - Hydraulique

### **Statuts (status) :**
- `planifiee` - Planifiée
- `confirmee` - Confirmée
- `terminee` - Terminée
- `annulee` - Annulée

---

## 🔧 **Utilisation des scripts**

### **Pour ajouter une formation :**
```bash
cd backend
node add-formation.js
```

### **Pour supprimer une formation :**
```bash
cd backend
node delete-formation.js
```

---

## 💡 **Conseils pour débutants**

1. **Commencez par l'interface web** - Plus simple pour débuter
2. **Faites des sauvegardes** - Exportez vos données régulièrement
3. **Testez d'abord** - Utilisez un environnement de test
4. **Documentez vos changements** - Notez ce que vous modifiez

---

## 🆘 **En cas de problème**

### **Erreur de connexion :**
- Vérifiez votre connexion internet
- Vérifiez vos identifiants MongoDB Atlas

### **Erreur de données :**
- Vérifiez le format JSON
- Assurez-vous que tous les champs requis sont présents

### **Formation non visible :**
- Vérifiez que `active: true`
- Vérifiez que la formation est bien sauvegardée 