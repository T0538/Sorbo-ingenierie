/**
 * Configuration et gestion de l'intégration EmailJS pour les newsletters.
 * Permet de configurer les identifiants EmailJS et d'envoyer des emails.
 */

class NewsletterEmailJS {
    constructor() {
        this.serviceId = localStorage.getItem('emailjs_service_id') || 'YOUR_SERVICE_ID';
        this.templateId = localStorage.getItem('emailjs_template_id') || 'YOUR_TEMPLATE_ID';
        this.userId = localStorage.getItem('emailjs_user_id') || 'YOUR_USER_ID';
        this.init();
    }

    init() {
        console.log('📧 NewsletterEmailJS initialisé');
        this.loadEmailJSLibrary();
        this.setupConfigModal();
    }

    loadEmailJSLibrary() {
        if (typeof emailjs === 'undefined') {
            const script = document.createElement('script');
            script.src = 'https://cdn.emailjs.com/sdk/2.6.4/email.min.js';
            script.onload = () => {
                emailjs.init(this.userId);
                console.log('EmailJS SDK chargé et initialisé.');
            };
            document.head.appendChild(script);
        } else {
            emailjs.init(this.userId);
            console.log('EmailJS SDK déjà chargé et initialisé.');
        }
    }

    setupConfigModal() {
        document.addEventListener('keydown', (e) => {
            if (e.ctrlKey && e.altKey && e.key === 'E') { // Ctrl+Alt+E
                e.preventDefault();
                this.showConfigModal();
            }
        });
    }

    showConfigModal() {
        let modal = document.getElementById('emailjs-config-modal');
        if (!modal) {
            modal = document.createElement('div');
            modal.id = 'emailjs-config-modal';
            modal.className = 'newsletter-modal';
            modal.innerHTML = `
                <div class="newsletter-modal-content">
                    <h2>Configuration EmailJS</h2>
                    <p>Entrez vos identifiants EmailJS pour activer l'envoi d'emails.</p>
                    <div class="form-group">
                        <label for="emailjs-service-id">Service ID:</label>
                        <input type="text" id="emailjs-service-id" class="form-control" value="${this.serviceId}">
                    </div>
                    <div class="form-group">
                        <label for="emailjs-template-id">Template ID (Confirmation):</label>
                        <input type="text" id="emailjs-template-id" class="form-control" value="${this.templateId}">
                    </div>
                    <div class="form-group">
                        <label for="emailjs-user-id">User ID:</label>
                        <input type="text" id="emailjs-user-id" class="form-control" value="${this.userId}">
                    </div>
                    <div class="modal-actions">
                        <button id="save-emailjs-config" class="btn btn-primary">Sauvegarder</button>
                        <button id="close-emailjs-config" class="btn btn-secondary">Fermer</button>
                    </div>
                    <p class="modal-info">Besoin d'aide ? <a href="https://www.emailjs.com/docs/introduction/" target="_blank">Consultez la documentation EmailJS</a></p>
                </div>
            `;
            document.body.appendChild(modal);

            modal.querySelector('#save-emailjs-config').addEventListener('click', () => this.saveConfig());
            modal.querySelector('#close-emailjs-config').addEventListener('click', () => this.hideConfigModal());
        }
        modal.style.display = 'flex';
    }

    hideConfigModal() {
        const modal = document.getElementById('emailjs-config-modal');
        if (modal) {
            modal.style.display = 'none';
        }
    }

    saveConfig() {
        try {
            // Récupérer les valeurs des champs
            this.serviceId = document.getElementById('emailjs-service-id').value;
            this.templateId = document.getElementById('emailjs-template-id').value;
            this.userId = document.getElementById('emailjs-user-id').value;

            // Validation des champs
            if (!this.serviceId || !this.templateId || !this.userId) {
                alert('Veuillez remplir tous les champs !');
                return;
            }

            // Sauvegarder dans localStorage
            localStorage.setItem('emailjs_service_id', this.serviceId);
            localStorage.setItem('emailjs_template_id', this.templateId);
            localStorage.setItem('emailjs_user_id', this.userId);

            // Réinitialiser EmailJS si disponible
            if (typeof emailjs !== 'undefined') {
                try {
                    emailjs.init(this.userId);
                    console.log('✅ EmailJS réinitialisé avec le nouveau User ID');
                } catch (initError) {
                    console.warn('⚠️ Erreur lors de l\'initialisation d\'EmailJS:', initError);
                }
            } else {
                console.log('📧 EmailJS sera initialisé au prochain chargement');
            }

            // Afficher le message de succès
            alert('✅ Configuration EmailJS sauvegardée avec succès !');
            
            // Fermer le modal
            this.hideConfigModal();
            
            // Mettre à jour l'affichage si nécessaire
            if (window.newsletterDashboard) {
                window.newsletterDashboard.refresh();
            }
            
        } catch (error) {
            console.error('❌ Erreur lors de la sauvegarde:', error);
            alert('❌ Erreur lors de la sauvegarde. Vérifiez la console pour plus de détails.');
        }
    }

    async sendEmail(templateParams) {
        if (!this.serviceId || this.serviceId === 'YOUR_SERVICE_ID' ||
            !this.templateId || this.templateId === 'YOUR_TEMPLATE_ID' ||
            !this.userId || this.userId === 'YOUR_USER_ID') {
            console.error('EmailJS non configuré. Veuillez configurer vos identifiants via Ctrl+Alt+E.');
            return { success: false, message: 'EmailJS non configuré.' };
        }

        try {
            await emailjs.send(this.serviceId, this.templateId, templateParams, this.userId);
            console.log('Email envoyé avec succès via EmailJS !');
            return { success: true };
        } catch (error) {
            console.error('Erreur lors de l\'envoi de l\'email via EmailJS:', error);
            return { success: false, message: error.message };
        }
    }

    // Méthode pour vérifier si EmailJS est configuré
    get isConfigured() {
        return this.serviceId !== 'YOUR_SERVICE_ID' && 
               this.templateId !== 'YOUR_TEMPLATE_ID' && 
               this.userId !== 'YOUR_USER_ID';
    }

    // Méthode pour afficher l'interface de configuration
    showConfigInterface() {
        this.showConfigModal();
    }
}

// Initialisation automatique
document.addEventListener('DOMContentLoaded', () => {
    window.newsletterEmailJS = new NewsletterEmailJS();
});

// Export pour compatibilité
window.NewsletterEmailJS = NewsletterEmailJS;
