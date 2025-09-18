// Script pour mettre à jour toutes les URLs API dans les fichiers JavaScript
const fs = require('fs');
const path = require('path');

console.log('🔄 Mise à jour de toutes les URLs API...');

// URL Railway fonctionnelle (à remplacer par la vraie URL trouvée)
const NEW_API_URL = 'https://sorbo-api-production.up.railway.app';

// Anciennes URLs possibles
const OLD_URLS = [
    'https://sorbo-ingenierie-production.up.railway.app',
    'https://sorbo-api.up.railway.app',
    'http://localhost:5000',
    'http://localhost:3000'
];

// Dossier à scanner
const JS_DIR = './js';

function updateFile(filePath) {
    try {
        let content = fs.readFileSync(filePath, 'utf8');
        let modified = false;
        
        OLD_URLS.forEach(oldUrl => {
            if (content.includes(oldUrl)) {
                content = content.replace(new RegExp(oldUrl.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'), NEW_API_URL);
                modified = true;
                console.log(`  ✅ ${path.basename(filePath)}: ${oldUrl} → ${NEW_API_URL}`);
            }
        });
        
        if (modified) {
            fs.writeFileSync(filePath, content, 'utf8');
            return true;
        }
        
        return false;
    } catch (error) {
        console.log(`  ❌ Erreur ${filePath}: ${error.message}`);
        return false;
    }
}

function scanDirectory(dir) {
    const files = fs.readdirSync(dir);
    let updatedCount = 0;
    
    files.forEach(file => {
        const filePath = path.join(dir, file);
        const stat = fs.statSync(filePath);
        
        if (stat.isDirectory()) {
            updatedCount += scanDirectory(filePath);
        } else if (file.endsWith('.js')) {
            if (updateFile(filePath)) {
                updatedCount++;
            }
        }
    });
    
    return updatedCount;
}

// Fichiers racine à vérifier aussi
const ROOT_FILES = [
    'test-api-production.js',
    'test-api-corrected.js',
    'test-api-simple.js',
    'test-connection-simple.js',
    'test-simple-connection.js'
];

console.log(`🎯 Nouvelle URL API: ${NEW_API_URL}`);
console.log('📁 Scan du dossier js/...');

const updatedFiles = scanDirectory(JS_DIR);

console.log('\n📄 Vérification des fichiers racine...');
ROOT_FILES.forEach(file => {
    if (fs.existsSync(file)) {
        if (updateFile(file)) {
            updatedFiles++;
        }
    }
});

console.log(`\n✅ Mise à jour terminée: ${updatedFiles} fichier(s) modifié(s)`);
console.log('\n🚀 Prochaines étapes:');
console.log('1. Testez le site sur sorbo-ingenierie.ci');
console.log('2. Vérifiez que les API fonctionnent');
console.log('3. Si ça ne marche pas, exécutez: node find-railway-url.js');
