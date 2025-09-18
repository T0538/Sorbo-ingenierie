// Script pour corriger toutes les URLs API
const fs = require('fs');
const path = require('path');

console.log('🔧 Correction de toutes les URLs API...');

const CORRECT_URL = 'https://sorbo-api-production.up.railway.app';
const WRONG_URL = 'https://sorbo-ingenierie-production.up.railway.app';

// Fichiers à corriger
const filesToUpdate = [
    'js/backend-integration.js',
    'js/logiciels-loader.js', 
    'js/logiciel-details-loader.js',
    'js/formations-mongodb-simple.js',
    'js/formations-mongodb-loader.js',
    'js/dynamic-content.js',
    'js/debug-formations.js',
    'js/contact.js',
    'js/admin-logiciels.js',
    'js/admin-actualites.js',
    'js/actualites-loader.js',
    'js/environment-config.js',
    'js/api-config.js',
    'test-api-production.js',
    'test-api-corrected.js'
];

let updatedCount = 0;

filesToUpdate.forEach(filePath => {
    if (fs.existsSync(filePath)) {
        try {
            let content = fs.readFileSync(filePath, 'utf8');
            
            if (content.includes(WRONG_URL)) {
                content = content.replace(new RegExp(WRONG_URL.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'), CORRECT_URL);
                fs.writeFileSync(filePath, content, 'utf8');
                console.log(`✅ ${filePath} - URL corrigée`);
                updatedCount++;
            } else {
                console.log(`⏭️ ${filePath} - Pas de changement nécessaire`);
            }
        } catch (error) {
            console.log(`❌ ${filePath} - Erreur: ${error.message}`);
        }
    } else {
        console.log(`⚠️ ${filePath} - Fichier non trouvé`);
    }
});

console.log(`\n🎯 Correction terminée: ${updatedCount} fichier(s) mis à jour`);
console.log(`\n🌐 URL correcte: ${CORRECT_URL}`);
console.log(`\n🚀 Prochaines étapes:`);
console.log('1. git add .');
console.log('2. git commit -m "Fix API URLs - use correct Railway URL"');
console.log('3. git push');
console.log('4. Testez le site sur sorbo-ingenierie.ci');
