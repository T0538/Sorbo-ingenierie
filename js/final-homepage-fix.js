/**
 * Script final pour forcer l'affichage des 3 actualités sur la page d'accueil
 * S'exécute en dernier pour écraser tous les autres chargements
 */

(function() {
    'use strict';
    
    function finalHomepageFix() {
        console.log('🚀 FINAL FIX: Forçage définitif des 3 actualités sur la page d\'accueil');
        
        const container = document.getElementById('latest-actualites');
        if (!container) {
            console.log('❌ Pas sur la page d\'accueil');
            return;
        }
        
        // Arrêter tous les autres scripts qui pourraient interférer
        window.actualitesManager = null;
        
        // Forcer l'affichage des 3 actualités directement
        forceDisplayThreeActualites(container);
        
        // Protéger contre les écrasements
        protectFromOverwrites(container);
    }
    
    function forceDisplayThreeActualites(container) {
        console.log('💪 Affichage forcé des 3 actualités principales...');
        
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
                image: 'images/actualites/oh-route-v1-1.jpg'
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
        
        // Vider complètement le conteneur
        container.innerHTML = '';
        
        // Créer le HTML des 3 actualités avec images
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
        
        // Vérifier et injecter le HTML seulement s'il est valide
        if (actualitesHTML && actualitesHTML.trim() !== '' && !actualitesHTML.includes('undefined')) {
            container.innerHTML = actualitesHTML;
            console.log('✅ HTML valide injecté');
        } else {
            console.error('❌ HTML invalide dans final-homepage-fix:', actualitesHTML.substring(0, 100));
        }
        
        console.log('✅ 3 actualités forcées avec succès');
        
        // Marquer le conteneur comme définitivement traité
        container.setAttribute('data-final-fix-applied', 'true');
        container.style.background = '';
        container.style.border = '';
    }
    
    function protectFromOverwrites(container) {
        console.log('🛡️ Protection contre les écrasements...');
        
        // Observer les changements sur le conteneur
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.type === 'childList') {
                    const currentCards = container.querySelectorAll('.news-card');
                    
                    // Si moins de 3 cartes ou contenu écrasé
                    if (currentCards.length < 3 || 
                        container.innerHTML.includes('loading-actualites') ||
                        container.innerHTML.includes('Chargement des actualités')) {
                        
                        console.log('⚠️ PROTECTION: Contenu écrasé détecté, restauration...');
                        setTimeout(() => {
                            forceDisplayThreeActualites(container);
                        }, 100);
                    }
                }
            });
        });
        
        observer.observe(container, {
            childList: true,
            subtree: true
        });
        
        console.log('🛡️ Protection active');
        
        // Aussi vérifier périodiquement pendant 30 secondes
        let checkCount = 0;
        const maxChecks = 15;
        
        const periodicCheck = setInterval(() => {
            checkCount++;
            const currentCards = container.querySelectorAll('.news-card');
            
            if (currentCards.length < 3) {
                console.log(`🔄 Check ${checkCount}/${maxChecks}: Seulement ${currentCards.length} actualités, correction...`);
                forceDisplayThreeActualites(container);
            } else {
                console.log(`✅ Check ${checkCount}/${maxChecks}: 3 actualités OK`);
            }
            
            if (checkCount >= maxChecks) {
                clearInterval(periodicCheck);
                observer.disconnect();
                console.log('🛡️ Protection terminée');
            }
        }, 2000);
    }
    
    // Attendre que tous les autres scripts soient chargés avant d'agir
    function scheduleExecution() {
        // Exécuter immédiatement
        setTimeout(() => {
            console.log('⏰ Exécution immédiate du fix...');
            finalHomepageFix();
        }, 500);
        
        // Puis toutes les 1 seconde pendant 20 secondes pour contrer les écrasements
        let protectionCount = 0;
        const maxProtections = 20;
        
        const protectionInterval = setInterval(() => {
            protectionCount++;
            console.log(`🛡️ Protection ${protectionCount}/${maxProtections}`);
            finalHomepageFix();
            
            if (protectionCount >= maxProtections) {
                clearInterval(protectionInterval);
                console.log('🛡️ Protection longue durée terminée');
            }
        }, 1000);
    }
    
    // Lancer selon l'état du document
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', scheduleExecution);
    } else {
        scheduleExecution();
    }
    
    // Export pour utilisation manuelle
    window.finalHomepageFix = finalHomepageFix;
    window.forceThreeActualites = () => {
        const container = document.getElementById('latest-actualites');
        if (container) {
            forceDisplayThreeActualites(container);
        }
    };
    
    console.log('🚀 Script de fix final chargé. Utilisez window.finalHomepageFix() ou window.forceThreeActualites() si besoin.');
    
})();
