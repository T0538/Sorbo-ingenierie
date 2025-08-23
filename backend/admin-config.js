// Configuration pour le système d'administration Sorbo-Ingénierie
const adminConfig = {
    // Configuration de sécurité
    security: {
        jwtSecret: process.env.JWT_SECRET || 'sorbo-admin-secret-key-2024',
        jwtExpiresIn: '24h', // Token valide 24 heures
        bcryptRounds: 12, // Niveau de hachage des mots de passe
        maxLoginAttempts: 5, // Nombre max de tentatives de connexion
        lockoutDuration: 15 * 60 * 1000, // 15 minutes de blocage
    },
    
    // Configuration de l'administrateur par défaut
    defaultAdmin: {
        username: 'admin',
        email: 'admin@sorbo-ingenierie.ci',
        role: 'super-admin',
        // Le mot de passe sera défini lors de la première connexion
    },
    
    // Configuration des sessions
    session: {
        maxAge: 24 * 60 * 60 * 1000, // 24 heures
        secure: process.env.NODE_ENV === 'production',
        httpOnly: true,
    },
    
    // Configuration des permissions
    permissions: {
        'super-admin': ['read', 'write', 'delete', 'manage-users'],
        'admin': ['read', 'write', 'delete'],
        'editor': ['read', 'write'],
        'viewer': ['read']
    },
    
    // Configuration des collections MongoDB
    collections: {
        users: 'admin_users',
        logiciels: 'logiciels',
        formations: 'formations',
        emplois: 'emplois',
        actualites: 'actualites',
        logs: 'admin_logs'
    },
    
    // Configuration des logs
    logging: {
        enabled: true,
        level: 'info', // debug, info, warn, error
        maxLogs: 1000, // Nombre max de logs conservés
    }
};

module.exports = adminConfig;


