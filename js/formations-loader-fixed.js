// Chargeur de formations depuis MongoDB Atlas - Version corrigée
console.log('📚 Démarrage du chargeur de formations...');

// Configuration de l'API
let API_BASE_URL;
if (typeof envConfig !== 'undefined') {
    API_BASE_URL = envConfig.apiUrl;
    console.log(`🌐 Configuration automatique: ${API_BASE_URL}`);
} else {
    API_BASE_URL = 'https://sorbo-api-production.up.railway.app';
    console.log(`⚠️ Configuration par défaut: ${API_BASE_URL}`);
}

const MAX_RETRIES = 3;
let retryCount = 0;

// Fonction pour charger les formations depuis l'API
async function loadFormationsFromAPI() {
    try {
        console.log(`📡 Récupération des formations depuis l'API... (Tentative ${retryCount + 1}/${MAX_RETRIES})`);
        
        let response;
        
        // Utiliser le proxy CORS si disponible
        if (typeof corsProxy !== 'undefined') {
            const result = await corsProxy.getFormations();
            if (result.success) {
                response = { ok: true, json: () => Promise.resolve(result.data) };
            } else {
                throw new Error(result.error);
            }
        } else {
            response = await fetch(`${API_BASE_URL}/api/formations`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                signal: AbortSignal.timeout(15000),
                cache: 'no-store'
            });
        }

        if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        const responseData = await response.json();
        console.log('📊 Réponse API complète:', responseData);
        
        // Extraire les formations du bon format
        let formations;
        if (responseData.data && Array.isArray(responseData.data)) {
            formations = responseData.data;
        } else if (Array.isArray(responseData)) {
            formations = responseData;
        } else {
            console.error('❌ Format de données inattendu:', responseData);
            formations = [];
        }
        
        console.log(`✅ ${formations.length} formations récupérées depuis MongoDB Atlas`);
        
        // Réinitialiser le compteur de tentatives
        retryCount = 0;
        
        return formations;
        
    } catch (error) {
        console.error(`❌ Erreur lors du chargement des formations (tentative ${retryCount + 1}):`, error.message);
        retryCount++;
        
        if (retryCount < MAX_RETRIES) {
            console.log(`🔄 Nouvelle tentative dans 2 secondes...`);
            await new Promise(resolve => setTimeout(resolve, 2000));
            return await loadFormationsFromAPI();
        } else {
            console.error('❌ Échec du chargement après 3 tentatives');
            return null;
        }
    }
}

