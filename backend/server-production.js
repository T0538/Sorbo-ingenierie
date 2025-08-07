const express = require('express');
const cors = require('cors');
const path = require('path');
const mongoose = require('mongoose');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
require('dotenv').config();

// Initialisation de l'application Express
const app = express();

// ===== SÉCURISATION =====

// Helmet pour la sécurité des headers
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
      fontSrc: ["'self'", "https://fonts.gstatic.com"],
      imgSrc: ["'self'", "data:", "https:"],
      scriptSrc: ["'self'", "'unsafe-inline'", "https://unpkg.com"],
    },
  },
  crossOriginEmbedderPolicy: false,
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limite chaque IP à 100 requêtes par fenêtre
  message: {
    success: false,
    message: 'Trop de requêtes depuis cette IP, veuillez réessayer plus tard.'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

app.use(limiter);

// Configuration CORS sécurisée
const corsOptions = {
  origin: function (origin, callback) {
    const allowedOrigins = [
      process.env.FRONTEND_URL,
      'https://sorbo-ingenierie.netlify.app',
      'https://sorbo-ingenierie.vercel.app',
      'http://localhost:3000',
      'http://localhost:5000'
    ];
    
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Origine non autorisée par CORS'));
    }
  },
  credentials: true,
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));

// Middlewares de base avec limites
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Connexion MongoDB (optionnelle pour le serveur local)
let isMongoConnected = false;
if (process.env.MONGODB_URI) {
  mongoose.connect(process.env.MONGODB_URI)
    .then(() => {
      console.log('✅ MongoDB connecté');
      isMongoConnected = true;
    })
    .catch(err => {
      console.log('⚠️ MongoDB non connecté, utilisation des données statiques');
    });
}

// Modèle Actualité pour MongoDB
const actualiteSchema = new mongoose.Schema({
  titre: { type: String, required: true },
  description: { type: String, required: true },
  contenu: { type: String, required: true },
  date: { type: Date, default: Date.now },
  auteur: { type: String, default: 'Équipe Sorbo Ingénierie' },
  image: { type: String },
  categorie: { type: String, default: 'Actualité' },
  tags: [{ type: String }]
});

const Actualite = mongoose.model('Actualite', actualiteSchema);

// Modèle Logiciel pour MongoDB
const logicielSchema = new mongoose.Schema({
  nom: { type: String, required: true },
  description: { type: String, required: true },
  categorie: { type: String, default: 'CAO' },
  version: { type: String, default: '2024' },
  prix: { type: String, default: 'Gratuit pour étudiants' },
  image: { type: String },
  downloadUrl: { type: String },
  trialUrl: { type: String },
  fonctionnalites: [{ type: String }],
  dateAjout: { type: Date, default: Date.now }
});

const Logiciel = mongoose.model('Logiciel', logicielSchema);

// Modèle Emploi pour MongoDB
const emploiSchema = new mongoose.Schema({
  poste: { type: String, required: true },
  description: { type: String, required: true },
  type: { type: String, default: 'CDI' },
  lieu: { type: String },
  salaire: { type: String },
  exigences: { type: String },
  dateAjout: { type: Date, default: Date.now }
});

const Emploi = mongoose.model('Emploi', emploiSchema);

// Route de santé simple
app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    message: 'Serveur local Sorbo Ingénierie fonctionnel',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: 'local',
    mongoConnected: isMongoConnected
  });
});

// Route de test
app.get('/api/test', (req, res) => {
  res.json({
    success: true,
    message: 'API locale fonctionnelle !',
    data: {
      formations: 5,
      logiciels: 5,
      actualites: 5,
      contacts: 0,
      date: new Date().toISOString()
    }
  });
});

// Modèle Formation pour MongoDB
const formationSchema = new mongoose.Schema({
  titre: { type: String, required: true },
  description: { type: String, required: true },
  duree: { type: String },
  niveau: { type: String, default: 'Débutant' },
  prix: { type: String },
  image: { type: String },
  categorie: { type: String, default: 'CAO' },
  dateAjout: { type: Date, default: Date.now }
});

const Formation = mongoose.model('Formation', formationSchema);

