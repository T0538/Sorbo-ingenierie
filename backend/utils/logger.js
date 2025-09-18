const winston = require('winston');
const path = require('path');

// Configuration des logs
const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: winston.format.combine(
    winston.format.timestamp({
      format: 'YYYY-MM-DD HH:mm:ss'
    }),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  defaultMeta: { service: 'sorbo-ingenierie-api' },
  transports: [
    // Logs d'erreur
    new winston.transports.File({ 
      filename: path.join(__dirname, '../logs/error.log'), 
      level: 'error',
      maxsize: 5242880, // 5MB
      maxFiles: 5
    }),
    // Logs combinés
    new winston.transports.File({ 
      filename: path.join(__dirname, '../logs/combined.log'),
      maxsize: 5242880, // 5MB
      maxFiles: 5
    }),
    // Logs d'API
    new winston.transports.File({ 
      filename: path.join(__dirname, '../logs/api.log'),
      maxsize: 5242880, // 5MB
      maxFiles: 5
    })
  ]
});

// Ajouter les logs console en développement
if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: winston.format.combine(
      winston.format.colorize(),
      winston.format.simple()
    )
  }));
}

// Middleware pour logger les requêtes API
const apiLogger = (req, res, next) => {
  const start = Date.now();
  
  res.on('finish', () => {
    const duration = Date.now() - start;
    logger.info('API Request', {
      method: req.method,
      url: req.url,
      status: res.statusCode,
      duration: `${duration}ms`,
      ip: req.ip,
      userAgent: req.get('User-Agent')
    });
  });
  
  next();
};

// Fonction pour logger les erreurs
const logError = (error, req = null) => {
  logger.error('Application Error', {
    error: error.message,
    stack: error.stack,
    url: req?.url,
    method: req?.method,
    ip: req?.ip
  });
};

module.exports = { logger, apiLogger, logError }; 