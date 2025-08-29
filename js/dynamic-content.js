// Script pour charger dynamiquement le contenu depuis MongoDB Atlas
class DynamicContentLoader {
    constructor() {
        this.apiBaseUrl = 'https://sorbo-api-production.up.railway.app/api';
        this.init();
    }

    async init() {
        // Charger le contenu selon la page
        const currentPage = this.getCurrentPage();
        
        switch(currentPage) {
            case 'actualites':
                // Ne pas charger si les actualités statiques sont disponibles
                if (typeof actualitesManager === 'undefined') {
                    console.log('📡 Chargement actualités page via API MongoDB');
                    await this.loadActualites();
                } else {
                    console.log('📰 Actualités statiques déjà disponibles pour la page actualités');
                }
                break;
            case 'logiciels':
                await this.loadLogiciels();
                break;
            case 'emplois':
                await this.loadEmplois();
                break;
            case 'formations':
                await this.loadFormations();
                break;
            default:
                // Page d'accueil - charger les dernières actualités seulement si pas de gestionnaire statique
                if (typeof actualitesManager === 'undefined') {
                    console.log('📡 Chargement actualités via API MongoDB');
                    await this.loadLatestActualites();
                } else {
                    console.log('📰 Actualités statiques déjà disponibles, ignorer le chargement API');
                }
                break;
        }
    }

    getCurrentPage() {
        const path = window.location.pathname;
        if (path.includes('actualites')) return 'actualites';
        if (path.includes('logiciels')) return 'logiciels';
        if (path.includes('emplois')) return 'emplois';
        if (path.includes('formations')) return 'formations';
        return 'home';
    }

    async apiCall(endpoint) {
        try {
            const response = await fetch(`${this.apiBaseUrl}${endpoint}`);
            const data = await response.json();
            
            if (!response.ok) {
                throw new Error(data.message || 'Erreur API');
            }
            
            return data.data;
        } catch (error) {
            console.error('Erreur lors du chargement:', error);
            return [];
        }
    }

    // Charger les actualités
    async loadActualites() {
        const actualites = await this.apiCall('/actualites');
        this.displayActualites(actualites);
    }

    displayActualites(actualites) {
        const container = document.getElementById('actualites-container');
        if (!container) return;

        if (actualites.length === 0) {
            container.innerHTML = '<p class="no-data">Aucune actualité disponible pour le moment.</p>';
            return;
        }

        // Nombre d'articles visibles initialement (les autres seront marqués hidden-post)
        const initialVisible = 6;

        const toHtml = (actualite, index) => {
            const image = actualite.image || '/images/actualites/default.jpg';
            const titre = actualite.titre || 'Article';
            const resume = actualite.resume || actualite.description || '';
            const categorie = actualite.categorie || 'actualites';
            const auteur = actualite.auteur || 'Équipe Sorbo-Ingénierie';
            const datePub = actualite.datePublication || actualite.date || Date.now();
            const dateStr = new Date(datePub).toLocaleDateString('fr-FR', { year: 'numeric', month: 'long', day: 'numeric' });
            // Calcul simple du temps de lecture (225 mots/min + 2 minutes pour l'article complet)
            const wordCount = (resume || '').split(/\s+/).filter(Boolean).length;
            const readingMinutes = Math.max(1, Math.ceil(wordCount / 225) + 2);
            const hiddenClass = index >= initialVisible ? ' hidden-post' : '';
            const dataContent = `${titre} ${categorie} ${resume} ${auteur}`.toLowerCase();

            return `
                <article class="blog-post${hiddenClass}" data-category="${categorie}" data-content="${dataContent}" style="${index >= initialVisible ? 'display:none;opacity:0;' : ''}">
                    <div class="blog-image">
                        <img src="${image}" alt="${titre}" class="lazy-image" loading="lazy" onerror="this.src='images/default-news.jpg'">
                        <div class="blog-category-tag">${categorie}</div>
                    </div>
                    <div class="blog-content">
                        <h3 class="blog-title">${titre}</h3>
                        <div class="blog-author"><i class="fas fa-user"></i> ${auteur}</div>
                        <div class="reading-time"><i class="far fa-clock"></i> <span class="time-value">${readingMinutes} min de lecture</span></div>
                        <div class="blog-excerpt"><p>${resume}</p></div>
                        <div class="blog-meta">
                            <span class="blog-date">${dateStr}</span>
                            <a href="#" class="read-more">Lire plus</a>
                        </div>
                    </div>
                </article>
            `;
        };

        container.innerHTML = actualites.map((a, i) => toHtml(a, i)).join('');

        // Émettre un événement personnalisé pour signaler que les actualités ont été chargées
        try {
            const event = new CustomEvent('actualitesLoaded', { detail: { count: actualites.length } });
            document.dispatchEvent(event);
        } catch (e) {
            // Environnements anciens sans CustomEvent
        }
    }

