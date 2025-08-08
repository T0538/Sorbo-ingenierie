const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();

// CORS sécurisé avec validation d'origine
const allowedOrigins = [
  process.env.FRONTEND_URL,
  'https://sorbo-ingenierie.netlify.app',
  'https://sorbo-ingenierie.vercel.app',
  'http://localhost:3000',
  'http://localhost:5000',
  'http://localhost:8080',
  'http://127.0.0.1:5500',
  'http://127.0.0.1:3000'
].filter(Boolean);

app.use(cors({
  origin: function (origin, callback) {
    // Autoriser requêtes sans en-tête Origin (curl, santé Railway, etc.)
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) return callback(null, true);
    // Refuser silencieusement (pas d'erreur 500)
    return callback(null, false);
  },
  credentials: true,
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Route de santé (ne doit jamais renvoyer 500)
app.get('/api/health', (req, res) => {
  try {
    res.status(200).json({
      success: true,
      message: 'API Sorbo Ingénierie fonctionne correctement',
      timestamp: new Date().toISOString(),
      version: '1.0.2'
    });
  } catch (e) {
    // Réponse de secours
    res.status(200).json({ success: true, message: 'OK' });
  }
});

// Route formations
app.get('/api/formations', (req, res) => {
  const formations = [
    {
      id: 1,
      title: 'Formation AutoCAD 2024',
      type: 'autocad',
      duration: 5,
      price: 250000,
      description: 'Formation complète AutoCAD 2024 pour professionnels',
      category: 'Architecture',
      location: 'Abidjan, Cocody'
    },
    {
      id: 2,
      title: 'Formation Revit Architecture',
      type: 'revit',
      duration: 7,
      price: 350000,
      description: 'Formation Revit Architecture pour la modélisation 3D',
      category: 'Architecture',
      location: 'Abidjan, Plateau'
    },
    {
      id: 3,
      title: 'Formation Covadis',
      type: 'covadis',
      duration: 4,
      price: 200000,
      description: 'Formation Covadis pour l\'ingénierie routière',
      category: 'Ingénierie routière',
      location: 'En ligne'
    },
    {
      id: 4,
      title: 'Formation SolidWorks',
      type: 'solidworks',
      duration: 6,
      price: 300000,
      description: 'Formation SolidWorks pour la conception mécanique',
      category: 'Génie mécanique',
      location: 'Abidjan, Zone 4'
    }
  ];

  res.json({
    success: true,
    data: formations
  });
});

// Route logiciels
app.get('/api/logiciels', (req, res) => {
  const logiciels = [
    {
      id: 1,
      nom: 'SorboPillar v1.1',
      description: 'Logiciel d\'aide à la conception et au dimensionnement géotechnique des bâtiments et d\'ouvrages d\'arts selon les Eurocodes et les anciens règlements.',
      categorie: 'Géotechnique',
      version: '1.1',
      prix: 'Gratuit',
      image: 'images/sorbo-pillar.jpg',
      fonctionnalites: ['Facile à apprendre', 'Interagir graphiquement', 'Calculs précis'],
      downloadUrl: '#',
      trialUrl: '#'
    },
    {
      id: 2,
      nom: 'SorboOH-Route v1.1',
      description: 'Logiciel d\'aide à la conception et au dimensionnement ouvrages hydrauliques selon les méthodes rationnelles, Orstorm et CIEH.',
      categorie: 'Hydraulique',
      version: '1.1',
      prix: 'Gratuit',
      image: 'images/sorbo-oh-route.jpg',
      fonctionnalites: ['Travailler sur carte', 'Google Maps intégré', 'Calculs hydrauliques'],
      downloadUrl: '#',
      trialUrl: '#'
    },
    {
      id: 3,
      nom: 'SorboPillar Beta',
      description: 'Logiciel d\'aide à la conception et au dimensionnement géotechnique des bâtiments et d\'ouvrages d\'arts selon les Eurocodes.',
      categorie: 'Géotechnique',
      version: 'Beta',
      prix: 'Gratuit',
      image: 'images/sorbo-pillar-beta.jpg',
      fonctionnalites: ['Intégration CAO', 'AutoCAD compatible', 'Calculs avancés'],
      downloadUrl: '#',
      trialUrl: '#'
    }
  ];

  res.json({
    success: true,
    data: logiciels
  });
});

// Route actualités
app.get('/api/actualites', (req, res) => {
  const actualites = [
    {
      id: 1,
      titre: 'Formation Covadis',
      description: 'Formation sur le logiciel Covadis pour la Société Ivoirienne de Construction : une révolution technologique pour le génie civil.',
      contenu: 'Dans un secteur en pleine mutation, où la précision et l\'efficacité des calculs sont devenues essentielles, la Société Ivoirienne de Construction a choisi Sorbo Ingénierie pour former ses équipes au logiciel Covadis.',
      date: '2025-05-11T10:00:00.000Z',
      categorie: 'Formation',
      auteur: 'kevinyameogo01@gmail.com',
      image: 'https://images.unsplash.com/photo-1517026575980-3e1e2dedeac4?ixlib=rb-1.2.1&auto=format&fit=crop&w=1050&q=80',
      tags: ['Covadis', 'Formation', 'Génie civil']
    },
    {
      id: 2,
      titre: 'Formation SETEC',
      description: 'Formation sur les logiciels d\'ingénierie de l\'eau pour SETEC Afrique.',
      contenu: 'Dans un environnement où la gestion des ressources hydriques est devenue un enjeu stratégique majeur, SETEC Afrique met en œuvre un programme de formation complet.',
      date: '2025-05-11T14:00:00.000Z',
      categorie: 'Formation',
      auteur: 'kevinyameogo01@gmail.com',
      image: 'https://images.unsplash.com/photo-1581094794329-c8112a89af12?ixlib=rb-1.2.1&auto=format&fit=crop&w=1050&q=80',
      tags: ['SETEC', 'Hydraulique', 'Formation']
    },
    {
      id: 3,
      titre: 'Début de formation le 20/12/2025',
      description: 'Sorbo-Ingénierie annonce le début d\'une nouvelle session de formation pour les professionnels du génie civil.',
      contenu: 'Cette formation portera sur les dernières méthodes et outils utilisés dans le secteur de l\'ingénierie moderne.',
      date: '2025-06-15T09:00:00.000Z',
      categorie: 'Actualités',
      auteur: 'sorbo.ingenierie@gmail.com',
      image: 'https://images.unsplash.com/photo-1584475784921-d9dbfd9d17ca?ixlib=rb-1.2.1&auto=format&fit=crop&w=1050&q=80',
      tags: ['Formation', 'Génie civil', '2025']
    }
  ];

  res.json({
    success: true,
    data: actualites
  });
});

// Route emplois
app.get('/api/emplois', (req, res) => {
  const emplois = [
    {
      id: 1,
      titre: 'Ingénieur Génie Civil',
      entreprise: 'Sorbo Ingénierie',
      lieu: 'Abidjan, Côte d\'Ivoire',
      type: 'CDI',
      description: 'Nous recherchons un ingénieur génie civil expérimenté pour rejoindre notre équipe.',
      salaire: 'À négocier',
      date: '2025-01-15T00:00:00.000Z'
    },
    {
      id: 2,
      titre: 'Développeur Full Stack',
      entreprise: 'Sorbo Ingénierie',
      lieu: 'Abidjan, Côte d\'Ivoire',
      type: 'CDI',
      description: 'Développement d\'applications web et logiciels métiers pour l\'ingénierie.',
      salaire: 'À négocier',
      date: '2025-01-10T00:00:00.000Z'
    }
  ];

  res.json({
    success: true,
    data: emplois
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Serveur Sorbo Ingénierie démarré sur le port ${PORT}`);
  console.log(`📡 API disponible sur https://sorbo-api-production.up.railway.app`);
  console.log(`🔗 Health check: /api/health`);
  console.log(`📚 Formations: /api/formations`);
  console.log(`💻 Logiciels: /api/logiciels`);
  console.log(`📰 Actualités: /api/actualites`);
  console.log(`💼 Emplois: /api/emplois`);
}); 