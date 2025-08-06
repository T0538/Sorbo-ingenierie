const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

// Initialisation de l'application Express
const app = express();

// Middlewares de base
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Configuration de la connexion à MongoDB
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/sorbo-ingenierie');
    console.log(`✅ MongoDB connecté: ${conn.connection.host}`);
  } catch (error) {
    console.error(`❌ Erreur de connexion à MongoDB: ${error.message}`);
    process.exit(1);
  }
};

// Route de santé simple
app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    message: 'Serveur Sorbo Ingénierie fonctionnel',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// Route de test
app.get('/api/test', (req, res) => {
  res.json({
    success: true,
    message: 'API fonctionnelle !',
    data: {
      formations: 0,
      contacts: 0,
      date: new Date().toISOString()
    }
  });
});

// Route formations simple
app.get('/api/formations', async (req, res) => {
  try {
    // Données de test pour formations
    const formations = [
      {
        id: 1,
        titre: "Formation AutoCAD",
        description: "Maîtrisez AutoCAD pour la conception technique",
        duree: "40 heures",
        niveau: "Débutant",
        prix: "800€",
        image: "images/autocad.jpg"
      },
      {
        id: 2,
        titre: "Formation Revit",
        description: "Apprenez Revit pour la modélisation BIM",
        duree: "35 heures",
        niveau: "Intermédiaire",
        prix: "900€",
        image: "images/revit.jpg"
      },
      {
        id: 3,
        titre: "Formation SolidWorks",
        description: "Conception 3D avec SolidWorks",
        duree: "45 heures",
        niveau: "Avancé",
        prix: "1000€",
        image: "images/solidworks.jpg"
      }
    ];

    res.json({
      success: true,
      message: 'Formations récupérées avec succès',
      data: formations
    });
  } catch (error) {
    console.error('Erreur formations:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération des formations',
      error: error.message
    });
  }
});

// Servir les fichiers statiques en production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../')));
  
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../', 'index.html'));
  });
}

// Middleware de gestion des erreurs simple
app.use((err, req, res, next) => {
  console.error('Erreur:', err.message);
  res.status(500).json({
    success: false,
    message: 'Erreur serveur',
    error: process.env.NODE_ENV === 'development' ? err.message : 'Erreur interne'
  });
});

// Port et démarrage du serveur
const PORT = process.env.PORT || 5000;

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`🚀 Serveur démarré sur le port ${PORT}`);
    console.log(`📊 Mode: ${process.env.NODE_ENV || 'development'}`);
    console.log(`🔗 URL: http://localhost:${PORT}`);
    console.log(`✅ API Health: http://localhost:${PORT}/api/health`);
  });
}); 