    // Charger les logiciels
    async loadLogiciels() {
        const logiciels = await this.apiCall('/logiciels');
        this.displayLogiciels(logiciels);
    }

    displayLogiciels(logiciels) {
        const container = document.getElementById('logiciels-container');
        if (!container) return;

        if (logiciels.length === 0) {
            container.innerHTML = '<p class="no-data">Aucun logiciel disponible pour le moment.</p>';
            return;
        }

        container.innerHTML = logiciels.map(logiciel => `
            <div class="logiciel-card">
                <div class="logiciel-image">
                    <img src="${logiciel.image || '/images/logiciels/default.jpg'}" alt="${logiciel.nom}">
                </div>
                <div class="logiciel-content">
                    <h3>${logiciel.nom}</h3>
                    <p class="logiciel-description">${logiciel.description}</p>
                    <div class="logiciel-meta">
                        <span class="categorie">${logiciel.categorie}</span>
                        <span class="prix">${logiciel.prix} FCFA</span>
                    </div>
                    <div class="logiciel-actions">
                        <button class="btn-demo" onclick="window.open('${logiciel.lienDemo || '#'}', '_blank')">Démo</button>
                        <button class="btn-telecharger" onclick="window.open('${logiciel.lienTelechargement || '#'}', '_blank')">Télécharger</button>
                    </div>
                </div>
            </div>
        `).join('');
    }

    // Charger les emplois - DÉSACTIVÉ TEMPORAIREMENT (offres statiques)
    async loadEmplois() {
        console.log('📋 Chargement des emplois désactivé - utilisation des offres statiques');
        // const emplois = await this.apiCall('/emplois');
        // this.displayEmplois(emplois);
        return;
    }

    displayEmplois(emplois) {
        const container = document.getElementById('emplois-container');
        if (!container) return;

        if (emplois.length === 0) {
            container.innerHTML = '<p class="no-data">Aucun emploi disponible pour le moment.</p>';
            return;
        }

        container.innerHTML = emplois.map(emploi => `
            <div class="emploi-card ${emploi.urgent ? 'urgent' : ''}">
                <div class="emploi-header">
                    <h3>${emploi.titre}</h3>
                    ${emploi.urgent ? '<span class="badge-urgent">URGENT</span>' : ''}
                </div>
                <div class="emploi-entreprise">${emploi.entreprise}</div>
                <p class="emploi-description">${emploi.description}</p>
                <div class="emploi-meta">
                    <span class="lieu">📍 ${emploi.lieu?.ville || 'Non spécifié'}</span>
                    <span class="type">📋 ${emploi.typeContrat}</span>
                    <span class="date-limite">⏰ ${new Date(emploi.dateLimite).toLocaleDateString()}</span>
                </div>
                <div class="emploi-actions">
                    <button class="btn-postuler" onclick="postulerEmploi('${emploi._id}')">Postuler</button>
                    <button class="btn-details" onclick="voirDetailsEmploi('${emploi._id}')">Voir détails</button>
                </div>
            </div>
        `).join('');
    }

