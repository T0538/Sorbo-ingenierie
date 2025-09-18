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

// Configuration CORS ULTRA PERMISSIVE pour résoudre définitivement le problème
app.use(cors({
    origin: '*', // Permettre TOUS les domaines
    credentials: false, // Désactiver pour éviter les problèmes
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
    allowedHeaders: ['*'], // Permettre tous les headers
    exposedHeaders: ['*'],
    optionsSuccessStatus: 200
}));

// Middleware pour gérer les requêtes OPTIONS (preflight)
app.options('*', (req, res) => {
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

// Middleware de debug CORS
app.use((req, res, next) => {
    console.log(`🌐 ${req.method} ${req.path} - Origin: ${req.get('Origin') || 'No Origin'}`);
    
    // Ajouter manuellement les headers CORS
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
    res.json({
        success: true,
        message: 'Serveur Railway Sorbo-Ingénierie opérationnel (CORS FIXED)',
        timestamp: new Date().toISOString(),
        mongodb: mongoose.connection.readyState === 1 ? 'connecté' : 'déconnecté',
        uptime: process.uptime(),
        origin: req.get('Origin'),
        cors: 'enabled'
    });
});

// Route API info
app.get('/api/info', (req, res) => {
    res.json({
        success: true,
        message: '🚀 API Sorbo Ingénierie - Railway (CORS FIXED)',
        version: '2.0.3',
        endpoints: {
            health: '/api/health',
            actualites: '/api/actualites',
            formations: '/api/formations',
            logiciels: '/api/logiciels'
        },
        status: 'opérationnel',
        mongodb: mongoose.connection.readyState === 1 ? 'connecté' : 'déconnecté',
        cors: 'enabled'
    });
});

// Routes API avec gestion d'erreur robuste
app.get('/api/logiciels', async (req, res) => {
    try {
        console.log('📡 Requête /api/logiciels reçue');
        
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
                ]
            });
        }

        // Essayer de charger depuis MongoDB
        try {
            const Logiciel = require('./backend/models/Logiciel');
            const logiciels = await Logiciel.find();
            
            console.log(`✅ ${logiciels.length} logiciels chargés depuis MongoDB`);
            res.json({
                success: true,
                data: logiciels
            });
        } catch (modelError) {
            console.log('⚠️ Modèle Logiciel non trouvé, utilisation des données de fallback');
            res.json({
                success: true,
                data: [
                    {
                        id: 'fallback-1',
                        nom: 'OH-Route v1.1',
                        description: 'Logiciel d\'hydrologie et d\'assainissement routier',
                        version: '1.1.0'
                    }
                ]
            });
        }
        
    } catch (error) {
        console.error('❌ Erreur /api/logiciels:', error.message);
        res.status(500).json({
            success: false,
            message: 'Erreur serveur',
            error: error.message
        });
    }
});

app.get('/api/formations', async (req, res) => {
    try {
        console.log('📡 Requête /api/formations reçue');
        
        if (mongoose.connection.readyState !== 1) {
            return res.json({
                success: true,
                data: [
                    {
                        id: 'fallback-1',
                        titre: 'Formation AutoCAD 2025',
                        description: 'Formation complète AutoCAD 2025'
                    }
                ]
            });
        }

        try {
            const Formation = require('./backend/models/Formation');
            const formations = await Formation.find();
            
            console.log(`✅ ${formations.length} formations chargées depuis MongoDB`);
            res.json({ success: true, data: formations });
        } catch (modelError) {
            res.json({
                success: true,
                data: [
                    {
                        id: 'fallback-1',
                        titre: 'Formation AutoCAD 2025',
                        description: 'Formation complète AutoCAD 2025'
                    }
                ]
            });
        }
        
    } catch (error) {
        console.error('❌ Erreur /api/formations:', error.message);
        res.status(500).json({
            success: false,
            message: 'Erreur serveur',
            error: error.message
        });
    }
});

app.get('/api/actualites', async (req, res) => {
    try {
        console.log('📡 Requête /api/actualites reçue');
        
        if (mongoose.connection.readyState !== 1) {
            return res.json({
                success: true,
                data: [
                    {
                        id: 'fallback-1',
                        titre: 'Actualité de démonstration',
                        contenu: 'Contenu de démonstration'
                    }
                ]
            });
        }

        try {
            const Actualite = require('./backend/models/Actualite');
            const actualites = await Actualite.find();
            
            console.log(`✅ ${actualites.length} actualités chargées depuis MongoDB`);
            res.json({ success: true, data: actualites });
        } catch (modelError) {
            res.json({
                success: true,
                data: [
                    {
                        id: 'fallback-1',
                        titre: 'Actualité de démonstration',
                        contenu: 'Contenu de démonstration'
                    }
                ]
            });
        }
        
    } catch (error) {
        console.error('❌ Erreur /api/actualites:', error.message);
        res.status(500).json({
            success: false,
            message: 'Erreur serveur',
            error: error.message
        });
    }
});

// Gestion des erreurs 404
app.use('*', (req, res) => {
    console.log(`❌ Route non trouvée: ${req.method} ${req.originalUrl}`);
    res.status(404).json({
        success: false,
        message: 'Route non trouvée',
        path: req.originalUrl
    });
});

// Gestion des erreurs globales
app.use((error, req, res, next) => {
    console.error('❌ Erreur serveur:', error);
    res.status(500).json({
        success: false,
        message: 'Erreur interne du serveur',
        error: process.env.NODE_ENV === 'development' ? error.message : 'Erreur serveur'
    });
});

// Démarrage du serveur
async function startServer() {
    console.log('🚀 Démarrage du serveur Railway Sorbo-Ingénierie (CORS FIXED)...');
    
    // Essayer de se connecter à MongoDB (non bloquant)
    const mongoConnected = await connectToMongoDB();
    
    if (!mongoConnected) {
        console.log('⚠️ MongoDB non connecté, mais le serveur démarre quand même avec des données de fallback');
    }
    
    app.listen(PORT, () => {
        console.log(`🚀 Serveur Railway Sorbo-Ingénierie démarré sur le port ${PORT}`);
        console.log(`🌐 URL: https://sorbo-api-production.up.railway.app`);
        console.log(`💚 Santé: https://sorbo-api-production.up.railway.app/api/health`);
        console.log(`📊 MongoDB: ${mongoConnected ? 'Connecté' : 'Non connecté (mode fallback)'}`);
        console.log(`🌐 CORS: Activé pour tous les domaines`);
    });
}

// Démarrer le serveur
startServer().catch(error => {
    console.error('❌ Erreur de démarrage:', error);
    process.exit(1);
});
