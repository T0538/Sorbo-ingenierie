// Script d'initialisation de l'administrateur par défaut
// Usage: node backend/init-admin.js

const mongoose = require('mongoose');
const AdminUser = require('./models/AdminUser');
require('dotenv').config();

// Configuration de connexion MongoDB
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/sorbo-ingenierie';

async function initializeAdmin() {
    try {
        console.log('🚀 Initialisation du système d\'administration Sorbo-Ingénierie...\n');
        
        // Connexion à MongoDB
        console.log('📡 Connexion à MongoDB...');
        await mongoose.connect(MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log('✅ Connexion MongoDB réussie\n');
        
        // Créer l'administrateur par défaut
        console.log('👤 Création de l\'administrateur par défaut...');
        const admin = await AdminUser.createDefaultAdmin();
        
        if (admin) {
            console.log('\n🎉 Initialisation terminée avec succès !');
            console.log('\n📋 Informations de connexion :');
            console.log('   🌐 URL de connexion: http://localhost:3000/admin-login.html');
            console.log('   👤 Nom d\'utilisateur:', admin.username);
            console.log('   🔑 Mot de passe:', 'AdminSorbo2024!');
            console.log('   🏷️  Rôle:', admin.role);
            console.log('\n⚠️  IMPORTANT: Changez ce mot de passe après la première connexion !');
            console.log('\n🔒 Sécurité activée :');
            console.log('   • Verrouillage automatique après 5 tentatives échouées');
            console.log('   • Session JWT valide 24 heures');
            console.log('   • Hachage bcrypt avec 12 rounds');
            console.log('   • Logs d\'activité complets');
        }
        
    } catch (error) {
        console.error('\n❌ Erreur lors de l\'initialisation:', error.message);
        
        if (error.code === 11000) {
            console.log('\n💡 Solution: L\'administrateur existe déjà. Utilisez les identifiants existants.');
        } else if (error.name === 'MongoNetworkError') {
            console.log('\n💡 Solution: Vérifiez que MongoDB est démarré et accessible.');
            console.log('   URI actuelle:', MONGODB_URI);
        }
        
        process.exit(1);
    } finally {
        // Fermer la connexion
        await mongoose.connection.close();
        console.log('\n🔌 Connexion MongoDB fermée');
        process.exit(0);
    }
}

// Fonction pour vérifier l'état de la base de données
async function checkDatabaseStatus() {
    try {
        console.log('🔍 Vérification de l\'état de la base de données...\n');
        
        await mongoose.connect(MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        
        // Compter les utilisateurs
        const userCount = await AdminUser.countDocuments();
        console.log(`👥 Nombre d'utilisateurs administrateurs: ${userCount}`);
        
        if (userCount > 0) {
            const users = await AdminUser.find({}).select('username role isActive createdAt');
            console.log('\n📋 Liste des utilisateurs :');
            users.forEach((user, index) => {
                const status = user.isActive ? '🟢 Actif' : '🔴 Inactif';
                console.log(`   ${index + 1}. ${user.username} (${user.role}) - ${status} - Créé le ${user.createdAt.toLocaleDateString('fr-FR')}`);
            });
        }
        
        // Vérifier les collections
        const collections = await mongoose.connection.db.listCollections().toArray();
        console.log('\n🗄️  Collections disponibles :');
        collections.forEach(collection => {
            console.log(`   • ${collection.name}`);
        });
        
    } catch (error) {
        console.error('❌ Erreur lors de la vérification:', error.message);
    } finally {
        await mongoose.connection.close();
        process.exit(0);
    }
}

// Gestion des arguments de ligne de commande
const args = process.argv.slice(2);

if (args.includes('--check') || args.includes('-c')) {
    checkDatabaseStatus();
} else if (args.includes('--help') || args.includes('-h')) {
    console.log(`
🔐 Script d'initialisation de l'administration Sorbo-Ingénierie

Usage:
  node backend/init-admin.js          # Initialise l'administrateur par défaut
  node backend/init-admin.js --check  # Vérifie l'état de la base de données
  node backend/init-admin.js --help   # Affiche cette aide

Options:
  --check, -c    Vérifie l'état de la base de données
  --help, -h     Affiche cette aide

Variables d'environnement:
  MONGODB_URI   URI de connexion MongoDB (défaut: mongodb://localhost:27017/sorbo-ingenierie)

Exemples:
  node backend/init-admin.js
  MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/db node backend/init-admin.js
    `);
    process.exit(0);
} else {
    initializeAdmin();
}


