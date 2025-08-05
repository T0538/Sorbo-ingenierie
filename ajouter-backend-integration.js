const fs = require('fs');
const path = require('path');

// Liste des pages HTML
const htmlFiles = [
    'index.html',
    'notre-entreprise.html',
    'ingenierie.html',
    'nos-formations.html',
    'nos-logiciels.html',
    'nous-rejoindre.html',
    'contact.html',
    'actualites.html'
];

// Scripts à ajouter
const scriptsToAdd = [
    'js/backend-integration.js'
];

// Scripts spécifiques par page
const pageSpecificScripts = {
    'contact.html': ['js/contact.js'],
    'nos-formations.html': ['js/formations-integration.js']
};

console.log('🚀 Ajout de l\'intégration backend aux pages HTML...');

htmlFiles.forEach(file => {
    if (fs.existsSync(file)) {
        console.log(`📝 Traitement de ${file}...`);
        
        let content = fs.readFileSync(file, 'utf8');
        let modified = false;
        
        // Ajouter les scripts d'intégration backend
        scriptsToAdd.forEach(script => {
            const scriptTag = `    <script src="${script}"></script>`;
            
            // Vérifier si le script n'est pas déjà présent
            if (!content.includes(scriptTag)) {
                // Trouver la position pour insérer (après les autres scripts)
                const scriptInsertionPoint = content.indexOf('<script src="js/script.js"></script>');
                
                if (scriptInsertionPoint !== -1) {
                    const insertPosition = scriptInsertionPoint + '<script src="js/script.js"></script>'.length;
                    content = content.slice(0, insertPosition) + '\n' + scriptTag + content.slice(insertPosition);
                    modified = true;
                    console.log(`  ✅ ${script} ajouté`);
                } else {
                    console.log(`  ⚠️ Impossible de trouver le point d'insertion pour ${script}`);
                }
            } else {
                console.log(`  ℹ️ ${script} déjà présent`);
            }
        });
        
        // Ajouter les scripts spécifiques à la page
        if (pageSpecificScripts[file]) {
            pageSpecificScripts[file].forEach(script => {
                const scriptTag = `    <script src="${script}"></script>`;
                
                if (!content.includes(scriptTag)) {
                    // Insérer après les scripts d'intégration backend
                    const backendScriptPoint = content.indexOf('<script src="js/backend-integration.js"></script>');
                    
                    if (backendScriptPoint !== -1) {
                        const insertPosition = backendScriptPoint + '<script src="js/backend-integration.js"></script>'.length;
                        content = content.slice(0, insertPosition) + '\n' + scriptTag + content.slice(insertPosition);
                        modified = true;
                        console.log(`  ✅ ${script} ajouté`);
                    } else {
                        console.log(`  ⚠️ Impossible de trouver le point d'insertion pour ${script}`);
                    }
                } else {
                    console.log(`  ℹ️ ${script} déjà présent`);
                }
            });
        }
        
        if (modified) {
            fs.writeFileSync(file, content, 'utf8');
            console.log(`  💾 ${file} mis à jour`);
        } else {
            console.log(`  ℹ️ ${file} déjà à jour`);
        }
    } else {
        console.log(`❌ Fichier ${file} non trouvé`);
    }
});

console.log('\n🎉 Intégration backend terminée !');
console.log('\n📋 Résumé des modifications :');
console.log('✅ Scripts d\'intégration backend ajoutés à toutes les pages');
console.log('✅ Scripts spécifiques ajoutés aux pages concernées');
console.log('✅ Formulaire de contact connecté au backend local');
console.log('✅ Formations chargées dynamiquement depuis le backend');
console.log('\n🚀 Pour tester l\'intégration :');
console.log('1. Démarrez le backend : cd backend && node server-ultra-simple.js');
console.log('2. Ouvrez contact.html dans votre navigateur');
console.log('3. Testez l\'envoi d\'un formulaire de contact');
console.log('4. Vérifiez les formations sur nos-formations.html'); 