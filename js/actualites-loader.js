// Chargeur d'actualités depuis MongoDB Atlas
console.log('📰 Démarrage du chargeur d\'actualités...');
const API_BASE_URL = 'https://sorbo-api-production.up.railway.app'; // Production Railway
// const API_BASE_URL = 'http://localhost:5000'; // Développement local
const MAX_RETRIES = 3; // Nombre maximum de tentatives de connexion à l'API
let retryCount = 0; // Compteur de tentatives

async function loadActualitesFromAPI() {
    try {
        console.log(`📡 Connexion à l\'API actualités... (Tentative ${retryCount + 1}/${MAX_RETRIES})`);
        
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 15000); // Augmentation du timeout à 15 secondes
        
        const response = await fetch(`${API_BASE_URL}/api/actualites`, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            signal: controller.signal,
            cache: 'no-store' // Désactiver le cache pour forcer une nouvelle requête
        });

        clearTimeout(timeoutId);

        if (!response.ok) {
            throw new Error(`Erreur HTTP: ${response.status}`);
        }

        const data = await response.json();
        console.log('✅ Données actualités reçues:', data);
        
        // Réinitialiser le compteur de tentatives en cas de succès
        retryCount = 0;
        
        if (data.success && data.data && data.data.length > 0) {
            displayActualites(data.data);
        } else {
            displayNoActualites();
        }
        
    } catch (error) {
        console.error(`❌ Erreur (Tentative ${retryCount + 1}/${MAX_RETRIES}):`, error);
        
        if (error.name === 'AbortError') {
            if (retryCount < MAX_RETRIES - 1) {
                retryCount++;
                console.log(`🔄 Nouvelle tentative ${retryCount}/${MAX_RETRIES} dans 2 secondes...`);
                displayError(`L'API prend du temps à répondre. Nouvelle tentative ${retryCount}/${MAX_RETRIES}...`);
                setTimeout(loadActualitesFromAPI, 2000); // Réessayer après 2 secondes
            } else {
                console.log('⚠️ Nombre maximum de tentatives atteint, l\'API reste inaccessible. Aucune donnée locale ne sera affichée.');
                displayError("Le serveur des actualités est temporairement indisponible après plusieurs tentatives. Veuillez réessayer plus tard.");
            }
        } else if (error.message.includes('Failed to fetch') || error.message.includes('500')) {
            if (retryCount < MAX_RETRIES - 1) {
                retryCount++;
                console.log(`🔄 Nouvelle tentative ${retryCount}/${MAX_RETRIES} dans 3 secondes...`);
                displayError(`Connexion à l'API impossible. Nouvelle tentative ${retryCount}/${MAX_RETRIES}...`);
                setTimeout(loadActualitesFromAPI, 3000); // Réessayer après 3 secondes
            } else {
                console.log('⚠️ Nombre maximum de tentatives atteint, l\'API reste inaccessible. Aucune donnée locale ne sera affichée.');
                displayError("Le serveur des actualités est temporairement indisponible après plusieurs tentatives. Veuillez réessayer plus tard.");
            }
        } else {
            displayError(error.message);
        }
    }
}

function displayActualites(actualites) {
    const container = document.getElementById('actualites-container');
    if (!container) {
        console.error('❌ Conteneur actualités non trouvé');
        return;
    }

    container.innerHTML = '';
    
    // Afficher les 3 premières actualités
    const initialCount = Math.min(3, actualites.length);
    
    actualites.forEach((actualite, index) => {
        const actualiteCard = createActualiteCard(actualite);
        
        // Marquer les articles après les 3 premiers comme "cachés"
        if (index >= initialCount) {
            actualiteCard.classList.add('hidden-post');
            actualiteCard.style.display = 'none';
            actualiteCard.style.opacity = '0';
        }
        
        container.appendChild(actualiteCard);
    });

    // Gérer le bouton "Charger plus"
    const loadMoreBtn = document.getElementById('loadMoreBtn');
    if (loadMoreBtn) {
        if (actualites.length > initialCount) {
            loadMoreBtn.style.display = 'inline-flex';
            // Réinitialiser l'index pour le chargement progressif
            window.currentIndex = initialCount;
        } else {
            loadMoreBtn.style.display = 'none';
        }
    }

    console.log(`✅ ${actualites.length} actualités chargées (${initialCount} visibles)`);
    
    // Réinitialiser les filtres de catégorie
    resetCategoryFilters();
}

