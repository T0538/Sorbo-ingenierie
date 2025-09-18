require('dotenv').config({ path: '../.env' });
const mongoose = require('mongoose');
const User = require('../backend/models/userModel');

const MONGODB_URI = process.env.MONGODB_URI;
const ADMIN_USERNAME = 'admin';
const ADMIN_PASSWORD = 'admin123';

const createAdmin = async () => {
  if (!MONGODB_URI) {
    console.error('❌ Erreur: MONGODB_URI n\'est pas défini dans votre fichier .env');
    process.exit(1);
  }

  try {
    console.log('🔄 Connexion à la base de données MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connecté à MongoDB.');

    // Vérifier si l'utilisateur admin existe déjà
    const existingUser = await User.findOne({ username: ADMIN_USERNAME });

    if (existingUser) {
      console.log(`✅ L'utilisateur administrateur "${ADMIN_USERNAME}" existe déjà.`);
      return;
    }

    // Créer le nouvel utilisateur admin
    console.log(`⏳ Création de l'utilisateur "${ADMIN_USERNAME}"...`);
    const newUser = new User({
      username: ADMIN_USERNAME,
      password: ADMIN_PASSWORD,
    });

    await newUser.save();
    console.log(`✅ Utilisateur administrateur "${ADMIN_USERNAME}" créé avec succès.`);
    console.log('Vous pouvez maintenant vous connecter avec le mot de passe "admin123".');

  } catch (error) {
    console.error('❌ Une erreur est survenue lors de la création de l\'administrateur:', error.message);
  } finally {
    // Fermer la connexion à la base de données
    await mongoose.disconnect();
    console.log('🔌 Connexion à MongoDB fermée.');
    process.exit(0);
  }
};

createAdmin();