// Route formations avec MongoDB
app.get('/api/formations', async (req, res) => {
  try {
    let formations;
    
    if (isMongoConnected) {
      // Récupérer depuis MongoDB
      formations = await Formation.find().sort({ dateAjout: -1 });
      console.log(`🎓 ${formations.length} formations récupérées depuis MongoDB`);
    } else {
      // Aucune donnée si MongoDB non connecté
      formations = [];
      console.log(`🎓 Aucune formation disponible (MongoDB non connecté)`);
    }

    res.json({
      success: true,
      message: 'Formations récupérées avec succès',
      data: formations,
      count: formations.length,
      source: isMongoConnected ? 'MongoDB' : 'Aucune donnée'
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

// Route logiciels avec MongoDB
app.get('/api/logiciels', async (req, res) => {
  try {
    let logiciels;
    
    if (isMongoConnected) {
      // Récupérer depuis MongoDB
      logiciels = await Logiciel.find().sort({ dateAjout: -1 });
      console.log(`💻 ${logiciels.length} logiciels récupérés depuis MongoDB`);
    } else {
      // Aucune donnée si MongoDB non connecté
      logiciels = [];
      console.log(`💻 Aucun logiciel disponible (MongoDB non connecté)`);
    }

    res.json({
      success: true,
      message: 'Logiciels récupérés avec succès',
      data: logiciels,
      count: logiciels.length,
      source: isMongoConnected ? 'MongoDB' : 'Aucune donnée'
    });
  } catch (error) {
    console.error('Erreur logiciels:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération des logiciels',
      error: error.message
    });
  }
});

// Route pour ajouter un logiciel (admin)
app.post('/api/logiciels', async (req, res) => {
  try {
    const { nom, description, categorie, version, prix, image, downloadUrl, trialUrl, fonctionnalites } = req.body;
    
    // Validation
    if (!nom || !description) {
      return res.status(400).json({
        success: false,
        message: 'Nom et description sont requis'
      });
    }

    if (isMongoConnected) {
      // Sauvegarder dans MongoDB
      const nouveauLogiciel = new Logiciel({
        nom,
        description,
        categorie: categorie || 'CAO',
        version: version || '2024',
        prix: prix || 'Gratuit pour étudiants',
        image,
        downloadUrl,
        trialUrl,
        fonctionnalites: fonctionnalites || []
      });

      await nouveauLogiciel.save();
      console.log('💻 Nouveau logiciel ajouté dans MongoDB:', nom);
      
      res.status(201).json({
        success: true,
        message: 'Logiciel ajouté avec succès',
        data: nouveauLogiciel
      });
    } else {
      // Simuler l'ajout si MongoDB non connecté
      console.log('💻 Nouveau logiciel simulé:', nom);
      
      res.status(201).json({
        success: true,
        message: 'Logiciel simulé (MongoDB non connecté)',
        data: {
          nom,
          description,
          categorie: categorie || 'CAO',
          version: version || '2024',
          prix: prix || 'Gratuit pour étudiants',
          dateAjout: new Date()
        }
      });
    }
  } catch (error) {
    console.error('Erreur ajout logiciel:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de l\'ajout du logiciel',
      error: error.message
    });
  }
});

// Route téléchargement logiciel
app.get('/api/logiciels/:id/download', async (req, res) => {
  try {
    const logicielId = req.params.id;
    
    if (isMongoConnected) {
      // Récupérer depuis MongoDB
      const logiciel = await Logiciel.findById(logicielId);
      
      if (!logiciel) {
        return res.status(404).json({
          success: false,
          message: 'Logiciel non trouvé'
        });
      }

      res.json({
        success: true,
        message: `Redirection vers ${logiciel.nom}`,
        data: {
          nom: logiciel.nom,
          downloadUrl: logiciel.downloadUrl,
          trialUrl: logiciel.trialUrl
        }
      });
    } else {
      return res.status(404).json({
        success: false,
        message: 'Aucun logiciel disponible (MongoDB non connecté)'
      });
    }
  } catch (error) {
    console.error('Erreur téléchargement:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors du téléchargement',
      error: error.message
    });
  }
});

// Route actualités avec MongoDB
app.get('/api/actualites', async (req, res) => {
  try {
    let actualites;
    
    if (isMongoConnected) {
      // Récupérer depuis MongoDB
      actualites = await Actualite.find().sort({ date: -1 }).limit(10);
      console.log(`📰 ${actualites.length} actualités récupérées depuis MongoDB`);
    } else {
      // Aucune donnée si MongoDB non connecté
      actualites = [];
      console.log(`📰 Aucune actualité disponible (MongoDB non connecté)`);
    }

    res.json({
      success: true,
      message: 'Actualités récupérées avec succès',
      data: actualites,
      count: actualites.length,
      source: isMongoConnected ? 'MongoDB' : 'Aucune donnée'
    });
  } catch (error) {
    console.error('Erreur actualités:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération des actualités',
      error: error.message
    });
  }
});

// Route pour ajouter une actualité (admin)
app.post('/api/actualites', async (req, res) => {
  try {
    const { titre, description, contenu, auteur, image, categorie, tags } = req.body;
    
    // Validation
    if (!titre || !description || !contenu) {
      return res.status(400).json({
        success: false,
        message: 'Titre, description et contenu sont requis'
      });
    }

    if (isMongoConnected) {
      // Sauvegarder dans MongoDB
      const nouvelleActualite = new Actualite({
        titre,
        description,
        contenu,
        auteur: auteur || 'Équipe Sorbo Ingénierie',
        image,
        categorie: categorie || 'Actualité',
        tags: tags || []
      });

      await nouvelleActualite.save();
      console.log('📰 Nouvelle actualité ajoutée dans MongoDB:', titre);
      
      res.status(201).json({
        success: true,
        message: 'Actualité ajoutée avec succès',
        data: nouvelleActualite
      });
    } else {
      // Simuler l'ajout si MongoDB non connecté
      console.log('📰 Nouvelle actualité simulée:', titre);
      
      res.status(201).json({
        success: true,
        message: 'Actualité simulée (MongoDB non connecté)',
        data: {
          titre,
          description,
          contenu,
          date: new Date(),
          auteur: auteur || 'Équipe Sorbo Ingénierie'
        }
      });
    }
  } catch (error) {
    console.error('Erreur ajout actualité:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de l\'ajout de l\'actualité',
      error: error.message
    });
  }
});

