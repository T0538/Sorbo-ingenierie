/**
 * Système de gestion des catégories et préférences pour les newsletters
 * Permet la segmentation et la personnalisation des abonnements
 */

class NewsletterCategories {
    constructor() {
        this.categories = {
            actualites: {
                id: 'actualites',
                name: 'Actualités',
                description: 'Nos dernières nouvelles et événements',
                icon: 'fas fa-newspaper',
                color: '#3498db',
                frequency: 'Hebdomadaire'
            },
            formations: {
                id: 'formations',
                name: 'Formations',
                description: 'Nouvelles formations et sessions disponibles',
                icon: 'fas fa-graduation-cap',
                color: '#e74c3c',
                frequency: 'Mensuelle'
            },
            projets: {
                id: 'projets',
                name: 'Projets',
                description: 'Nos réalisations et études de cas',
                icon: 'fas fa-project-diagram',
                color: '#27ae60',
                frequency: 'Bimensuelle'
            },
            logiciels: {
                id: 'logiciels',
                name: 'Logiciels',
                description: 'Nouveautés et mises à jour de nos solutions',
                icon: 'fas fa-code',
                color: '#f39c12',
                frequency: 'Mensuelle'
            },
            emploi: {
                id: 'emploi',
                name: 'Emploi & Stages',
                description: 'Opportunités de carrière et stages',
                icon: 'fas fa-briefcase',
                color: '#9b59b6',
                frequency: 'Selon disponibilité'
            }
        };
        
        this.userPreferences = this.loadUserPreferences();
        this.init();
    }

    // Initialisation du système
    init() {
        this.createCategorySelector();
        this.setupEventListeners();
    }

    // Créer l'interface de sélection des catégories
    createCategorySelector() {
        const newsletters = document.querySelectorAll('.footer-newsletter-form');
        
        newsletters.forEach(form => {
            this.enhanceNewsletterForm(form);
        });
    }

    // Améliorer le formulaire de newsletter avec les catégories
    enhanceNewsletterForm(form) {
        const container = form.parentElement;
        
        // Créer le conteneur des préférences
        const preferencesContainer = document.createElement('div');
        preferencesContainer.className = 'newsletter-preferences';
        preferencesContainer.innerHTML = `
            <div class="preferences-header">
                <h4>Personnalisez votre abonnement</h4>
                <p>Choisissez les types de contenu qui vous intéressent :</p>
            </div>
            <div class="categories-grid">
                ${this.renderCategories()}
            </div>
            <div class="frequency-info">
                <small><i class="fas fa-info-circle"></i> Vous pouvez modifier vos préférences à tout moment</small>
            </div>
        `;

        // Ajouter le honeypot pour la sécurité
        const honeypot = document.createElement('input');
        honeypot.type = 'text';
        honeypot.name = 'website';
        honeypot.className = 'honeypot';
        honeypot.setAttribute('tabindex', '-1');
        honeypot.setAttribute('autocomplete', 'off');
        form.appendChild(honeypot);

        // Insérer après le formulaire
        container.insertBefore(preferencesContainer, form.nextSibling);

        // Ajouter les styles
        this.addPreferencesStyles();
    }

    // Rendu des catégories
    renderCategories() {
        return Object.values(this.categories).map(category => `
            <div class="category-item" data-category="${category.id}">
                <div class="category-checkbox">
                    <input type="checkbox" id="cat-${category.id}" name="categories" value="${category.id}" 
                           ${this.userPreferences.categories.includes(category.id) ? 'checked' : ''}>
                    <label for="cat-${category.id}">
                        <div class="category-icon" style="background-color: ${category.color}">
                            <i class="${category.icon}"></i>
                        </div>
                        <div class="category-info">
                            <h5>${category.name}</h5>
                            <p>${category.description}</p>
                            <small class="frequency">${category.frequency}</small>
                        </div>
                    </label>
                </div>
            </div>
        `).join('');
    }

