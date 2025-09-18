/**
 * Script pour limiter l'affichage aux 3 actualités principales
 * Masque toutes les autres actualités
 */

(function() {
    'use strict';
    
    function limitToThreeActualites() {
        console.log('🔒 Limitation aux 3 actualités principales...');
        
        // Conteneurs possibles d'actualités
        const containers = [
            document.getElementById('latest-actualites'),
            document.getElementById('actualites-container'),
            document.querySelector('.news-grid'),
            document.querySelector('.actualites-grid'),
            document.querySelector('.blog-container')
        ].filter(container => container !== null);
        
        containers.forEach(container => {
            limitActualitesInContainer(container);
        });
        
        // Masquer le bouton "Charger plus" s'il existe
        const loadMoreBtn = document.getElementById('loadMoreBtn');
        if (loadMoreBtn) {
            loadMoreBtn.style.display = 'none';
            console.log('🔒 Bouton "Charger plus" masqué');
        }
        
        // Masquer les filtres de catégories s'ils existent
        const categoryFilters = document.querySelectorAll('.category-filter, .filter-btn');
        categoryFilters.forEach(filter => {
            filter.style.display = 'none';
        });
        
        console.log('✅ Limitation aux 3 actualités appliquée');
    }
    
    function limitActualitesInContainer(container) {
        if (!container) return;
        
        const actualiteCards = container.querySelectorAll(
            '.news-card, .actualite-mini-card, .actualite-card, .blog-post, [class*="actualite"], [class*="news"]'
        );
        
        console.log(`📊 ${actualiteCards.length} cartes trouvées dans`, container.id || container.className);
        
        // Pour la page d'accueil, forcer l'affichage des 3 premières actualités
        if (container.id === 'latest-actualites' && actualiteCards.length < 3) {
            console.log('🔄 Page d\'accueil: Recharger les actualités pour avoir les 3');
            if (window.actualitesManager) {
                window.actualitesManager.displayLatestActualites();
            }
            return;
        }
        
        actualiteCards.forEach((card, index) => {
            if (index >= 3) {
                // Masquer les actualités après les 3 premières
                card.style.display = 'none';
                card.style.visibility = 'hidden';
                card.classList.add('hidden-actualite');
                console.log(`🚫 Actualité ${index + 1} masquée`);
            } else {
                // S'assurer que les 3 premières sont visibles
                card.style.display = '';
                card.style.visibility = 'visible';
                card.classList.remove('hidden-actualite');
                console.log(`✅ Actualité ${index + 1} visible`);
            }
        });
    }
    
    // Exécuter la limitation
    function applyLimitation() {
        limitToThreeActualites();
        
        // Répéter toutes les 2 secondes pendant 10 secondes pour contrer les rechargements
        let attempts = 0;
        const maxAttempts = 5;
        
        const intervalId = setInterval(() => {
            attempts++;
            console.log(`🔄 Réapplication de la limitation (${attempts}/${maxAttempts})`);
            limitToThreeActualites();
            
            if (attempts >= maxAttempts) {
                clearInterval(intervalId);
                console.log('🔒 Protection de limitation terminée');
            }
        }, 2000);
    }
    
    // Exécuter maintenant et après chargement
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', applyLimitation);
    } else {
        applyLimitation();
    }
    
    // Aussi après 1 seconde pour les chargements tardifs
    setTimeout(applyLimitation, 1000);
    
    // Export pour utilisation manuelle
    window.limitToThreeActualites = limitToThreeActualites;
    window.applyActualitesLimitation = applyLimitation;
    
    console.log('🔒 Script de limitation aux 3 actualités chargé. Utilisez window.limitToThreeActualites() si besoin.');
    
})();
