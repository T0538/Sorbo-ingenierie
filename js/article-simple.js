// ======================================
// AFFICHAGE SIMPLE DES ARTICLES - SORBO-INGÉNIERIE
// ======================================

document.addEventListener('DOMContentLoaded', function() {
    console.log('📖 Chargement de l\'article simple...');
    
    // Récupérer l'ID de l'article depuis l'URL
    const urlParams = new URLSearchParams(window.location.search);
    const articleId = urlParams.get('id');
    
    if (!articleId) {
        console.log('❌ Aucun ID d\'article fourni');
        return;
    }
    
    // Trouver l'article dans les données
    if (!window.actualitesData || window.actualitesData.length === 0) {
        console.log('❌ Aucune donnée d\'actualité trouvée');
        return;
    }
    
    const article = window.actualitesData.find(a => a.id === articleId);
    
    if (!article) {
        console.log('❌ Article non trouvé:', articleId);
        afficherArticleNonTrouve();
        return;
    }
    
    console.log('✅ Article trouvé:', article.title);
    afficherArticle(article);
});

function afficherArticle(article) {
    // Titre
    const titleElement = document.getElementById('article-title');
    if (titleElement) {
        titleElement.textContent = article.title;
    }
    
    // Breadcrumb
    const breadcrumbElement = document.getElementById('article-breadcrumb');
    if (breadcrumbElement) {
        breadcrumbElement.textContent = article.title;
    }
    
    // Titre de la page
    document.title = article.title + ' - Sorbo-Ingénierie';
    
    // Catégorie
    const categoryElement = document.getElementById('article-category');
    if (categoryElement) {
        categoryElement.textContent = article.categorie || 'Actualités';
    }
    
    // Date
    const dateElement = document.getElementById('article-date');
    if (dateElement) {
        const date = new Date(article.datePublication);
        dateElement.textContent = date.toLocaleDateString('fr-FR', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    }
    
    // Auteur
    const authorElement = document.getElementById('article-author');
    if (authorElement) {
        authorElement.textContent = article.auteur;
    }
    
    // Temps de lecture
    const readingTimeElement = document.getElementById('reading-time');
    if (readingTimeElement) {
        const wordsPerMinute = 200;
        const wordCount = article.content.split(/\s+/).length;
        const readingTime = Math.ceil(wordCount / wordsPerMinute);
        readingTimeElement.textContent = readingTime + ' min de lecture';
    }
    
    // Image principale
    const heroImageElement = document.getElementById('hero-image');
    if (heroImageElement && article.imageUrl) {
        heroImageElement.src = article.imageUrl;
        heroImageElement.alt = article.imageAlt || article.title;
        heroImageElement.style.display = 'block';
    }
    
    // Contenu principal - EN UN SEUL BLOC
    const mainContentElement = document.getElementById('main-content');
    if (mainContentElement) {
        // Créer un seul paragraphe avec tout le contenu
        mainContentElement.innerHTML = `<p>${article.content}</p>`;
    }
    
    console.log('✅ Article affiché avec succès');
}

function afficherArticleNonTrouve() {
    const mainContentElement = document.getElementById('main-content');
    if (mainContentElement) {
        mainContentElement.innerHTML = `
            <div style="text-align: center; padding: 60px 0;">
                <h2 style="color: #e74c3c; margin-bottom: 20px;">Article non trouvé</h2>
                <p style="color: #7f8c8d; margin-bottom: 30px;">L'article que vous cherchez n'existe pas ou a été supprimé.</p>
                <a href="actualites.html" style="background: #3498db; color: white; padding: 15px 30px; text-decoration: none; border-radius: 25px;">Retour aux actualités</a>
            </div>
        `;
    }
    
    const titleElement = document.getElementById('article-title');
    if (titleElement) {
        titleElement.textContent = 'Article non trouvé';
    }
}

