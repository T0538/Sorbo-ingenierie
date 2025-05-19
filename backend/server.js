const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

// Import des routes
const authRoutes = require('./routes/authRoutes');
const contactRoutes = require('./routes/contactRoutes');
// Utiliser le nouveau fichier de routes simplifié
const formationRoutes = require('./routes/formation');
const emploiRoutes = require('./routes/emploiRoutes');
const projetRoutes = require('./routes/projetRoutes');
const logicielRoutes = require('./routes/logicielRoutes');

// Initialisation de l'application Express
const app = express();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Configuration de la connexion à MongoDB
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/sorbo-ingenierie');
    console.log(`MongoDB connecté: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Erreur de connexion à MongoDB: ${error.message}`);
    process.exit(1);
  }
};

// Routes API
app.use('/api/auth', authRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/formations', formationRoutes);
app.use('/api/emplois', emploiRoutes);
app.use('/api/projets', projetRoutes);
app.use('/api/logiciels', logicielRoutes);

// Servir les fichiers statiques en production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../')));
  
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../', 'index.html'));
  });
}

// Middleware de gestion des erreurs
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: 'Erreur serveur',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// Port et démarrage du serveur
const PORT = process.env.PORT || 5000;

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Serveur démarré sur le port ${PORT}`);
  });
}); 