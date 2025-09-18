/**
 * Script simple et efficace pour afficher les 3 actualités sur la page d'accueil
 * Sans bloquer le chargement de la page
 */

(function() {
    'use strict';
    
    function displayThreeActualites() {
        const container = document.getElementById('latest-actualites');
        if (!container) {
            console.error('❌ Container latest-actualites non trouvé');
            return;
        }
        
        console.log('📰 Affichage simple des 3 actualités...');
        
        const actualites = [
          /*{
                title: 'Nouvelle formation AutoCAD 2025 disponible',
                resume: 'Découvrez les nouvelles fonctionnalités d\'AutoCAD 2025 dans notre formation mise à jour. Inscription ouverte.',
                date: '20 décembre 2024',
                image: 'images/formationcova.jpg',
                id: 'formation-autocad-2025'
            },*/
            {
                title: 'Sorbo-Ingénierie obtient le renouvellement de son habilitation FDFP',
                resume: 'Nous sommes heureux d’annoncer que Sorbo-Ingénierie a obtenu le renouvellement de son habilitation auprès du FDFP, attestant de la qualité et de la conformité de nos programmes de formation.',
                date: '03 Avril 2025',
                image: 'images/image 01.jpg',
                id: 'prix-excellence-2024'
            },
            {
                title: 'Nouveau logiciel de calcul de structures OH-Route v1',
                resume: 'Lancement de la version 1 de notre logiciel OH-Route avec de nouvelles fonctionnalités de calcul hydraulique avancé.',
                date: '12 Septembre 2025',
                image: 'images/drainageroute.png',
                id: 'oh-route-v1-1'
            }
        ];
        
        // Tester d'abord si les images existent
        console.log('🔍 Test du chargement des images...');
        actualites.forEach((actualite, index) => {
            const img = new Image();
            img.onload = () => console.log(`✅ Image ${index + 1} chargée:`, actualite.image);
            img.onerror = () => console.error(`❌ Image ${index + 1} non trouvée:`, actualite.image);
            img.src = actualite.image;
        });
        
        container.innerHTML = actualites.map((actualite, index) => `
            <div class="news-card" data-aos="fade-up" data-aos-delay="${100 + (index * 100)}">
                <div class="news-image">
                    <img src="${actualite.image}" alt="${actualite.title}" loading="eager" 
                         onerror="console.error('❌ Image non trouvée:', '${actualite.image}'); this.src='images/logo.mr.png';" 
                         onload="console.log('✅ Image chargée:', '${actualite.image}');" 
                         style="width: 100%; height: 100%; object-fit: cover; display: block;">
                </div>
                <div class="news-content">
                    <span class="date">${actualite.date}</span>
                    <h3>${actualite.title}</h3>
                    <p>${actualite.resume}</p>
                    <a href="article-template.html?id=${actualite.id}" class="text-btn lire-plus">Lire la suite</a>
                </div>
            </div>
        `).join('');
        
        console.log('✅ 3 actualités affichées avec succès');
    }
    
    // Attendre que la page soit chargée
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', function() {
            setTimeout(displayThreeActualites, 1000);
        });
    } else {
        setTimeout(displayThreeActualites, 1000);
    }
    
    // Une seule vérification après 3 secondes
    setTimeout(function() {
        const container = document.getElementById('latest-actualites');
        if (container && container.children.length < 3) {
            displayThreeActualites();
        }
    }, 3000);
    
    // Export pour utilisation manuelle
    window.displayThreeActualites = displayThreeActualites;
    
    console.log('📰 Script simple actualités chargé');
    
})();
