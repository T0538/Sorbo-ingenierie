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
                await this.loadActualites();
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
                // Page d'accueil - charger les dernières actualités
                await this.loadLatestActualites();
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

        container.innerHTML = actualites.map(actualite => `
            <div class="actualite-card">
                <div class="actualite-image">
                    <img src="${actualite.image || '/images/actualites/default.jpg'}" alt="${actualite.titre}">
                </div>
                <div class="actualite-content">
                    <h3>${actualite.titre}</h3>
                    <p class="actualite-resume">${actualite.resume}</p>
                    <div class="actualite-meta">
                        <span class="categorie">${actualite.categorie}</span>
                        <span class="date">${new Date(actualite.datePublication).toLocaleDateString()}</span>
                    </div>
                    <a href="/actualite/${actualite.slug}" class="btn-lire-plus">Lire plus</a>
                </div>
            </div>
        `).join('');
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

    // Charger les emplois
    async loadEmplois() {
        const emplois = await this.apiCall('/emplois');
        this.displayEmplois(emplois);
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
        const actualites = await this.apiCall('/actualites?limit=3');
        this.displayLatestActualites(actualites);
    }

    displayLatestActualites(actualites) {
        const container = document.getElementById('latest-actualites');
        if (!container) return;

        if (actualites.length === 0) {
            container.innerHTML = '<p class="no-data">Aucune actualité récente.</p>';
            return;
        }

        container.innerHTML = `
            <h2>📰 Dernières Actualités</h2>
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


