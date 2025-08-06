const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

// Générer un JWT secret aléatoire
const jwtSecret = crypto.randomBytes(32).toString('hex');

// Contenu du fichier .env pour MongoDB Atlas avec le bon mot de passe
const envContent = `# Configuration MongoDB Atlas
MONGODB_URI=mongodb+srv://kevinyameogo01:wBLR2n5hAPNZM93Y@sorbo-ingenierie.ol32tmy.mongodb.net/?retryWrites=true&w=majority&appName=Sorbo-ingenierie

# Configuration du serveur
PORT=5000
NODE_ENV=development

# JWT
JWT_SECRET=${jwtSecret}
JWT_EXPIRES_IN=30d

# URLs
FRONTEND_URL=http://localhost:3000
API_URL=http://localhost:5000/api
`;

// Chemin du fichier .env
const envPath = path.join(__dirname, '.env');

// Supprimer l'ancien fichier .env s'il existe
if (fs.existsSync(envPath)) {
  fs.unlinkSync(envPath);
  console.log('🗑️  Ancien fichier .env supprimé');
}

// Créer le nouveau fichier .env
fs.writeFileSync(envPath, envContent);
console.log('✅ Fichier .env créé avec succès pour MongoDB Atlas!');
console.log('🔑 JWT_SECRET sécurisé généré automatiquement');
console.log('🗄️  URI MongoDB Atlas configuré avec le bon mot de passe'); 