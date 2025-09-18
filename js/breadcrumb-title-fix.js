/**
 * Correctif simple pour le titre du breadcrumb
 * Ne modifie que le breadcrumb, préserve tout le reste du système
 */

(function() {
    'use strict';
    
    // Données de correspondance pour les titres complets - TOUS LES PATTERNS POSSIBLES
    const titleMappings = {
        'prix-excellence-2024': 'Sorbo-Ingénierie obtient le renouvellement de son habilitation FDFP',
        'formation-autocad-2025': 'Nouvelle formation AutoCAD 2025 disponible',
        'oh-route-v1-1': 'Nouveau logiciel de calcul de structures OH-Route v1.1',
        // Patterns possibles générés par les scripts
        'sorbo-ingenierie-obtient-le-renouvellement-de-son': 'Sorbo-Ingénierie obtient le renouvellement de son habilitation FDFP',
        'sorbo-ingenierie-obtient-le-renouvellement-de-son-': 'Sorbo-Ingénierie obtient le renouvellement de son habilitation FDFP', // PATTERN EXACT TROUVÉ !
        'sorbo-ingenierie-obtient-le-renouvellement-de-son-habilitation-fdfp': 'Sorbo-Ingénierie obtient le renouvellement de son habilitation FDFP',
        'nouvelle-formation-autocad-2025-disponible': 'Nouvelle formation AutoCAD 2025 disponible',
        'nouveau-logiciel-de-calcul-de-structures-oh-route-v1-1': 'Nouveau logiciel de calcul de structures OH-Route v1.1',
        'nouveau-logiciel-de-calcul-de-structures-oh-route': 'Nouveau logiciel de calcul de structures OH-Route v1.1'
    };
    
    function fixBreadcrumbTitle() {
        // Obtenir l'ID de l'article depuis l'URL
        const urlParams = new URLSearchParams(window.location.search);
        const articleId = urlParams.get('id');
        
        console.log('🍞 === DEBUG BREADCRUMB ===');
        console.log('🍞 URL complète:', window.location.href);
        console.log('🍞 ID article détecté:', articleId);
        console.log('🍞 Mappings disponibles:', Object.keys(titleMappings));
        
        if (!articleId) {
            console.log('🍞 ❌ Pas d\'ID d\'article pour le breadcrumb');
            return;
        }
        
        // Normaliser l'ID (décoder et enlever tirets finaux qui arrivent souvent lors des truncations)
        function normalizeId(id) {
            if (!id) return id;
            try { id = decodeURIComponent(id); } catch (e) { /* ignore */ }
            // Supprimer les tirets répétés et les tirets de fin
            id = id.replace(/-+/g, '-').replace(/^-|-$/g, '');
            return id;
        }

        const normalizedId = normalizeId(articleId);
        console.log('🍞 ID normalisé:', normalizedId);

        // Trouver le titre complet correspondant - recherche extensive
        let fullTitle = titleMappings[normalizedId] || titleMappings[articleId];
        console.log('🍞 Mapping direct trouvé:', fullTitle);

        // Si pas de mapping direct, tenter un appariement fuzzy (préfixe / clé la plus longue correspondante)
        if (!fullTitle) {
            const keys = Object.keys(titleMappings);
            // Chercher clés qui commencent par normalizedId ou pour lesquelles normalizedId commence par la clé
            const candidates = keys.filter(k => k.startsWith(normalizedId) || normalizedId.startsWith(k));
            if (candidates.length > 0) {
                // Choisir la clé la plus longue (meilleure correspondance)
                candidates.sort((a,b) => b.length - a.length);
                const best = candidates[0];
                fullTitle = titleMappings[best];
                console.log('🍞 Mapping fuzzy trouvé (best):', best, '->', fullTitle);
            }
        }

        // Si pas de mapping direct/fuzzy, essayer par mots-clés
        if (!fullTitle) {
            console.log('🍞 Recherche par mots-clés...');
            if (articleId.includes('sorbo') || articleId.includes('fdfp') || articleId.includes('habilitation') || articleId.includes('renouvellement')) {
                fullTitle = 'Sorbo-Ingénierie obtient le renouvellement de son habilitation FDFP';
                console.log('🍞 ✅ Détecté: Article FDFP');
            } else if (articleId.includes('autocad') || articleId.includes('formation')) {
                fullTitle = 'Nouvelle formation AutoCAD 2025 disponible';
                console.log('🍞 ✅ Détecté: Article Formation');
            } else if (articleId.includes('route') || articleId.includes('logiciel') || articleId.includes('calcul')) {
                fullTitle = 'Nouveau logiciel de calcul de structures OH-Route v1.1';
                console.log('🍞 ✅ Détecté: Article OH-Route');
            }
        }
        
        console.log('🍞 Titre final à appliquer:', fullTitle);
        
        if (fullTitle) {
            // Fonction de mise à jour AGRESSIVE
            function updateBreadcrumb() {
                console.log('🍞 Tentative de mise à jour du breadcrumb...');
                
                // Chercher TOUS les éléments possibles
                const selectors = [
                    '#article-breadcrumb',
                    '.breadcrumb span:last-child',
                    '.breadcrumb span:nth-child(3)',
                    'nav span:last-child'
                ];
                
                let updated = false;
                
                selectors.forEach(selector => {
                    const elements = document.querySelectorAll(selector);
                    elements.forEach((element, index) => {
                        if (element) {
                            const oldText = element.textContent;
                            element.textContent = fullTitle;
                            console.log(`✅ Breadcrumb mis à jour (${selector}[${index}]):`);
                            console.log('   Ancien:', oldText);
                            console.log('   Nouveau:', fullTitle);
                            updated = true;
                        }
                    });
                });
                
                return updated;
            }
            
            // Essayer plusieurs fois de manière agressive
            console.log('🍞 Début des tentatives de correction...');
            updateBreadcrumb(); // Immédiat
            setTimeout(() => { console.log('🍞 Tentative 500ms'); updateBreadcrumb(); }, 500);
            setTimeout(() => { console.log('🍞 Tentative 1000ms'); updateBreadcrumb(); }, 1000);
            setTimeout(() => { console.log('🍞 Tentative 2000ms'); updateBreadcrumb(); }, 2000);
            setTimeout(() => { console.log('🍞 Tentative 3000ms'); updateBreadcrumb(); }, 3000);
            
        } else {
            console.log('🍞 ❌ Aucun titre trouvé pour:', articleId);
            console.log('🍞 Essayez d\'ajouter ce mapping dans titleMappings');
        }
    }
    
    // Observer les changements du breadcrumb pour le corriger automatiquement
    function watchBreadcrumb() {
        const breadcrumbElement = document.querySelector('#article-breadcrumb');
        if (!breadcrumbElement) {
            // Si l'élément n'existe pas encore, réessayer
            setTimeout(watchBreadcrumb, 500);
            return;
        }
        
        const observer = new MutationObserver(function(mutations) {
            mutations.forEach(function(mutation) {
                if (mutation.type === 'childList' || mutation.type === 'characterData') {
                    // Le breadcrumb a changé, le corriger après un petit délai
                    setTimeout(fixBreadcrumbTitle, 100);
                }
            });
        });
        
        observer.observe(breadcrumbElement, {
            childList: true,
            characterData: true,
            subtree: true
        });
        
        console.log('👀 Surveillance du breadcrumb activée');
    }
    
    // Initialisation
    function init() {
        console.log('🍞 Correctif breadcrumb initialisé');
        
        // Corriger immédiatement
        fixBreadcrumbTitle();
        
        // Surveiller les changements
        watchBreadcrumb();
    }
    
    // Lancer quand le DOM est prêt
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
    
    // Export pour usage manuel
    window.fixBreadcrumbTitle = fixBreadcrumbTitle;
    
})();