function createActualiteCard(actualite) {
    const card = document.createElement('div');
    card.className = 'blog-post';
    card.setAttribute('data-category', actualite.categorie.toLowerCase().replace(/\s+/g, '-'));
    
    // Formater la date (MongoDB utilise datePublication)
    const date = new Date(actualite.datePublication || actualite.date || actualite.createdAt);
    const formattedDate = date.toLocaleDateString('fr-FR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
    
    // Calculer le temps de lecture (estimation basée sur le résumé)
    const wordCount = (actualite.resume || actualite.description || '').split(/\s+/).length;
    const readingTime = Math.ceil(wordCount / 225) + 2; // 225 mots/minute + 2 min pour l'article complet
    
    // Gérer les tags (s'assurer qu'ils existent)
    const tags = Array.isArray(actualite.tags) ? actualite.tags : [];
    
    card.innerHTML = `
        <div class="blog-image">
            <img src="${actualite.image || 'images/default-news.jpg'}" alt="${actualite.titre}" 
                 onerror="this.src='images/default-news.jpg'" class="lazy-image">
            <div class="blog-category-tag">${actualite.categorie || 'Actualité'}</div>
        </div>
        <div class="blog-content">
            <h3 class="blog-title">${actualite.titre}</h3>
            <div class="blog-author">
                <i class="fas fa-user"></i> ${actualite.auteur || 'Sorbo-Ingénierie'}
            </div>
            <div class="reading-time">
                <i class="far fa-clock"></i> <span class="time-value">${readingTime} min de lecture</span>
            </div>
            <p class="blog-excerpt">${actualite.resume || actualite.description || 'Aucun résumé disponible'}</p>
            <div class="blog-meta">
                <div class="blog-date">${formattedDate}</div>
                <a href="#" class="read-more" onclick="showActualiteDetails('${actualite._id || actualite.id}')">
                    Lire la suite
                </a>
            </div>
        </div>
    `;
    
    // Ajouter les tags si disponibles
    if (tags.length > 0) {
        const tagsContainer = document.createElement('div');
        tagsContainer.className = 'actualite-tags';
        tagsContainer.style.cssText = 'margin-top: 15px; display: flex; flex-wrap: wrap; gap: 8px;';
        
        tags.forEach(tag => {
            const tagSpan = document.createElement('span');
            tagSpan.className = 'tag';
            tagSpan.style.cssText = 'background: #f0f0f0; padding: 4px 12px; border-radius: 20px; font-size: 0.8rem; color: #666;';
            tagSpan.textContent = tag;
            tagsContainer.appendChild(tagSpan);
        });
        
        card.querySelector('.blog-content').appendChild(tagsContainer);
    }
    
    return card;
}

function showActualiteDetails(actualiteId) {
    // Fonction pour afficher les détails d'une actualité
    console.log(`📰 Affichage des détails de l'actualité ${actualiteId}`);
    // Ici vous pouvez implémenter une modal ou une nouvelle page
    alert(`Détails de l'actualité ${actualiteId} - Fonctionnalité à implémenter`);
}

function displayNoActualites() {
    const container = document.getElementById('actualites-container');
    if (container) {
        container.innerHTML = `
            <div class="no-actualites" style="text-align: center; padding: 40px;">
                <i class="fas fa-newspaper" style="font-size: 3rem; color: #666; margin-bottom: 20px;"></i>
                <h3>Aucune actualité disponible</h3>
                <p>Les actualités seront bientôt disponibles.</p>
            </div>
        `;
    }
}

function displayError(message) {
    const container = document.getElementById('actualites-container');
    if (container) {
        container.innerHTML = `
            <div class="error-message" style="text-align: center; padding: 40px; color: #e74c3c;">
                <i class="fas fa-exclamation-triangle" style="font-size: 3rem; margin-bottom: 20px;"></i>
                <h3>Erreur de chargement</h3>
                <p>${message}</p>
                <button onclick="loadActualitesFromAPI()" style="
                    background: #3498db;
                    color: white;
                    border: none;
                    padding: 10px 20px;
                    border-radius: 5px;
                    cursor: pointer;
                    margin-top: 15px;
                ">🔄 Réessayer</button>
            </div>
        `;
    }
}

// Fonction pour réinitialiser les filtres de catégorie
function resetCategoryFilters() {
    const categories = document.querySelectorAll('.blog-category');
    categories.forEach(cat => cat.classList.remove('active'));
    
    // Activer la catégorie "Tous" par défaut
    const allCategory = document.querySelector('.blog-category[data-filter="tous"]');
    if (allCategory) {
        allCategory.classList.add('active');
    }
}

// Fonction pour filtrer les actualités par catégorie
function filterActualitesByCategory(category) {
    const articles = document.querySelectorAll('.blog-post');
    const loadMoreBtn = document.getElementById('loadMoreBtn');
    
    if (category === 'tous') {
        // Afficher tous les articles
        articles.forEach((article, index) => {
            if (index < 3) {
                article.style.display = 'block';
                article.style.opacity = '1';
                article.classList.remove('hidden-post');
            } else {
                article.style.display = 'none';
                article.style.opacity = '0';
                article.classList.add('hidden-post');
            }
        });
        
        // Afficher le bouton "Charger plus" s'il y a des articles cachés
        if (loadMoreBtn && articles.length > 3) {
            loadMoreBtn.style.display = 'inline-flex';
        }
        
        // Réinitialiser l'index
        window.currentIndex = 3;
    } else {
        // Filtrer par catégorie
        articles.forEach(article => {
            const articleCategory = article.getAttribute('data-category');
            if (articleCategory === category) {
                article.style.display = 'block';
                article.style.opacity = '1';
            } else {
                article.style.display = 'none';
            }
        });
        
        // Masquer le bouton "Charger plus" lors du filtrage
        if (loadMoreBtn) {
            loadMoreBtn.style.display = 'none';
        }
    }
}

// Fonction pour gérer le bouton "Charger plus"
function loadMoreActualites() {
    const hiddenPosts = document.querySelectorAll('.hidden-post');
    const loadMoreBtn = document.getElementById('loadMoreBtn');
    
    if (!window.currentIndex) {
        window.currentIndex = 3;
    }
    
    const postsPerLoad = 2;
    const endIndex = Math.min(window.currentIndex + postsPerLoad, hiddenPosts.length);
    
    for (let i = window.currentIndex; i < endIndex; i++) {
        if (hiddenPosts[i]) {
            hiddenPosts[i].style.display = 'block';
            setTimeout(() => {
                hiddenPosts[i].style.opacity = '1';
            }, (i - window.currentIndex) * 200);
        }
    }
    
    window.currentIndex = endIndex;
    
    // Masquer le bouton s'il n'y a plus d'articles à charger
    if (window.currentIndex >= hiddenPosts.length) {
        loadMoreBtn.style.display = 'none';
    }
}

// Initialisation
document.addEventListener('DOMContentLoaded', function() {
    console.log('📄 DOM chargé, lancement du chargeur d\'actualités...');
    
    // Attendre que la page soit complètement chargée
    setTimeout(() => {
        loadActualitesFromAPI();
        setupEventListeners();
    }, 1000);
});

// Configuration des gestionnaires d'événements
function setupEventListeners() {
    // Gestionnaire pour les catégories
    const categories = document.querySelectorAll('.blog-category');
    categories.forEach(category => {
        category.addEventListener('click', function() {
            // Retirer la classe active de toutes les catégories
            categories.forEach(cat => cat.classList.remove('active'));
            
            // Ajouter la classe active à la catégorie cliquée
            this.classList.add('active');
            
            // Filtrer les articles
            const filterValue = this.getAttribute('data-filter');
            filterActualitesByCategory(filterValue);
        });
    });
    
    // Gestionnaire pour le bouton "Charger plus"
    const loadMoreBtn = document.getElementById('loadMoreBtn');
    if (loadMoreBtn) {
        loadMoreBtn.addEventListener('click', function() {
            this.classList.add('loading');
            this.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Chargement...';
            
            setTimeout(() => {
                loadMoreActualites();
                this.classList.remove('loading');
                this.innerHTML = '<i class="fas fa-plus-circle"></i> Charger plus d\'articles';
            }, 500);
        });
    }
    
    // Gestionnaire pour la recherche
    const searchForm = document.getElementById('searchForm');
    const searchInput = document.getElementById('searchInput');
    
    if (searchForm && searchInput) {
        searchForm.addEventListener('submit', function(e) {
            e.preventDefault();
            performSearch(searchInput.value);
        });
        
        // Recherche en temps réel (optionnel)
        searchInput.addEventListener('input', function() {
            if (this.value.trim() === '') {
                resetSearch();
            }
        });
    }
}

// Fonction de recherche
function performSearch(query) {
    if (!query || query.trim() === '') {
        resetSearch();
        return;
    }
    
    query = query.toLowerCase().trim();
    const articles = document.querySelectorAll('.blog-post');
    let matchCount = 0;
    
    // Réinitialiser les filtres de catégorie
    resetCategoryFilters();
    
    articles.forEach(article => {
        const title = article.querySelector('.blog-title').textContent.toLowerCase();
        const excerpt = article.querySelector('.blog-excerpt').textContent.toLowerCase();
        const category = article.querySelector('.blog-category-tag').textContent.toLowerCase();
        
        if (title.includes(query) || excerpt.includes(query) || category.includes(query)) {
            article.style.display = 'block';
            article.style.opacity = '1';
            matchCount++;
        } else {
            article.style.display = 'none';
        }
    });
    
    // Afficher les résultats de recherche
    const searchResults = document.getElementById('searchResults');
    const resultCount = document.getElementById('resultCount');
    
    if (searchResults && resultCount) {
        searchResults.classList.add('active');
        resultCount.innerHTML = `${matchCount} article${matchCount > 1 ? 's' : ''} trouvé${matchCount > 1 ? 's' : ''} pour "${query}"`;
    }
    
    // Masquer le bouton "Charger plus" pendant la recherche
    const loadMoreBtn = document.getElementById('loadMoreBtn');
    if (loadMoreBtn) {
        loadMoreBtn.style.display = 'none';
    }
}

// Fonction pour réinitialiser la recherche
function resetSearch() {
    const searchResults = document.getElementById('searchResults');
    const searchInput = document.getElementById('searchInput');
    
    if (searchResults) {
        searchResults.classList.remove('active');
    }
    
    if (searchInput) {
        searchInput.value = '';
    }
    
    // Restaurer l'affichage normal
    filterActualitesByCategory('tous');
}

// Fonction pour afficher des actualités de démonstration
function displayDemoActualites() {
    const demoActualites = [
        {
            _id: 'demo1',
            titre: 'Nouveau projet de pont suspendu à Abidjan',
            description: 'Sorbo-Ingénierie lance un projet innovant de pont suspendu moderne dans la capitale économique ivoirienne. Ce projet de 800 mètres de long utilisera les dernières technologies en matière de génie civil et d\'ingénierie structurelle.',
            categorie: 'Projets',
            auteur: 'Équipe Sorbo-Ingénierie',
            date: new Date('2025-08-20'),
            image: 'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
            tags: ['Pont', 'Abidjan', 'Innovation', 'Génie civil']
        },
        {
            _id: 'demo2',
            titre: 'Formation certifiante en BIM avancé',
            description: 'Nous lançons une nouvelle formation certifiante en Building Information Modeling (BIM) niveau avancé. Cette formation s\'adresse aux professionnels du secteur de la construction souhaitant maîtriser les outils BIM modernes.',
            categorie: 'Formation',
            auteur: 'Département Formation',
            date: new Date('2025-08-18'),
            image: 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
            tags: ['BIM', 'Formation', 'Certification', 'Construction']
        },
        {
            _id: 'demo3',
            titre: 'OH-Route v1.1 disponible au téléchargement',
            description: 'Notre logiciel phare OH-Route est maintenant disponible en version 1.1 avec de nouvelles fonctionnalités pour les études hydrologiques et hydrauliques en génie routier. Téléchargez gratuitement !',
            categorie: 'Logiciels',
            auteur: 'Équipe Développement',
            date: new Date('2025-08-22'),
            image: 'images/drainageroute.png',
            tags: ['OH-Route', 'Logiciel', 'Hydrologie', 'Gratuit']
        },
        {
            _id: 'demo4',
            titre: 'Partenariat avec l\'École des Ponts ParisTech',
            description: 'Sorbo-Ingénierie signe un partenariat stratégique avec l\'École des Ponts ParisTech pour le développement de nouvelles méthodologies en ingénierie des structures et la formation continue.',
            categorie: 'Partenariats',
            auteur: 'Direction Générale',
            date: new Date('2025-08-15'),
            image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
            tags: ['Partenariat', 'Formation', 'Recherche', 'France']
        },
        {
            _id: 'demo5',
            titre: 'Succès du projet de drainage urbain à Yamoussoukro',
            description: 'Le projet de drainage urbain de Yamoussoukro, réalisé par Sorbo-Ingénierie, a été inauguré avec succès. Ce projet améliore significativement la gestion des eaux pluviales dans la capitale politique.',
            categorie: 'Success Stories',
            auteur: 'Équipe Projets',
            date: new Date('2025-08-12'),
            image: 'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
            tags: ['Drainage', 'Yamoussoukro', 'Succès', 'Eau pluviale']
        }
    ];
    
    console.log('📰 Affichage des actualités de démonstration...');
    displayActualites(demoActualites);
}

console.log('✅ Script chargeur d\'actualités chargé');

// Déclencher le chargement des actualités au chargement de la page
document.addEventListener('DOMContentLoaded', function() {
    console.log('📰 Page chargée, démarrage du chargement des actualités...');
    loadActualitesFromAPI();
});

// Fallback si DOMContentLoaded a déjà été déclenché
if (document.readyState === 'loading') {
    // La page est encore en cours de chargement
    document.addEventListener('DOMContentLoaded', function() {
        console.log('📰 Page chargée (fallback), démarrage du chargement des actualités...');
        loadActualitesFromAPI();
    });
} else {
    // La page est déjà chargée
    console.log('📰 Page déjà chargée, démarrage immédiat du chargement des actualités...');
    loadActualitesFromAPI();
}