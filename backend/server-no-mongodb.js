const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

// Initialisation de l'application Express
const app = express();

// Middlewares de base
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Route de santé simple
app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    message: 'Serveur Sorbo Ingénierie fonctionnel (sans MongoDB)',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// Route de test
app.get('/api/test', (req, res) => {
  res.json({
    success: true,
    message: 'API fonctionnelle !',
    data: {
      formations: 3,
      contacts: 0,
      date: new Date().toISOString()
    }
  });
});

// Route formations avec données statiques
app.get('/api/formations', async (req, res) => {
  try {
    // Données de formations statiques
    const formations = [
      {
        id: 1,
        titre: "Formation AutoCAD",
        description: "Maîtrisez AutoCAD pour la conception technique. Apprenez à créer des plans 2D et 3D professionnels.",
        duree: "40 heures",
        niveau: "Débutant",
        prix: "800€",
        image: "images/autocad.jpg",
        categorie: "CAO"
      },
      {
        id: 2,
        titre: "Formation Revit",
        description: "Apprenez Revit pour la modélisation BIM. Créez des modèles 3D intelligents pour l'architecture.",
        duree: "35 heures",
        niveau: "Intermédiaire",
        prix: "900€",
        image: "images/revit.jpg",
        categorie: "BIM"
      },
      {
        id: 3,
        titre: "Formation SolidWorks",
        description: "Conception 3D avec SolidWorks. Développez vos compétences en modélisation mécanique.",
        duree: "45 heures",
        niveau: "Avancé",
        prix: "1000€",
        image: "images/solidworks.jpg",
        categorie: "CAO 3D"
      },
      {
        id: 4,
        titre: "Formation Covadis",
        description: "Spécialisez-vous en topographie avec Covadis. Créez des plans topographiques précis.",
        duree: "30 heures",
        niveau: "Débutant",
        prix: "700€",
        image: "images/covadis.jpg",
        categorie: "Topographie"
      },
      {
        id: 5,
        titre: "Formation SketchUp",
        description: "Modélisation 3D intuitive avec SketchUp. Parfait pour l'architecture et le design.",
        duree: "25 heures",
        niveau: "Débutant",
        prix: "600€",
        image: "images/sketchup.jpg",
        categorie: "3D"
      }
    ];

    res.json({
      success: true,
      message: 'Formations récupérées avec succès',
      data: formations,
      count: formations.length
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

// Route contact simple
app.post('/api/contact', (req, res) => {
  try {
    const { name, email, phone, subject, message } = req.body;
    
    // Validation simple
    if (!name || !email || !message) {
      return res.status(400).json({
        success: false,
        message: 'Nom, email et message sont requis'
      });
    }
    
    // Simuler l'enregistrement
    console.log('📞 Nouveau contact reçu:', { name, email, phone, subject, message });
    
    res.status(200).json({
      success: true,
      message: 'Contact reçu avec succès',
      data: {
        id: Date.now(),
        name,
        email,
        phone,
        subject,
        message,
        createdAt: new Date().toISOString()
      }
    });
  } catch (error) {
    console.error('Erreur contact:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de l\'envoi du contact',
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

app.listen(PORT, () => {
  console.log(`🚀 Serveur démarré sur le port ${PORT}`);
  console.log(`📊 Mode: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🔗 URL: http://localhost:${PORT}`);
  console.log(`✅ API Health: http://localhost:${PORT}/api/health`);
  console.log(`📞 Contact: http://localhost:${PORT}/api/contact`);
  console.log(`🎓 Formations: http://localhost:${PORT}/api/formations`);
}); 