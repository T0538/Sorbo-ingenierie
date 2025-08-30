/**
 * Système principal de Newsletter pour Sorbo-Ingénierie
 * Intègre tous les composants et améliore l'expérience utilisateur
 */

class NewsletterManager {
    constructor() {
        this.validator = null;
        this.categories = null;
        this.database = null;
        this.doubleOptIn = null;
        this.emailService = null;
        this.isInitialized = false;
        this.init();
    }

    // Initialisation du système complet
    async init() {
        console.log('🚀 Initialisation du système Newsletter Sorbo-Ingénierie...');
        
        try {
            // Attendre que tous les composants soient disponibles
            await this.waitForComponents();
            
            // Initialiser les composants
            this.initializeComponents();
            
            // Améliorer les formulaires existants
            this.enhanceNewsletterForms();
            
            // Configurer les gestionnaires d'événements
            this.setupEventHandlers();
            
            // Afficher les notifications d'état
            this.showSystemStatus();
            
            this.isInitialized = true;
            console.log('✅ Système Newsletter entièrement initialisé !');
            
        } catch (error) {
            console.error('❌ Erreur lors de l\'initialisation:', error);
            this.showError('Erreur d\'initialisation du système newsletter');
        }
    }

    // Attendre que tous les composants soient disponibles
    waitForComponents() {
        return new Promise((resolve) => {
            const checkComponents = () => {
                const required = [
                    'NewsletterValidator',
                    'NewsletterCategories', 
                    'NewsletterDatabase',
                    'NewsletterDoubleOptIn'
                ];
                
                const available = required.every(comp => window[comp]);
                
                if (available) {
                    resolve();
                } else {
                    setTimeout(checkComponents, 100);
                }
            };
            checkComponents();
        });
    }

    // Initialiser tous les composants
    initializeComponents() {
        this.validator = new window.NewsletterValidator();
        this.categories = new window.NewsletterCategories();
        this.database = new window.NewsletterDatabase();
        this.doubleOptIn = new window.NewsletterDoubleOptIn();
        
        // Rendre la base de données accessible globalement
        window.newsletterDB = this.database;
    }

    // Améliorer les formulaires de newsletter existants
    enhanceNewsletterForms() {
        const forms = document.querySelectorAll('.footer-newsletter-form');
        
        forms.forEach((form, index) => {
            this.enhanceForm(form, index);
        });
    }

    // Améliorer un formulaire spécifique
    enhanceForm(form, index) {
        // Ajouter un ID unique si nécessaire
        if (!form.id) {
            form.id = `newsletter-form-${index}`;
        }

        // Récupérer l'input email
        const emailInput = form.querySelector('input[type="email"]');
        const submitButton = form.querySelector('button[type="submit"]');
        
        if (!emailInput || !submitButton) {
            console.warn('Formulaire newsletter incomplet:', form);
            return;
        }

        // Améliorer l'input email
        this.enhanceEmailInput(emailInput);
        
        // Améliorer le bouton de soumission
        this.enhanceSubmitButton(submitButton);
        
        // Ajouter la validation en temps réel
        this.validator.setupRealTimeValidation(emailInput);
        
        // Wrapper pour les messages
        this.addMessageContainer(form);
        
        // Remplacer le gestionnaire de soumission
        this.replaceFormHandler(form);
        
        console.log(`✅ Formulaire newsletter amélioré: ${form.id}`);
    }

    // Améliorer l'input email
    enhanceEmailInput(input) {
        // Améliorer le style
        input.style.cssText += `
            transition: all 0.3s ease;
            border: 2px solid #e9ecef;
            padding: 12px 15px;
            border-radius: 6px;
        `;
        
        // Placeholder amélioré
        input.placeholder = 'Votre adresse email';
        
        // Attributs d'accessibilité
        input.setAttribute('aria-label', 'Adresse email pour la newsletter');
        input.setAttribute('autocomplete', 'email');
        
        // Animation au focus
        input.addEventListener('focus', () => {
            input.style.borderColor = '#007bff';
            input.style.boxShadow = '0 0 10px rgba(0,123,255,0.25)';
        });
        
        input.addEventListener('blur', () => {
            if (!input.value) {
                input.style.borderColor = '#e9ecef';
                input.style.boxShadow = 'none';
            }
        });
    }

