const mongoose = require('mongoose');
const { logger } = require('../utils/logger');
require('dotenv').config();

// Import des modèles
const Formation = require('../models/Formation');
const Contact = require('../models/Contact');
const User = require('../models/User');

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    logger.info('MongoDB connecté pour migration');
  } catch (error) {
    logger.error('Erreur de connexion MongoDB:', error);
    process.exit(1);
  }
};

const createIndexes = async () => {
  try {
    logger.info('Création des index...');
    
    // Index pour Formation
    await Formation.collection.createIndex({ titre: 'text', description: 'text' });
    await Formation.collection.createIndex({ categorie: 1, prix: 1 });
    await Formation.collection.createIndex({ dateDebut: 1 });
    await Formation.collection.createIndex({ inscriptions: -1 });
    
    // Index pour Contact
    await Contact.collection.createIndex({ email: 1 });
    await Contact.collection.createIndex({ subject: 1, createdAt: -1 });
    await Contact.collection.createIndex({ createdAt: -1 });
    
    // Index pour User
    await User.collection.createIndex({ email: 1 }, { unique: true });
    await User.collection.createIndex({ role: 1 });
    
    logger.info('Index créés avec succès');
  } catch (error) {
    logger.error('Erreur lors de la création des index:', error);
  }
};

const updateSchemas = async () => {
  try {
    logger.info('Mise à jour des schémas...');
    
    // Ajouter des champs manquants aux formations existantes
    await Formation.updateMany(
      { duree: { $exists: false } },
      { $set: { duree: '1 jour' } }
    );
    
    await Formation.updateMany(
      { niveau: { $exists: false } },
      { $set: { niveau: 'Débutant' } }
    );
    
    // Ajouter des champs manquants aux contacts existants
    await Contact.updateMany(
      { status: { $exists: false } },
      { $set: { status: 'nouveau' } }
    );
    
    logger.info('Schémas mis à jour avec succès');
  } catch (error) {
    logger.error('Erreur lors de la mise à jour des schémas:', error);
  }
};

const migrate = async () => {
  try {
    await connectDB();
    await createIndexes();
    await updateSchemas();
    
    logger.info('Migration terminée avec succès');
    process.exit(0);
  } catch (error) {
    logger.error('Erreur lors de la migration:', error);
    process.exit(1);
  }
};

migrate(); 