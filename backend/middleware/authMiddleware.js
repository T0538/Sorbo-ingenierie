const jwt = require('jsonwebtoken');

// Middleware pour protéger les routes
exports.protect = (req, res, next) => {
  let token;

  // Récupérer le token du header Authorization
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  // Vérifier si le token existe
  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Accès non autorisé, authentification requise'
    });
  }

  try {
    // Vérifier le token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'sorbo-ingenierie-secret-key');

    // Ajouter l'utilisateur décodé à la requête
    req.user = decoded;
    next();
  } catch (error) {
    console.error('Erreur d\'authentification:', error);
    return res.status(401).json({
      success: false,
      message: 'Token invalide ou expiré'
    });
  }
};

// Middleware pour limiter l'accès aux administrateurs
exports.restrict = (roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: 'Accès interdit, permissions insuffisantes'
      });
    }
    next();
  };
}; 