require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const mongoose = require('mongoose');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5000;

// Connexion MongoDB Atlas
async function connectDB() {
    try {
        console.log('📡 Connexion à MongoDB Atlas...');
        
        // Vérifier que l'URI MongoDB est définie
        if (!process.env.MONGODB_URI) {
            console.error('❌ MONGODB_URI non définie dans les variables d\'environnement');
            console.log('💡 Créez un fichier .env avec MONGODB_URI=mongodb+srv://...');
            process.exit(1);
        }
        
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('✅ Connexion MongoDB Atlas réussie !');
    } catch (error) {
        console.error('❌ Erreur de connexion MongoDB:', error.message);
        console.log('💡 Vérifiez votre URI MongoDB et votre connexion internet');
        process.exit(1);
    }
}

// Middleware de sécurité
app.use(helmet());
app.use(cors({
    origin: ['https://sorbo-ingenierie.netlify.app', 'http://localhost:3000', 'http://localhost:5000'],
    credentials: true
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Servir les fichiers statiques
app.use(express.static(path.join(__dirname)));


// Route racine - Servir index.html
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Route API info
app.get('/api/info', (req, res) => {
    res.json({
        success: true,
        message: '🚀 API Sorbo Ingénierie - Railway (Corrigée)',
        version: '2.0.0',
        endpoints: {
            health: '/api/health',
            actualites: '/api/actualites',
            formations: '/api/formations',
            logiciels: '/api/logiciels'
        },
        status: 'opérationnel',
        mongodb: mongoose.connection.readyState === 1 ? 'connecté' : 'déconnecté'
    });
});

// Route de santé
app.get('/api/health', (req, res) => {
    res.json({
        success: true,
        message: 'Serveur Railway Sorbo-Ingénierie opérationnel',
        timestamp: new Date().toISOString(),
        mongodb: mongoose.connection.readyState === 1 ? 'connecté' : 'déconnecté',
        uptime: process.uptime()
    });
});

// Route pour les actualités (utilisant le modèle et contrôleur appropriés)
app.get('/api/actualites', async (req, res) => {
    try {
        console.log('📰 Récupération des actualités...');
        
        // Vérifier la connexion MongoDB
        if (mongoose.connection.readyState !== 1) {
            console.log('⚠️ MongoDB non connecté, utilisation du fallback');
            return res.status(200).json({
                success: true,
                data: [],
                message: 'MongoDB non disponible',
                source: 'fallback'
            });
        }
        
        // Utiliser le modèle Actualite au lieu de la collection brute
        const Actualite = require('./backend/models/Actualite');
        
        const limitParam = parseInt(req.query.limit, 10);
        const limit = Number.isFinite(limitParam) ? Math.min(Math.max(limitParam, 1), 100) : 50;
        
        const actualites = await Actualite.find({ statut: 'publie' })
            .sort({ datePublication: -1, createdAt: -1 })
            .limit(limit)
            .lean();
        
        console.log(`📰 ${actualites.length} actualités trouvées`);
        
        res.json({
            success: true,
            data: actualites,
            message: 'Actualités récupérées avec succès',
            source: 'mongodb',
            count: actualites.length
        });
        
    } catch (error) {
        console.error('❌ Erreur API actualités:', error.message);
        
        // En cas d'erreur, renvoyer un tableau vide au lieu d'une erreur 500
        res.status(200).json({
            success: true,
            data: [],
            message: 'Erreur lors de la récupération des actualités',
            source: 'error-fallback',
            count: 0,
            error: error.message
        });
    }
});

// Route pour les formations
app.get('/api/formations', async (req, res) => {
    try {
        console.log('🎓 Récupération des formations...');
        
        if (mongoose.connection.readyState !== 1) {
            return res.json({
                success: true,
                data: [],
                message: 'MongoDB non disponible',
                source: 'fallback'
            });
        }
        
        const db = mongoose.connection.db;
        const formations = await db.collection('formations').find({}).toArray();
        
        console.log(`📚 ${formations.length} formations trouvées`);
        
        res.json({
            success: true,
            data: formations,
            message: 'Formations récupérées',
            source: 'mongodb',
            count: formations.length
        });
        
    } catch (error) {
        console.error('❌ Erreur API formations:', error.message);
        res.status(200).json({
            success: true,
            data: [],
            message: 'Erreur lors de la récupération',
            source: 'error-fallback',
            count: 0
        });
    }
});

// Route pour les logiciels
app.get('/api/logiciels', async (req, res) => {
    try {
        console.log('💻 Récupération des logiciels...');
        
        if (mongoose.connection.readyState !== 1) {
            return res.json({
                success: true,
                data: [],
                message: 'MongoDB non disponible',
                source: 'fallback'
            });
        }
        
        const db = mongoose.connection.db;
        const logiciels = await db.collection('logiciels').find({}).toArray();
        
        console.log(`🔧 ${logiciels.length} logiciels trouvés`);
        
        res.json({
            success: true,
            data: logiciels,
            message: 'Logiciels récupérés',
            source: 'mongodb',
            count: logiciels.length
        });
        
    } catch (error) {
        console.error('❌ Erreur API logiciels:', error.message);
        res.status(200).json({
            success: true,
            data: [],
            message: 'Erreur lors de la récupération',
            source: 'error-fallback',
            count: 0
        });
    }
});

// Gestion des routes HTML pour le routage côté client
app.get('/*.html', (req, res) => {
    const htmlFile = req.path.substring(1); // Enlever le slash initial
    res.sendFile(path.join(__dirname, htmlFile));
});

// Redirection des routes non-API vers index.html pour le routage côté client
app.get('*', (req, res, next) => {
    if (req.path.startsWith('/api/')) {
        // Si c'est une route API, passer au gestionnaire d'erreur 404
        next();
    } else {
        // Sinon, servir index.html pour le routage côté client
        res.sendFile(path.join(__dirname, 'index.html'));
    }
});

// Gestion des erreurs 404 pour les routes API
app.use('/api/*', (req, res) => {
    res.status(404).json({
        success: false,
        message: 'Route API non trouvée',
        path: req.originalUrl
    });
});

// Démarrage du serveur
async function startServer() {
    await connectDB();
    
    app.listen(PORT, () => {
        console.log(`🚀 API Sorbo Ingénierie démarrée sur le port ${PORT}`);
        console.log(`🔌 Endpoints disponibles:`);
        console.log(`   - /api/health`);
        console.log(`   - /api/actualites`);
        console.log(`   - /api/formations`);
        console.log(`   - /api/logiciels`);
        console.log(`📡 MongoDB: ${mongoose.connection.readyState === 1 ? 'Connecté' : 'Déconnecté'}`);
    });
}

// Gestion de l'arrêt gracieux
process.on('SIGINT', async () => {
    console.log('\n🛑 Arrêt gracieux...');
    if (mongoose.connection.readyState === 1) {
        await mongoose.connection.close();
    }
    process.exit(0);
});

startServer().catch(error => {
    console.error('❌ Erreur lors du démarrage:', error);
    process.exit(1);
});
