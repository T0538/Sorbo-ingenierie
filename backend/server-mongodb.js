const express = require('express');
const cors = require('cors');
const connectDB = require('./config/database');
require('dotenv').config();

// Initialisation de l'application Express
const app = express();

// Connexion à MongoDB
connectDB();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Import des modèles
const Contact = require('./models/Contact');
const Formation = require('./models/Formation');

// Routes

// Route de santé
app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    message: 'Serveur Sorbo Ingénierie avec MongoDB',
    database: 'MongoDB Atlas',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// Route de test
app.get('/api/test', async (req, res) => {
  try {
    const contactsCount = await Contact.countDocuments();
    const formationsCount = await Formation.countDocuments();
    
    res.json({
      success: true,
      message: 'API fonctionnelle avec MongoDB !',
      data: {
        contacts: contactsCount,
        formations: formationsCount,
        date: new Date().toISOString()
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erreur lors du test',
      error: error.message
    });
  }
});

// Route de contact avec MongoDB
app.post('/api/contact', async (req, res) => {
  try {
    const { name, email, phone, subject, message, ...otherFields } = req.body;
    
    // Validation
    if (!name || !email || !message) {
      return res.status(400).json({
        success: false,
        message: 'Nom, email et message sont requis'
      });
    }
    
    // Créer le contact
    const contact = new Contact({
      name,
      email,
      phone,
      subject,
      message,
      ...otherFields
    });
    
    await contact.save();
    
    console.log('📞 Nouveau contact enregistré:', {
      id: contact._id,
      name: contact.name,
      email: contact.email,
      subject: contact.subject
    });
    
    res.status(201).json({
      success: true,
      message: 'Contact enregistré avec succès',
      data: {
        id: contact._id,
        name: contact.name,
        email: contact.email,
        phone: contact.phone,
        subject: contact.subject,
        createdAt: contact.createdAt
      }
    });
  } catch (error) {
    console.error('❌ Erreur lors de l\'enregistrement:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de l\'enregistrement',
      error: error.message
    });
  }
});

// Route des formations avec MongoDB
app.get('/api/formations', async (req, res) => {
  try {
    const formations = await Formation.find({ active: true })
      .select('title description price duration category type')
      .sort({ createdAt: -1 });
    
    res.json({
      success: true,
      data: formations
    });
  } catch (error) {
    console.error('❌ Erreur lors de la récupération des formations:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération des formations',
      error: error.message
    });
  }
});

// Route pour ajouter une formation (admin)
app.post('/api/formations', async (req, res) => {
  try {
    const { title, description, price, duration, category, type } = req.body;
    
    const formation = new Formation({
      title,
      description,
      price,
      duration,
      category,
      type
    });
    
    await formation.save();
    
    res.status(201).json({
      success: true,
      message: 'Formation ajoutée avec succès',
      data: formation
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erreur lors de l\'ajout de la formation',
      error: error.message
    });
  }
});

// Middleware de gestion des erreurs
app.use((err, req, res, next) => {
  console.error('❌ Erreur serveur:', err.message);
  res.status(500).json({
    success: false,
    message: 'Erreur serveur',
    error: process.env.NODE_ENV === 'development' ? err.message : 'Erreur interne'
  });
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
}); 