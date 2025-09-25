// ======================================
// CORRECTION DES FORMULAIRES - SORBO-INGÉNIERIE
// ======================================

class FormFix {
    constructor() {
        this.init();
    }

    init() {
        this.fixContactForm();
        this.fixInscriptionForm();
        this.fixFormationModals();
        
        // Vérifier les paramètres de formation après un délai
        setTimeout(() => {
            this.checkFormationParameter();
        }, 500);
    }

    // ======================================
    // CORRECTION DU FORMULAIRE DE CONTACT
    // ======================================
    
    fixContactForm() {
        const contactForm = document.getElementById('contact-form');
        if (!contactForm) return;

        // S'assurer que le formulaire n'a pas d'action mailto
        contactForm.removeAttribute('action');
        contactForm.setAttribute('action', 'javascript:void(0);');
        contactForm.setAttribute('method', 'post');

        // Supprimer les anciens event listeners
        const newForm = contactForm.cloneNode(true);
        contactForm.parentNode.replaceChild(newForm, contactForm);

        // Ajouter le nouvel event listener avec preventDefault strict
        newForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            e.stopPropagation();
            e.stopImmediatePropagation();
            await this.handleContactSubmit(e);
        });

        // Gestion des champs dynamiques
        this.setupDynamicFields();
    }

    async handleContactSubmit(e) {
        const form = e.target;
        const submitBtn = form.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;

        try {
            // Validation personnalisée avant soumission
            if (!this.validateContactForm(form)) {
                return;
            }

            // Afficher le loading
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Envoi en cours...';
            submitBtn.disabled = true;

            // Collecter les données
            const formData = new FormData(form);
            const data = this.collectContactData(formData);

            // Simuler l'envoi (remplacer par votre API)
            await this.simulateContactSend(data);

            // Afficher le succès
            this.showContactSuccess(form, data);

        } catch (error) {
            console.error('Erreur contact:', error);
            this.showContactError(form, error.message);
        } finally {
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
        }
    }

    validateContactForm(form) {
        let isValid = true;
        
        // Valider les champs de base
        const basicFields = ['name', 'email', 'subject', 'message'];
        basicFields.forEach(fieldName => {
            const field = form.querySelector(`[name="${fieldName}"]`);
            if (field && field.hasAttribute('required') && !field.value.trim()) {
                this.highlightError(field);
                isValid = false;
            } else if (field) {
                this.removeErrorHighlight(field);
            }
        });

        // Valider les champs dynamiques visibles seulement
        const visibleDynamicFields = document.querySelectorAll('.dynamic-fields[style*="block"] input[required], .dynamic-fields[style*="block"] select[required], .dynamic-fields[style*="block"] textarea[required]');
        visibleDynamicFields.forEach(field => {
            if (!field.value.trim()) {
                this.highlightError(field);
                isValid = false;
            } else {
                this.removeErrorHighlight(field);
            }
        });

        // Validation email
        const emailField = form.querySelector('[name="email"]');
        if (emailField && emailField.value && !this.isValidEmail(emailField.value)) {
            this.highlightError(emailField);
            isValid = false;
        }

        if (!isValid) {
            this.showContactError(form, 'Veuillez remplir tous les champs obligatoires.');
        }

        return isValid;
    }

    collectContactData(formData) {
        const data = {};
        for (let [key, value] of formData.entries()) {
            data[key] = value;
        }
        data.timestamp = new Date().toISOString();
        return data;
    }

    async simulateContactSend(data) {
        console.log('📤 Envoi du message de contact via Zoho Mail...', data);
        
        // Utiliser la nouvelle fonction sendToZohoMail du FormHandler
        if (window.formHandler && window.formHandler.sendToZohoMail) {
            try {
                const success = await window.formHandler.sendToZohoMail(data);
                return success.ok;
            } catch (error) {
                console.error('❌ Erreur lors de l\'envoi via FormHandler:', error);
                return false;
            }
        }
        
        // Fallback: utiliser mailto directement
        try {
            const subject = `Nouveau message de ${data.name || data.nom || 'contact'}`;
            const body = this.formatContactEmailBody(data);
            
            const mailtoLink = `mailto:contact@sorbo-ingenierie.ci?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
            window.location.href = mailtoLink;
            
            return true;
        } catch (error) {
            console.error('❌ Erreur lors de l\'envoi via mailto:', error);
            return false;
        }
    }

    // Formatage du corps de l'email pour form-fix
    formatContactEmailBody(data) {
        let body = `Nouveau message de contact:\n\n`;
        body += `Nom: ${data.name || data.nom || 'Non renseigné'}\n`;
        body += `Email: ${data.email || 'Non renseigné'}\n`;
        body += `Téléphone: ${data.phone || data.telephone || 'Non renseigné'}\n`;
        body += `Sujet: ${this.getSubjectText(data.subject || data.sujet) || 'Non renseigné'}\n\n`;
        body += `Message:\n${data.message || 'Aucun message'}\n\n`;
        
        // Ajouter les informations spécifiques aux formations
        if (data.subject === 'formation' || data.sujet === 'formation') {
            body += `--- Informations Formation ---\n`;
            body += `Nom complet: ${data['formation-nom'] || ''} ${data['formation-prenom'] || ''}\n`;
            body += `Email formation: ${data['formation-email'] || ''}\n`;
            body += `Téléphone formation: ${data['formation-telephone'] || ''}\n`;
            body += `Nationalité: ${data['formation-nationalite'] || ''}\n`;
            body += `CNI: ${data['formation-cni'] || ''}\n`;
            body += `Adresse: ${data['formation-adresse'] || ''}\n`;
            body += `Fonction: ${data['formation-fonction'] || ''}\n`;
            body += `Secteur d'activité: ${data['formation-secteur'] || ''}\n`;
            body += `Niveau: ${data['formation-niveau'] || ''}\n`;
            body += `Prise en charge: ${data['formation-prise-charge'] || ''}\n`;
            body += `Mode de paiement: ${data['formation-paiement'] || ''}\n`;
        }
        
        body += `\n--- Informations techniques ---\n`;
        body += `Page: ${data.page || window.location.pathname}\n`;
        body += `Date: ${new Date().toLocaleString('fr-FR')}\n`;
        
        return body;
    }

    showContactSuccess(form, data) {
        const subjectText = this.getSubjectText(data.subject);
        
        form.innerHTML = `
            <div class="success-message" style="text-align: center; padding: 2rem;">
                <i class="fas fa-check-circle" style="font-size: 3rem; color: #28a745; margin-bottom: 1rem;"></i>
                <h3 style="color: #28a745; margin-bottom: 1rem;">Message envoyé avec succès !</h3>
                <p style="margin-bottom: 2rem;">Nous avons bien reçu votre demande et nous vous répondrons dans les plus brefs délais.</p>
                
                <div style="background: #f8f9fa; padding: 1.5rem; border-radius: 8px; text-align: left; margin-top: 1rem;">
                    <h4 style="margin-bottom: 1rem; color: #333;">Récapitulatif :</h4>
                    <p><strong>Sujet :</strong> ${subjectText}</p>
                    <p><strong>Nom :</strong> ${data.name}</p>
                    <p><strong>Email :</strong> ${data.email}</p>
                    ${data.phone ? `<p><strong>Téléphone :</strong> ${data.phone}</p>` : ''}
                    <p><strong>Message :</strong> ${data.message}</p>
                </div>
                
                <button onclick="location.reload()" style="margin-top: 1rem; background: #d10000; color: white; border: none; padding: 0.75rem 1.5rem; border-radius: 5px; cursor: pointer;">
                    Envoyer un autre message
                </button>
            </div>
        `;
    }

    showContactError(form, message) {
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        errorDiv.style.cssText = `
            background: #f8d7da;
            color: #721c24;
            padding: 1rem;
            border: 1px solid #f5c6cb;
            border-radius: 5px;
            margin-bottom: 1rem;
        `;
        errorDiv.innerHTML = `
            <i class="fas fa-exclamation-triangle"></i>
            <strong>Erreur :</strong> ${message || 'Une erreur est survenue lors de l\'envoi de votre message.'}
        `;
        
        form.insertBefore(errorDiv, form.firstChild);
        
        setTimeout(() => {
            errorDiv.remove();
        }, 5000);
    }

    getSubjectText(value) {
        const subjects = {
            'rendezvous': 'Demande de rendez-vous',
            'ingenierie': 'Projet d\'ingénierie',
            'formation': 'Formation',
            'logiciel': 'Logiciels',
            'carriere': 'Carrières',
            'autre': 'Autre'
        };
        return subjects[value] || value;
    }

    highlightError(field) {
        field.style.borderColor = '#dc3545';
        field.style.boxShadow = '0 0 0 3px rgba(220, 53, 69, 0.1)';
    }

    removeErrorHighlight(field) {
        field.style.borderColor = '#e1e5e9';
        field.style.boxShadow = 'none';
    }

    isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    setupDynamicFields() {
        const subjectSelect = document.getElementById('subject');
        if (!subjectSelect) return;

        // Initialiser les champs dynamiques au chargement
        this.initializeDynamicFields();

        // Vérifier si on vient d'une formation (paramètre URL)
        this.checkFormationParameter();

        subjectSelect.addEventListener('change', (e) => {
            const value = e.target.value;
            this.toggleDynamicFields(value);
        });
    }

    checkFormationParameter() {
        const urlParams = new URLSearchParams(window.location.search);
        const subject = urlParams.get('subject');
        
        if (subject === 'formation') {
            // Fonction récursive pour attendre que l'élément soit disponible
            this.waitForSubjectElement(urlParams);
        }
    }

    waitForSubjectElement(urlParams, attempts = 0) {
        const maxAttempts = 20; // 2 secondes maximum
        const subjectSelect = document.getElementById('subject');
        
        if (subjectSelect) {
            // Élément trouvé, sélectionner la formation
            subjectSelect.value = 'formation';
            this.toggleDynamicFields('formation');
            
            // Afficher un message informatif
            this.showFormationMessage(urlParams);
            
            console.log('✅ Sujet "Formation" sélectionné automatiquement');
        } else if (attempts < maxAttempts) {
            // Élément pas encore disponible, réessayer
            setTimeout(() => {
                this.waitForSubjectElement(urlParams, attempts + 1);
            }, 100);
        } else {
            console.log('❌ Élément subject non trouvé après', maxAttempts, 'tentatives');
        }
    }

    showFormationMessage(urlParams) {
        // Fonction supprimée - plus de cartes vertes "Inscription à la formation"
        console.log('✅ Cartes vertes d\'inscription supprimées selon demande utilisateur');
    }

    initializeDynamicFields() {
        // Marquer les champs requis avec un attribut data-required
        const allDynamicFields = document.querySelectorAll('.dynamic-fields');
        allDynamicFields.forEach(field => {
            const inputs = field.querySelectorAll('input[required], select[required], textarea[required]');
            inputs.forEach(input => {
                input.setAttribute('data-required', 'true');
            });
        });

        // Masquer tous les champs dynamiques au chargement
        this.toggleDynamicFields('');
    }

    toggleDynamicFields(subject) {
        // Masquer tous les champs dynamiques
        const allDynamicFields = document.querySelectorAll('.dynamic-fields');
        allDynamicFields.forEach(field => {
            field.style.display = 'none';
            // Désactiver la validation des champs cachés
            const inputs = field.querySelectorAll('input, select, textarea');
            inputs.forEach(input => {
                input.removeAttribute('required');
                input.disabled = true;
            });
        });

        // Afficher les champs appropriés
        if (subject === 'ingenierie') {
            const ingenierieFields = document.getElementById('ingenierie-fields');
            if (ingenierieFields) {
                ingenierieFields.style.display = 'block';
                // Réactiver la validation des champs visibles
                const inputs = ingenierieFields.querySelectorAll('input, select, textarea');
                inputs.forEach(input => {
                    if (input.hasAttribute('data-required')) {
                        input.setAttribute('required', '');
                    }
                    input.disabled = false;
                });
            }
        } else if (subject === 'formation') {
            const formationFields = document.getElementById('formation-fields');
            if (formationFields) {
                formationFields.style.display = 'block';
                // Réactiver la validation des champs visibles
                const inputs = formationFields.querySelectorAll('input, select, textarea');
                inputs.forEach(input => {
                    if (input.hasAttribute('data-required')) {
                        input.setAttribute('required', '');
                    }
                    input.disabled = false;
                });
            }
        } else if (subject === 'logiciel') {
            const logicielFields = document.getElementById('logiciel-fields');
            if (logicielFields) {
                logicielFields.style.display = 'block';
                // Réactiver la validation des champs visibles
                const inputs = logicielFields.querySelectorAll('input, select, textarea');
                inputs.forEach(input => {
                    if (input.hasAttribute('data-required')) {
                        input.setAttribute('required', '');
                    }
                    input.disabled = false;
                });
            }
        }
    }

    // ======================================
    // CORRECTION DU FORMULAIRE D'INSCRIPTION
    // ======================================
    
    fixInscriptionForm() {
        const inscriptionForm = document.getElementById('inscription-form');
        if (!inscriptionForm) return;

        // Supprimer les anciens event listeners
        const newForm = inscriptionForm.cloneNode(true);
        inscriptionForm.parentNode.replaceChild(newForm, inscriptionForm);

        // Ajouter le nouvel event listener
        newForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            await this.handleInscriptionSubmit(e);
        });
    }

    async handleInscriptionSubmit(e) {
        const form = e.target;
        const submitBtn = form.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;

        try {
            // Validation
            if (!this.validateInscriptionForm(form)) {
                return;
            }

            // Afficher le loading
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Envoi en cours...';
            submitBtn.disabled = true;

            // Collecter les données
            const formData = new FormData(form);
            const data = this.collectInscriptionData(formData);

            // Simuler l'envoi
            await this.simulateInscriptionSend(data);

            // Afficher le succès
            this.showInscriptionSuccess(form, data);

        } catch (error) {
            console.error('Erreur inscription:', error);
            this.showInscriptionError(form, error.message);
        } finally {
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
        }
    }

    validateInscriptionForm(form) {
        const requiredFields = ['nom', 'prenom', 'email', 'telephone', 'ville', 'pays', 'motivation'];
        let isValid = true;

        requiredFields.forEach(fieldName => {
            const field = form.querySelector(`[name="${fieldName}"]`);
            if (field && !field.value.trim()) {
                this.highlightError(field);
                isValid = false;
            } else if (field) {
                this.removeErrorHighlight(field);
            }
        });

        // Validation email
        const emailField = form.querySelector('[name="email"]');
        if (emailField && emailField.value && !this.isValidEmail(emailField.value)) {
            this.highlightError(emailField);
            isValid = false;
        }

        return isValid;
    }



    collectInscriptionData(formData) {
        const data = {};
        for (let [key, value] of formData.entries()) {
            data[key] = value;
        }
        
        // Ajouter les paramètres de l'URL
        const urlParams = new URLSearchParams(window.location.search);
        data.formation_name = urlParams.get('name') || 'Formation non spécifiée';
        data.formation_duration = urlParams.get('duration') || 'Durée non spécifiée';
        data.formation_price = urlParams.get('price') || 'Prix non spécifié';
        data.formation_id = urlParams.get('id') || '';
        data.date_inscription = new Date().toISOString();
        
        return data;
    }

    async simulateInscriptionSend(data) {
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        // Sauvegarder dans localStorage
        const inscriptions = JSON.parse(localStorage.getItem('inscriptions') || '[]');
        inscriptions.push({
            id: Date.now(),
            ...data,
            status: 'nouveau'
        });
        localStorage.setItem('inscriptions', JSON.stringify(inscriptions));
        
        console.log('Inscription sauvegardée:', data);
    }

    showInscriptionSuccess(form, data) {
        form.innerHTML = `
            <div class="success-message" style="text-align: center; padding: 2rem;">
                <i class="fas fa-check-circle" style="font-size: 3rem; color: #28a745; margin-bottom: 1rem;"></i>
                <h3 style="color: #28a745; margin-bottom: 1rem;">Inscription envoyée avec succès !</h3>
                <p style="margin-bottom: 2rem;">Nous avons bien reçu votre demande d'inscription. Notre équipe vous contactera dans les plus brefs délais.</p>
                
                <div style="background: #f8f9fa; padding: 1.5rem; border-radius: 8px; text-align: left; margin-top: 1rem;">
                    <h4 style="margin-bottom: 1rem; color: #333;">Détails de l'inscription :</h4>
                    <p><strong>Formation :</strong> ${data.formation_name}</p>
                    <p><strong>Nom :</strong> ${data.prenom} ${data.nom}</p>
                    <p><strong>Email :</strong> ${data.email}</p>
                    <p><strong>Téléphone :</strong> ${data.telephone}</p>
                    <p><strong>Ville :</strong> ${data.ville}, ${data.pays}</p>
                </div>
                
                <button onclick="window.location.href='nos-formations.html'" style="margin-top: 1rem; background: #d10000; color: white; border: none; padding: 0.75rem 1.5rem; border-radius: 5px; cursor: pointer;">
                    Retour aux formations
                </button>
            </div>
        `;
    }

    showInscriptionError(form, message) {
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        errorDiv.style.cssText = `
            background: #f8d7da;
            color: #721c24;
            padding: 1rem;
            border: 1px solid #f5c6cb;
            border-radius: 5px;
            margin-bottom: 1rem;
        `;
        errorDiv.innerHTML = `
            <i class="fas fa-exclamation-triangle"></i>
            <strong>Erreur :</strong> ${message || 'Une erreur est survenue lors de l\'envoi de votre inscription.'}
        `;
        
        form.insertBefore(errorDiv, form.firstChild);
        
        setTimeout(() => {
            errorDiv.remove();
        }, 5000);
    }

    // ======================================
    // CORRECTION DES MODALS DE FORMATION
    // ======================================
    
    fixFormationModals() {
        // Remplacer la fonction globale submitInscription
        window.submitInscription = async (e) => {
            e.preventDefault();
            await this.handleModalInscription(e);
        };
    }

    async handleModalInscription(e) {
        const form = e.target;
        const submitBtn = form.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;

        try {
            // Afficher le loading
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Envoi en cours...';
            submitBtn.disabled = true;

            // Collecter les données
            const formData = new FormData(form);
            const data = {};
            for (let [key, value] of formData.entries()) {
                data[key] = value;
            }

            // Simuler l'envoi
            await new Promise(resolve => setTimeout(resolve, 2000));
            
            // Sauvegarder
            const inscriptions = JSON.parse(localStorage.getItem('inscriptions') || '[]');
            inscriptions.push({
                id: Date.now(),
                ...data,
                status: 'nouveau',
                date_inscription: new Date().toISOString()
            });
            localStorage.setItem('inscriptions', JSON.stringify(inscriptions));

            // Afficher le succès
            form.innerHTML = `
                <div style="text-align: center; padding: 2rem;">
                    <i class="fas fa-check-circle" style="font-size: 3rem; color: #28a745; margin-bottom: 1rem;"></i>
                    <h3 style="color: #28a745; margin-bottom: 1rem;">Demande envoyée !</h3>
                    <p>Nous vous contacterons bientôt pour confirmer votre inscription.</p>
                    <button onclick="closeInscriptionModal()" style="margin-top: 1rem; background: #d10000; color: white; border: none; padding: 0.75rem 1.5rem; border-radius: 5px; cursor: pointer;">
                        Fermer
                    </button>
                </div>
            `;

        } catch (error) {
            console.error('Erreur modal inscription:', error);
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
            
            alert('Erreur lors de l\'envoi de votre demande. Veuillez réessayer.');
        }
    }
}

// Initialisation
document.addEventListener('DOMContentLoaded', () => {
    new FormFix();
});

// Fonction pour fermer le modal d'inscription
function closeInscriptionModal() {
    const modal = document.querySelector('.modal-overlay');
    if (modal) {
        modal.remove();
    }
}