// Fonction pour créer une carte de formation
function createFormationCard(formation) {
    // Utiliser les vrais champs de MongoDB Atlas (en anglais)
    const _id = formation._id;
    const titre = formation.title; // Champ title en anglais
    const description = formation.description;
    const prix = formation.price; // Champ price en anglais
    const duree = formation.schedule; // schedule contient la durée
    const niveau = formation.niveau;
    const categorie = formation.category; // Champ category en anglais
    const localisation = formation.location; // Champ location en anglais
    const dates = formation.dates;
    const image = formation.image || `images/formation-${formation.type || 'default'}.jpg`;
    const objectifs = formation.objectives || [];
    const prerequisites = formation.prerequisites || [];
    const status = formation.active ? 'active' : 'inactive';
    
    // Log des données pour debug
    console.log(`✅ Formation chargée:`, {
        id: _id,
        titre: titre,
        categorie: categorie,
        prix: prix,
        localisation: localisation,
        niveau: niveau
    });

    return `
        <div class="formation-card" 
             data-category="${categorie || 'Général'}" 
             data-price="${prix || 0}" 
             data-location="${localisation || 'Abidjan'}" 
             data-status="${status}"
             data-formation-id="${_id}">
            <div class="formation-image">
                <img src="${image || 'images/formation-default.jpg'}" 
                     alt="${titre}" 
                     loading="lazy"
                     onerror="this.src='images/formation-default.jpg'">
            </div>
            <div class="formation-content">
                <h3>${titre}</h3>
                <p class="formation-description">${description || 'Description complète disponible lors de l\'inscription.'}</p>
                
                <div class="formation-details">
                    <div class="detail-item">
                        <i class="fas fa-clock"></i>
                        <span>${duree || 'À définir'}</span>
                    </div>
                    <div class="detail-item">
                        <i class="fas fa-users"></i>
                        <span>${niveau || 'Tous niveaux'}</span>
                    </div>
                    <div class="detail-item">
                        <i class="fas fa-map-marker-alt"></i>
                        <span>${localisation || 'Abidjan'}</span>
                    </div>
                    <div class="detail-item">
                        <i class="fas fa-calendar"></i>
                        <span>${dates || 'Dates à confirmer'}</span>
                    </div>
                </div>

                ${objectifs.length > 0 ? `
                <div class="formation-objectives">
                    <h4><i class="fas fa-target"></i> Objectifs de la formation</h4>
                    <ul>
                        ${objectifs.map(obj => `<li>${obj}</li>`).join('')}
                    </ul>
                </div>
                ` : ''}

                <div class="formation-footer">
                    <div class="formation-price">
                        <span class="price-amount">${prix ? `${parseInt(prix).toLocaleString()} FCFA` : 'Prix sur demande'}</span>
                    </div>
                    <div class="formation-actions">
                        <button class="btn outline-btn" onclick="showFormationDetails('${_id}')">
                            <i class="fas fa-info-circle"></i> En savoir plus
                        </button>
                        <button class="btn primary-btn inscription-btn" onclick="openInscriptionModal('${_id}')">
                            <i class="fas fa-user-plus"></i> S'inscrire
                        </button>
                    </div>
                </div>

                <div class="formation-tags">
                    ${categorie ? `<span class="tag category-tag">${categorie}</span>` : ''}
                    ${niveau ? `<span class="tag level-tag">${niveau}</span>` : ''}
                </div>
            </div>
        </div>
    `;
}

// Fonction pour afficher les formations
function displayFormations(formations) {
    const container = document.getElementById('formations-grid');
    
    if (!container) {
        console.error('❌ Container formations-grid non trouvé');
        return;
    }

    if (!formations || formations.length === 0) {
        container.innerHTML = `
            <div class="no-formations" style="text-align: center; padding: 40px;">
                <i class="fas fa-graduation-cap" style="font-size: 3rem; color: #bdc3c7; margin-bottom: 20px;"></i>
                <h3>Aucune formation disponible</h3>
                <p>Nos formations sont en cours de mise à jour. Revenez bientôt !</p>
                <button class="btn primary-btn" onclick="window.location.reload()">Actualiser</button>
            </div>
        `;
        return;
    }

    // Vérifier que formations est bien un tableau
    if (!Array.isArray(formations)) {
        console.error('❌ formations n\'est pas un tableau:', formations);
        container.innerHTML = `
            <div class="no-formations">
                <h3>Erreur de format de données</h3>
                <p>Les données reçues ne sont pas dans le bon format.</p>
                <button class="btn primary-btn" onclick="window.location.reload()">Actualiser</button>
            </div>
        `;
        return;
    }

    // Générer le HTML pour toutes les formations
    const formationsHTML = formations.map(formation => createFormationCard(formation)).join('');
    
    container.innerHTML = formationsHTML;
    
    // Mettre à jour le compteur de résultats
    const resultsCount = document.getElementById('results-count');
    if (resultsCount) {
        resultsCount.textContent = `${formations.length} formation${formations.length > 1 ? 's' : ''} trouvée${formations.length > 1 ? 's' : ''}`;
    }
    
    console.log(`✅ ${formations.length} formations affichées`);
    
    // Reinitialiser les filtres
    initializeFilters();
    
    // Déclencher les animations
    if (typeof AOS !== 'undefined') {
        AOS.refresh();
    }
}

// Fonction pour gérer les détails d'une formation
function showFormationDetails(formationId) {
    console.log(`📋 Affichage des détails pour la formation: ${formationId}`);
    // TODO: Implémenter l'affichage des détails
    alert('Détails de la formation à venir. Contactez-nous pour plus d\'informations.');
}

// Fonction pour ouvrir le modal d'inscription
function openInscriptionModal(formationId) {
    console.log(`📝 Ouverture du modal d'inscription pour: ${formationId}`);
    // TODO: Implémenter le modal d'inscription
    window.location.href = `inscription-formation.html?formation=${formationId}`;
}