    // Configuration des écouteurs d'événements
    setupEventListeners() {
        document.addEventListener('change', (e) => {
            if (e.target.name === 'categories') {
                this.updateUserPreferences();
                this.saveUserPreferences();
            }
        });

        // Écouteur pour le bouton "Tout sélectionner"
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('select-all-categories')) {
                this.selectAllCategories();
            }
            if (e.target.classList.contains('deselect-all-categories')) {
                this.deselectAllCategories();
            }
        });
    }

    // Mettre à jour les préférences utilisateur
    updateUserPreferences() {
        const selectedCategories = Array.from(document.querySelectorAll('input[name="categories"]:checked'))
            .map(input => input.value);
        
        this.userPreferences.categories = selectedCategories;
        this.userPreferences.lastUpdated = new Date().toISOString();
    }

    // Sauvegarder les préférences
    saveUserPreferences() {
        localStorage.setItem('newsletter_preferences', JSON.stringify(this.userPreferences));
    }

    // Charger les préférences
    loadUserPreferences() {
        const saved = localStorage.getItem('newsletter_preferences');
        if (saved) {
            try {
                return JSON.parse(saved);
            } catch (e) {
                console.warn('Erreur lors du chargement des préférences:', e);
            }
        }
        
        // Préférences par défaut
        return {
            categories: ['actualites'], // Au moins les actualités par défaut
            frequency: 'weekly',
            language: 'fr',
            format: 'html',
            createdAt: new Date().toISOString(),
            lastUpdated: new Date().toISOString()
        };
    }

    // Sélectionner toutes les catégories
    selectAllCategories() {
        const checkboxes = document.querySelectorAll('input[name="categories"]');
        checkboxes.forEach(checkbox => {
            checkbox.checked = true;
        });
        this.updateUserPreferences();
        this.saveUserPreferences();
    }

    // Désélectionner toutes les catégories
    deselectAllCategories() {
        const checkboxes = document.querySelectorAll('input[name="categories"]');
        checkboxes.forEach(checkbox => {
            checkbox.checked = false;
        });
        this.updateUserPreferences();
        this.saveUserPreferences();
    }

    // Obtenir les catégories sélectionnées
    getSelectedCategories() {
        return this.userPreferences.categories.map(id => this.categories[id]).filter(Boolean);
    }

    // Obtenir les données pour l'envoi
    getSubscriptionData(email) {
        const selectedCategories = this.getSelectedCategories();
        
        return {
            email: email,
            categories: this.userPreferences.categories,
            categoryNames: selectedCategories.map(cat => cat.name),
            preferences: this.userPreferences,
            subscribedAt: new Date().toISOString(),
            source: 'website',
            page: window.location.pathname
        };
    }

    // Validation des catégories
    validateCategorySelection() {
        const selected = this.userPreferences.categories;
        
        if (selected.length === 0) {
            return {
                isValid: false,
                error: 'Veuillez sélectionner au moins une catégorie'
            };
        }
        
        return { isValid: true };
    }

    // Ajouter les styles CSS
    addPreferencesStyles() {
        if (document.getElementById('newsletter-preferences-styles')) return;

        const styles = `
            .newsletter-preferences {
                margin-top: 20px;
                padding: 20px;
                background: linear-gradient(135deg, #f8f9fa 0%, #ffffff 100%);
                border-radius: 12px;
                border: 1px solid #e9ecef;
                box-shadow: 0 2px 10px rgba(0,0,0,0.05);
            }

            .preferences-header h4 {
                color: #2c3e50;
                margin: 0 0 8px 0;
                font-size: 18px;
                font-weight: 600;
            }

            .preferences-header p {
                color: #6c757d;
                margin: 0 0 20px 0;
                font-size: 14px;
            }

            .categories-grid {
                display: grid;
                gap: 15px;
                margin-bottom: 15px;
            }

            .category-item {
                border-radius: 8px;
                border: 2px solid #e9ecef;
                transition: all 0.3s ease;
                background: white;
            }

            .category-item:hover {
                border-color: #007bff;
                box-shadow: 0 4px 12px rgba(0,123,255,0.15);
            }

            .category-checkbox input[type="checkbox"] {
                display: none;
            }

            .category-checkbox label {
                display: flex;
                align-items: center;
                padding: 15px;
                cursor: pointer;
                gap: 15px;
                margin: 0;
            }

            .category-icon {
                width: 45px;
                height: 45px;
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                color: white;
                font-size: 18px;
                flex-shrink: 0;
            }

            .category-info h5 {
                margin: 0 0 5px 0;
                color: #2c3e50;
                font-size: 16px;
                font-weight: 600;
            }

            .category-info p {
                margin: 0 0 5px 0;
                color: #6c757d;
                font-size: 14px;
                line-height: 1.4;
            }

            .category-info .frequency {
                color: #28a745;
                font-weight: 500;
                font-size: 12px;
            }

            .category-checkbox input[type="checkbox"]:checked + label {
                background: rgba(0,123,255,0.05);
            }

            .category-checkbox input[type="checkbox"]:checked + label .category-item {
                border-color: #007bff;
            }

            .frequency-info {
                text-align: center;
                color: #6c757d;
                font-size: 12px;
                margin-top: 15px;
                padding-top: 15px;
                border-top: 1px solid #e9ecef;
            }

            .frequency-info i {
                margin-right: 5px;
                color: #17a2b8;
            }

            /* Animation pour la sélection */
            .category-item {
                transform: scale(1);
                transition: transform 0.2s ease;
            }

            .category-checkbox input[type="checkbox"]:checked + label .category-item {
                transform: scale(1.02);
            }

            /* Responsive */
            @media (min-width: 768px) {
                .categories-grid {
                    grid-template-columns: repeat(2, 1fr);
                }
            }

            @media (min-width: 1024px) {
                .categories-grid {
                    grid-template-columns: repeat(3, 1fr);
                }
            }
        `;

        const styleSheet = document.createElement('style');
        styleSheet.id = 'newsletter-preferences-styles';
        styleSheet.textContent = styles;
        document.head.appendChild(styleSheet);
    }

    // Exporter les préférences
    exportPreferences() {
        return {
            preferences: this.userPreferences,
            categories: this.categories,
            timestamp: new Date().toISOString()
        };
    }
}

// Exporter la classe
window.NewsletterCategories = NewsletterCategories;
