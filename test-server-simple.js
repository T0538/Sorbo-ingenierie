// Serveur de test simple pour vérifier CORS
const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3001;

// CORS très permissif pour les tests
app.use(cors({
    origin: '*', // Permettre tous les domaines pour les tests
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Accept']
}));

app.use(express.json());

// Middleware de debug
app.use((req, res, next) => {
    console.log(`🌐 ${req.method} ${req.path} - Origin: ${req.get('Origin') || 'No Origin'}`);
    next();
});

// Route de test
app.get('/api/test', (req, res) => {
    res.json({
        success: true,
        message: 'Test server fonctionne !',
        timestamp: new Date().toISOString(),
        origin: req.get('Origin')
    });
});

// Route de santé
app.get('/api/health', (req, res) => {
    res.json({
        success: true,
        message: 'Serveur de test opérationnel',
        timestamp: new Date().toISOString(),
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
                nom: 'Logiciel Test 1',
                description: 'Description du logiciel test',
                version: '1.0.0'
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

app.listen(PORT, () => {
    console.log(`🧪 Serveur de test démarré sur le port ${PORT}`);
    console.log(`🌐 Test: http://localhost:${PORT}/api/health`);
});