// Fonction pour initialiser les filtres
function initializeFilters() {
    const formationCards = document.querySelectorAll('.formation-card');
    
    // Filtres
    const statusFilter = document.getElementById('status-filter');
    const categoryFilter = document.getElementById('category-filter');
    const locationFilter = document.getElementById('location-filter');
    const priceFilter = document.getElementById('price-filter');
    const clearFiltersBtn = document.getElementById('clear-filters');
    
    // Peupler les options de filtre dynamiquement
    populateFilterOptions(formationCards);
    
    // Événements de filtre
    if (statusFilter) statusFilter.addEventListener('change', applyFilters);
    if (categoryFilter) categoryFilter.addEventListener('change', applyFilters);
    if (locationFilter) locationFilter.addEventListener('change', applyFilters);
    if (priceFilter) priceFilter.addEventListener('change', applyFilters);
    if (clearFiltersBtn) clearFiltersBtn.addEventListener('click', clearAllFilters);
}

// Fonction pour peupler les options de filtre
function populateFilterOptions(formationCards) {
    const categories = new Set();
    const locations = new Set();
    
    formationCards.forEach(card => {
        const category = card.getAttribute('data-category');
        const location = card.getAttribute('data-location');
        
        if (category) categories.add(category);
        if (location) locations.add(location);
    });
    
    // Mettre à jour le filtre des catégories
    const categoryFilter = document.getElementById('category-filter');
    if (categoryFilter) {
        const currentValue = categoryFilter.value;
        const optionsHTML = Array.from(categories).map(cat => 
            `<option value="${cat}">${cat}</option>`
        ).join('');
        
        categoryFilter.innerHTML = `
            <option value="all">Toutes les catégories</option>
            ${optionsHTML}
        `;
        categoryFilter.value = currentValue;
    }
    
    // Mettre à jour le filtre des localisations
    const locationFilter = document.getElementById('location-filter');
    if (locationFilter) {
        const currentValue = locationFilter.value;
        const optionsHTML = Array.from(locations).map(loc => 
            `<option value="${loc}">${loc}</option>`
        ).join('');
        
        locationFilter.innerHTML = `
            <option value="all">Toutes les localisations</option>
            ${optionsHTML}
        `;
        locationFilter.value = currentValue;
    }
}

// Fonction pour appliquer les filtres
function applyFilters() {
    const formationCards = document.querySelectorAll('.formation-card');
    const resultsCount = document.getElementById('results-count');
    
    const status = document.getElementById('status-filter')?.value || 'all';
    const category = document.getElementById('category-filter')?.value || 'all';
    const location = document.getElementById('location-filter')?.value || 'all';
    const price = document.getElementById('price-filter')?.value || 'all';
    
    let visibleCount = 0;
    
    formationCards.forEach(card => {
        const cardStatus = card.getAttribute('data-status');
        const cardCategory = card.getAttribute('data-category');
        const cardLocation = card.getAttribute('data-location');
        const cardPrice = parseInt(card.getAttribute('data-price')) || 0;
        
        let showCard = true;
        
        // Filtre par statut
        if (status !== 'all' && cardStatus !== status) {
            showCard = false;
        }
        
        // Filtre par catégorie
        if (category !== 'all' && cardCategory !== category) {
            showCard = false;
        }
        
        // Filtre par localisation
        if (location !== 'all' && cardLocation !== location) {
            showCard = false;
        }
        
        // Filtre par prix
        if (price !== 'all') {
            const [minPrice, maxPrice] = price.split('-').map(p => p === '+' ? Infinity : parseInt(p));
            if (cardPrice < minPrice || (maxPrice !== Infinity && cardPrice > maxPrice)) {
                showCard = false;
            }
        }
        
        if (showCard) {
            card.classList.remove('hidden');
            visibleCount++;
        } else {
            card.classList.add('hidden');
        }
    });
    
    // Mettre à jour le compteur
    if (resultsCount) {
        resultsCount.textContent = `${visibleCount} formation${visibleCount > 1 ? 's' : ''} trouvée${visibleCount > 1 ? 's' : ''}`;
    }
}

