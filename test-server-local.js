// Test local du serveur Railway
const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = 3001;

// CORS permissif
app.use(cors({
    origin: '*',
    credentials: false,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Accept']
}));

app.use(express.json());

// Middleware de debug
app.use((req, res, next) => {
    console.log(`🌐 ${req.method} ${req.path} - Origin: ${req.get('Origin') || 'No Origin'}`);
    next();
});

// Route de santé
app.get('/api/health', (req, res) => {
    res.json({
        success: true,
        message: 'Serveur de test local opérationnel',
        timestamp: new Date().toISOString(),
        mongodb: 'simulé',
        uptime: process.uptime(),
        origin: req.get('Origin')
    });
});

// Route pour les logiciels (données de test)
app.get('/api/logiciels', (req, res) => {
    res.json({
        success: true,
        data: [
            {
                id: 'test-1',
                nom: 'OH-Route v1.1',
                description: 'Logiciel d\'hydrologie et d\'assainissement routier',
                version: '1.1.0',
                imageUrl: 'images/oh-route-logo.png',
                downloadUrl: 'downloads/OH-Route v1.1.exe'
            },
            {
                id: 'test-2',
                nom: 'Logiciel Test 2',
                description: 'Description du logiciel test 2',
                version: '2.0.0'
            }
        ]
    });
});

// Route pour les formations (données de test)
app.get('/api/formations', (req, res) => {
    res.json({
        success: true,
        data: [
            {
                id: 'test-1',
                titre: 'Formation AutoCAD 2025',
                description: 'Formation complète AutoCAD 2025',
                duree: '40 heures'
            },
            {
                id: 'test-2',
                titre: 'Formation Robot Structural Analysis',
                description: 'Formation Robot Structural Analysis',
                duree: '30 heures'
            }
        ]
    });
});

// Route pour les actualités (données de test)
app.get('/api/actualites', (req, res) => {
    res.json({
        success: true,
        data: [
            {
                id: 'test-1',
                titre: 'Lancement officiel de OH-Route v1.1',
                contenu: 'Nous avons le plaisir d\'annoncer la sortie de la version 1.1 de notre logiciel OH-Route.',
                datePublication: new Date().toISOString()
            }
        ]
    });
});

app.listen(PORT, () => {
    console.log(`🧪 Serveur de test local démarré sur le port ${PORT}`);
    console.log(`🌐 Test: http://localhost:${PORT}/api/health`);
    console.log(`📊 Logiciels: http://localhost:${PORT}/api/logiciels`);
    console.log(`📚 Formations: http://localhost:${PORT}/api/formations`);
    console.log(`📰 Actualités: http://localhost:${PORT}/api/actualites`);
});
