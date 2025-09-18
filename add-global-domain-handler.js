// Script pour ajouter le gestionnaire global de domaine à toutes les pages HTML
const fs = require('fs');
const path = require('path');

console.log('🔧 Ajout du gestionnaire global de domaine à toutes les pages...');

// Liste des fichiers HTML à modifier
const htmlFiles = [
    'contact.html',
    'ingenierie.html',
    'nos-formations.html',
    'nos-projets.html',
    'notre-entreprise.html',
    'nous-rejoindre.html',
    'formations-detail.html',
    'formations-inter-entreprise.html',
    'formations-intra-entreprise.html',
    'logiciel-details.html',
    'actualites.html',
    'admin-actualites.html',
    'admin-dashboard.html',
    'admin-logiciels.html',
    'admin-login.html',
    'inscription-formation.html',
    'stage-hydrologie.html',
    'stage-mecanique.html'
];

// Script à ajouter
const scriptLine = '    <script src="js/global-domain-handler.js"></script>';

// Fonction pour modifier un fichier HTML
function addScriptToFile(filename) {
    const filePath = path.join(__dirname, filename);
    
    // Vérifier si le fichier existe
    if (!fs.existsSync(filePath)) {
        console.log(`❌ Fichier non trouvé: ${filename}`);
        return false;
    }
    
    try {
        // Lire le contenu du fichier
        let content = fs.readFileSync(filePath, 'utf8');
        
        // Vérifier si le script est déjà présent
        if (content.includes('global-domain-handler.js')) {
            console.log(`ℹ️ Script déjà présent dans: ${filename}`);
            return true;
        }
        
        // Chercher différents patterns pour insérer le script
        const patterns = [
            // Pattern 1: Avant environment-config.js
            {
                search: /<script src="js\/environment-config\.js"><\/script>/,
                replace: `${scriptLine}\n    <script src="js/environment-config.js"></script>`
            },
            // Pattern 2: Avant script.js
            {
                search: /<script src="js\/script\.js"><\/script>/,
                replace: `${scriptLine}\n    <script src="js/script.js"></script>`
            },
            // Pattern 3: Après le dernier script CSS/link et avant le premier script JS
            {
                search: /(<\/head>)/,
                replace: `${scriptLine}\n$1`
            },
            // Pattern 4: Avant </body>
            {
                search: /(<\/body>)/,
                replace: `${scriptLine}\n$1`
            }
        ];
        
        let modified = false;
        
        for (const pattern of patterns) {
            if (pattern.search.test(content)) {
                content = content.replace(pattern.search, pattern.replace);
                modified = true;
                console.log(`✅ Script ajouté à: ${filename} (pattern ${patterns.indexOf(pattern) + 1})`);
                break;
            }
        }
        
        if (!modified) {
            console.log(`⚠️ Aucun pattern trouvé pour: ${filename}`);
            return false;
        }
        
        // Écrire le fichier modifié
        fs.writeFileSync(filePath, content, 'utf8');
        return true;
        
    } catch (error) {
        console.log(`❌ Erreur lors de la modification de ${filename}: ${error.message}`);
        return false;
    }
}

// Traiter tous les fichiers
let successCount = 0;
let totalFiles = htmlFiles.length;

for (const filename of htmlFiles) {
    if (addScriptToFile(filename)) {
        successCount++;
    }
}

console.log(`\n📊 Résumé:`);
console.log(`✅ Fichiers modifiés: ${successCount}/${totalFiles}`);
console.log(`❌ Échecs: ${totalFiles - successCount}`);

if (successCount === totalFiles) {
    console.log(`\n🎉 Tous les fichiers ont été mis à jour avec succès !`);
} else {
    console.log(`\n⚠️ Certains fichiers n'ont pas pu être modifiés. Vérifiez les logs ci-dessus.`);
}

console.log(`\n🔧 Le gestionnaire global de domaine va maintenant :`);
console.log(`   - Détecter automatiquement les domaines .ci`);
console.log(`   - Tester la connectivité API`);
console.log(`   - Configurer des proxies CORS si nécessaire`);
console.log(`   - Gérer les erreurs de réseau automatiquement`);
console.log(`   - Afficher des notifications en cas de problème`);
