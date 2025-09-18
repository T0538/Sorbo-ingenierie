/**
 * Script de test et d'activation forcée du système de blog
 * Ce script force l'activation du blog même si l'intégration automatique ne fonctionne pas
 */

(function() {
    'use strict';
    
    console.log('🧪 Blog Activation Test: Script de test chargé');
    
    // Fonction pour forcer l'activation du blog
    function forceBlogActivation() {
        console.log('🚀 Activation forcée du système de blog...');
        
        // 1. Traiter tous les liens "Lire la suite" existants
        const readMoreLinks = document.querySelectorAll('a[href*="#"], a[onclick], .read-more, .lire-plus');
        console.log(`📊 ${readMoreLinks.length} liens potentiels trouvés`);
        
        readMoreLinks.forEach((link, index) => {
            processLink(link, index);
        });
        
        // 2. Traiter toutes les cartes d'actualités
        const cards = document.querySelectorAll('.actualite-mini-card, .news-card, .blog-post, .actualite-card, [class*="actualite"], [class*="news"]');
        console.log(`📊 ${cards.length} cartes d'actualités trouvées`);
        
        cards.forEach((card, index) => {
            processCard(card, index);
        });
        
        // 3. Ajouter des logs pour debug
        addDebugInfo();
    }
    
    function processLink(link, index) {
        // Éviter de traiter le même lien plusieurs fois
        if (link.hasAttribute('data-blog-forced')) {
            return;
        }
        
        link.setAttribute('data-blog-forced', 'true');
        
        // Trouver le titre associé
        const card = link.closest('.actualite-mini-card, .news-card, .blog-post, .actualite-card, [class*="actualite"], [class*="news"]') || 
                     link.parentElement;
        
        let title = 'Article sans titre';
        let articleId = `article-${index + 1}`;
        
        if (card) {
            const titleElement = card.querySelector('h1, h2, h3, h4, h5, h6, .title, .titre, [class*="title"], [class*="titre"]');
            if (titleElement) {
                title = titleElement.textContent.trim();
                articleId = generateSlug(title);
            }
        }
        
        // Supprimer les anciens événements
        link.removeAttribute('onclick');
        link.onclick = null;
        
        // Mettre à jour le lien
        link.href = `article-template.html?id=${articleId}`;
        link.setAttribute('data-article-id', articleId);
        link.setAttribute('data-article-title', title);
        
        // Pas de style visuel - fonctionnalité invisible
        
        console.log(`✅ Lien forcé: "${title}" -> ${link.href}`);
    }
    
    function processCard(card, index) {
        // Éviter de traiter la même carte plusieurs fois
        if (card.hasAttribute('data-blog-card-forced')) {
            return;
        }
        
        card.setAttribute('data-blog-card-forced', 'true');
        
        // Chercher un lien "Lire la suite" dans la carte
        let readMoreLink = card.querySelector('a.read-more, a.lire-plus, a[href*="#"], a[onclick]');
        
        // Ne pas créer de nouveaux liens - seulement traiter les existants
        
        // Traiter le lien
        if (readMoreLink) {
            processLink(readMoreLink, index);
        }
        
        // Pas d'indicateur visuel - traitement invisible
    }
    
    // Fonction createReadMoreLink supprimée - ne pas créer de nouveaux boutons
    
    function generateSlug(title) {
        return title.toLowerCase()
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
    }
    
    function addDebugInfo() {
        // Debug silencieux - pas d'interface visuelle
        const linksCount = document.querySelectorAll('a[data-blog-forced]').length;
        const cardsCount = document.querySelectorAll('[data-blog-card-forced]').length;
        
        console.log(`📊 Blog Integration: ${linksCount} liens traités, ${cardsCount} cartes traitées`);
    }
    
    // Activation automatique
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', function() {
            setTimeout(forceBlogActivation, 1000);
        });
    } else {
        setTimeout(forceBlogActivation, 1000);
    }
    
    // Aussi activer après 3 secondes pour les chargements tardifs
    setTimeout(forceBlogActivation, 3000);
    
    // Exporter pour utilisation manuelle
    window.forceBlogActivation = forceBlogActivation;
    
    console.log('🧪 Blog Activation Test: Prêt! Utilisez window.forceBlogActivation() pour activer manuellement');
    
})();