// Fonction pour effacer tous les filtres
function clearAllFilters() {
    const filters = ['status-filter', 'category-filter', 'location-filter', 'price-filter'];
    
    filters.forEach(filterId => {
        const filter = document.getElementById(filterId);
        if (filter) filter.value = 'all';
    });
    
    applyFilters();
}

// Fonction d'initialisation principale
async function initFormationsLoader() {
    console.log('🚀 Initialisation du chargeur de formations...');
    
    // Vérifier si on est sur la page des formations
    if (!document.getElementById('formations-grid')) {
        console.log('ℹ️ Page des formations non détectée, arrêt du chargeur');
        return;
    }
    
    // Afficher le loader
    const container = document.getElementById('formations-grid');
    if (container) {
        container.innerHTML = `
            <div class="loading-formations" style="text-align: center; padding: 40px;">
                <i class="fas fa-spinner fa-spin" style="font-size: 2rem; color: #3498db; margin-bottom: 20px;"></i>
                <p>Chargement des formations depuis MongoDB Atlas...</p>
            </div>
        `;
    }
    
    // Charger les formations depuis l'API
    const formations = await loadFormationsFromAPI();
    
    if (formations) {
        displayFormations(formations);
    } else {
        // Afficher un message d'erreur avec option de fallback
        if (container) {
            container.innerHTML = `
                <div class="error-formations" style="text-align: center; padding: 40px;">
                    <i class="fas fa-exclamation-triangle" style="font-size: 3rem; color: #e74c3c; margin-bottom: 20px;"></i>
                    <h3>Erreur de chargement</h3>
                    <p>Impossible de charger les formations depuis la base de données.</p>
                    <div style="margin-top: 20px;">
                        <button class="btn primary-btn" onclick="window.location.reload()" style="margin-right: 10px;">
                            <i class="fas fa-redo"></i> Réessayer
                        </button>
                        <button class="btn outline-btn" onclick="loadDemoFormations()">
                            <i class="fas fa-eye"></i> Voir les formations de démonstration
                        </button>
                    </div>
                </div>
            `;
        }
    }
}

// Fonction de fallback pour charger les formations de démonstration
function loadDemoFormations() {
    console.log('⚠️ Chargement des formations de démonstration...');
    
    const demoFormations = [
        {
            _id: 'demo-1',
            titre: 'Dimensionnement des structures de chaussées routières',
            description: 'Conception et calcul des structures de chaussées neuves selon les normes internationales',
            prix: 150000,
            duree: '2 jours (16h)',
            niveau: 'Intermédiaire',
            categorie: 'Génie civil',
            localisation: 'Abidjan',
            dates: 'Prochaine session : À définir',
            image: 'images/formation-routiere.jpg',
            objectifs: [
                'Maîtriser les méthodes de dimensionnement',
                'Analyser les sols et matériaux',
                'Concevoir des structures durables',
                'Utiliser les outils de calcul'
            ],
            status: 'active'
        },
        {
            _id: 'demo-2',
            titre: 'Diagnostic et renforcement des chaussées routières',
            description: 'Méthodes CEREMA-IDRRIM pour l\'évaluation et le renforcement des structures existantes',
            prix: 200000,
            duree: '3 jours (24h)',
            niveau: 'Avancé',
            categorie: 'Génie civil',
            localisation: 'Abidjan',
            dates: 'Prochaine session : À définir',
            image: 'images/formation-diagnostic.jpg',
            objectifs: [
                'Diagnostiquer l\'état des chaussées',
                'Analyser les dégradations',
                'Concevoir des renforcements',
                'Optimiser la maintenance'
            ],
            status: 'active'
        }
    ];
    
    displayFormations(demoFormations);
}

// Initialisation automatique quand le DOM est prêt
document.addEventListener('DOMContentLoaded', function() {
    console.log('📚 DOM chargé, initialisation du chargeur de formations...');
    initFormationsLoader();
});

// Si le DOM est déjà chargé
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initFormationsLoader);
} else {
    initFormationsLoader();
}

// Export pour utilisation dans d'autres modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        loadFormationsFromAPI,
        displayFormations,
        initFormationsLoader
    };
}
