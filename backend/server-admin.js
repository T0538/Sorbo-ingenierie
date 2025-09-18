const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();

// Connexion MongoDB
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log(`🗄️  MongoDB connecté: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    console.error('❌ Erreur de connexion MongoDB:', error.message);
    process.exit(1);
  }
};

connectDB();

// Middlewares
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Import des modèles
const Contact = require('./models/Contact');
const Formation = require('./models/Formation');
const Actualite = require('./models/Actualite');
const Logiciel = require('./models/Logiciel');
const Emploi = require('./models/Emploi');

// Middleware d'authentification
const requireAuth = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || authHeader !== `Bearer ${process.env.ADMIN_TOKEN || 'admin123'}`) {
    return res.status(401).json({
      success: false,
      message: 'Accès non autorisé'
    });
  }
  next();
};

// Routes publiques
app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    message: 'Serveur Sorbo Ingénierie avec MongoDB',
    database: 'MongoDB Atlas',
    timestamp: new Date().toISOString()
  });
});

app.post('/api/contact', async (req, res) => {
  try {
    const { name, email, phone, subject, message } = req.body;
    
    if (!name || !email || !message) {
      return res.status(400).json({
        success: false,
        message: 'Nom, email et message sont requis'
      });
    }
    
    const contact = new Contact({
      name,
      email,
      phone,
      subject,
      message
    });
    
    await contact.save();
    
    res.status(201).json({
      success: true,
      message: 'Contact enregistré avec succès',
      data: contact
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erreur lors de l\'enregistrement',
      error: error.message
    });
  }
});

// Routes d'administration
app.get('/api/admin/actualites', requireAuth, async (req, res) => {
  try {
    const actualites = await Actualite.find().sort({ datePublication: -1 });
    res.json({ success: true, data: actualites });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération des actualités',
      error: error.message
    });
  }
});

app.post('/api/admin/actualites', requireAuth, async (req, res) => {
  try {
    const actualite = new Actualite(req.body);
    await actualite.save();
    res.status(201).json({
      success: true,
      message: 'Actualité créée avec succès',
      data: actualite
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la création',
      error: error.message
    });
  }
});

app.put('/api/admin/actualites/:id', requireAuth, async (req, res) => {
  try {
    const actualite = await Actualite.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    
    if (!actualite) {
      return res.status(404).json({
        success: false,
        message: 'Actualité non trouvée'
      });
    }
    
    res.json({
      success: true,
      message: 'Actualité modifiée avec succès',
      data: actualite
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la modification',
      error: error.message
    });
  }
});

app.delete('/api/admin/actualites/:id', requireAuth, async (req, res) => {
  try {
    const actualite = await Actualite.findByIdAndDelete(req.params.id);
    
    if (!actualite) {
      return res.status(404).json({
        success: false,
        message: 'Actualité non trouvée'
      });
    }
    
    res.json({
      success: true,
      message: 'Actualité supprimée avec succès'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la suppression',
      error: error.message
    });
  }
});

// Routes pour logiciels
app.get('/api/admin/logiciels', requireAuth, async (req, res) => {
  try {
    const logiciels = await Logiciel.find().sort({ dateAjout: -1 });
    res.json({ success: true, data: logiciels });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération des logiciels',
      error: error.message
    });
  }
});

app.post('/api/admin/logiciels', requireAuth, async (req, res) => {
  try {
    const logiciel = new Logiciel(req.body);
    await logiciel.save();
    res.status(201).json({
      success: true,
      message: 'Logiciel créé avec succès',
      data: logiciel
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la création',
      error: error.message
    });
  }
});

app.put('/api/admin/logiciels/:id', requireAuth, async (req, res) => {
  try {
    const logiciel = await Logiciel.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    
    if (!logiciel) {
      return res.status(404).json({
        success: false,
        message: 'Logiciel non trouvé'
      });
    }
    
    res.json({
      success: true,
      message: 'Logiciel modifié avec succès',
      data: logiciel
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la modification',
      error: error.message
    });
  }
});

app.delete('/api/admin/logiciels/:id', requireAuth, async (req, res) => {
  try {
    const logiciel = await Logiciel.findByIdAndDelete(req.params.id);
    
    if (!logiciel) {
      return res.status(404).json({
        success: false,
        message: 'Logiciel non trouvé'
      });
    }
    
    res.json({
      success: true,
      message: 'Logiciel supprimé avec succès'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la suppression',
      error: error.message
    });
  }
});

// Routes pour emplois
app.get('/api/admin/emplois', requireAuth, async (req, res) => {
  try {
    const emplois = await Emploi.find().sort({ datePublication: -1 });
    res.json({ success: true, data: emplois });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération des emplois',
      error: error.message
    });
  }
});

app.post('/api/admin/emplois', requireAuth, async (req, res) => {
  try {
    const emploi = new Emploi(req.body);
    await emploi.save();
    res.status(201).json({
      success: true,
      message: 'Emploi créé avec succès',
      data: emploi
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la création',
      error: error.message
    });
  }
});

app.put('/api/admin/emplois/:id', requireAuth, async (req, res) => {
  try {
    const emploi = await Emploi.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    
    if (!emploi) {
      return res.status(404).json({
        success: false,
        message: 'Emploi non trouvé'
      });
    }
    
    res.json({
      success: true,
      message: 'Emploi modifié avec succès',
      data: emploi
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la modification',
      error: error.message
    });
  }
});

app.delete('/api/admin/emplois/:id', requireAuth, async (req, res) => {
  try {
    const emploi = await Emploi.findByIdAndDelete(req.params.id);
    
    if (!emploi) {
      return res.status(404).json({
        success: false,
        message: 'Emploi non trouvé'
      });
    }
    
    res.json({
      success: true,
      message: 'Emploi supprimé avec succès'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la suppression',
      error: error.message
    });
  }
});

// Routes pour formations
app.get('/api/admin/formations', requireAuth, async (req, res) => {
  try {
    const formations = await Formation.find().sort({ createdAt: -1 });
    res.json({ success: true, data: formations });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération des formations',
      error: error.message
    });
  }
});

app.post('/api/admin/formations', requireAuth, async (req, res) => {
  try {
    const formation = new Formation(req.body);
    await formation.save();
    res.status(201).json({
      success: true,
      message: 'Formation créée avec succès',
      data: formation
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la création',
      error: error.message
    });
  }
});

app.put('/api/admin/formations/:id', requireAuth, async (req, res) => {
  try {
    const formation = await Formation.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    
    if (!formation) {
      return res.status(404).json({
        success: false,
        message: 'Formation non trouvée'
      });
    }
    
    res.json({
      success: true,
      message: 'Formation modifiée avec succès',
      data: formation
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la modification',
      error: error.message
    });
  }
});

app.delete('/api/admin/formations/:id', requireAuth, async (req, res) => {
  try {
    const formation = await Formation.findByIdAndDelete(req.params.id);
    
    if (!formation) {
      return res.status(404).json({
        success: false,
        message: 'Formation non trouvée'
      });
    }
    
    res.json({
      success: true,
      message: 'Formation supprimée avec succès'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la suppression',
      error: error.message
    });
  }
});

// Routes publiques pour affichage
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
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération des formations',
      error: error.message
    });
  }
});

app.get('/api/actualites', async (req, res) => {
  try {
    const actualites = await Actualite.find({ statut: 'publie' })
      .select('titre resume image categorie datePublication slug')
      .sort({ datePublication: -1 });
    
    res.json({
      success: true,
      data: actualites
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération des actualités',
      error: error.message
    });
  }
});

app.get('/api/logiciels', async (req, res) => {
  try {
    const logiciels = await Logiciel.find({ disponible: true })
      .select('nom description version categorie prix image note')
      .sort({ populaire: -1, dateAjout: -1 });
    
    res.json({
      success: true,
      data: logiciels
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération des logiciels',
      error: error.message
    });
  }
});

app.get('/api/emplois', async (req, res) => {
  try {
    const emplois = await Emploi.find({ statut: 'actif' })
      .select('titre entreprise description lieu typeContrat dateLimite urgent')
      .sort({ urgent: -1, datePublication: -1 });
    
    res.json({
      success: true,
      data: emplois
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération des emplois',
      error: error.message
    });
  }
});

// Statistiques
app.get('/api/admin/stats', requireAuth, async (req, res) => {
  try {
    const stats = {
      contacts: await Contact.countDocuments(),
      formations: await Formation.countDocuments(),
      actualites: await Actualite.countDocuments(),
      logiciels: await Logiciel.countDocuments(),
      emplois: await Emploi.countDocuments(),
      actualitesPubliees: await Actualite.countDocuments({ statut: 'publie' }),
      emploisActifs: await Emploi.countDocuments({ statut: 'actif' }),
      logicielsDisponibles: await Logiciel.countDocuments({ disponible: true })
    };
    
    res.json({
      success: true,
      data: stats
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération des statistiques',
      error: error.message
    });
  }
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
  console.log(`📰 Actualités: http://localhost:${PORT}/api/actualites`);
  console.log(`💻 Logiciels: http://localhost:${PORT}/api/logiciels`);
  console.log(`💼 Emplois: http://localhost:${PORT}/api/emplois`);
  console.log(`🔐 Admin: http://localhost:${PORT}/api/admin/`);
});
