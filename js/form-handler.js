/**
 * Gestionnaire centralisé des formulaires Sorbo-Ingénierie
 * Gère l'envoi de tous les formulaires via Formspree
 */

class FormHandler {
    constructor() {
        this.init();
    }

    init() {
        console.log('📧 FormHandler initialisé');
        this.setupFormListeners();
        this.setupNewsletterListeners();
    }

    // Configuration des écouteurs de formulaires
    setupFormListeners() {
        // Formulaire de contact principal
        const contactForm = document.getElementById('contact-form');
        if (contactForm) {
            contactForm.addEventListener('submit', (e) => this.handleContactForm(e));
        }

        // Formulaire de candidature
        const applicationForm = document.getElementById('applicationForm');
        if (applicationForm) {
            applicationForm.addEventListener('submit', (e) => this.handleApplicationForm(e));
        }

        // Formulaire de devis (si existe)
        const devisForm = document.querySelector('form[data-form-type="devis"]');
        if (devisForm) {
            devisForm.addEventListener('submit', (e) => this.handleDevisForm(e));
        }
    }

    // Configuration des newsletters
    setupNewsletterListeners() {
        const newsletterForms = document.querySelectorAll('.footer-newsletter-form');
        newsletterForms.forEach(form => {
            form.addEventListener('submit', (e) => this.handleNewsletterForm(e));
        });
    }

    // Gestion du formulaire de contact
    async handleContactForm(e) {
        e.preventDefault();
        const form = e.target;
        const submitBtn = form.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;

        try {
            // Afficher l'état de chargement
            submitBtn.textContent = 'Envoi en cours...';
            submitBtn.disabled = true;

            // Préparer les données du formulaire
            const formData = new FormData(form);
            const data = this.prepareContactData(formData);

            // Envoyer via Formspree
            const response = await this.sendToFormspree(EMAIL_CONFIG.contact, data);

            if (response.ok) {
                this.showSuccess('contact', form);
                form.reset();
                this.hideDynamicFields();
            } else {
                throw new Error('Erreur serveur');
            }

        } catch (error) {
            console.error('Erreur envoi contact:', error);
            this.showError('contact');
        } finally {
            // Restaurer le bouton
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
        }
    }

    // Gestion du formulaire de candidature
    async handleApplicationForm(e) {
        e.preventDefault();
        const form = e.target;
        const submitBtn = form.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;

        try {
            submitBtn.textContent = 'Envoi en cours...';
            submitBtn.disabled = true;

            const formData = new FormData(form);
            const data = this.prepareApplicationData(formData);

            const response = await this.sendToFormspree(EMAIL_CONFIG.candidature, data);

            if (response.ok) {
                this.showSuccess('candidature', form);
                form.reset();
                this.closeApplicationModal();
            } else {
                throw new Error('Erreur serveur');
            }

        } catch (error) {
            console.error('Erreur envoi candidature:', error);
            this.showError('candidature');
        } finally {
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
        }
    }

    // Gestion du formulaire de devis
    async handleDevisForm(e) {
        e.preventDefault();
        const form = e.target;
        const submitBtn = form.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;

        try {
            submitBtn.textContent = 'Envoi en cours...';
            submitBtn.disabled = true;

            const formData = new FormData(form);
            const data = this.prepareDevisData(formData);

            const response = await this.sendToFormspree(EMAIL_CONFIG.devis, data);

            if (response.ok) {
                this.showSuccess('devis', form);
                form.reset();
            } else {
                throw new Error('Erreur serveur');
            }

        } catch (error) {
            console.error('Erreur envoi devis:', error);
            this.showError('devis');
        } finally {
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
        }
    }

    // Gestion des newsletters
    async handleNewsletterForm(e) {
        e.preventDefault();
        const form = e.target;
        const emailInput = form.querySelector('input[type="email"]');
        const email = emailInput.value;

        try {
            const data = {
                email: email,
                type: 'newsletter',
                date: new Date().toISOString()
            };

            const response = await this.sendToFormspree(EMAIL_CONFIG.newsletter, data);

            if (response.ok) {
                this.showSuccess('newsletter', form);
                emailInput.value = '';
            } else {
                throw new Error('Erreur serveur');
            }

        } catch (error) {
            console.error('Erreur newsletter:', error);
            this.showError('newsletter');
        }
    }