    // Améliorer le bouton de soumission
    enhanceSubmitButton(button) {
        // Texte et style améliorés
        if (!button.textContent.trim() || button.innerHTML.includes('fa-paper-plane')) {
            button.innerHTML = '<i class="fas fa-paper-plane"></i> S\'abonner';
        }
        
        button.style.cssText += `
            transition: all 0.3s ease;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            border: none;
            color: white;
            padding: 12px 20px;
            border-radius: 6px;
            font-weight: 500;
            cursor: pointer;
        `;
        
        // Effets hover
        button.addEventListener('mouseenter', () => {
            button.style.transform = 'translateY(-2px)';
            button.style.boxShadow = '0 8px 20px rgba(102, 126, 234, 0.4)';
        });
        
        button.addEventListener('mouseleave', () => {
            button.style.transform = 'translateY(0)';
            button.style.boxShadow = 'none';
        });
    }

    // Ajouter un conteneur pour les messages
    addMessageContainer(form) {
        const container = form.parentElement;
        
        if (!container.querySelector('.newsletter-messages')) {
            const messageDiv = document.createElement('div');
            messageDiv.className = 'newsletter-messages';
            messageDiv.style.cssText = `
                margin-top: 15px;
                min-height: 20px;
            `;
            
            container.insertBefore(messageDiv, form.nextSibling);
        }
    }

    // Remplacer le gestionnaire de formulaire
    replaceFormHandler(form) {
        // Supprimer les anciens écouteurs
        const newForm = form.cloneNode(true);
        form.parentNode.replaceChild(newForm, form);
        
        // Ajouter le nouveau gestionnaire
        newForm.addEventListener('submit', (e) => this.handleFormSubmission(e));
        
        // Réappliquer les améliorations sur le nouveau formulaire
        const emailInput = newForm.querySelector('input[type="email"]');
        const submitButton = newForm.querySelector('button[type="submit"]');
        
        if (emailInput && submitButton) {
            this.enhanceEmailInput(emailInput);
            this.enhanceSubmitButton(submitButton);
            this.validator.setupRealTimeValidation(emailInput);
        }
    }

    // Gestionnaire principal de soumission
    async handleFormSubmission(e) {
        e.preventDefault();
        
        const form = e.target;
        const formData = new FormData(form);
        const messageContainer = form.parentElement.querySelector('.newsletter-messages');
        
        try {
            // 1. Validation complète
            console.log('🔍 Validation du formulaire...');
            const validation = await this.validator.validateNewsletterForm(formData);
            
            if (!validation.isValid) {
                this.showFormErrors(validation.errors, messageContainer);
                return;
            }
            
            // 2. Vérification des catégories
            const categoryValidation = this.categories.validateCategorySelection();
            if (!categoryValidation.isValid) {
                this.showFormErrors([categoryValidation.error], messageContainer);
                return;
            }
            
            // 3. Préparation des données
            console.log('📦 Préparation des données...');
            const email = formData.get('email');
            const subscriptionData = this.categories.getSubscriptionData(email);
            
            // 4. Sauvegarde en base
            console.log('💾 Sauvegarde en base de données...');
            const subscriber = await this.database.addSubscriber(subscriptionData);
            
            // 5. Envoi de l'email de confirmation
            console.log('📧 Envoi email de confirmation...');
            const emailResult = await this.doubleOptIn.sendConfirmationEmail(subscriber);
            
            if (!emailResult.success) {
                console.warn('⚠️ Email de confirmation non envoyé:', emailResult.error);
                this.showFormWarning('Inscription enregistrée, mais email de confirmation non envoyé.', messageContainer);
            } else {
                this.showFormSuccess('Email de confirmation envoyé ! Vérifiez votre boîte de réception.', messageContainer);
            }
            
            // 6. Réinitialiser le formulaire
            form.reset();
            this.categories.updateUserPreferences();
            
            // 7. Rafraîchir le dashboard si ouvert
            this.refreshDashboardIfOpen();
            
            // 8. Animation de succès
            this.animateSuccess(form);
            
        } catch (error) {
            console.error('❌ Erreur lors de la soumission:', error);
            this.showFormErrors(['Une erreur inattendue s\'est produite. Veuillez réessayer.'], messageContainer);
        }
    }

    // Afficher les erreurs de formulaire
    showFormErrors(errors, container) {
        container.innerHTML = errors.map(error => `
            <div class="newsletter-error" style="
                background: #f8d7da;
                color: #721c24;
                padding: 12px 15px;
                border-radius: 6px;
                margin-bottom: 10px;
                border: 1px solid #f5c6cb;
                display: flex;
                align-items: center;
                gap: 10px;
                animation: slideDown 0.3s ease;
            ">
                <i class="fas fa-exclamation-triangle"></i>
                <span>${error}</span>
            </div>
        `).join('');
    }

