/**
 * Script simple pour corriger les liens "Lire la suite" 
 * Version discrète sans modifications visuelles
 */

(function() {
    'use strict';
    
    function fixReadMoreLinks() {
        // Chercher tous les liens "Lire la suite"
        const links = document.querySelectorAll('a[href*="#"], a[onclick*="showActualiteDetails"], a[onclick*="openArticleModal"], .read-more, .lire-plus, .text-btn');
        
        links.forEach((link, index) => {
            // Éviter de traiter le même lien plusieurs fois
            if (link.hasAttribute('data-fixed')) return;
            link.setAttribute('data-fixed', 'true');
            
            let articleId = 'default-article-id'; // ID par défaut
            
            // Si window.actualitesData existe, essayer de matcher par titre ou utiliser l'index
            if (window.actualitesData && window.actualitesData.length > 0) {
                // Essayer de trouver la carte parente pour matcher par titre
                const card = link.closest('.news-card, .blog-post, .actualite-card');
                if (card) {
                    const titleEl = card.querySelector('h1, h2, h3, h4, h5, h6, .blog-title, .news-title');
                    if (titleEl) {
                        const cardTitle = titleEl.textContent.trim();
                        const matchedArticle = window.actualitesData.find(a => a.title === cardTitle);
                        if (matchedArticle) {
                            articleId = matchedArticle.id;
                            console.log(`🎯 Match par titre: "${cardTitle}" -> ${articleId}`);
                        } else {
                            // Fallback par index
                            if (index < window.actualitesData.length) {
                                articleId = window.actualitesData[index].id;
                                console.log(`📊 Fallback par index: ${index} -> ${articleId}`);
                            }
                        }
                    } else {
                        // Fallback par index si pas de titre trouvé
                        if (index < window.actualitesData.length) {
                            articleId = window.actualitesData[index].id;
                        }
                    }
                } else {
                    // Fallback par index si pas de carte trouvée
                    if (index < window.actualitesData.length) {
                        articleId = window.actualitesData[index].id;
                    }
                }
            }
            
            // Mettre à jour le lien
            link.href = `article-template.html?id=${articleId}`;
            link.removeAttribute('onclick');
            
            console.log(`✅ Lien corrigé: Index ${index} -> ${link.href}`);
        });
    }
    
    // Exécuter après que les données soient chargées
    function initializeWhenReady() {
        if (window.actualitesData && window.actualitesData.length > 0) {
            fixReadMoreLinks();
            console.log('✅ Liens corrigés avec les données actualitesData');
        } else {
            // Si pas de données, utiliser l'ID par défaut
            setTimeout(fixReadMoreLinks, 500);
            console.log('⚠️ Liens corrigés avec l\'ID par défaut');
        }
    }
    
    // Exécuter maintenant et après chargement
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            setTimeout(initializeWhenReady, 1000);
        });
    } else {
        setTimeout(initializeWhenReady, 1000);
    }
    
    // Vérifier périodiquement pendant les 5 premières secondes
    let attempts = 0;
    const checkInterval = setInterval(() => {
        attempts++;
        initializeWhenReady();
        
        if (attempts >= 5) {
            clearInterval(checkInterval);
        }
    }, 1000);
    
    // Export pour utilisation manuelle
    window.fixReadMoreLinks = fixReadMoreLinks;
    
})();
