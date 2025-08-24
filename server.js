require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware de sécurité
app.use(helmet());
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Servir les fichiers statiques
app.use(express.static(path.join(__dirname)));

// Route racine
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
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

// Démarrage du serveur
app.listen(PORT, () => {
    console.log(`🚀 Serveur Sorbo-Ingénierie démarré sur le port ${PORT}`);
    console.log(`🌐 URL: http://localhost:${PORT}`);
    console.log(`📁 Fichiers statiques servis depuis: ${__dirname}`);
});

// Gestion de l'arrêt gracieux
process.on('SIGINT', () => {
    console.log('\n🛑 Arrêt gracieux du serveur...');
    process.exit(0);
});

process.on('SIGTERM', () => {
    console.log('\n🛑 Arrêt gracieux du serveur...');
    process.exit(0);
});
