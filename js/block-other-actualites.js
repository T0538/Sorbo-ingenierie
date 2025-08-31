/**
 * Script pour bloquer les autres scripts d'actualités qui écrasent notre contenu
 */

(function() {
    'use strict';
    
    console.log('🚫 Bloqueur d\'actualités activé');
    
    // Désactiver les autres gestionnaires d'actualités
    function disableOtherActualitesScripts() {
        // Bloquer l'actualitesManager
        if (window.actualitesManager) {
            console.log('🚫 Désactivation de actualitesManager');
            window.actualitesManager.displayLatestActualites = function() {
                console.log('🚫 actualitesManager.displayLatestActualites bloqué');
            };
        }
        
        // Bloquer le DynamicContentLoader
        if (window.DynamicContentLoader) {
            console.log('🚫 Désactivation de DynamicContentLoader');
            window.DynamicContentLoader.prototype.loadLatestActualites = function() {
                console.log('🚫 DynamicContentLoader.loadLatestActualites bloqué');
            };
        }
        
        // Surveiller les nouveaux scripts
        Object.defineProperty(window, 'actualitesManager', {
            set: function(value) {
                console.log('🚫 Tentative de redéfinition de actualitesManager bloquée');
            },
            get: function() {
                return null;
            }
        });
    }
    
    // Protéger le conteneur contre les modifications
    function protectContainer() {
        const container = document.getElementById('latest-actualites');
        if (!container) return;
        
        // Intercepter les tentatives de modification du innerHTML
        const originalInnerHTMLSetter = Object.getOwnPropertyDescriptor(Element.prototype, 'innerHTML').set;
        
        Object.defineProperty(container, 'innerHTML', {
            set: function(value) {
                // Si c'est notre contenu avec les 3 actualités, l'autoriser
                if (value.includes('Nouvelle formation AutoCAD 2025') && 
                    value.includes('prix d\'excellence 2024') && 
                    value.includes('OH-Route v1.1')) {
                    console.log('✅ Modification autorisée - contenu valide');
                    originalInnerHTMLSetter.call(this, value);
                } else if (value.includes('loading-actualites') || 
                          value.includes('Chargement des actualités') ||
                          value.trim() === '') {
                    console.log('🚫 Modification bloquée - tentative d\'écrasement');
                    // Ne pas appliquer la modification
                    return;
                } else {
                    console.log('⚠️ Modification inconnue:', value.substring(0, 100));
                    // Laisser passer les autres modifications
                    originalInnerHTMLSetter.call(this, value);
                }
            },
            get: function() {
                return originalInnerHTMLSetter.call(this);
            }
        });
        
        console.log('🛡️ Conteneur protégé contre les modifications');
    }
    
    // Forcer nos 3 actualités avec images
    function forceOurActualites() {
        const container = document.getElementById('latest-actualites');
        if (!container) return;
        
        const actualites = [
            {
                id: 'formation-autocad-2025',
                title: 'Nouvelle formation AutoCAD 2025 disponible',
                resume: 'Découvrez les nouvelles fonctionnalités d\'AutoCAD 2025 dans notre formation mise à jour. Inscription ouverte.',
                datePublication: '2024-12-20T10:00:00.000Z',
                image: 'images/actualites/formation-autocad-2025.jpg'
            },
            {
                id: 'prix-excellence-2024',
                title: 'Sorbo-Ingénierie remporte le prix d\'excellence 2024',
                resume: 'Notre entreprise a été récompensée pour ses innovations dans le domaine de l\'ingénierie civile en Afrique de l\'Ouest.',
                datePublication: '2024-12-18T14:30:00.000Z',
                image: 'images/actualites/prix-excellence-2024.jpg'
            },
            {
                id: 'oh-route-v1-1',
                title: 'Nouveau logiciel de calcul de structures OH-Route v1.1',
                resume: 'Lancement de la version 1.1 de notre logiciel OH-Route avec de nouvelles fonctionnalités de calcul hydraulique avancé.',
                datePublication: '2024-12-15T09:15:00.000Z',
                image: 'images/drainageroute.png'
            }
        ];
        
        const formatDate = (dateString) => {
            const date = new Date(dateString);
            return date.toLocaleDateString('fr-FR', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            });
        };
        
        const actualitesHTML = actualites.map((actualite, index) => `
            <div class="news-card" data-aos="fade-up" data-aos-delay="${100 + (index * 100)}">
                <div class="news-image">
                    <img src="${actualite.image}" alt="${actualite.title}" loading="lazy" 
                         onerror="this.src='images/default-news.jpg'">
                </div>
                <div class="news-content">
                    <span class="date">${formatDate(actualite.datePublication)}</span>
                    <h3>${actualite.title}</h3>
                    <p>${actualite.resume}</p>
                    <a href="article-template.html?id=${actualite.id}" class="text-btn lire-plus">Lire la suite</a>
                </div>
            </div>
        `).join('');
        
        // Vérifier que le HTML est valide avant de l'injecter
        if (actualitesHTML && actualitesHTML.trim() !== '' && !actualitesHTML.includes('undefined')) {
            // Utiliser le setter original pour contourner notre protection
            const originalSetter = Object.getOwnPropertyDescriptor(Element.prototype, 'innerHTML').set;
            originalSetter.call(container, actualitesHTML);
        } else {
            console.error('❌ HTML invalide détecté, abandon');
        }
        
        console.log('💪 3 actualités avec images forcées');
    }
    
    // Initialisation
    function init() {
        disableOtherActualitesScripts();
        
        setTimeout(() => {
            protectContainer();
            forceOurActualites();
        }, 100);
        
        // Forcer toutes les 500ms pendant 30 secondes
        let forceCount = 0;
        const maxForces = 60;
        
        const forceInterval = setInterval(() => {
            forceCount++;
            console.log(`💪 Force ${forceCount}/${maxForces}`);
            forceOurActualites();
            
            if (forceCount >= maxForces) {
                clearInterval(forceInterval);
                console.log('💪 Forçage intensif terminé');
            }
        }, 500);
    }
    
    // Lancer immédiatement
    init();
    
    // Aussi après DOMContentLoaded
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    }
    
    // Export pour debug
    window.forceOurActualites = forceOurActualites;
    window.blockOtherScripts = disableOtherActualitesScripts;
    
    console.log('🚫 Bloqueur d\'actualités prêt');
    
})();
