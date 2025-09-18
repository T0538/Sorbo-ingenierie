require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const path = require('path');
const mongoose = require('mongoose');

const app = express();
const PORT = process.env.PORT || 5000;

// Connexion MongoDB avec gestion d'erreur améliorée
async function connectToMongoDB() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('✅ Connexion MongoDB Atlas réussie !');
        return true;
    } catch (error) {
        console.error('❌ Erreur de connexion MongoDB:', error.message);
        console.log('💡 Vérifiez votre URI MongoDB et votre connexion internet');
        return false;
    }
}

// Configuration CORS ULTRA PERMISSIVE spécialement pour sorbo-ingenierie.ci
app.use(cors({
    origin: function (origin, callback) {
        // Permettre tous les domaines, y compris le nouveau domaine
        console.log(`🌐 Origin reçu: ${origin || 'No Origin'}`);
        callback(null, true);
    },
    credentials: false,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
    allowedHeaders: ['*'],
    exposedHeaders: ['*'],
    optionsSuccessStatus: 200
}));

// Middleware pour gérer les requêtes OPTIONS (preflight)
app.options('*', (req, res) => {
    console.log(`🔄 OPTIONS request from: ${req.get('Origin') || 'No Origin'}`);
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS, PATCH');
    res.header('Access-Control-Allow-Headers', '*');
    res.header('Access-Control-Allow-Credentials', 'false');
    res.status(200).end();
});