// Routes pour les emplois
app.get('/api/emplois', async (req, res) => {
  try {
    let emplois;
    
    if (isMongoConnected) {
      emplois = await Emploi.find().sort({ dateAjout: -1 });
      console.log(`💼 ${emplois.length} emplois récupérés depuis MongoDB`);
    } else {
      emplois = [];
      console.log(`💼 Aucun emploi disponible (MongoDB non connecté)`);
    }

    res.json({
      success: true,
      message: 'Emplois récupérés avec succès',
      data: emplois,
      count: emplois.length,
      source: isMongoConnected ? 'MongoDB' : 'Aucune donnée'
    });
  } catch (error) {
    console.error('Erreur emplois:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération des emplois',
      error: error.message
    });
  }
});

app.post('/api/emplois', async (req, res) => {
  try {
    const { poste, description, type, lieu, salaire, exigences } = req.body;
    
    if (!poste || !description) {
      return res.status(400).json({
        success: false,
        message: 'Poste et description sont requis'
      });
    }

    if (isMongoConnected) {
      const nouvelEmploi = new Emploi({
        poste,
        description,
        type: type || 'CDI',
        lieu,
        salaire,
        exigences
      });

      await nouvelEmploi.save();
      console.log('💼 Nouvel emploi ajouté dans MongoDB:', poste);
      
      res.status(201).json({
        success: true,
        message: 'Emploi ajouté avec succès',
        data: nouvelEmploi
      });
    } else {
      console.log('💼 Nouvel emploi simulé:', poste);
      
      res.status(201).json({
        success: true,
        message: 'Emploi simulé (MongoDB non connecté)',
        data: {
          poste,
          description,
          type: type || 'CDI',
          dateAjout: new Date()
        }
      });
    }
  } catch (error) {
    console.error('Erreur ajout emploi:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de l\'ajout de l\'emploi',
      error: error.message
    });
  }
});

// Routes CRUD pour les formations
app.post('/api/formations', async (req, res) => {
  try {
    const { titre, description, duree, niveau, prix, categorie, image } = req.body;
    
    if (!titre || !description) {
      return res.status(400).json({
        success: false,
        message: 'Titre et description sont requis'
      });
    }

    if (isMongoConnected) {
      // Sauvegarder dans MongoDB
      const nouvelleFormation = new Formation({
        titre,
        description,
        duree,
        niveau: niveau || 'Débutant',
        prix,
        categorie: categorie || 'CAO',
        image
      });

      await nouvelleFormation.save();
      console.log('🎓 Nouvelle formation ajoutée dans MongoDB:', titre);
      
      res.status(201).json({
        success: true,
        message: 'Formation ajoutée avec succès',
        data: nouvelleFormation
      });
    } else {
      console.log('🎓 Nouvelle formation simulée:', titre);
      
      res.status(201).json({
        success: true,
        message: 'Formation simulée (MongoDB non connecté)',
        data: {
          titre,
          description,
          duree,
          niveau: niveau || 'Débutant',
          prix,
          categorie: categorie || 'CAO',
          dateAjout: new Date()
        }
      });
    }
  } catch (error) {
    console.error('Erreur ajout formation:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de l\'ajout de la formation',
      error: error.message
    });
  }
});

