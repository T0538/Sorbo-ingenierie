/**
 * Script spécifique pour afficher les actualités sur la page actualites.html
 */

(function() {
    'use strict';
    
    function displayActualitesPage() {
        const container = document.getElementById('actualites-container');
        if (!container) {
            console.error('❌ Container actualites-container non trouvé');
            return;
        }
        
        // Vérifier si les données sont disponibles
        if (!window.actualitesData || !Array.isArray(window.actualitesData)) {
            console.error('❌ window.actualitesData non disponible');
            setTimeout(displayActualitesPage, 500); // Réessayer
            return;
        }
        
        console.log('📰 Affichage des actualités sur la page actualités...');
        
        // Masquer le loader
        const loader = container.querySelector('.loading-actualites');
        if (loader) {
            loader.style.display = 'none';
        }
        
        // Générer le HTML des actualités
        const actualitesHTML = window.actualitesData.map((actualite, index) => `
            <article class="blog-post" data-aos="fade-up" data-aos-delay="${100 + (index * 100)}">
                <div class="blog-post-image">
                    <img src="${actualite.imageUrl}" alt="${actualite.imageAlt || actualite.title}" loading="lazy">
                    <div class="blog-post-category">${actualite.categorie}</div>
                </div>
                <div class="blog-post-content">
                    <div class="blog-post-meta">
                        <span class="blog-post-author">
                            <i class="fas fa-user"></i> ${actualite.auteur}
                        </span>
                        <span class="blog-post-date">
                            <i class="fas fa-calendar"></i> ${new Date(actualite.datePublication).toLocaleDateString('fr-FR', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric'
                            })}
                        </span>
                    </div>
                    <h2 class="blog-post-title">${actualite.title}</h2>
                    <p class="blog-post-excerpt">${actualite.resume}</p>
                    <div class="blog-post-footer">
                        <div class="blog-post-tags">
                            ${actualite.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
                        </div>
                        <a href="article-template.html?id=${actualite.id}" class="read-more-btn">
                            Lire la suite <i class="fas fa-arrow-right"></i>
                        </a>
                    </div>
                </div>
            </article>
        `).join('');
        
        // Injecter le HTML
        container.innerHTML = actualitesHTML;
        
        console.log(`✅ ${window.actualitesData.length} actualités affichées sur la page actualités`);
    }
    
    // Attendre que la page et les données soient chargées
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', function() {
            setTimeout(displayActualitesPage, 500);
        });
    } else {
        setTimeout(displayActualitesPage, 500);
    }
    
    // Export pour utilisation manuelle
    window.displayActualitesPage = displayActualitesPage;
    
    console.log('📄 Script actualités page chargé');
    
})();
