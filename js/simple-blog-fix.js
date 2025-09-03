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
            
            // Utiliser les IDs des actualités définies dans window.actualitesData
            let articleId = 'renouvellement-habilitation-fdfp-genie-civil'; // ID par défaut
            
            // Si window.actualitesData existe, utiliser le bon ID
            if (window.actualitesData && window.actualitesData.length > 0) {
                if (index < window.actualitesData.length) {
                    articleId = window.actualitesData[index].id;
                }
            }
            
            // Mettre à jour le lien en gardant le texte original
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
