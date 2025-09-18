// Script pour ajouter environment-config.js à toutes les pages HTML
const fs = require('fs');
const path = require('path');

console.log('🔧 Ajout de environment-config.js à toutes les pages...');

// Trouver tous les fichiers HTML
const htmlFiles = [];
function findHtmlFiles(dir) {
    const files = fs.readdirSync(dir);
    files.forEach(file => {
        const filePath = path.join(dir, file);
        const stat = fs.statSync(filePath);
        if (stat.isDirectory() && !file.startsWith('.') && file !== 'node_modules') {
            findHtmlFiles(filePath);
        } else if (file.endsWith('.html')) {
            htmlFiles.push(filePath);
        }
    });
}

findHtmlFiles('.');

let updatedCount = 0;

htmlFiles.forEach(filePath => {
    try {
        let content = fs.readFileSync(filePath, 'utf8');
        
        // Vérifier si environment-config.js est déjà présent
        if (content.includes('environment-config.js')) {
            console.log(`⏭️ ${filePath} - Déjà présent`);
            return;
        }
        
        // Chercher la section des scripts
        const scriptPattern = /<script\s+src="js\/script\.js"><\/script>/;
        const match = content.match(scriptPattern);
        
        if (match) {
            // Remplacer par script avec environment-config.js
            const replacement = '<script src="js/environment-config.js"></script>\n    <script src="js/script.js"></script>';
            content = content.replace(scriptPattern, replacement);
            
            fs.writeFileSync(filePath, content, 'utf8');
            console.log(`✅ ${filePath} - Ajouté`);
            updatedCount++;
        } else {
            // Chercher d'autres patterns de scripts
            const scriptPattern2 = /<script\s+src="js\/[^"]+\.js"><\/script>/;
            const match2 = content.match(scriptPattern2);
            
            if (match2) {
                // Ajouter avant le premier script
                const replacement = '<script src="js/environment-config.js"></script>\n    ' + match2[0];
                content = content.replace(scriptPattern2, replacement);
                
                fs.writeFileSync(filePath, content, 'utf8');
                console.log(`✅ ${filePath} - Ajouté (pattern 2)`);
                updatedCount++;
            } else {
                console.log(`⚠️ ${filePath} - Aucun script trouvé`);
            }
        }
        
    } catch (error) {
        console.log(`❌ ${filePath} - Erreur: ${error.message}`);
    }
});

console.log(`\n🎯 Ajout terminé: ${updatedCount} fichier(s) mis à jour`);
console.log(`\n📄 Fichiers traités: ${htmlFiles.length}`);
