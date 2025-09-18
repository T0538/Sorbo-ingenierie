// Script pour forcer l'utilisation de l'API Railway dans tous les fichiers JS
const fs = require('fs');
const path = require('path');

console.log('🔧 Forçage de l\'utilisation de l\'API Railway...');

const RAILWAY_API_URL = 'https://sorbo-api-production.up.railway.app';

// Patterns à remplacer
const patterns = [
    {
        search: /const\s+API_BASE_URL\s*=\s*['"`][^'"`]+['"`];/g,
        replace: `const API_BASE_URL = 'https://sorbo-api-production.up.railway.app';`
    },
    {
        search: /let\s+API_BASE_URL\s*=\s*['"`][^'"`]+['"`];/g,
        replace: `let API_BASE_URL = 'https://sorbo-api-production.up.railway.app';`
    },
    {
        search: /var\s+API_BASE_URL\s*=\s*['"`][^'"`]+['"`];/g,
        replace: `var API_BASE_URL = 'https://sorbo-api-production.up.railway.app';`
    },
    {
        search: /this\.apiBaseUrl\s*=\s*['"`][^'"`]+['"`];/g,
        replace: `this.apiBaseUrl = 'https://sorbo-api-production.up.railway.app';`
    },
    {
        search: /apiUrl:\s*['"`][^'"`]+['"`]/g,
        replace: `apiUrl: 'https://sorbo-api-production.up.railway.app'`
    }
];

// Trouver tous les fichiers JS
const jsFiles = [];
function findJsFiles(dir) {
    const files = fs.readdirSync(dir);
    files.forEach(file => {
        const filePath = path.join(dir, file);
        const stat = fs.statSync(filePath);
        if (stat.isDirectory() && !file.startsWith('.') && file !== 'node_modules') {
            findJsFiles(filePath);
        } else if (file.endsWith('.js')) {
            jsFiles.push(filePath);
        }
    });
}

findJsFiles('.');

let updatedCount = 0;

jsFiles.forEach(filePath => {
    try {
        let content = fs.readFileSync(filePath, 'utf8');
        let modified = false;
        
        patterns.forEach(pattern => {
            if (pattern.search.test(content)) {
                content = content.replace(pattern.search, pattern.replace);
                modified = true;
            }
        });
        
        if (modified) {
            fs.writeFileSync(filePath, content, 'utf8');
            console.log(`✅ ${filePath} - URLs mises à jour`);
            updatedCount++;
        } else {
            console.log(`⏭️ ${filePath} - Pas de changement nécessaire`);
        }
        
    } catch (error) {
        console.log(`❌ ${filePath} - Erreur: ${error.message}`);
    }
});

console.log(`\n🎯 Mise à jour terminée: ${updatedCount} fichier(s) modifié(s)`);
console.log(`\n🌐 URL forcée: ${RAILWAY_API_URL}`);
