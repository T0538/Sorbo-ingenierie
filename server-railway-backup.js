require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const mongoose = require('mongoose');

const app = express();
const PORT = process.env.PORT || 5000;

// Connexion MongoDB Atlas
async function connectDB() {
    try {
        console.log('📡 Connexion à MongoDB Atlas...');
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('✅ Connexion MongoDB Atlas réussie !');
    } catch (error) {
        console.error('❌ Erreur de connexion MongoDB:', error.message);
        process.exit(1);
    }
}

// Middleware de sécurité
app.use(helmet());
app.use(cors({
    origin: ['https://sorbo-ingenierie.netlify.app', 'http://localhost:3000'],
    credentials: true
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Route racine - API info
app.get('/', (req, res) => {
    res.json({
        success: true,
        message: '🚀 API Sorbo Ingénierie - Railway',
        version: '1.0.0',
        endpoints: {
            health: '/api/health',
            actualites: '/api/actualites',
            formations: '/api/formations',
            logiciels: '/api/logiciels'
        },
        status: 'opérationnel'
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

// Route pour les actualités
app.get('/api/actualites', async (req, res) => {
    try {
        console.log('📰 Récupération des actualités...');
        
        if (mongoose.connection.readyState !== 1) {
            return res.json({
                success: true,
                data: [],
                message: 'MongoDB non disponible',
                source: 'fallback'
            });
        }
        
        const db = mongoose.connection.db;
        const actualites = await db.collection('actualites').find({ statut: 'publie' }).toArray();
        
        console.log(`📰 ${actualites.length} actualités trouvées`);
        
        res.json({
            success: true,
            data: actualites,
            message: 'Actualités récupérées',
            source: 'mongodb',
            count: actualites.length
        });
        
    } catch (error) {
        console.error('❌ Erreur API actualités:', error.message);
        res.status(200).json({
            success: true,
            data: [],
            message: 'Erreur lors de la récupération',
            source: 'error-fallback',
            count: 0
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

// Gestion des erreurs 404
app.use('*', (req, res) => {
    res.status(404).json({
        success: false,
        message: 'Route non trouvée',
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
