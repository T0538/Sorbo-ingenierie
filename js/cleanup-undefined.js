/**
 * Script pour nettoyer les "undefined" qui apparaissent dans les actualités
 */

(function() {
    'use strict';
    
    function cleanupUndefined() {
        console.log('🧹 Nettoyage des "undefined"...');
        
        const container = document.getElementById('latest-actualites');
        if (!container) {
            console.log('❌ Conteneur non trouvé');
            return;
        }
        
        // Vérifier s'il y a du texte "undefined"
        if (container.innerHTML.includes('undefined')) {
            console.log('⚠️ "undefined" détecté, nettoyage en cours...');
            
            // Vider complètement le conteneur
            container.innerHTML = '';
            
            // Remettre les 3 actualités proprement
            displayCleanActualites(container);
        } else {
            // Vérifier si le conteneur est vide ou contient seulement des éléments vides
            const content = container.textContent.trim();
            if (content === '' || content === 'undefined') {
                console.log('⚠️ Conteneur vide ou invalide, restauration...');
                displayCleanActualites(container);
            } else {
                console.log('✅ Contenu valide détecté');
            }
        }
    }
    
    function displayCleanActualites(container) {
        console.log('🔧 Affichage des actualités propres...');
        
        const actualites = [
            {
                title: 'Nouvelle formation AutoCAD 2025 disponible',
                resume: 'Découvrez les nouvelles fonctionnalités d\'AutoCAD 2025 dans notre formation mise à jour. Inscription ouverte.',
                date: '20 décembre 2024',
                image: 'images/actualites/formation-autocad-2025.jpg',
                id: 'formation-autocad-2025'
            },
            {
                title: 'Sorbo-Ingénierie remporte le prix d\'excellence 2024',
                resume: 'Notre entreprise a été récompensée pour ses innovations dans le domaine de l\'ingénierie civile en Afrique de l\'Ouest.',
                date: '18 décembre 2024',
                image: 'images/actualites/prix-excellence-2024.jpg',
                id: 'prix-excellence-2024'
            },
            {
                title: 'Nouveau logiciel de calcul de structures OH-Route v1.1',
                resume: 'Lancement de la version 1.1 de notre logiciel OH-Route avec de nouvelles fonctionnalités de calcul hydraulique avancé.',
                date: '15 décembre 2024',
                image: 'images/actualites/oh-route-v1-1.jpg',
                id: 'oh-route-v1-1'
            }
        ];
        
        const actualitesHTML = actualites.map((actualite, index) => `
            <div class="news-card" data-aos="fade-up" data-aos-delay="${100 + (index * 100)}">
                <div class="news-image">
                    <img src="${actualite.image}" alt="${actualite.title}" loading="lazy" 
                         onerror="this.src='images/default-news.jpg'">
                </div>
                <div class="news-content">
                    <span class="date">${actualite.date}</span>
                    <h3>${actualite.title}</h3>
                    <p>${actualite.resume}</p>
                    <a href="article-template.html?id=${actualite.id}" class="text-btn lire-plus">Lire la suite</a>
                </div>
            </div>
        `).join('');
        
        // Double vérification avant injection
        if (actualitesHTML && !actualitesHTML.includes('undefined')) {
            container.innerHTML = actualitesHTML;
            console.log('✅ Actualités propres injectées');
        } else {
            console.error('❌ Erreur dans la génération du HTML');
        }
    }
    
    // Nettoyage immédiat
    setTimeout(cleanupUndefined, 100);
    
    // Nettoyages répétés pour contrer les problèmes
    setTimeout(cleanupUndefined, 1000);
    setTimeout(cleanupUndefined, 2000);
    setTimeout(cleanupUndefined, 3000);
    setTimeout(cleanupUndefined, 5000);
    
    // Observer les changements pour détecter l'apparition d'undefined
    function setupUndefinedObserver() {
        const container = document.getElementById('latest-actualites');
        if (!container) return;
        
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.type === 'childList' || mutation.type === 'characterData') {
                    if (container.innerHTML.includes('undefined')) {
                        console.log('🚨 "undefined" détecté par l\'observer, nettoyage...');
                        setTimeout(cleanupUndefined, 100);
                    }
                }
            });
        });
        
        observer.observe(container, {
            childList: true,
            subtree: true,
            characterData: true
        });
        
        console.log('👁️ Observer "undefined" activé');
    }
    
    // Activer l'observer
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', setupUndefinedObserver);
    } else {
        setupUndefinedObserver();
    }
    
    // Export pour utilisation manuelle
    window.cleanupUndefined = cleanupUndefined;
    window.displayCleanActualites = () => {
        const container = document.getElementById('latest-actualites');
        if (container) {
            displayCleanActualites(container);
        }
    };
    
    console.log('🧹 Script de nettoyage "undefined" chargé');
    
})();