    // Afficher un message de succès
    showFormSuccess(message, container) {
        container.innerHTML = `
            <div class="newsletter-success" style="
                background: #d4edda;
                color: #155724;
                padding: 12px 15px;
                border-radius: 6px;
                border: 1px solid #c3e6cb;
                display: flex;
                align-items: center;
                gap: 10px;
                animation: slideDown 0.3s ease;
            ">
                <i class="fas fa-check-circle"></i>
                <span>${message}</span>
            </div>
        `;
    }

    // Afficher un avertissement
    showFormWarning(message, container) {
        container.innerHTML = `
            <div class="newsletter-warning" style="
                background: #fff3cd;
                color: #856404;
                padding: 12px 15px;
                border-radius: 6px;
                border: 1px solid #ffeaa7;
                display: flex;
                align-items: center;
                gap: 10px;
                animation: slideDown 0.3s ease;
            ">
                <i class="fas fa-exclamation-circle"></i>
                <span>${message}</span>
            </div>
        `;
    }

    // Animation de succès
    animateSuccess(form) {
        const originalBg = form.style.background;
        form.style.transition = 'background 0.5s ease';
        form.style.background = 'rgba(40, 167, 69, 0.1)';
        
        setTimeout(() => {
            form.style.background = originalBg;
        }, 2000);
    }

    // Configurer les gestionnaires d'événements globaux
    setupEventHandlers() {
        // Raccourci pour ouvrir le dashboard (Ctrl+Alt+N)
        document.addEventListener('keydown', (e) => {
            if (e.ctrlKey && e.altKey && e.key === 'n') {
                e.preventDefault();
                this.showDashboard();
            }
        });
        
        // Gestion de la visibilité de la page
        document.addEventListener('visibilitychange', () => {
            if (!document.hidden && this.isInitialized) {
                this.database.updateStatistics();
            }
        });
    }

    // Afficher le dashboard
    showDashboard() {
        if (window.newsletterDashboard) {
            window.newsletterDashboard.show();
        } else {
            console.warn('Dashboard non disponible');
        }
    }

    // Afficher le statut du système
    showSystemStatus() {
        const status = {
            validation: this.validator ? '✅' : '❌',
            categories: this.categories ? '✅' : '❌',
            database: this.database ? '✅' : '❌',
            doubleOptIn: this.doubleOptIn ? '✅' : '❌',
            emailService: window.newsletterEmailJS?.isConfigured ? '✅' : '⚠️'
        };
        
        console.log(`
📊 STATUT DU SYSTÈME NEWSLETTER
===============================
${status.validation} Validation et sécurité
${status.categories} Gestion des catégories  
${status.database} Base de données locale
${status.doubleOptIn} Double opt-in RGPD
${status.emailService} Service d'envoi EmailJS

🎯 RACCOURCIS CLAVIER:
• Ctrl+Alt+N : Ouvrir le dashboard
• Ctrl+Alt+D : Dashboard détaillé
• Ctrl+Alt+E : Configuration EmailJS

💡 GUIDE DE DÉMARRAGE:
1. Configurez EmailJS (Ctrl+Alt+E)
2. Testez avec votre email
3. Consultez le dashboard (Ctrl+Alt+N)

Pour plus d'aide : contact@sorbo-ingenierie.fr
        `);

        // Notification visuelle si EmailJS n'est pas configuré
        if (!window.newsletterEmailJS?.isConfigured) {
            setTimeout(() => {
                this.showConfigurationReminder();
            }, 3000);
        }
    }

