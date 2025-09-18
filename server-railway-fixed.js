require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const path = require('path');
const mongoose = require('mongoose');

const app = express();
const PORT = process.env.PORT || 5000;

// Connexion MongoDB
async function connectToMongoDB() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('✅ Connexion MongoDB Atlas réussie !');
    } catch (error) {
        console.error('❌ Erreur de connexion MongoDB:', error.message);
        console.log('💡 Vérifiez votre URI MongoDB et votre connexion internet');
        process.exit(1);
    }
}

// Initialiser MongoDB
connectToMongoDB();

// Configuration CORS très permissive pour résoudre le problème
app.use(cors({
    origin: '*', // Permettre tous les domaines temporairement
    credentials: false, // Désactiver temporairement
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Accept']
}));

// Middleware de sécurité simplifié
app.use(helmet({
    crossOriginEmbedderPolicy: false,
    crossOriginResourcePolicy: false
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Middleware de debug
app.use((req, res, next) => {
    console.log(`🌐 ${req.method} ${req.path} - Origin: ${req.get('Origin') || 'No Origin'}`);
    next();
});

// Servir les fichiers statiques
app.use(express.static(path.join(__dirname)));

// Route racine - Servir index.html
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Route de santé - PRIORITÉ
app.get('/api/health', (req, res) => {
    res.json({
        success: true,
        message: 'Serveur Railway Sorbo-Ingénierie opérationnel (FIXED)',
        timestamp: new Date().toISOString(),
        mongodb: mongoose.connection.readyState === 1 ? 'connecté' : 'déconnecté',
        uptime: process.uptime(),
        origin: req.get('Origin')
    });
});

// Route API info
app.get('/api/info', (req, res) => {
    res.json({
        success: true,
        message: '🚀 API Sorbo Ingénierie - Railway (FIXED)',
        version: '2.0.1',
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

// Routes API avec gestion d'erreur améliorée
app.get('/api/logiciels', async (req, res) => {
    try {
        // Import dynamique pour éviter les erreurs si le modèle n'existe pas
        const Logiciel = require('./backend/models/Logiciel');
        const logiciels = await Logiciel.find();
        
        res.json({
            success: true,
            data: logiciels
        });
    } catch (error) {
        console.error('❌ Erreur /api/logiciels:', error.message);
        
        // Données de fallback
        res.json({
            success: true,
            data: [
                {
                    id: 'fallback-1',
                    nom: 'Logiciel Fallback 1',
                    description: 'Données de fallback - MongoDB non accessible',
                    version: '1.0.0'
                }
            ]
        });
    }
});

app.get('/api/formations', async (req, res) => {
    try {
        const Formation = require('./backend/models/Formation');
        const formations = await Formation.find();
        
        res.json({
            success: true,
            data: formations
        });
    } catch (error) {
        console.error('❌ Erreur /api/formations:', error.message);
        
        res.json({
            success: true,
            data: [
                {
                    id: 'fallback-1',
                    titre: 'Formation Fallback 1',
                    description: 'Données de fallback - MongoDB non accessible'
                }
            ]
        });
    }
});

app.get('/api/actualites', async (req, res) => {
    try {
        const Actualite = require('./backend/models/Actualite');
        const actualites = await Actualite.find();
        
        res.json({
            success: true,
            data: actualites
        });
    } catch (error) {
        console.error('❌ Erreur /api/actualites:', error.message);
        
        res.json({
            success: true,
            data: [
                {
                    id: 'fallback-1',
                    titre: 'Actualité Fallback 1',
                    contenu: 'Données de fallback - MongoDB non accessible'
                }
            ]
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
app.listen(PORT, () => {
    console.log(`🚀 Serveur Railway Sorbo-Ingénierie démarré sur le port ${PORT}`);
    console.log(`🌐 URL: https://sorbo-ingenierie-production.up.railway.app`);
    console.log(`💚 Santé: https://sorbo-ingenierie-production.up.railway.app/api/health`);
});
