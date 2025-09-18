// Gestion des inscriptions aux formations
class FormationInscription {
    constructor() {
        this.form = document.getElementById('inscription-form');
        this.submitBtn = document.getElementById('submit-btn');
        this.loading = document.getElementById('loading');
        this.successMessage = document.getElementById('success-message');
        this.errorMessage = document.getElementById('error-message');
        
        this.init();
    }

    init() {
        this.displayFormationInfo();
        this.bindEvents();
    }

    // Récupération des paramètres de l'URL
    getUrlParams() {
        const params = new URLSearchParams(window.location.search);
        return {
            name: params.get('name') || 'Formation non spécifiée',
            duration: params.get('duration') || 'Durée non spécifiée',
            price: params.get('price') || 'Prix non spécifié',
            id: params.get('id') || ''
        };
    }

    // Affichage des informations de la formation
    displayFormationInfo() {
        const params = this.getUrlParams();
        const formationName = document.getElementById('formation-name');
        const formationDuration = document.getElementById('formation-duration');
        const formationPrice = document.getElementById('formation-price');

        if (formationName) formationName.textContent = params.name;
        if (formationDuration) formationDuration.textContent = params.duration;
        if (formationPrice) formationPrice.textContent = params.price;
    }

    // Liaison des événements
    bindEvents() {
        if (this.form) {
            this.form.addEventListener('submit', (e) => this.handleSubmit(e));
        }
    }

    // Gestion de la soumission du formulaire
    async handleSubmit(e) {
        e.preventDefault();
        
        if (!this.validateForm()) {
            return;
        }

        this.showLoading();

        try {
            const formData = this.collectFormData();
            await this.sendInscription(formData);
            this.showSuccess();
            this.resetForm();
            
            // Redirection après 5 secondes
            setTimeout(() => {
                window.location.href = 'nos-formations.html';
            }, 5000);
            
        } catch (error) {
            this.showError(error.message);
        } finally {
            this.hideLoading();
        }
    }

    // Validation du formulaire
    validateForm() {
        const requiredFields = ['nom', 'prenom', 'email', 'telephone', 'ville', 'pays', 'motivation'];
        let isValid = true;

        requiredFields.forEach(fieldName => {
            const field = document.getElementById(fieldName);
            if (field && !field.value.trim()) {
                this.highlightError(field);
                isValid = false;
            } else if (field) {
                this.removeErrorHighlight(field);
            }
        });

        // Validation email
        const emailField = document.getElementById('email');
        if (emailField && emailField.value && !this.isValidEmail(emailField.value)) {
            this.highlightError(emailField);
            isValid = false;
        }

        return isValid;
    }

    // Validation email
    isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    // Mise en évidence des erreurs
    highlightError(field) {
        field.style.borderColor = '#dc3545';
        field.style.boxShadow = '0 0 0 3px rgba(220, 53, 69, 0.1)';
    }

    // Suppression de la mise en évidence d'erreur
    removeErrorHighlight(field) {
        field.style.borderColor = '#e1e5e9';
        field.style.boxShadow = 'none';
    }

    // Collecte des données du formulaire
    collectFormData() {
        const formData = new FormData(this.form);
        const formationParams = this.getUrlParams();
        
        // Ajout des informations de la formation
        formData.append('formation_name', formationParams.name);
        formData.append('formation_duration', formationParams.duration);
        formData.append('formation_price', formationParams.price);
        formData.append('formation_id', formationParams.id);
        formData.append('date_inscription', new Date().toISOString());
        
        return formData;
    }

    // Envoi de l'inscription
    async sendInscription(formData) {
        // Option 1: Utilisation d'EmailJS (nécessite une clé API)
        if (typeof emailjs !== 'undefined') {
            return this.sendViaEmailJS(formData);
        }
        
        // Option 2: Envoi via votre backend
        return this.sendViaBackend(formData);
        
        // Option 3: Simulation (pour les tests)
        // return this.simulateSend(formData);
    }

    // Envoi via EmailJS
    async sendViaEmailJS(formData) {
        const templateParams = {
            to_email: 'contact@sorbo.ingenierie.ci',
            to_name: 'Sorbo Ingénierie',
            from_name: `${formData.get('prenom')} ${formData.get('nom')}`,
            from_email: formData.get('email'),
            formation_name: formData.get('formation_name'),
            formation_duration: formData.get('formation_duration'),
            formation_price: formData.get('formation_price'),
            telephone: formData.get('telephone'),
            entreprise: formData.get('entreprise'),
            fonction: formData.get('fonction'),
            adresse: formData.get('adresse'),
            ville: formData.get('ville'),
            pays: formData.get('pays'),
            motivation: formData.get('motivation'),
            experience: formData.get('experience'),
            questions: formData.get('questions'),
            date_inscription: formData.get('date_inscription')
        };

        return emailjs.send('YOUR_SERVICE_ID', 'YOUR_TEMPLATE_ID', templateParams, 'YOUR_USER_ID');
    }

    // Envoi via votre backend
    async sendViaBackend(formData) {
        const response = await fetch('/api/inscription-formation', {
            method: 'POST',
            body: formData
        });

        if (!response.ok) {
            throw new Error('Erreur lors de l\'envoi de la demande');
        }

        return response.json();
    }

    // Simulation d'envoi (pour les tests)
    simulateSend(formData) {
        return new Promise((resolve) => {
            setTimeout(() => {
                console.log('Données du formulaire:', Object.fromEntries(formData));
                resolve({ success: true });
            }, 2000);
        });
    }

    // Affichage du loading
    showLoading() {
        this.submitBtn.disabled = true;
        this.loading.style.display = 'block';
        this.successMessage.style.display = 'none';
        this.errorMessage.style.display = 'none';
    }

    // Masquage du loading
    hideLoading() {
        this.submitBtn.disabled = false;
        this.loading.style.display = 'none';
    }

    // Affichage du message de succès
    showSuccess() {
        this.successMessage.style.display = 'block';
    }

    // Affichage du message d'erreur
    showError(message) {
        const errorText = document.getElementById('error-text');
        if (errorText) {
            errorText.textContent = message || 'Une erreur s\'est produite lors de l\'envoi de votre demande.';
        }
        this.errorMessage.style.display = 'block';
    }

    // Réinitialisation du formulaire
    resetForm() {
        this.form.reset();
    }
}

// Initialisation quand le DOM est chargé
document.addEventListener('DOMContentLoaded', () => {
    new FormationInscription();
});

// Fonction pour ouvrir la page de contact avec les informations de formation
function openInscriptionForm(formationName, duration, price, id) {
    const params = new URLSearchParams({
        formation: encodeURIComponent(formationName),
        prix: encodeURIComponent(price),
        subject: 'formation'
    });
    
    window.location.href = `contact.html?${params.toString()}`;
}











