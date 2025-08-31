/**
 * Vérification finale pour s'assurer que les 3 actualités avec images sont bien affichées
 */

(function() {
    'use strict';
    
    function finalCheck() {
        console.log('🔍 Vérification finale des actualités...');
        
        const container = document.getElementById('latest-actualites');
        if (!container) {
            console.log('❌ Conteneur non trouvé');
            return;
        }
        
        const newsCards = container.querySelectorAll('.news-card');
        const images = container.querySelectorAll('img');
        
        console.log(`📊 État final: ${newsCards.length} cartes, ${images.length} images`);
        
        if (newsCards.length !== 3) {
            console.log('⚠️ Pas exactement 3 actualités, correction...');
            window.forceOurActualites && window.forceOurActualites();
        }
        
        if (images.length !== 3) {
            console.log('⚠️ Pas exactement 3 images, correction...');
            window.forceOurActualites && window.forceOurActualites();
        }
        
        // Vérifier que les actualités correctes sont présentes
        const content = container.innerHTML;
        const requiredTitles = [
            'Nouvelle formation AutoCAD 2025',
            'prix d\'excellence 2024',
            'OH-Route v1.1'
        ];
        
        const missingTitles = requiredTitles.filter(title => !content.includes(title));
        
        if (missingTitles.length > 0) {
            console.log('⚠️ Actualités manquantes:', missingTitles);
            window.forceOurActualites && window.forceOurActualites();
        } else {
            console.log('✅ Toutes les actualités sont présentes');
        }
        
        // Vérifier les images
        images.forEach((img, index) => {
            if (!img.src || img.src.includes('default-news.jpg')) {
                console.log(`⚠️ Image ${index + 1} manquante ou par défaut`);
            } else {
                console.log(`✅ Image ${index + 1} OK: ${img.src}`);
            }
        });
    }
    
    // Vérifications multiples
    setTimeout(finalCheck, 2000);  // Après 2 secondes
    setTimeout(finalCheck, 5000);  // Après 5 secondes
    setTimeout(finalCheck, 10000); // Après 10 secondes
    
    // Export pour utilisation manuelle
    window.finalCheckActualites = finalCheck;
    
    console.log('🔍 Script de vérification finale chargé');
    
})();
