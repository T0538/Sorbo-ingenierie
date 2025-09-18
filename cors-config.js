// Configuration CORS pour Sorbo-Ingénierie
const allowedOrigins = [
    // Domaines de production
    'https://sorbo-ingenierie.netlify.app',
    'https://sorbo-ingenierie.ci',
    'https://www.sorbo-ingenierie.ci',
    
    // Domaines de développement local
    'http://localhost:3000',
    'http://localhost:5000',
    'http://localhost:8000',
    'http://127.0.0.1:3000',
    'http://127.0.0.1:5000',
    'http://127.0.0.1:8000',
    
    // Domaines Railway de développement
    'https://sorbo-ingenierie-production.up.railway.app',
    'https://sorbo-ingenierie-dev.up.railway.app',
    'https://sorbo-api-production.up.railway.app' // Ancienne URL pour compatibilité
];

const corsOptions = {
    origin: function (origin, callback) {
        // Permettre les requêtes sans origin (ex: Postman, applications mobiles)
        if (!origin) return callback(null, true);
        
        if (allowedOrigins.indexOf(origin) !== -1) {
            callback(null, true);
        } else {
            console.log(`❌ CORS: Origin non autorisé: ${origin}`);
            callback(new Error('Non autorisé par CORS'));
        }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
    allowedHeaders: [
        'Origin',
        'X-Requested-With',
        'Content-Type',
        'Accept',
        'Authorization',
        'Cache-Control',
        'Pragma'
    ],
    exposedHeaders: ['Content-Length', 'X-Foo', 'X-Bar'],
    optionsSuccessStatus: 200 // Pour supporter les anciens navigateurs
};

module.exports = corsOptions;