// Middleware de sécurité simplifié
app.use(helmet({
    crossOriginEmbedderPolicy: false,
    crossOriginResourcePolicy: false,
    crossOriginOpenerPolicy: false
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Middleware de debug CORS avec logging détaillé
app.use((req, res, next) => {
    const origin = req.get('Origin');
    console.log(`🌐 ${req.method} ${req.path} - Origin: ${origin || 'No Origin'}`);
    
    // Ajouter manuellement les headers CORS pour tous les domaines
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS, PATCH');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Accept, Origin, X-Requested-With');
    res.header('Access-Control-Allow-Credentials', 'false');
    
    next();
});

// Servir les fichiers statiques
app.use(express.static(path.join(__dirname)));

// Route racine - Servir index.html
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Route de santé - TOUJOURS FONCTIONNELLE
app.get('/api/health', (req, res) => {
    const origin = req.get('Origin');
    console.log(`💚 Health check from: ${origin || 'No Origin'}`);
    
    res.json({
        success: true,
        message: 'Serveur Railway Sorbo-Ingénierie opérationnel (NEW DOMAIN SUPPORT)',
        timestamp: new Date().toISOString(),
        mongodb: mongoose.connection.readyState === 1 ? 'connecté' : 'déconnecté',
        uptime: process.uptime(),
        origin: origin,
        cors: 'enabled-for-all-domains',
        newDomain: 'sorbo-ingenierie.ci-supported'
    });
});

// Route API info
app.get('/api/info', (req, res) => {
    res.json({
        success: true,
        message: '🚀 API Sorbo Ingénierie - Railway (NEW DOMAIN SUPPORT)',
        version: '2.0.4',
        endpoints: {
            health: '/api/health',
            actualites: '/api/actualites',
            formations: '/api/formations',
            logiciels: '/api/logiciels'
        },
        status: 'opérationnel',
        mongodb: mongoose.connection.readyState === 1 ? 'connecté' : 'déconnecté',
        cors: 'enabled-for-all-domains',
        supportedDomains: ['sorbo-ingenierie.ci', 'sorbo-ingenierie.netlify.app', '*']
    });
});

// Routes API avec gestion d'erreur robuste
app.get('/api/logiciels', async (req, res) => {
    try {
        // Vérifier si MongoDB est connecté
        if (mongoose.connection.readyState !== 1) {
            console.log('⚠️ MongoDB non connecté, utilisation des données de fallback');
            return res.json({
                success: true,
                data: [
                    {
                        id: 'fallback-1',
                        nom: 'OH-Route v1.1',
                        description: 'Logiciel d\'hydrologie et d\'assainissement routier',
                        version: '1.1.0',
                        imageUrl: 'images/oh-route-logo.png',
                        downloadUrl: 'downloads/OH-Route v1.1.exe'
                    }
                ],
                source: 'fallback'
            });
        }

        // Essayer de charger depuis MongoDB
        try {
            const Logiciel = require('./backend/models/Logiciel');
            const logiciels = await Logiciel.find();
            
            res.json({
                success: true,
                data: logiciels,
                source: 'mongodb'
            });
            
        } catch (modelError) {
            console.log('⚠️ Erreur modèle Logiciel, utilisation des données de fallback');
            res.json({
                success: true,
                data: [
                    {
                        id: 'fallback-1',
                        nom: 'OH-Route v1.1',
                        description: 'Logiciel d\'hydrologie et d\'assainissement routier',
                        version: '1.1.0',
                        imageUrl: 'images/oh-route-logo.png',
                        downloadUrl: 'downloads/OH-Route v1.1.exe'
                    }
                ],
                source: 'fallback'
            });
        }
        
    } catch (error) {
        console.error('❌ Erreur API logiciels:', error.message);
        res.status(200).json({
            success: true,
            data: [],
            message: 'Erreur lors de la récupération',
            source: 'error-fallback'
        });
    }
});

app.get('/api/formations', async (req, res) => {
    try {
        if (mongoose.connection.readyState !== 1) {
            console.log('⚠️ MongoDB non connecté pour formations');
            return res.json({
                success: true,
                data: [],
                source: 'fallback'
            });
        }

        try {
            const Formation = require('./backend/models/Formation');
            const formations = await Formation.find();
            
            res.json({
                success: true,
                data: formations,
                source: 'mongodb'
            });
            
        } catch (modelError) {
            console.log('⚠️ Erreur modèle Formation');
            res.json({
                success: true,
                data: [],
                source: 'fallback'
            });
        }
        
    } catch (error) {
        console.error('❌ Erreur API formations:', error.message);
        res.status(200).json({
            success: true,
            data: [],
            source: 'error-fallback'
        });
    }
});

app.get('/api/actualites', async (req, res) => {
    try {
        if (mongoose.connection.readyState !== 1) {
            console.log('⚠️ MongoDB non connecté pour actualités');
            return res.json({
                success: true,
                data: [],
                source: 'fallback'
            });
        }

        try {
            const Actualite = require('./backend/models/Actualite');
            const actualites = await Actualite.find().sort({ datePublication: -1 });
            
            res.json({
                success: true,
                data: actualites,
                source: 'mongodb'
            });
            
        } catch (modelError) {
            console.log('⚠️ Erreur modèle Actualite');
            res.json({
                success: true,
                data: [],
                source: 'fallback'
            });
        }
        
    } catch (error) {
        console.error('❌ Erreur API actualités:', error.message);
        res.status(200).json({
            success: true,
            data: [],
            source: 'error-fallback'
        });
    }
});

// Gestion des routes non trouvées
app.use('*', (req, res) => {
    res.status(404).json({
        success: false,
        message: 'Route non trouvée',
        path: req.originalUrl
    });
});

// Gestion des erreurs globales
app.use((error, req, res, next) => {
    console.error('❌ Erreur serveur:', error.message);
    res.status(500).json({
        success: false,
        message: 'Erreur serveur interne'
    });
});

// Démarrage du serveur
async function startServer() {
    try {
        // Connecter à MongoDB
        await connectToMongoDB();
        
        // Démarrer le serveur
        app.listen(PORT, () => {
            console.log(`🚀 Serveur Railway démarré sur le port ${PORT}`);
            console.log(`🌐 URL: https://sorbo-api-production.up.railway.app`);
            console.log(`💚 Santé: https://sorbo-api-production.up.railway.app/api/health`);
            console.log(`🆕 Support nouveau domaine: sorbo-ingenierie.ci`);
            console.log(`🔧 CORS: Activé pour tous les domaines`);
        });
        
    } catch (error) {
        console.error('❌ Erreur de démarrage:', error.message);
        process.exit(1);
    }
}

startServer().catch(error => {
    console.error('❌ Erreur fatale:', error.message);
    process.exit(1);
});