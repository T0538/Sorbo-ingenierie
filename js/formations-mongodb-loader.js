// Script pour charger les formations depuis MongoDB Atlas
class FormationsMongoDBLoader {
    constructor() {
        this.apiBaseUrl = 'http://localhost:5000';
        this.formationsContainer = null;
    }

    // Récupérer les formations depuis l'API MongoDB
    async loadFormationsFromMongoDB() {
        try {
            console.log('🎓 Chargement des formations depuis MongoDB Atlas...');
            
            const response = await fetch(`${this.apiBaseUrl}/api/formations`, {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error(`Erreur HTTP: ${response.status} - ${response.statusText}`);
            }

            const data = await response.json();
            console.log('📊 Données reçues:', data);
            
            if (data.success && data.data) {
                console.log(`✅ ${data.data.length} formations chargées depuis MongoDB Atlas`);
                return data.data;
            } else {
                throw new Error('Format de données invalide');
            }
        } catch (error) {
            console.error('❌ Erreur lors du chargement des formations:', error);
            throw error;
        }
    }

    // Afficher les formations dans le conteneur
    displayFormations(formations) {
        if (!this.formationsContainer) {
            console.error('❌ Conteneur de formations non trouvé');
            return;
        }

        // Vider le conteneur
        this.formationsContainer.innerHTML = '';

        if (formations.length === 0) {
            this.formationsContainer.innerHTML = `
                <div class="no-formations" style="text-align: center; padding: 40px;">
                    <i class="fas fa-info-circle" style="font-size: 3rem; color: #3498db; margin-bottom: 20px;"></i>
                    <h3>Aucune formation disponible</h3>
                    <p>Les formations seront bientôt disponibles.</p>
                </div>
            `;
            return;
        }

        // Créer les cartes de formations
        formations.forEach((formation, index) => {
            const formationCard = this.createFormationCard(formation, index);
            this.formationsContainer.appendChild(formationCard);
        });

        // Mettre à jour le compteur
        const resultsCount = document.getElementById('results-count');
        if (resultsCount) {
            resultsCount.textContent = `${formations.length} formation${formations.length > 1 ? 's' : ''} trouvée${formations.length > 1 ? 's' : ''}`;
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
        card.setAttribute('data-category', formation.type || 'formation');
        card.setAttribute('data-location', 'abidjan-cocody');
        card.setAttribute('data-price', formation.price);

        card.innerHTML = `
            <div class="formation-header">
                <div class="formation-category">${this.getCategoryFromType(formation.type)}</div>
                <div class="formation-price">${formation.price.toLocaleString()} FCFA</div>
            </div>
            <h3>${formation.title}</h3>
            <div class="formation-details">
                <div class="detail"><i class="fas fa-calendar-alt"></i> Prochaine session à définir</div>
                <div class="detail"><i class="fas fa-clock"></i> ${formation.duration} jours</div>
                <div class="detail"><i class="fas fa-map-marker-alt"></i> Abidjan, Cocody</div>
                <div class="detail"><i class="fas fa-users"></i> Places disponibles</div>
            </div>
            <p>${formation.description}</p>
            <div class="formation-footer">
                <button class="btn primary-btn inscription-btn" data-formation-id="${formation._id}">S'inscrire maintenant</button>
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

    // Obtenir la catégorie à partir du type
    getCategoryFromType(type) {
        const typeMap = {
            'autocad': 'Logiciels',
            'covadis': 'Logiciels',
            'robot': 'Logiciels',
            'revit': 'Logiciels',
            'genie-civil': 'Génie civil',
            'hydraulique': 'Ingénierie de l\'eau'
        };
        
        return typeMap[type] || 'Formation';
    }

    // Gérer l'inscription à une formation
    handleInscription(formation) {
        const contactUrl = `contact.html?formation=${encodeURIComponent(formation.title)}&prix=${formation.price}`;
        window.location.href = contactUrl;
    }

    // Initialiser le chargeur de formations
    async init() {
        console.log('🚀 Initialisation du chargeur de formations MongoDB Atlas...');
        
        // Trouver le conteneur de formations
        this.formationsContainer = document.getElementById('formations-grid');
        
        if (!this.formationsContainer) {
            console.log('ℹ️ Conteneur de formations non trouvé sur cette page');
            return;
        }

        console.log('✅ Conteneur de formations trouvé:', this.formationsContainer.id);

        try {
            // Afficher un indicateur de chargement
            this.formationsContainer.innerHTML = `
                <div class="loading" style="text-align: center; padding: 40px;">
                    <i class="fas fa-spinner fa-spin" style="font-size: 2rem; color: #3498db; margin-bottom: 20px;"></i>
                    <p>Chargement des formations depuis MongoDB Atlas...</p>
                </div>
            `;

            // Charger les formations
            const formations = await this.loadFormationsFromMongoDB();
            
            // Afficher les formations
            this.displayFormations(formations);
            
            console.log('🎉 Formations chargées avec succès depuis MongoDB Atlas !');
            
        } catch (error) {
            console.error('❌ Erreur lors de l\'initialisation:', error);
            
            // Afficher un message d'erreur
            this.formationsContainer.innerHTML = `
                <div class="error" style="text-align: center; padding: 40px; color: #e74c3c;">
                    <i class="fas fa-exclamation-triangle" style="font-size: 2rem; margin-bottom: 20px;"></i>
                    <h3>Erreur de chargement</h3>
                    <p>Impossible de charger les formations depuis MongoDB Atlas.</p>
                    <p style="font-size: 0.9rem; margin-top: 10px; color: #666;">
                        Erreur: ${error.message}
                    </p>
                    <button onclick="location.reload()" style="
                        background: #3498db;
                        color: white;
                        border: none;
                        padding: 10px 20px;
                        border-radius: 5px;
                        cursor: pointer;
                        margin-top: 15px;
                    ">Réessayer</button>
                </div>
            `;
        }
    }
}

// Initialiser le chargeur quand le DOM est chargé
document.addEventListener('DOMContentLoaded', function() {
    console.log('📄 Page chargée, initialisation du chargeur de formations MongoDB Atlas...');
    window.formationsMongoDBLoader = new FormationsMongoDBLoader();
    window.formationsMongoDBLoader.init();
}); 