require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const path = require('path');
const mongoose = require('mongoose');

const app = express();
const PORT = process.env.PORT || 5000;

// Connexion MongoDB Atlas
async function connectDB() {
    try {
        console.log('📡 Connexion à MongoDB Atlas...');
        console.log('🔗 URI:', process.env.MONGODB_URI ? 'Configuré' : 'Non configuré');
        
        await mongoose.connect(process.env.MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            serverSelectionTimeoutMS: 30000,
            socketTimeoutMS: 45000,
            connectTimeoutMS: 30000,
            maxPoolSize: 10,
            minPoolSize: 1,
            maxIdleTimeMS: 30000,
        });
        console.log('✅ Connexion MongoDB Atlas réussie !');
    } catch (error) {
        console.error('❌ Erreur de connexion MongoDB:', error.message);
        console.error('🔍 Détails de l\'erreur:', error);
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

// Servir les fichiers statiques (HTML, CSS, JS, images)
app.use(express.static(path.join(__dirname)));

// Route racine pour index.html
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Route pour les pages HTML
app.get('/:page', (req, res) => {
    const page = req.params.page;
    if (page.endsWith('.html')) {
        res.sendFile(path.join(__dirname, page));
    } else {
        res.sendFile(path.join(__dirname, `${page}.html`));
    }
});

// Route de santé
app.get('/api/health', (req, res) => {
    res.json({
        success: true,
        message: 'Serveur Railway Sorbo-Ingénierie opérationnel',
        timestamp: new Date().toISOString(),
        mongodb: mongoose.connection.readyState === 1 ? 'connecté' : 'déconnecté',
        uptime: process.uptime(),
        environment: process.env.NODE_ENV || 'development'
    });
});

// Route de test simple pour les actualités
app.get('/api/actualites-test', (req, res) => {
    try {
        const testData = [
            {
                id: 1,
                titre: "Test Actualité 1",
                resume: "Ceci est un test",
                date: new Date().toISOString(),
                source: 'test-route'
            }
        ];
        
        res.json({
            success: true,
            data: testData,
            message: 'Route de test des actualités fonctionne',
            source: 'test-route',
            count: testData.length
        });
    } catch (error) {
        res.status(200).json({
            success: true,
            data: [],
            message: 'Erreur dans la route de test',
            source: 'test-error',
            count: 0
        });
    }
});

// Route pour les formations
app.get('/api/formations', async (req, res) => {
    try {
        console.log('🎓 Récupération des formations depuis MongoDB Atlas...');
        
        // Récupérer depuis la collection formations
        const db = mongoose.connection.db;
        const formations = await db.collection('formations').find({}).toArray();
        
        console.log(`📚 ${formations.length} formations trouvées`);
        
        if (formations && formations.length > 0) {
            res.json({
                success: true,
                data: formations,
                message: 'Formations récupérées depuis MongoDB Atlas',
                source: 'mongodb',
                count: formations.length
            });
        } else {
            // Fallback vers des données statiques
            const formationsStatiques = [
                {
                    id: 1,
                    titre: "Formation AutoCAD",
                    description: "Maîtrisez AutoCAD pour la conception 2D et 3D",
                    duree: "40 heures",
                    niveau: "Débutant à Avancé",
                    prix: "1200€",
                    image: "images/formations/autocad.jpg"
                },
                {
                    id: 2,
                    titre: "Formation SolidWorks",
                    description: "Conception 3D et simulation avec SolidWorks",
                    duree: "35 heures",
                    niveau: "Intermédiaire",
                    prix: "1400€",
                    image: "images/formations/solidworks.jpg"
                }
            ];
            
            res.json({
                success: true,
                data: formationsStatiques,
                message: 'Formations récupérées depuis les données statiques (fallback)',
                source: 'static-fallback',
                count: formationsStatiques.length
            });
        }
    } catch (error) {
        console.error('❌ Erreur API formations:', error.message);
        res.status(500).json({
            success: false,
            message: 'Erreur lors de la récupération des formations',
            error: error.message
        });
    }
});

// Route pour les logiciels
app.get('/api/logiciels', async (req, res) => {
    try {
        console.log('💻 Récupération des logiciels depuis MongoDB Atlas...');
        
        // Récupérer depuis la collection logiciels
        const db = mongoose.connection.db;
        const logiciels = await db.collection('logiciels').find({}).toArray();
        
        console.log(`🔧 ${logiciels.length} logiciels trouvés`);
        
        if (logiciels && logiciels.length > 0) {
            res.json({
                success: true,
                data: logiciels,
                message: 'Logiciels récupérés depuis MongoDB Atlas',
                source: 'mongodb',
                count: logiciels.length
            });
        } else {
            // Fallback vers des données statiques
            const logicielsStatiques = [
                {
                    id: 1,
                    nom: "AutoCAD 2024",
                    version: "2024",
                    description: "Logiciel de CAO 2D/3D professionnel",
                    prix: "2200€/an",
                    image: "images/logiciels/autocad.jpg",
                    categorie: "CAO"
                },
                {
                    id: 2,
                    nom: "SolidWorks Premium",
                    version: "2024",
                    description: "Conception 3D, simulation et gestion de données",
                    prix: "4500€/an",
                    image: "images/logiciels/solidworks.jpg",
                    categorie: "CAO 3D"
                }
            ];
            
            res.json({
                success: true,
                data: logicielsStatiques,
                message: 'Logiciels récupérés depuis les données statiques (fallback)',
                source: 'static-fallback',
                count: logicielsStatiques.length
            });
        }
    } catch (error) {
        console.error('❌ Erreur API logiciels:', error.message);
        res.status(500).json({
            success: false,
            message: 'Erreur lors de la récupération des logiciels',
            error: error.message
        });
    }
});

// Route pour les actualités
app.get('/api/actualites', async (req, res) => {
    try {
        console.log('📰 Récupération des actualités depuis MongoDB Atlas...');
        
        // Vérifier que MongoDB est connecté
        if (mongoose.connection.readyState !== 1) {
            console.log('❌ MongoDB non connecté, utilisation des données statiques');
            return res.json({
                success: true,
                data: [],
                message: 'MongoDB non disponible, données statiques utilisées',
                source: 'static-fallback',
                count: 0
            });
        }
        
        // Récupérer depuis la collection actualites
        const db = mongoose.connection.db;
        
        // Vérifier si la collection existe
        const collections = await db.listCollections().toArray();
        const actualitesCollection = collections.find(col => col.name === 'actualites');
        
        if (!actualitesCollection) {
            console.log('❌ Collection actualites non trouvée');
            return res.json({
                success: true,
                data: [],
                message: 'Collection actualites non trouvée',
                source: 'static-fallback',
                count: 0
            });
        }
        
        const actualites = await db.collection('actualites').find({ statut: 'publie' }).toArray();
        
        console.log(`📰 ${actualites.length} actualités trouvées`);
        
        if (actualites && actualites.length > 0) {
            res.json({
                success: true,
                data: actualites,
                message: 'Actualités récupérées depuis MongoDB Atlas',
                source: 'mongodb',
                count: actualites.length
            });
        } else {
            res.json({
                success: true,
                data: [],
                message: 'Aucune actualité publiée trouvée',
                source: 'mongodb',
                count: 0
            });
        }
    } catch (error) {
        console.error('❌ Erreur API actualités:', error.message);
        console.error('🔍 Stack trace:', error.stack);
        
        // En cas d'erreur, renvoyer un tableau vide plutôt qu'une erreur 500
        res.status(200).json({
            success: true,
            data: [],
            message: 'Erreur lors de la récupération des actualités, données vides retournées',
            source: 'error-fallback',
            count: 0,
            error: process.env.NODE_ENV === 'development' ? error.message : 'Erreur interne'
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

// Gestion globale des erreurs
app.use((error, req, res, next) => {
    console.error('Erreur serveur:', error);
    res.status(500).json({
        success: false,
        message: 'Erreur interne du serveur',
        error: process.env.NODE_ENV === 'development' ? error.message : 'Erreur interne'
    });
});

// Démarrage du serveur avec MongoDB
async function startServer() {
    // D'abord connecter MongoDB
    await connectDB();
    
    // Puis démarrer le serveur
    app.listen(PORT, () => {
        console.log(`🚀 Serveur Railway Sorbo-Ingénierie démarré sur le port ${PORT}`);
        console.log(`🌐 URL: http://localhost:${PORT}`);
        console.log(`🗄️ Base de données MongoDB Atlas connectée`);
        console.log(`🔌 API Health: http://localhost:${PORT}/api/health`);
        console.log(`🔌 API Formations: http://localhost:${PORT}/api/formations`);
        console.log(`🔌 API Logiciels: http://localhost:${PORT}/api/logiciels`);
        console.log(`🔌 API Actualités: http://localhost:${PORT}/api/actualites`);
        console.log(`🌍 CORS activé pour: https://sorbo-ingenierie.netlify.app`);
        console.log(`📁 Fichiers statiques servis depuis: ${__dirname}`);
    });
}

// Gestion de l'arrêt gracieux
process.on('SIGINT', async () => {
    console.log('\n🛑 Arrêt gracieux du serveur Railway...');
    if (mongoose.connection.readyState === 1) {
        await mongoose.connection.close();
        console.log('🔌 Connexion MongoDB fermée');
    }
    process.exit(0);
});

process.on('SIGTERM', async () => {
    console.log('\n🛑 Arrêt gracieux du serveur Railway...');
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
