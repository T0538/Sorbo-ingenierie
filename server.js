require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const path = require('path');
const mongoose = require('mongoose');

// Import des routes d'administration
const adminAuthRoutes = require('./backend/routes/adminAuth');

const app = express();
const PORT = process.env.PORT || 3000;

// Connexion MongoDB
async function connectDB() {
    try {
        console.log('📡 Connexion à MongoDB...');
        await mongoose.connect(process.env.MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log('✅ Connexion MongoDB réussie !');
    } catch (error) {
        console.error('❌ Erreur de connexion MongoDB:', error.message);
        process.exit(1);
    }
}

// Middleware de sécurité
app.use(helmet());
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Rate limiting pour l'API
const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limite chaque IP à 100 requêtes par fenêtre
    message: 'Trop de requêtes depuis cette IP, réessayez plus tard.'
});
app.use('/api/', apiLimiter);

// Rate limiting spécifique pour l'authentification
const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5, // limite chaque IP à 5 tentatives de connexion par fenêtre
    message: 'Trop de tentatives de connexion, réessayez plus tard.'
});
app.use('/api/admin/auth/login', authLimiter);

// Routes d'administration
app.use('/api/admin/auth', adminAuthRoutes);

// Servir les fichiers statiques
app.use(express.static(path.join(__dirname)));

// Route racine
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Route pour la page de connexion admin
app.get('/admin-login', (req, res) => {
    res.sendFile(path.join(__dirname, 'admin-login.html'));
});

// Route pour le dashboard admin (à créer)
app.get('/admin-dashboard', (req, res) => {
    res.sendFile(path.join(__dirname, 'admin-dashboard.html'));
});

// Gestion des erreurs 404
app.use('*', (req, res) => {
    res.status(404).json({
        success: false,
        message: 'Route non trouvée',
        path: req.originalUrl
    });
});

// Gestion globale des erreurs
app.use((error, req, res, next) => {
    console.error('Erreur serveur:', error);
    res.status(500).json({
        success: false,
        message: 'Erreur interne du serveur',
        error: process.env.NODE_ENV === 'development' ? error.message : 'Erreur interne'
    });
});

// Démarrage du serveur avec connexion MongoDB
async function startServer() {
    // D'abord connecter MongoDB
    await connectDB();
    
    // Puis démarrer le serveur
    app.listen(PORT, () => {
        console.log(`🚀 Serveur Sorbo-Ingénierie démarré sur le port ${PORT}`);
        console.log(`🌐 URL: http://localhost:${PORT}`);
        console.log(`🔐 Admin: http://localhost:${PORT}/admin-login`);
        console.log(`📊 Dashboard: http://localhost:${PORT}/admin-dashboard`);
        console.log(`🔒 API Admin: http://localhost:${PORT}/api/admin/auth`);
        console.log(`📁 Fichiers statiques servis depuis: ${__dirname}`);
        console.log(`🗄️ Base de données MongoDB connectée`);
    });
}

// Gestion de l'arrêt gracieux
process.on('SIGINT', async () => {
    console.log('\n🛑 Arrêt gracieux du serveur...');
    if (mongoose.connection.readyState === 1) {
        await mongoose.connection.close();
        console.log('🔌 Connexion MongoDB fermée');
    }
    process.exit(0);
});

process.on('SIGTERM', async () => {
    console.log('\n🛑 Arrêt gracieux du serveur...');
    if (mongoose.connection.readyState === 1) {
        await mongoose.connection.close();
        console.log('🔌 Connexion MongoDB fermée');
    }
    process.exit(0);
});

// Démarrer le serveur
startServer().catch(error => {
    console.error('❌ Erreur lors du démarrage:', error);
    process.exit(1);
});