    // Charger les formations
    async loadFormations() {
        const formations = await this.apiCall('/formations');
        this.displayFormations(formations);
    }

    displayFormations(formations) {
        const container = document.getElementById('formations-container');
        if (!container) return;

        if (formations.length === 0) {
            container.innerHTML = '<p class="no-data">Aucune formation disponible pour le moment.</p>';
            return;
        }

        container.innerHTML = formations.map(formation => `
            <div class="formation-card">
                <div class="formation-header">
                    <h3>${formation.titre}</h3>
                    <span class="niveau ${formation.niveau}">${formation.niveau}</span>
                </div>
                <p class="formation-description">${formation.description}</p>
                <div class="formation-meta">
                    <span class="categorie">${formation.categorie}</span>
                    <span class="duree">⏱️ ${formation.duree}</span>
                    <span class="prix">💰 ${formation.prix} FCFA</span>
                </div>
                <div class="formation-actions">
                    <button class="btn-inscription" onclick="inscrireFormation('${formation._id}')">S'inscrire</button>
                    <button class="btn-details" onclick="voirDetailsFormation('${formation._id}')">Voir détails</button>
                </div>
            </div>
        `).join('');
    }

    // Charger les dernières actualités pour la page d'accueil
    async loadLatestActualites() {
        console.log('🔄 Chargement des dernières actualités...');
        const actualites = await this.apiCall('/actualites?limit=3');
        console.log('📰 Actualités récupérées:', actualites);
        this.displayLatestActualites(actualites);
    }

    displayLatestActualites(actualites) {
        const container = document.getElementById('latest-actualites');
        console.log('🔍 Conteneur latest-actualites:', container);
        
        if (!container) {
            console.error('❌ Conteneur latest-actualites non trouvé');
            return;
        }

        if (actualites.length === 0) {
            console.log('ℹ️ Aucune actualité disponible');
            container.innerHTML = '<p class="no-data">Aucune actualité récente.</p>';
            return;
        }

        container.innerHTML = `
            <div class="actualites-grid">
                ${actualites.map(actualite => `
                    <div class="actualite-mini-card">
                        <div class="actualite-image">
                            <img src="${actualite.image || '/images/actualites/default.jpg'}" alt="${actualite.titre}">
                        </div>
                        <div class="actualite-content">
                            <h4>${actualite.titre}</h4>
                            <p>${actualite.resume}</p>
                            <div class="actualite-meta">
                                <span class="date">${new Date(actualite.datePublication).toLocaleDateString()}</span>
                                <a href="/actualite/${actualite.slug}" class="lire-plus">Lire plus →</a>
                            </div>
                        </div>
                    </div>
                `).join('')}
            </div>
        `;
    }
}

// Fonctions utilitaires
function postulerEmploi(emploiId) {
    // Rediriger vers la page de contact avec les détails de l'emploi
    window.location.href = `/contact.html?emploi=${emploiId}`;
}

function voirDetailsEmploi(emploiId) {
    // Ouvrir une modal ou rediriger vers la page de détails
    alert('Fonctionnalité en cours de développement');
}

function inscrireFormation(formationId) {
    // Rediriger vers la page de contact avec les détails de la formation
    window.location.href = `/contact.html?formation=${formationId}`;
}

function voirDetailsFormation(formationId) {
    // Ouvrir une modal ou rediriger vers la page de détails
    alert('Fonctionnalité en cours de développement');
}

// Initialiser le chargement dynamique
document.addEventListener('DOMContentLoaded', function() {
    new DynamicContentLoader();
});

// Fonction pour recharger le contenu (utile pour les mises à jour)
function reloadContent() {
    new DynamicContentLoader();
}

// Fonction pour vérifier les mises à jour (optionnel)
setInterval(() => {
    // Vérifier périodiquement s'il y a de nouvelles données
    // Cette fonction peut être utilisée pour des mises à jour en temps réel
}, 300000); // Vérifier toutes les 5 minutes


