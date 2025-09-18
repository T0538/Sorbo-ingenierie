const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Connexion MongoDB
mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => console.log('✅ MongoDB connecté'))
.catch(err => console.error('❌ Erreur MongoDB:', err));

// Modèle Contact simple
const Contact = mongoose.model('Contact', {
    name: String,
    email: String,
    phone: String,
    subject: String,
    message: String,
    createdAt: { type: Date, default: Date.now }
});

// Modèle Formation simple
const Formation = mongoose.model('Formation', {
    titre: String,
    description: String,
    categorie: String,
    niveau: String,
    prix: Number,
    duree: String,
    disponible: { type: Boolean, default: true },
    createdAt: { type: Date, default: Date.now }
});

// Routes de test
app.get('/api/health', (req, res) => {
    res.json({
        status: 'OK',
        message: 'Serveur de test Sorbo Ingénierie',
        timestamp: new Date().toISOString(),
        mongoConnected: mongoose.connection.readyState === 1
    });
});

// Route de test pour les formations
app.get('/api/formations', async (req, res) => {
    try {
        const formations = await Formation.find();
        res.json({ success: true, data: formations });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// Route pour ajouter une formation
app.post('/api/formations', async (req, res) => {
    try {
        const formation = new Formation(req.body);
        await formation.save();
        res.status(201).json({ success: true, data: formation });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// Route de test pour les contacts
app.get('/api/contacts', async (req, res) => {
    try {
        const contacts = await Contact.find().sort({ createdAt: -1 });
        res.json({ success: true, data: contacts });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// Route pour ajouter un contact
app.post('/api/contact', async (req, res) => {
    try {
        const contact = new Contact(req.body);
        await contact.save();
        res.status(201).json({ success: true, data: contact });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// Route d'administration simple
app.get('/api/admin/stats', (req, res) => {
    res.json({
        success: true,
        data: {
            contacts: 0,
            formations: 0,
            actualites: 0,
            logiciels: 0,
            emplois: 0,
            actualitesPubliees: 0
        }
    });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`🚀 Serveur de test démarré sur le port ${PORT}`);
    console.log(`📊 Health check: http://localhost:${PORT}/api/health`);
    console.log(`🎓 Formations: http://localhost:${PORT}/api/formations`);
    console.log(`📞 Contacts: http://localhost:${PORT}/api/contacts`);
    console.log(`📊 Stats: http://localhost:${PORT}/api/admin/stats`);
});