// Routes de suppression
app.delete('/api/actualites/:id', async (req, res) => {
  try {
    const id = req.params.id;
    
    if (isMongoConnected) {
      const result = await Actualite.findByIdAndDelete(id);
      if (result) {
        console.log('📰 Actualité supprimée:', id);
        res.json({ success: true, message: 'Actualité supprimée avec succès' });
      } else {
        res.status(404).json({ success: false, message: 'Actualité non trouvée' });
      }
    } else {
      console.log('📰 Suppression simulée:', id);
      res.json({ success: true, message: 'Suppression simulée' });
    }
  } catch (error) {
    console.error('Erreur suppression actualité:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la suppression',
      error: error.message
    });
  }
});

app.delete('/api/logiciels/:id', async (req, res) => {
  try {
    const id = req.params.id;
    
    if (isMongoConnected) {
      const result = await Logiciel.findByIdAndDelete(id);
      if (result) {
        console.log('💻 Logiciel supprimé:', id);
        res.json({ success: true, message: 'Logiciel supprimé avec succès' });
      } else {
        res.status(404).json({ success: false, message: 'Logiciel non trouvé' });
      }
    } else {
      console.log('💻 Suppression simulée:', id);
      res.json({ success: true, message: 'Suppression simulée' });
    }
  } catch (error) {
    console.error('Erreur suppression logiciel:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la suppression',
      error: error.message
    });
  }
});

app.delete('/api/emplois/:id', async (req, res) => {
  try {
    const id = req.params.id;
    
    if (isMongoConnected) {
      const result = await Emploi.findByIdAndDelete(id);
      if (result) {
        console.log('💼 Emploi supprimé:', id);
        res.json({ success: true, message: 'Emploi supprimé avec succès' });
      } else {
        res.status(404).json({ success: false, message: 'Emploi non trouvé' });
      }
    } else {
      console.log('💼 Suppression simulée:', id);
      res.json({ success: true, message: 'Suppression simulée' });
    }
  } catch (error) {
    console.error('Erreur suppression emploi:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la suppression',
      error: error.message
    });
  }
});

// Route de suppression pour les formations
app.delete('/api/formations/:id', async (req, res) => {
  try {
    const id = req.params.id;
    
    if (isMongoConnected) {
      const result = await Formation.findByIdAndDelete(id);
      if (result) {
        console.log('🎓 Formation supprimée:', id);
        res.json({ success: true, message: 'Formation supprimée avec succès' });
      } else {
        res.status(404).json({ success: false, message: 'Formation non trouvée' });
      }
    } else {
      console.log('🎓 Suppression simulée:', id);
      res.json({ success: true, message: 'Suppression simulée' });
    }
  } catch (error) {
    console.error('Erreur suppression formation:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la suppression',
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

// Servir les fichiers statiques
app.use(express.static(path.join(__dirname, '../')));

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
  console.log(`🚀 Serveur de production démarré sur le port ${PORT}`);
  console.log(`📊 Mode: ${process.env.NODE_ENV || 'production'}`);
  console.log(`🔗 URL: http://localhost:${PORT}`);
  console.log(`✅ API Health: http://localhost:${PORT}/api/health`);
  console.log(`📞 Contact: http://localhost:${PORT}/api/contact`);
  console.log(`🎓 Formations: http://localhost:${PORT}/api/formations`);
  console.log(`💻 Logiciels: http://localhost:${PORT}/api/logiciels`);
  console.log(`📰 Actualités: http://localhost:${PORT}/api/actualites`);
  console.log(`📥 Téléchargements: http://localhost:${PORT}/api/logiciels/:id/download`);
  console.log(`💼 Emplois: http://localhost:${PORT}/api/emplois`);
  console.log(`🌐 Frontend: http://localhost:${PORT}`);
  console.log(`🎛️ Admin: http://localhost:${PORT}/admin-dashboard.html`);
  console.log(`🔒 Sécurité: Rate limiting, Helmet, CORS configuré`);
}); 