    // Envoi vers Formspree
    async sendToFormspree(endpoint, data) {
        return fetch(endpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
        });
    }

    // Préparation des données de contact
    prepareContactData(formData) {
        const data = {
            type: 'contact',
            date: new Date().toISOString()
        };

        // Ajouter tous les champs du formulaire
        for (let [key, value] of formData.entries()) {
            if (value) {
                data[key] = value;
            }
        }

        // Ajouter des informations contextuelles
        data.page = window.location.pathname;
        data.userAgent = navigator.userAgent;

        return data;
    }

    // Préparation des données de candidature
    prepareApplicationData(formData) {
        const data = {
            type: 'candidature',
            date: new Date().toISOString()
        };

        for (let [key, value] of formData.entries()) {
            if (value) {
                data[key] = value;
            }
        }

        // Informations supplémentaires pour les candidatures
        data.page = 'nous-rejoindre';
        data.source = 'site-web';

        return data;
    }

    // Préparation des données de devis
    prepareDevisData(formData) {
        const data = {
            type: 'devis',
            date: new Date().toISOString()
        };

        for (let [key, value] of formData.entries()) {
            if (value) {
                data[key] = value;
            }
        }

        data.page = window.location.pathname;
        return data;
    }

    // Affichage des messages de succès
    showSuccess(type, form) {
        const message = SUCCESS_MESSAGES[type];
        this.showNotification(message, 'success');
        
        // Scroll vers le haut du formulaire
        form.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }

    // Affichage des messages d'erreur
    showError(type) {
        const message = ERROR_MESSAGES[type];
        this.showNotification(message, 'error');
    }

    // Affichage des notifications
    showNotification(message, type) {
        // Supprimer les notifications existantes
        const existingNotifications = document.querySelectorAll('.form-notification');
        existingNotifications.forEach(notif => notif.remove());

        // Créer la nouvelle notification
        const notification = document.createElement('div');
        notification.className = `form-notification form-notification-${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-circle'}"></i>
                <span>${message}</span>
                <button class="notification-close">&times;</button>
            </div>
        `;

        // Styles de la notification
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${type === 'success' ? '#4CAF50' : '#f44336'};
            color: white;
            padding: 15px 20px;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            z-index: 10000;
            max-width: 400px;
            animation: slideInRight 0.3s ease;
        `;

        // Ajouter au body
        document.body.appendChild(notification);

        // Gestion de la fermeture
        const closeBtn = notification.querySelector('.notification-close');
        closeBtn.addEventListener('click', () => notification.remove());

        // Auto-fermeture après 5 secondes
        setTimeout(() => {
            if (notification.parentNode) {
                notification.remove();
            }
        }, 5000);
    }

    // Masquer les champs dynamiques
    hideDynamicFields() {
        const dynamicFields = document.querySelectorAll('.dynamic-fields');
        dynamicFields.forEach(field => {
            field.style.display = 'none';
        });
    }

    // Fermer le modal de candidature
    closeApplicationModal() {
        const modal = document.querySelector('.application-modal');
        if (modal) {
            modal.style.display = 'none';
        }
    }
}

// Initialisation automatique
document.addEventListener('DOMContentLoaded', () => {
    new FormHandler();
});

// Styles CSS pour les notifications
const notificationStyles = `
    @keyframes slideInRight {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    
    .form-notification .notification-content {
        display: flex;
        align-items: center;
        gap: 10px;
    }
    
    .form-notification .notification-close {
        background: none;
        border: none;
        color: white;
        font-size: 18px;
        cursor: pointer;
        margin-left: auto;
    }
    
    .form-notification .notification-close:hover {
        opacity: 0.8;
    }
`;

// Ajouter les styles
const styleSheet = document.createElement('style');
styleSheet.textContent = notificationStyles;
document.head.appendChild(styleSheet);
