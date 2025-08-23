const jwt = require('jsonwebtoken');
const AdminUser = require('../models/AdminUser');
const adminConfig = require('../admin-config');

// Middleware d'authentification JWT
const authenticateToken = async (req, res, next) => {
    try {
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN
        
        if (!token) {
            return res.status(401).json({
                success: false,
                message: 'Token d\'authentification manquant',
                code: 'MISSING_TOKEN'
            });
        }
        
        // Vérifier et décoder le token
        const decoded = jwt.verify(token, adminConfig.security.jwtSecret);
        
        // Récupérer l'utilisateur depuis la base de données
        const user = await AdminUser.findById(decoded.userId).select('-password');
        
        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'Utilisateur non trouvé',
                code: 'USER_NOT_FOUND'
            });
        }
        
        if (!user.isActive) {
            return res.status(401).json({
                success: false,
                message: 'Compte désactivé',
                code: 'ACCOUNT_DISABLED'
            });
        }
        
        if (user.isLocked) {
            return res.status(423).json({
                success: false,
                message: 'Compte temporairement verrouillé',
                code: 'ACCOUNT_LOCKED',
                lockUntil: user.lockUntil
            });
        }
        
        // Ajouter l'utilisateur à la requête
        req.user = user;
        next();
        
    } catch (error) {
        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({
                success: false,
                message: 'Token invalide',
                code: 'INVALID_TOKEN'
            });
        }
        
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({
                success: false,
                message: 'Token expiré',
                code: 'TOKEN_EXPIRED'
            });
        }
        
        console.error('Erreur d\'authentification:', error);
        return res.status(500).json({
            success: false,
            message: 'Erreur interne du serveur',
            code: 'INTERNAL_ERROR'
        });
    }
};

// Middleware de vérification des permissions
const requirePermission = (permission) => {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({
                success: false,
                message: 'Utilisateur non authentifié',
                code: 'NOT_AUTHENTICATED'
            });
        }
        
        if (!req.user.hasPermission(permission)) {
            return res.status(403).json({
                success: false,
                message: 'Permissions insuffisantes',
                code: 'INSUFFICIENT_PERMISSIONS',
                required: permission,
                userRole: req.user.role
            });
        }
        
        next();
    };
};

// Middleware de vérification du rôle
const requireRole = (roles) => {
    const allowedRoles = Array.isArray(roles) ? roles : [roles];
    
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({
                success: false,
                message: 'Utilisateur non authentifié',
                code: 'NOT_AUTHENTICATED'
            });
        }
        
        if (!allowedRoles.includes(req.user.role)) {
            return res.status(403).json({
                success: false,
                message: 'Rôle insuffisant',
                code: 'INSUFFICIENT_ROLE',
                required: allowedRoles,
                userRole: req.user.role
            });
        }
        
        next();
    };
};

// Middleware de rate limiting pour les tentatives de connexion
const loginRateLimit = (req, res, next) => {
    const { username } = req.body;
    
    if (!username) {
        return next();
    }
    
    // Ce middleware sera étendu avec Redis ou une solution de cache
    // pour le moment, on laisse passer
    next();
};

// Middleware de validation des données d'entrée
const validateLoginData = (req, res, next) => {
    const { username, password } = req.body;
    
    if (!username || !password) {
        return res.status(400).json({
            success: false,
            message: 'Nom d\'utilisateur et mot de passe requis',
            code: 'MISSING_CREDENTIALS'
        });
    }
    
    if (username.length < 3) {
        return res.status(400).json({
            success: false,
            message: 'Nom d\'utilisateur trop court',
            code: 'INVALID_USERNAME'
        });
    }
    
    if (password.length < 8) {
        return res.status(400).json({
            success: false,
            message: 'Mot de passe trop court',
            code: 'INVALID_PASSWORD'
        });
    }
    
    next();
};

// Middleware de logging des actions d'administration
const logAdminAction = (action) => {
    return async (req, res, next) => {
        const originalSend = res.send;
        
        res.send = function(data) {
            // Log de l'action après la réponse
            if (res.statusCode >= 200 && res.statusCode < 300) {
                logAction(req.user, action, req.body, res.statusCode);
            }
            
            originalSend.call(this, data);
        };
        
        next();
    };
};

// Fonction de logging des actions
async function logAction(user, action, data, statusCode) {
    try {
        // Ici on pourrait sauvegarder dans une collection de logs
        console.log(`🔐 [ADMIN] ${user.username} (${user.role}) - ${action} - Status: ${statusCode}`);
        
        if (adminConfig.logging.enabled) {
            // Log détaillé si activé
            console.log(`   📝 Détails:`, {
                userId: user._id,
                username: user.username,
                role: user.role,
                action: action,
                timestamp: new Date().toISOString(),
                statusCode: statusCode,
                data: data
            });
        }
    } catch (error) {
        console.error('Erreur lors du logging:', error);
    }
}

module.exports = {
    authenticateToken,
    requirePermission,
    requireRole,
    loginRateLimit,
    validateLoginData,
    logAdminAction
};


