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

// Ordre standardisé du menu
const standardMenuOrder = [
    { href: 'index.html', text: 'Accueil' },
    { href: 'notre-entreprise.html', text: 'Notre entreprise' },
    { href: 'ingenierie.html', text: 'Ingénierie' },
    { href: 'nos-formations.html', text: 'Nos formations' },
    { href: 'nos-logiciels.html', text: 'Nos logiciels' },
    { href: 'nous-rejoindre.html', text: 'Nous rejoindre' },
    { href: 'contact.html', text: 'Contactez-nous' }
];

// Menu dropdown "Autres"
const dropdownMenu = `
                            <li><a href="rendez-vous.html">Rendez-vous</a></li>
                            <li><a href="evenements.html">Événements</a></li>
                            <li><a href="actualites.html">Actualités</a></li>
                            <li><a href="acheter-formations.html">Acheter nos formations</a></li>`;

// Fonction pour générer le menu HTML
function generateMenu(activePage) {
    let menuHTML = '';
    
    standardMenuOrder.forEach(item => {
        const isActive = item.href === activePage ? ' class="active"' : '';
        menuHTML += `                    <li><a href="${item.href}"${isActive}>${item.text}</a></li>\n`;
    });
    
    // Ajouter le dropdown "Autres"
    menuHTML += `                    <li class="dropdown">
                        <a href="#" aria-haspopup="true" aria-expanded="false">Autres <i class="fas fa-chevron-down" aria-hidden="true"></i></a>
                        <ul class="dropdown-menu" role="menu">
${dropdownMenu}
                        </ul>
                    </li>`;
    
    return menuHTML;
}

// Fonction pour mettre à jour un fichier
function updateFile(filePath) {
    try {
        let content = fs.readFileSync(filePath, 'utf8');
        
        // Chercher le menu existant
        const menuRegex = /<ul class="main-nav">[\s\S]*?<\/ul>\s*<button class="mobile-menu-btn"/;
        
        // Générer le nouveau menu avec la page active
        const fileName = path.basename(filePath);
        const newMenu = generateMenu(fileName);
        
        // Créer le nouveau contenu du menu
        const newMenuContent = `<ul class="main-nav">
${newMenu}
                </ul>
                <button class="mobile-menu-btn"`;
        
        // Remplacer le menu
        const updatedContent = content.replace(menuRegex, newMenuContent);
        
        // Écrire le contenu mis à jour
        fs.writeFileSync(filePath, updatedContent, 'utf8');
        console.log(`✅ Menu standardisé dans ${fileName}`);
        
    } catch (error) {
        console.error(`❌ Erreur lors de la mise à jour de ${filePath}:`, error.message);
    }
}

// Mettre à jour tous les fichiers
console.log('🔄 Standardisation de l\'ordre du menu sur toutes les pages...\n');

filesToUpdate.forEach(file => {
    const filePath = path.join(__dirname, file);
    if (fs.existsSync(filePath)) {
        updateFile(filePath);
    } else {
        console.log(`⚠️  Fichier ${file} non trouvé`);
    }
});

console.log('\n✅ Standardisation terminée !');
console.log('\n📋 Ordre standardisé du menu :');
standardMenuOrder.forEach((item, index) => {
    console.log(`${index + 1}. ${item.text}`);
});
console.log('8. Autres (dropdown)'); 