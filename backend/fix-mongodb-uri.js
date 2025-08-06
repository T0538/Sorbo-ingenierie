const fs = require('fs');
const path = require('path');

// URI MongoDB Atlas avec encodage correct
const mongoURI = 'mongodb+srv://kevinyameogo01:Kevin%402023@sorbo-ingenierie.ol32tmy.mongodb.net/?retryWrites=true&w=majority&appName=Sorbo-ingenierie';

// Contenu du fichier .env
const envContent = `# Configuration MongoDB Atlas
MONGODB_URI=${mongoURI}

# Configuration du serveur
PORT=5000
NODE_ENV=development

# JWT
JWT_SECRET=c670766d50129c7b7e59455fc7608991666bdeb5f5984ef6915b8a358a90c9c4
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
console.log('✅ Fichier .env créé avec URI MongoDB Atlas corrigée!');
console.log('🔧 Caractères spéciaux encodés correctement'); 