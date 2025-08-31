/**
 * Script simple pour corriger les liens "Lire la suite" 
 * Version discrète sans modifications visuelles
 */

(function() {
    'use strict';
    
    function fixReadMoreLinks() {
        // Chercher tous les liens "Lire la suite"
        const links = document.querySelectorAll('a[href*="#"], a[onclick*="showActualiteDetails"], a[onclick*="openArticleModal"], .read-more, .lire-plus');
        
        links.forEach((link, index) => {
            // Éviter de traiter le même lien plusieurs fois
            if (link.hasAttribute('data-fixed')) return;
            link.setAttribute('data-fixed', 'true');
            
            // Trouver le titre associé
            const card = link.closest('.actualite-mini-card, .news-card, .blog-post, .actualite-card') || link.parentElement;
            let title = `Article ${index + 1}`;
            
            if (card) {
                const titleEl = card.querySelector('h1, h2, h3, h4, h5, h6');
                if (titleEl) {
                    title = titleEl.textContent.trim();
                }
            }
            
            // Générer un ID d'article
            const articleId = title.toLowerCase()
                .replace(/[àáâãäå]/g, 'a')
                .replace(/[èéêë]/g, 'e')
                .replace(/[ìíîï]/g, 'i')
                .replace(/[òóôõö]/g, 'o')
                .replace(/[ùúûü]/g, 'u')
                .replace(/[ç]/g, 'c')
                .replace(/[^a-z0-9\s-]/g, '')
                .replace(/\s+/g, '-')
                .replace(/-+/g, '-')
                .trim('-')
                .substring(0, 50);
            
            // Mettre à jour le lien en gardant le texte original
            link.href = `article-template.html?id=${articleId}`;
            link.removeAttribute('onclick');
            // Ne pas changer le texte du bouton
            
            console.log(`✅ Lien corrigé: "${title}" -> ${link.href}`);
        });
    }
    
    // Exécuter maintenant et après chargement
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', fixReadMoreLinks);
    } else {
        fixReadMoreLinks();
    }
    
    // Aussi après 2 secondes pour les chargements tardifs
    setTimeout(fixReadMoreLinks, 2000);
    
    // Export pour utilisation manuelle
    window.fixReadMoreLinks = fixReadMoreLinks;
    
})();
