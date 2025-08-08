const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();

// CORS sécurisé avec validation d'origine
const allowedOrigins = [
  process.env.FRONTEND_URL,
  'https://sorbo-ingenierie.netlify.app',
  'https://sorbo-ingenierie.vercel.app',
  'http://localhost:3000',
  'http://localhost:5000',
  'http://localhost:8080',
  'http://127.0.0.1:5500',
  'http://127.0.0.1:3000'
].filter(Boolean);

app.use(cors({
  origin: function (origin, callback) {
    // Autoriser requêtes sans en-tête Origin (curl, santé Railway, etc.)
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) return callback(null, true);
    // Refuser silencieusement (pas d'erreur 500)
    return callback(null, false);
  },
  credentials: true,
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Connexion MongoDB pour les routes dynamiques
if (process.env.MONGODB_URI) {
  mongoose
    .connect(process.env.MONGODB_URI)
    .then(() => console.log('✅ MongoDB connecté (production)'))
    .catch((err) => console.error('❌ Échec connexion MongoDB:', err.message));
}

// Routes dynamiques (MongoDB)
try {
  const formationRoutes = require('./routes/formation');
  const logicielRoutes = require('./routes/logicielRoutes');
  const emploiRoutes = require('./routes/emploiRoutes');
  const actualiteRoutes = require('./routes/actualiteRoutes');
  app.use('/api/formations', formationRoutes);
  app.use('/api/logiciels', logicielRoutes);
  app.use('/api/emplois', emploiRoutes);
  app.use('/api/actualites', actualiteRoutes);
} catch (e) {
  console.warn('⚠️ Routes dynamiques non chargées:', e.message);
}

// Route de santé (ne doit jamais renvoyer 500)
app.get('/api/health', (req, res) => {
  try {
    res.status(200).json({
      success: true,
      message: 'API Sorbo Ingénierie fonctionne correctement',
      timestamp: new Date().toISOString(),
      version: '1.0.2'
    });
  } catch (e) {
    // Réponse de secours
    res.status(200).json({ success: true, message: 'OK' });
  }
});

// (les anciennes routes statiques ont été retirées)

// Route actualités (maintenant gérée par actualiteRoutes)

// (route emplois dynamique montée plus haut)

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Serveur Sorbo Ingénierie démarré sur le port ${PORT}`);
  console.log(`📡 API disponible sur https://sorbo-api-production.up.railway.app`);
  console.log(`🔗 Health check: /api/health`);
  console.log(`📚 Formations: /api/formations`);
  console.log(`💻 Logiciels: /api/logiciels`);
  console.log(`📰 Actualités: /api/actualites`);
  console.log(`💼 Emplois: /api/emplois`);
}); 