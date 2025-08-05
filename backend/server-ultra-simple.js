const express = require('express');
const cors = require('cors');
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

// Route de contact simple (sans base de données)
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
    res.status(500).json({
      success: false,
      message: 'Erreur serveur',
      error: error.message
    });
  }
});

// Route de formations simple
app.get('/api/formations', (req, res) => {
  res.json({
    success: true,
    data: [
      {
        id: 1,
        titre: 'Formation AutoCAD',
        description: 'Apprenez AutoCAD de A à Z',
        prix: 500,
        duree: '3 jours'
      },
      {
        id: 2,
        titre: 'Formation Covadis',
        description: 'Maîtrisez Covadis',
        prix: 400,
        duree: '2 jours'
      }
    ]
  });
});

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
  console.log(`🚀 Serveur ultra-simple démarré sur le port ${PORT}`);
  console.log(`📊 Mode: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🔗 URL: http://localhost:${PORT}`);
  console.log(`✅ API Health: http://localhost:${PORT}/api/health`);
  console.log(`📞 Contact: http://localhost:${PORT}/api/contact`);
  console.log(`🎓 Formations: http://localhost:${PORT}/api/formations`);
}); 