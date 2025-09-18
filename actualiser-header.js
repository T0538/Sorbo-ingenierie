const fs = require('fs');
const path = require('path');

// Liste des fichiers HTML à mettre à jour
const filesToUpdate = [
    'actualites.html',
    'nous-rejoindre.html',
    'nos-logiciels.html',
    'ingenierie.html',
    'contact.html'
];

// Nouveau header avec le logo
const newHeader = `<header>
        <div class="container">
            <div class="logo">
                <a href="index.html">
                    <img src="images/logo.png" alt="Logo Sorbo-Ingénierie" id="logo">
                </a>
            </div>
            <nav aria-label="Navigation principale">
                <ul class="main-nav">
                    <li><a href="index.html">Accueil</a></li>
                    <li><a href="notre-entreprise.html">Notre entreprise</a></li>
                    <li><a href="ingenierie.html">Ingénierie</a></li>
                    <li><a href="nos-formations.html">Nos formations</a></li>
                    <li><a href="nos-logiciels.html">Nos logiciels</a></li>
                    <li><a href="nous-rejoindre.html">Nous rejoindre</a></li>
                    <li><a href="contact.html">Contactez-nous</a></li>
                    <li class="dropdown">
                        <a href="#" aria-haspopup="true" aria-expanded="false">Autres <i class="fas fa-chevron-down" aria-hidden="true"></i></a>
                        <ul class="dropdown-menu" role="menu">
                            <li><a href="rendez-vous.html">Rendez-vous</a></li>
                            <li><a href="evenements.html">Événements</a></li>
                            <li><a href="actualites.html">Actualités</a></li>
                            <li><a href="acheter-formations.html">Acheter nos formations</a></li>
                        </ul>
                    </li>
                </ul>
                <button class="mobile-menu-btn" aria-label="Menu mobile" aria-expanded="false">
                    <i class="fas fa-bars" aria-hidden="true"></i>
                </button>
            </nav>
        </div>
    </header>`;

// Mettre à jour chaque fichier
filesToUpdate.forEach(file => {
    try {
        const filePath = path.join(__dirname, file);
        let content = fs.readFileSync(filePath, 'utf8');
        
        // Chercher le header existant et le remplacer
        const headerRegex = /<header>[\s\S]*?<\/header>/;
        
        // Mettre à jour les classes "active" en fonction du nom du fichier
        let updatedHeader = newHeader;
        filesToUpdate.forEach(pageFile => {
            const pageName = path.basename(pageFile);
            if (pageName === file) {
                updatedHeader = updatedHeader.replace(`<a href="${pageName}">`, `<a href="${pageName}" class="active">`);
            }
        });
        
        // Remplacer le header
        const updatedContent = content.replace(headerRegex, updatedHeader);
        
        // Écrire le contenu mis à jour dans le fichier
        fs.writeFileSync(filePath, updatedContent, 'utf8');
        console.log(`✅ Header mis à jour dans ${file}`);
    } catch (error) {
        console.error(`❌ Erreur lors de la mise à jour de ${file}:`, error);
    }
});

console.log('Mise à jour des headers terminée !');