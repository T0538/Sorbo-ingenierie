// Script pour mettre à jour toutes les pages de formations
const fs = require('fs');
const path = require('path');

console.log('🔧 === MISE À JOUR DES PAGES FORMATIONS ===\n');

// Pages de formations à mettre à jour
const formationPages = [
    'formations-detail.html',
    'formations-intra-entreprise.html',
    'inscription-formation.html'
];

// Remplacements à effectuer
const replacements = [
    {
        old: 'js/formations-mongodb-loader.js',
        new: 'js/formations-loader-fixed.js',
        description: 'Remplacement du script formations MongoDB'
    },
    {
        old: 'js/formations-mongodb-simple.js',
        new: 'js/formations-loader-fixed.js',
        description: 'Remplacement du script formations simple'
    },
    {
        old: 'js/debug-formations.js',
        new: '',
        description: 'Suppression du script debug formations (plus nécessaire)'
    },
    {
        old: 'js/force-mongodb-load.js',
        new: '',
        description: 'Suppression du script force load (plus nécessaire)'
    }
];

function updateFormationPage(filename) {
    const filePath = path.join(__dirname, filename);
    
    // Vérifier si le fichier existe
    if (!fs.existsSync(filePath)) {
        console.log(`⚠️ Fichier non trouvé: ${filename}`);
        return false;
    }
    
    try {
        // Lire le contenu du fichier
        let content = fs.readFileSync(filePath, 'utf8');
        let modified = false;
        
        console.log(`🔍 Traitement de: ${filename}`);
        
        // Appliquer les remplacements
        replacements.forEach(replacement => {
            if (content.includes(replacement.old)) {
                if (replacement.new === '') {
                    // Supprimer la ligne complète
                    const regex = new RegExp(`\\s*<script src="${replacement.old.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}"><\/script>`, 'g');
                    content = content.replace(regex, '');
                } else {
                    // Remplacer le script
                    content = content.replace(replacement.old, replacement.new);
                }
                console.log(`   ✅ ${replacement.description}`);
                modified = true;
            }
        });
        
        // Ajouter le nouveau script si pas déjà présent
        if (!content.includes('formations-loader-fixed.js')) {
            // Chercher où insérer le script
            const patterns = [
                /<script src="js\/environment-config\.js"><\/script>/,
                /<script src="js\/script\.js"><\/script>/,
                /<\/head>/
            ];
            
            for (const pattern of patterns) {
                if (pattern.test(content)) {
                    const scriptTag = '    <script src="js/formations-loader-fixed.js"></script>';
                    content = content.replace(pattern, match => `${match}\n${scriptTag}`);
                    console.log(`   ✅ Script formations-loader-fixed.js ajouté`);
                    modified = true;
                    break;
                }
            }
        }
        
        if (modified) {
            // Écrire le fichier modifié
            fs.writeFileSync(filePath, content, 'utf8');
            console.log(`✅ ${filename} mis à jour\n`);
            return true;
        } else {
            console.log(`ℹ️ ${filename} - aucune modification nécessaire\n`);
            return true;
        }
        
    } catch (error) {
        console.log(`❌ Erreur lors de la modification de ${filename}: ${error.message}\n`);
        return false;
    }
}

// Traiter toutes les pages
console.log('🚀 Début de la mise à jour...\n');

let successCount = 0;
const totalPages = formationPages.length;

formationPages.forEach(page => {
    if (updateFormationPage(page)) {
        successCount++;
    }
});

// Résumé
console.log(`📊 === RÉSUMÉ ===`);
console.log(`✅ Pages mises à jour: ${successCount}/${totalPages}`);

if (successCount === totalPages) {
    console.log(`\n🎉 Toutes les pages de formations ont été mises à jour !`);
    console.log(`\n📋 Modifications effectuées:`);
    console.log(`   ✅ Remplacement des anciens scripts formations`);
    console.log(`   ✅ Ajout du nouveau script formations-loader-fixed.js`);
    console.log(`   ✅ Suppression des scripts debug obsolètes`);
    
    console.log(`\n🌐 Votre domaine .ci devrait maintenant charger les vraies formations sur toutes les pages !`);
    
} else {
    console.log(`\n⚠️ Certaines pages n'ont pas pu être mises à jour.`);
}

console.log(`\n🔧 Prochaines étapes:`);
console.log(`   1. Testez les pages: formations-inter-entreprise.html, formations-intra-entreprise.html`);
console.log(`   2. Vérifiez que les 4 vraies formations s'affichent`);
console.log(`   3. Déployez si tout fonctionne`);
