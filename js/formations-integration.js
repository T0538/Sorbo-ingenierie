// Script d'intégration des formations avec le backend
class FormationsIntegration {
    constructor() {
        this.formationsContainer = document.getElementById('formations-grid');
        this.resultsCount = document.getElementById('results-count');
        this.backendIntegration = window.backendIntegration;
    }

    // Charger les formations depuis le backend
    async loadFormationsFromBackend() {
        try {
            if (!this.backendIntegration || !this.backendIntegration.isBackendAvailable) {
                console.log('⚠️ Backend non disponible, utilisation des formations statiques');
                return;
            }

            console.log('🔄 Chargement des formations depuis le backend...');
            
            const response = await this.backendIntegration.getFormations();
            const formations = response.data;

            if (formations && formations.length > 0) {
                this.updateFormationsDisplay(formations);
                console.log(`✅ ${formations.length} formations chargées depuis le backend`);
            } else {
                console.log('⚠️ Aucune formation trouvée dans le backend');
            }
        } catch (error) {
            console.error('❌ Erreur lors du chargement des formations:', error);
        }
    }

    // Mettre à jour l'affichage des formations
    updateFormationsDisplay(formations) {
        if (!this.formationsContainer) return;

        // Vider le conteneur
        this.formationsContainer.innerHTML = '';

        // Ajouter chaque formation
        formations.forEach((formation, index) => {
            const formationCard = this.createFormationCard(formation, index);
            this.formationsContainer.appendChild(formationCard);
        });

        // Mettre à jour le compteur
        if (this.resultsCount) {
            this.resultsCount.textContent = `${formations.length} formation${formations.length > 1 ? 's' : ''} trouvée${formations.length > 1 ? 's' : ''}`;
        }

        // Réinitialiser les animations AOS
        if (typeof AOS !== 'undefined') {
            AOS.refresh();
        }
    }

    // Créer une carte de formation
    createFormationCard(formation, index) {
        const card = document.createElement('div');
        card.className = 'formation-card';
        card.setAttribute('data-aos', 'fade-up');
        card.setAttribute('data-aos-delay', `${(index + 1) * 100}`);
        card.setAttribute('data-aos-duration', '800');
        card.setAttribute('data-status', 'a-venir');
        card.setAttribute('data-category', this.getCategoryFromTitle(formation.titre));
        card.setAttribute('data-location', 'abidjan-cocody');
        card.setAttribute('data-price', formation.prix);

        card.innerHTML = `
            <div class="formation-header">
                <div class="formation-category">${this.getCategoryFromTitle(formation.titre)}</div>
                <div class="formation-price">${this.formatPrice(formation.prix)} FCFA</div>
            </div>
            <h3>${formation.titre}</h3>
            <div class="formation-details">
                <div class="detail"><i class="fas fa-calendar-alt"></i> Prochaine session à définir</div>
                <div class="detail"><i class="fas fa-clock"></i> ${formation.duree}</div>
                <div class="detail"><i class="fas fa-map-marker-alt"></i> Abidjan, Cocody</div>
                <div class="detail"><i class="fas fa-users"></i> Places disponibles</div>
            </div>
            <p>${formation.description}</p>
            <div class="formation-footer">
                <button class="btn primary-btn inscription-btn" data-formation-id="${formation.id}">S'inscrire maintenant</button>
                <a href="#" class="more-info">En savoir plus</a>
            </div>
        `;

        // Ajouter l'événement d'inscription
        const inscriptionBtn = card.querySelector('.inscription-btn');
        if (inscriptionBtn) {
            inscriptionBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.handleInscription(formation);
            });
        }

        return card;
    }

    // Gérer l'inscription à une formation
    handleInscription(formation) {
        // Rediriger vers la page de contact avec les détails de la formation
        const contactUrl = `contact.html?formation=${encodeURIComponent(formation.titre)}&prix=${formation.prix}`;
        window.location.href = contactUrl;
    }

    // Obtenir la catégorie à partir du titre
    getCategoryFromTitle(title) {
        const titleLower = title.toLowerCase();
        
        if (titleLower.includes('autocad')) return 'Logiciels';
        if (titleLower.includes('covadis')) return 'Logiciels';
        if (titleLower.includes('revit')) return 'Logiciels';
        if (titleLower.includes('robot')) return 'Logiciels';
        if (titleLower.includes('structure')) return 'Génie civil';
        if (titleLower.includes('hydraulique')) return 'Ingénierie de l\'eau';
        if (titleLower.includes('route')) return 'Ingénierie routière';
        if (titleLower.includes('topographie')) return 'Topographie';
        
        return 'Formation';
    }

    // Formater le prix
    formatPrice(price) {
        return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
    }

    // Initialiser l'intégration
    async init() {
        console.log('🚀 Initialisation de l\'intégration des formations...');
        
        // Attendre que l'intégration backend soit prête
        if (this.backendIntegration) {
            // Attendre un peu que le backend soit vérifié
            setTimeout(() => {
                this.loadFormationsFromBackend();
            }, 2000);
        } else {
            console.log('⚠️ Intégration backend non disponible');
        }
    }
}

// Initialiser l'intégration des formations
document.addEventListener('DOMContentLoaded', function() {
    // Attendre que l'intégration backend soit initialisée
    setTimeout(() => {
        window.formationsIntegration = new FormationsIntegration();
        window.formationsIntegration.init();
    }, 1000);
}); 