/**
 * Script pour forcer l'affichage des 3 actualités sur la page d'accueil
 */

(function() {
    'use strict';
    
    function forceHomepageActualites() {
        console.log('🏠 Forçage de l\'affichage des 3 actualités sur la page d\'accueil...');
        
        const container = document.getElementById('latest-actualites');
        if (!container) {
            console.log('❌ Conteneur latest-actualites non trouvé - pas sur la page d\'accueil');
            return;
        }
        
        // Vérifier combien d'actualités sont actuellement affichées
        const currentCards = container.querySelectorAll('.news-card, .actualite-mini-card');
        console.log(`📊 Actualités actuellement affichées: ${currentCards.length}`);
        
        if (currentCards.length >= 3) {
            console.log('✅ Les 3 actualités sont déjà affichées');
            return;
        }
        
        // Forcer l'affichage en utilisant le gestionnaire d'actualités
        if (window.actualitesManager) {
            console.log('🔄 Rechargement via actualitesManager...');
            window.actualitesManager.displayLatestActualites();
        } else {
            // Affichage manuel des 3 actualités principales
            console.log('🔄 Affichage manuel des 3 actualités...');
            displayThreeActualites(container);
        }
        
        // Vérifier après 1 seconde
        setTimeout(() => {
            const finalCards = container.querySelectorAll('.news-card, .actualite-mini-card');
            console.log(`✅ Résultat final: ${finalCards.length} actualités affichées`);
        }, 1000);
    }
    
    function displayThreeActualites(container) {
        // Les 3 actualités principales à afficher
        const actualites = [
            {
                id: 'formation-autocad-2025',
                title: 'Nouvelle formation AutoCAD 2025 disponible',
                resume: 'Découvrez les nouvelles fonctionnalités d\'AutoCAD 2025 dans notre formation mise à jour. Inscription ouverte.',
                datePublication: '2024-12-20T10:00:00.000Z',
                slug: 'formation-autocad-2025'
            },
            {
                id: 'prix-excellence-2024',
                title: 'Sorbo-Ingénierie remporte le prix d\'excellence 2024',
                resume: 'Notre entreprise a été récompensée pour ses innovations dans le domaine de l\'ingénierie civile en Afrique de l\'Ouest.',
                datePublication: '2024-12-18T14:30:00.000Z',
                slug: 'prix-excellence-2024'
            },
            {
                id: 'oh-route-v1-1',
                title: 'Nouveau logiciel de calcul de structures OH-Route v1.1',
                resume: 'Lancement de la version 1.1 de notre logiciel OH-Route avec de nouvelles fonctionnalités de calcul hydraulique avancé.',
                datePublication: '2024-12-15T09:15:00.000Z',
                slug: 'oh-route-v1-1'
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
        
        container.innerHTML = actualites.map((actualite, index) => `
            <div class="news-card" data-aos="fade-up" data-aos-delay="${100 + (index * 100)}">
                <div class="news-image">
                    <img src="images/actualites/${actualite.id}.jpg" alt="${actualite.title}" loading="lazy" 
                         data-actualite-id="${actualite.id}" 
                         data-image-path="images/actualites/${actualite.id}.jpg"
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
        
        console.log('✅ 3 actualités affichées manuellement');
    }
    
    // Fonction pour s'exécuter à intervalles réguliers
    function scheduleForcing() {
        // Exécuter immédiatement
        forceHomepageActualites();
        
        // Répéter toutes les 2 secondes pendant 10 secondes
        let attempts = 0;
        const maxAttempts = 5;
        
        const intervalId = setInterval(() => {
            attempts++;
            console.log(`🔄 Tentative de forçage ${attempts}/${maxAttempts}`);
            forceHomepageActualites();
            
            if (attempts >= maxAttempts) {
                clearInterval(intervalId);
                console.log('🏠 Forçage des actualités terminé');
            }
        }, 2000);
    }
    
    // Exécuter selon l'état du document
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', scheduleForcing);
    } else {
        scheduleForcing();
    }
    
    // Aussi après 1 seconde
    setTimeout(scheduleForcing, 1000);
    
    // Export pour utilisation manuelle
    window.forceHomepageActualites = forceHomepageActualites;
    window.displayThreeActualites = () => {
        const container = document.getElementById('latest-actualites');
        if (container) {
            displayThreeActualites(container);
        }
    };
    
    console.log('🏠 Script de forçage des actualités page d\'accueil chargé. Utilisez window.forceHomepageActualites() si besoin.');
    
})();
