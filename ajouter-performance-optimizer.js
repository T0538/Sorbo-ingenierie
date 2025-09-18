const fs = require('fs');
const path = require('path');

// Liste de tous les fichiers HTML à mettre à jour
const filesToUpdate = [
    'index.html',
    'notre-entreprise.html',
    'ingenierie.html',
    'nos-formations.html',
    'nos-logiciels.html',
    'nous-rejoindre.html',
    'contact.html',
    'actualites.html'
];

const performanceOptimizerJS = `    <script src="js/performance-optimizer.js"></script>`;

// Fonction pour ajouter l'optimiseur de performance
function addPerformanceOptimizer(filePath) {
    try {
        let content = fs.readFileSync(filePath, 'utf8');
        
        // Vérifier si l'optimiseur n'est pas déjà présent
        if (!content.includes('js/performance-optimizer.js')) {
            // Ajouter après le script lazy-loading
            const regex = /(<script src="js\/lazy-loading\.js"><\/script>)/;
            if (regex.test(content)) {
                content = content.replace(regex, `$1\n${performanceOptimizerJS}`);
                
                // Écrire le contenu mis à jour
                fs.writeFileSync(filePath, content, 'utf8');
                console.log(`✅ Performance optimizer ajouté à ${path.basename(filePath)}`);
            } else {
                console.log(`⚠️  Pattern non trouvé dans ${path.basename(filePath)}`);
            }
        } else {
            console.log(`ℹ️  Performance optimizer déjà présent dans ${path.basename(filePath)}`);
        }
        
    } catch (error) {
        console.error(`❌ Erreur lors de la mise à jour de ${filePath}:`, error.message);
    }
}

// Ajouter l'optimiseur à tous les fichiers
console.log('⚡ Ajout de l\'optimiseur de performance à toutes les pages...\n');

filesToUpdate.forEach(file => {
    const filePath = path.join(__dirname, file);
    if (fs.existsSync(filePath)) {
        addPerformanceOptimizer(filePath);
    } else {
        console.log(`⚠️  Fichier ${file} non trouvé`);
    }
});

console.log('\n✅ Optimiseur de performance ajouté à toutes les pages !');
console.log('\n🚀 Optimisations incluent :');
console.log('- 🖼️  Préchargement des images critiques');
console.log('- 🔤 Optimisation des polices');
console.log('- 📱 Adaptation aux performances de l\'appareil');
console.log('- 🧠 Cache intelligent des animations');
console.log('- 📊 Surveillance des performances');
console.log('- 🎯 Gestion optimisée de la mémoire');