const express = require('express');
const path = require('path');

const app = express();
const PORT = 3000;

// Servir les fichiers statiques
app.use(express.static('.'));

// Route pour tester
app.get('/test', (req, res) => {
    res.json({ message: 'Serveur de test fonctionne!' });
});

app.listen(PORT, () => {
    console.log(`🚀 Serveur de test démarré sur http://localhost:${PORT}`);
    console.log(`📁 Fichiers servis depuis: ${__dirname}`);
    console.log(`🌐 Ouvrez: http://localhost:${PORT}/nos-formations.html`);
    console.log(`🔗 API Render: https://sorbo-ingenierie-1.onrender.com`);
}); 