    // Rappel de configuration
    showConfigurationReminder() {
        const reminder = document.createElement('div');
        reminder.innerHTML = `
            <div style="
                position: fixed;
                bottom: 20px;
                right: 20px;
                background: linear-gradient(135deg, #ff6b6b, #ee5a52);
                color: white;
                padding: 20px;
                border-radius: 12px;
                max-width: 350px;
                box-shadow: 0 10px 30px rgba(0,0,0,0.3);
                z-index: 9999;
                animation: slideInUp 0.5s ease;
            ">
                <div style="display: flex; align-items: center; gap: 15px; margin-bottom: 15px;">
                    <div style="font-size: 24px;">⚙️</div>
                    <div>
                        <h4 style="margin: 0; font-size: 16px;">Configuration requise</h4>
                        <p style="margin: 5px 0 0 0; font-size: 14px; opacity: 0.9;">
                            Configurez EmailJS pour activer l'envoi d'emails
                        </p>
                    </div>
                </div>
                <div style="display: flex; gap: 10px;">
                    <button onclick="window.newsletterEmailJS?.showConfigInterface(); this.parentElement.parentElement.parentElement.remove();" style="
                        background: white;
                        color: #ff6b6b;
                        border: none;
                        padding: 10px 15px;
                        border-radius: 6px;
                        cursor: pointer;
                        font-weight: 500;
                        flex: 1;
                    ">
                        Configurer
                    </button>
                    <button onclick="this.parentElement.parentElement.parentElement.remove();" style="
                        background: rgba(255,255,255,0.2);
                        color: white;
                        border: none;
                        padding: 10px 15px;
                        border-radius: 6px;
                        cursor: pointer;
                    ">
                        Plus tard
                    </button>
                </div>
            </div>
        `;
        
        document.body.appendChild(reminder);
        
        // Auto-fermeture après 10 secondes
        setTimeout(() => {
            if (reminder.parentNode) {
                reminder.remove();
            }
        }, 10000);
    }

    // Afficher une erreur système
    showError(message) {
        console.error('❌', message);
        
        // Notification d'erreur
        const errorNotif = document.createElement('div');
        errorNotif.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: #dc3545;
            color: white;
            padding: 15px 20px;
            border-radius: 8px;
            z-index: 10000;
            animation: slideInRight 0.3s ease;
        `;
        errorNotif.innerHTML = `
            <div style="display: flex; align-items: center; gap: 10px;">
                <i class="fas fa-exclamation-triangle"></i>
                <span>${message}</span>
            </div>
        `;
        
        document.body.appendChild(errorNotif);
        setTimeout(() => errorNotif.remove(), 5000);
    }

    // Obtenir les statistiques
    getStats() {
        return this.database ? this.database.getStatistics() : null;
    }

    // Rafraîchir le dashboard si ouvert
    refreshDashboardIfOpen() {
        if (window.newsletterDashboard && window.newsletterDashboard.isVisible) {
            console.log('🔄 Rafraîchissement automatique du dashboard...');
            window.newsletterDashboard.refresh();
            
            // Notification de mise à jour
            this.showDashboardUpdateNotification();
        }
    }

    // Afficher une notification de mise à jour du dashboard
    showDashboardUpdateNotification() {
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            top: 80px;
            right: 20px;
            background: #28a745;
            color: white;
            padding: 12px 18px;
            border-radius: 8px;
            z-index: 10001;
            animation: slideInRight 0.3s ease;
            font-size: 14px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        `;
        notification.innerHTML = `
            <div style="display: flex; align-items: center; gap: 8px;">
                <i class="fas fa-sync-alt"></i>
                <span>Dashboard mis à jour !</span>
            </div>
        `;
        
        document.body.appendChild(notification);
        setTimeout(() => notification.remove(), 3000);
    }

    // Méthode publique pour tester le système
    test() {
        console.log('🧪 Test du système Newsletter...');
        
        const results = {
            initialized: this.isInitialized,
            components: {
                validator: !!this.validator,
                categories: !!this.categories,
                database: !!this.database,
                doubleOptIn: !!this.doubleOptIn
            },
            forms: document.querySelectorAll('.footer-newsletter-form').length,
            stats: this.getStats()
        };
        
        console.table(results.components);
        console.log('📊 Statistiques:', results.stats);
        
        return results;
    }
}

// Styles CSS pour les animations
const newsletterStyles = `
    @keyframes slideDown {
        from { opacity: 0; transform: translateY(-10px); }
        to { opacity: 1; transform: translateY(0); }
    }
    
    @keyframes slideInUp {
        from { opacity: 0; transform: translateY(30px); }
        to { opacity: 1; transform: translateY(0); }
    }
    
    @keyframes slideInRight {
        from { opacity: 0; transform: translateX(30px); }
        to { opacity: 1; transform: translateX(0); }
    }
    
    .newsletter-messages {
        animation: slideDown 0.3s ease;
    }
`;

// Ajouter les styles
const styleSheet = document.createElement('style');
styleSheet.textContent = newsletterStyles;
document.head.appendChild(styleSheet);

// Initialisation automatique quand le DOM est prêt
document.addEventListener('DOMContentLoaded', () => {
    window.newsletterManager = new NewsletterManager();
});

// Export
window.NewsletterManager = NewsletterManager;
