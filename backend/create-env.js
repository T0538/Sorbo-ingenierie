const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

// Générer un JWT secret aléatoire
const jwtSecret = crypto.randomBytes(32).toString('hex');

// Contenu du fichier .env pour le développement
const envContent = `# Configuration de base
NODE_ENV=development
PORT=5000

# MongoDB
MONGODB_URI=mongodb://localhost:27017/sorbo-ingenierie

# JWT
JWT_SECRET=${jwtSecret}
JWT_EXPIRES_IN=30d

# Email
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=contact@sorbo-ingenierie.com
EMAIL_PASS=your_password_here
EMAIL_FROM=contact@sorbo-ingenierie.com

# Upload des fichiers
MAX_FILE_SIZE=5242880  # 5MB
UPLOAD_PATH=./uploads

# URLs
FRONTEND_URL=http://localhost:3000
API_URL=http://localhost:5000/api
`;

// Chemin du fichier .env
const envPath = path.join(__dirname, '.env');

// Vérifier si le fichier existe déjà
if (fs.existsSync(envPath)) {
  console.log('Le fichier .env existe déjà. Voulez-vous le remplacer? (Pour le remplacer, supprimez-le manuellement et relancez ce script)');
} else {
  // Créer le fichier .env
  fs.writeFileSync(envPath, envContent);
  console.log('Fichier .env créé avec succès! Un JWT_SECRET sécurisé a été généré automatiquement.');
}

// Contenu du fichier .env pour la production (à titre informatif)
console.log('\nPour la production, voici un exemple de configuration:');
console.log(`
# Configuration de base
NODE_ENV=production
PORT=5000

# MongoDB
MONGODB_URI=mongodb+srv://username:password@clusterXXX.mongodb.net/sorbo-ingenierie?retryWrites=true&w=majority

# JWT
JWT_SECRET=${crypto.randomBytes(32).toString('hex')}
JWT_EXPIRES_IN=30d

# Email
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=contact@sorbo-ingenierie.com
EMAIL_PASS=your_secure_app_password
EMAIL_FROM=contact@sorbo-ingenierie.com

# Upload des fichiers
MAX_FILE_SIZE=5242880  # 5MB
UPLOAD_PATH=./uploads

# URLs
FRONTEND_URL=https://www.sorbo-ingenierie.com
API_URL=https://api.sorbo-ingenierie.com/api
`); 