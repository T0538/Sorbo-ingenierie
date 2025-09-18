const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

// Import des middlewares de sécurité
const securityMiddleware = require('./middleware/security');
const { apiLogger, logError } = require('./utils/logger');
const cacheManager = require('./utils/cache');

// Import des routes
const authRoutes = require('./routes/authRoutes');
const contactRoutes = require('./routes/contactRoutes');
const formationRoutes = require('./routes/formation');
const emploiRoutes = require('./routes/emploiRoutes');
const projetRoutes = require('./routes/projetRoutes');
const logicielRoutes = require('./routes/logicielRoutes');

// Initialisation de l'application Express
const app = express();

// Middlewares de sécurité
securityMiddleware(app);

// Middleware de logging
app.use(apiLogger);

// Configuration CORS optimisée
const corsOptions = {
  origin: function (origin, callback) {
    const allowedOrigins = [
      process.env.FRONTEND_URL, 
      'https://sorbo-ingenierie.netlify.app',
      'http://localhost:3000',
      'http://localhost:5000'
    ];
    
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  optionsSuccessStatus: 200,
  credentials: true
};
app.use(cors(corsOptions));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Configuration de la connexion à MongoDB avec optimisations
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/sorbo-ingenierie', {
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
      bufferMaxEntries: 0,
      bufferCommands: false
    });
    
    console.log(`✅ MongoDB connecté: ${conn.connection.host}`);
    
    // Connexion Redis
    await cacheManager.connect();
    
  } catch (error) {
    console.error(`❌ Erreur de connexion à MongoDB: ${error.message}`);
    process.exit(1);
  }
};

// Routes API avec cache
app.use('/api/auth', authRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/formations', formationRoutes);
app.use('/api/emplois', emploiRoutes);
app.use('/api/projets', projetRoutes);
app.use('/api/logiciels', logicielRoutes);

// Route de santé pour monitoring
app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    memory: process.memoryUsage(),
    redis: cacheManager.isConnected ? 'connected' : 'disconnected'
  });
});

// Route de statistiques (avec cache)
app.get('/api/stats', cacheManager.cacheMiddleware(300), async (req, res) => {
  try {
    const stats = {
      formations: await mongoose.model('Formation').countDocuments(),
      contacts: await mongoose.model('Contact').countDocuments(),
      users: await mongoose.model('User').countDocuments(),
      date: new Date().toISOString()
    };
    
    res.json({ success: true, data: stats });
  } catch (error) {
    logError(error, req);
    res.status(500).json({ success: false, message: 'Erreur serveur' });
  }
});

// Servir les fichiers statiques en production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../')));
  
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../', 'index.html'));
  });
}

// Middleware de gestion des erreurs amélioré
app.use((err, req, res, next) => {
  logError(err, req);
  
  // Erreurs de validation
  if (err.name === 'ValidationError') {
    return res.status(400).json({
      success: false,
      message: 'Données invalides',
      errors: Object.values(err.errors).map(e => e.message)
    });
  }
  
  // Erreurs de cast MongoDB
  if (err.name === 'CastError') {
    return res.status(400).json({
      success: false,
      message: 'ID invalide'
    });
  }
  
  // Erreurs JWT
  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({
      success: false,
      message: 'Token invalide'
    });
  }
  
  // Erreur par défaut
  res.status(500).json({
    success: false,
    message: 'Erreur serveur',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// Gestion gracieuse de l'arrêt
process.on('SIGTERM', () => {
  console.log('SIGTERM reçu, arrêt gracieux...');
  mongoose.connection.close(() => {
    console.log('MongoDB déconnecté');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  console.log('SIGINT reçu, arrêt gracieux...');
  mongoose.connection.close(() => {
    console.log('MongoDB déconnecté');
    process.exit(0);
  });
});

// Port et démarrage du serveur
const PORT = process.env.PORT || 5000;

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`🚀 Serveur démarré sur le port ${PORT}`);
    console.log(`📊 Mode: ${process.env.NODE_ENV || 'development'}`);
    console.log(`🔗 URL: http://localhost:${PORT}`);
  });
}); 