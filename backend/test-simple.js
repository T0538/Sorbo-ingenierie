const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();

// CORS simple
app.use(cors());
app.use(express.json());

// Route de test simple
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: 'API fonctionne correctement',
    timestamp: new Date().toISOString()
  });
});

// Route de test formations
app.get('/api/formations', (req, res) => {
  res.json({
    success: true,
    data: [
      {
        id: 1,
        title: 'Formation AutoCAD 2024',
        type: 'autocad',
        duration: 5,
        price: 250000,
        description: 'Formation complète AutoCAD 2024'
      }
    ]
  });
});

// Route de test logiciels
app.get('/api/logiciels', (req, res) => {
  res.json({
    success: true,
    data: [
      {
        id: 1,
        nom: 'SorboPillar v1.1',
        description: 'Logiciel géotechnique',
        categorie: 'Géotechnique',
        version: '1.1',
        prix: 'Gratuit',
        image: 'images/sorbo-pillar.jpg'
      }
    ]
  });
});

// Route de test actualités
app.get('/api/actualites', (req, res) => {
  res.json({
    success: true,
    data: [
      {
        id: 1,
        titre: 'Nouvelle formation disponible',
        description: 'Formation AutoCAD 2024 maintenant disponible',
        date: new Date().toISOString(),
        categorie: 'Formation',
        auteur: 'Sorbo Ingénierie',
        image: 'images/formation-autocad.jpg',
        tags: ['AutoCAD', 'Formation', '2024']
      }
    ]
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Serveur de test démarré sur le port ${PORT}`);
  console.log(`📡 API disponible sur http://localhost:${PORT}`);
  console.log(`🔗 Health check: http://localhost:${PORT}/api/health`);
});
