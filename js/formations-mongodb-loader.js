// Script pour charger les formations depuis MongoDB Atlas
class FormationsMongoDBLoader {
    constructor() {
        this.apiBaseUrl = 'https://sorbo-api-production.up.railway.app';
        this.formationsContainer = null;
        this.allFormations = []; // Stocker toutes les formations
        this.currentIndex = 0; // Index de départ pour l'affichage
        this.formationsPerPage = 3; // Nombre de formations à afficher à la fois
    }

    // Récupérer les formations depuis l'API MongoDB
    async loadFormationsFromMongoDB() {
        try {
            console.log('🎓 Chargement des formations depuis MongoDB Atlas...');
            
            const response = await fetch(`${this.apiBaseUrl}/api/formations?limit=50`, {
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

    // Afficher les formations dans le conteneur (par groupes de 3)
    displayFormations(formations, isInitialLoad = false) {
        if (!this.formationsContainer) {
            console.error('❌ Conteneur de formations non trouvé');
            return;
        }

        // Si c'est le chargement initial, vider le conteneur et stocker toutes les formations
        if (isInitialLoad) {
            this.formationsContainer.innerHTML = '';
            this.allFormations = formations;
            this.currentIndex = 0;
        }

        if (this.allFormations.length === 0) {
            this.formationsContainer.innerHTML = `
                <div class="no-formations" style="text-align: center; padding: 40px;">
                    <i class="fas fa-info-circle" style="font-size: 3rem; color: #3498db; margin-bottom: 20px;"></i>
                    <h3>Aucune formation disponible</h3>
                    <p>Les formations seront bientôt disponibles.</p>
                </div>
            `;
            return;
        }

        // Calculer les formations à afficher
        const formationsToShow = this.allFormations.slice(this.currentIndex, this.currentIndex + this.formationsPerPage);
        
        // Créer les cartes de formations
        formationsToShow.forEach((formation, index) => {
            const formationCard = this.createFormationCard(formation, this.currentIndex + index);
            this.formationsContainer.appendChild(formationCard);
        });

        // Mettre à jour le compteur
        this.updateResultsCount();

        // Ajouter ou mettre à jour le bouton "Voir plus de formations"
        this.updateLoadMoreButton();

        // Réinitialiser les animations AOS
        if (typeof AOS !== 'undefined') {
            AOS.refresh();
        }
    }

    // Mettre à jour le compteur de résultats
    updateResultsCount() {
        const resultsCount = document.getElementById('results-count');
        if (resultsCount) {
            const totalFormations = this.allFormations.length;
            const displayedFormations = Math.min(this.currentIndex + this.formationsPerPage, totalFormations);
            resultsCount.textContent = `${displayedFormations} sur ${totalFormations} formation${totalFormations > 1 ? 's' : ''} affichée${displayedFormations > 1 ? 's' : ''}`;
        }
    }

    // Mettre à jour le bouton "Voir plus de formations"
    updateLoadMoreButton() {
        // Supprimer TOUS les boutons existants pour éviter les doublons
        const existingButtons = document.querySelectorAll('.load-more-container');
        existingButtons.forEach(button => button.remove());

        // Vérifier s'il reste des formations à afficher
        if (this.currentIndex + this.formationsPerPage < this.allFormations.length) {
            const loadMoreButton = document.createElement('div');
            loadMoreButton.className = 'load-more-container';
            loadMoreButton.style.textAlign = 'center';
            loadMoreButton.style.marginTop = '40px';
            loadMoreButton.style.marginBottom = '40px';
            
            loadMoreButton.innerHTML = `
                <button id="load-more-formations" class="load-more-btn">
                    <i class="fas fa-plus-circle"></i>
                    Voir plus de formations (${this.allFormations.length - (this.currentIndex + this.formationsPerPage)} restante${this.allFormations.length - (this.currentIndex + this.formationsPerPage) > 1 ? 's' : ''})
                </button>
            `;

            // Ajouter le bouton après le conteneur de formations
            this.formationsContainer.parentNode.insertBefore(loadMoreButton, this.formationsContainer.nextSibling);

            // Ajouter l'événement click
            const btn = loadMoreButton.querySelector('#load-more-formations');
            btn.addEventListener('click', () => {
                this.loadMoreFormations();
            });
        }
    }

    // Charger plus de formations
    loadMoreFormations() {
        this.currentIndex += this.formationsPerPage;
        this.displayFormations([], false); // false = pas de chargement initial
        console.log(`📚 Chargement de ${this.formationsPerPage} formations supplémentaires...`);
    }

    // Générer des objectifs basés sur le type de formation
    generateObjectives(formationType) {
        const objectivesMap = {
            'génie civil': [
                'Maîtriser les principes fondamentaux du génie civil',
                'Apprendre les techniques de conception et de calcul',
                'Comprendre les normes et réglementations en vigueur',
                'Développer des compétences pratiques en construction'
            ],
            'architecture': [
                'Concevoir des projets architecturaux innovants',
                'Maîtriser les logiciels de conception assistée',
                'Comprendre l\'ergonomie et l\'esthétique',
                'Intégrer les contraintes techniques et réglementaires'
            ],
            'topographie': [
                'Effectuer des levés topographiques précis',
                'Maîtriser les instruments de mesure modernes',
                'Traiter et analyser les données topographiques',
                'Réaliser des plans et cartes techniques'
            ],
            'hydraulique': [
                'Comprendre les principes de l\'hydraulique',
                'Concevoir des réseaux d\'eau et d\'assainissement',
                'Analyser les écoulements et pressions',
                'Optimiser les systèmes hydrauliques'
            ],
            'bim': [
                'Maîtriser la modélisation 3D collaborative',
                'Utiliser les outils BIM pour la conception',
                'Gérer les informations du projet',
                'Optimiser la coordination entre disciplines'
            ],
            'routier': [
                'Concevoir des infrastructures routières',
                'Dimensionner les structures de chaussées',
                'Analyser les sols et matériaux',
                'Planifier la maintenance des routes'
            ]
        };
        
        // Retourner les objectifs correspondants ou des objectifs par défaut
        return objectivesMap[formationType?.toLowerCase()] || [
            'Développer des compétences techniques avancées',
            'Maîtriser les outils et méthodes modernes',
            'Appliquer les bonnes pratiques du secteur',
            'Améliorer la qualité des projets réalisés'
        ];
    }

    // Créer une carte de formation
    createFormationCard(formation, index) {
        const card = document.createElement('div');
        card.className = 'formation-card-promo';
        card.setAttribute('data-aos', 'fade-up');
        card.setAttribute('data-aos-delay', `${(index + 1) * 100}`);
        card.setAttribute('data-aos-duration', '800');

        // Image par défaut basée sur le type de formation
        const defaultImage = this.getDefaultImage(formation.type);
        
        // Calculer la durée en jours (si disponible)
        const duration = formation.duration || 'À définir';

        // Générer des objectifs basés sur le type de formation
        const objectives = this.generateObjectives(formation.type);
        
        card.innerHTML = `
            <div class="formation-header">
                <div class="formation-image">
                    <img src="${defaultImage}" alt="${formation.title}" loading="lazy">
                    <div class="formation-badge">
                        <span class="badge-text">FORMATION INTER-ENTREPRISE</span>
                    </div>
                </div>
            </div>
            
            <div class="formation-content">
                <div class="formation-theme">
                    <h3 class="formation-title">${formation.title}</h3>
                </div>
                
                <!-- Objectifs de la formation -->
                <div class="formation-objectives" style="margin: 15px 0; padding: 12px; background: #f8f9fa; border-radius: 6px; border-left: 3px solid #d10000;">
                    <h4 style="color: #d10000; margin-bottom: 8px; font-size: 0.85rem; font-weight: bold;">
                        <i class="fas fa-bullseye"></i> Objectifs de la formation
                    </h4>
                    <ul style="list-style: none; padding: 0; margin: 0; font-size: 0.75rem; color: #666;">
                        ${objectives.map(obj => `<li style="margin-bottom: 4px;"><i class="fas fa-check" style="color: #28a745; margin-right: 6px; font-size: 0.7rem;"></i>${obj}</li>`).join('')}
                    </ul>
                </div>
                
                <div class="formation-details">
                    <div class="detail-item">
                        <i class="fas fa-calendar-alt"></i>
                        <span>Prochaine session à définir</span>
                    </div>
                    <div class="detail-item">
                        <i class="fas fa-clock"></i>
                        <span>${duration} jours</span>
                    </div>
                    <div class="detail-item">
                        <i class="fas fa-map-marker-alt"></i>
                        <span>Abidjan, Cocody</span>
                    </div>
                </div>
                
                <div class="formation-price-section">
                    <div class="price-tag">
                        <span class="price-amount">${formation.price.toLocaleString()}</span>
                        <span class="price-currency">FCFA</span>
                    </div>
                </div>
                
                <div class="formation-actions">
                    <button class="btn primary-btn inscription-btn" data-formation-id="${formation._id}" onclick="openInscriptionForm('${formation.title}', '${formation.price}')">
                        <i class="fas fa-user-plus"></i>
                        S'INSCRIRE MAINTENANT
                    </button>
                </div>
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

    // Obtenir une image par défaut basée sur le type de formation
    getDefaultImage(type) {
        const imageMap = {
            'autocad': 'images/image 30.jpg',
            'revit': 'images/image 37.jpg',
            'robot': 'images/image 3.jpg',
            'covadis': 'images/iage22.jpg',
            'genie-civil': 'images/imag 16.jpg',
            'hydraulique': 'images/IMG-20241030-WA0039.jpg'
        };
        
        return imageMap[type] || 'images/image 30.jpg'; // Image par défaut
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
            
            // Afficher les formations (chargement initial)
            this.displayFormations(formations, true);
            
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

// Fonctions globales pour le modal d'inscription et les détails
function openInscriptionForm(formationTitle, prix) {
    // Créer le modal d'inscription
    const modal = document.createElement('div');
    modal.id = 'inscriptionModal';
    modal.style.cssText = `
        position: fixed; 
        z-index: 1000; 
        left: 0; 
        top: 0; 
        width: 100%; 
        height: 100%; 
        background-color: rgba(0,0,0,0.5);
        display: flex;
        align-items: center;
        justify-content: center;
    `;
    
    modal.innerHTML = `
        <div style="background-color: white; padding: 30px; border-radius: 15px; width: 90%; max-width: 500px; position: relative;">
            <span onclick="closeInscriptionModal()" style="position: absolute; right: 20px; top: 20px; font-size: 28px; font-weight: bold; cursor: pointer; color: #666;">&times;</span>
            
            <h2 style="color: #d10000; margin-bottom: 20px; text-align: center;">Inscription à la formation</h2>
            <p style="text-align: center; margin-bottom: 30px; font-weight: bold; color: #333;">${formationTitle}</p>
            
            <form id="inscriptionForm" onsubmit="submitInscription(event)">
                <div style="margin-bottom: 20px;">
                    <label style="display: block; margin-bottom: 8px; font-weight: bold; color: #555;">Nom complet *</label>
                    <input type="text" name="nom" required style="width: 100%; padding: 12px; border: 1px solid #ddd; border-radius: 8px; font-size: 16px;">
                </div>
                
                <div style="margin-bottom: 20px;">
                    <label style="display: block; margin-bottom: 8px; font-weight: bold; color: #555;">Email professionnel *</label>
                    <input type="email" name="email" required style="width: 100%; padding: 12px; border: 1px solid #ddd; border-radius: 8px; font-size: 16px;">
                </div>
                
                <div style="margin-bottom: 20px;">
                    <label style="display: block; margin-bottom: 8px; font-weight: bold; color: #555;">Téléphone *</label>
                    <input type="tel" name="telephone" required style="width: 100%; padding: 12px; border: 1px solid #ddd; border-radius: 8px; font-size: 16px;">
                </div>
                
                <div style="margin-bottom: 20px;">
                    <label style="display: block; margin-bottom: 8px; font-weight: bold; color: #555;">Entreprise *</label>
                    <input type="text" name="entreprise" required style="width: 100%; padding: 12px; border: 1px solid #ddd; border-radius: 8px; font-size: 16px;">
                </div>
                
                <div style="margin-bottom: 30px;">
                    <label style="display: block; margin-bottom: 8px; font-weight: bold; color: #555;">Message (optionnel)</label>
                    <textarea name="message" rows="4" style="width: 100%; padding: 12px; border: 1px solid #ddd; border-radius: 8px; font-size: 16px; resize: vertical;"></textarea>
                </div>
                
                <div style="text-align: center;">
                    <button type="submit" style="background: #d10000; color: white; border: none; padding: 15px 40px; border-radius: 25px; font-size: 16px; font-weight: bold; cursor: pointer;">
                        Envoyer ma demande d'inscription
                    </button>
                </div>
            </form>
        </div>
    `;
    
    document.body.appendChild(modal);
    document.body.style.overflow = 'hidden';
}

function closeInscriptionModal() {
    const modal = document.getElementById('inscriptionModal');
    if (modal) {
        modal.remove();
        document.body.style.overflow = 'auto';
    }
}

function submitInscription(event) {
    event.preventDefault();
    
    const formData = new FormData(event.target);
    const data = Object.fromEntries(formData);
    
    // Simuler l'envoi par email
    const emailBody = `
        Nouvelle demande d'inscription à la formation :
        
        Formation : ${event.target.querySelector('p').textContent}
        Nom : ${data.nom}
        Email : ${data.email}
        Téléphone : ${data.telephone}
        Entreprise : ${data.entreprise}
        Message : ${data.message || 'Aucun message'}
        
        Date de demande : ${new Date().toLocaleString('fr-FR')}
    `;
    
    console.log('Demande d\'inscription :', emailBody);
    
    alert('Votre demande d\'inscription a été envoyée avec succès ! Nous vous contacterons dans les plus brefs délais.');
    
    closeInscriptionModal();
}

 