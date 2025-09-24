// Intégration email Zoho Mail pour Sorbo-Ingénierie
// contact@sorbo-ingenierie.ci

class ZohoEmailIntegration {
    constructor() {
        this.emailAddress = 'contact@sorbo-ingenierie.ci';
        this.apiEndpoint = 'https://sorbo-api-production.up.railway.app/api/zoho-proxy/send';
        
        console.log('📧 Initialisation intégration Zoho Mail via Proxy SMTP...');
        this.init();
    }
    
    init() {
        // Attendre que le DOM soit chargé
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.setupFormHandlers());
        } else {
            this.setupFormHandlers();
        }
    }
    
    setupFormHandlers() {
        console.log('🔧 Configuration des gestionnaires de formulaires...');
        
        // Désactiver le gestionnaire pour le formulaire de contact principal
        // car il est déjà géré par form-fix.js
        const contactForm = document.querySelector('#contact-form');
        if (contactForm) {
            console.log('⚠️ Formulaire de contact détecté - géré par form-fix.js');
            // Ne pas attacher de gestionnaire ici pour éviter les conflits
        }
        
        // Types de formulaires à gérer (sauf contact principal)
        const formTypes = [
            {
                selector: '.inscription-form, .inscription-formation-form',
                type: 'inscription',
                title: 'Nouvelle inscription à une formation'
            },
            {
                selector: '#newsletter-form, .newsletter-form, .footer-newsletter-form',
                type: 'newsletter',
                title: 'Nouvelle inscription newsletter'
            },
            {
                selector: '#rendez-vous-form, .rdv-form',
                type: 'rendez-vous',
                title: 'Nouvelle demande de rendez-vous'
            },
            {
                selector: '#devis-form, .devis-form',
                type: 'devis',
                title: 'Nouvelle demande de devis'
            }
        ];
        
        formTypes.forEach(formType => {
            const forms = document.querySelectorAll(formType.selector);
            forms.forEach(form => {
                console.log(`✅ Formulaire ${formType.type} trouvé:`, form);
                this.attachFormHandler(form, formType);
            });
        });
    }
    
    attachFormHandler(form, formType) {
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            console.log(`📤 Soumission formulaire ${formType.type}...`);
            
            const formData = this.extractFormData(form, formType);
            const success = await this.sendEmail(formData, formType);
            
            if (success) {
                this.showSuccessMessage(form, formType);
            } else {
                this.showErrorMessage(form, formType);
            }
        });
    }
    
    extractFormData(form, formType) {
        const formData = new FormData(form);
        const data = {};
        
        // Extraction des données communes
        for (let [key, value] of formData.entries()) {
            data[key] = value;
        }
        
        // Données spécifiques selon le type
        data.timestamp = new Date().toLocaleString('fr-FR', {
            timeZone: 'Africa/Abidjan',
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit'
        });
        
        data.source = window.location.href;
        data.userAgent = navigator.userAgent;
        data.formType = formType.type;
        
        // Informations supplémentaires selon le type
        switch (formType.type) {
            case 'inscription':
                data.formation = form.querySelector('#formationTitle')?.textContent || 
                               form.querySelector('[name="formation"]')?.value || 
                               'Formation non spécifiée';
                break;
                
            case 'rendez-vous':
                data.datePreferee = form.querySelector('[name="date"]')?.value || 
                                   form.querySelector('[name="date-preferee"]')?.value;
                break;
                
            case 'devis':
                data.typeProjet = form.querySelector('[name="type-projet"]')?.value || 
                                 form.querySelector('[name="service"]')?.value;
                break;
        }
        
        return data;
    }
    
    async sendEmail(formData, formType) {
        try {
            console.log(`📧 Envoi email ${formType.type}...`, formData);
            
            // Construire le contenu de l'email
            const emailContent = this.buildEmailContent(formData, formType);
            
            // Envoyer via l'API backend
            const response = await fetch(this.apiEndpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify({
                    to: this.emailAddress,
                    subject: formType.title,
                    html: emailContent.html,
                    text: emailContent.text,
                    formData: formData,
                    type: formType.type
                })
            });
            
            if (response.ok) {
                const result = await response.json();
                console.log('✅ Email envoyé avec succès:', result);
                
                // Envoyer aussi une copie de confirmation si email fourni
                if (formData.email) {
                    await this.sendConfirmationEmail(formData, formType);
                }
                
                return true;
            } else {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }
            
        } catch (error) {
            console.error('❌ Erreur envoi email:', error);
            
            // Fallback: ouvrir le client email par défaut
            this.openEmailClient(formData, formType);
            
            return false;
        }
    }
    
    buildEmailContent(formData, formType) {
        const date = formData.timestamp;
        const source = formData.source;
        
        let html = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <div style="background: #d10000; color: white; padding: 20px; text-align: center;">
                <h1>Sorbo-Ingénierie</h1>
                <h2>${formType.title}</h2>
            </div>
            
            <div style="padding: 20px; background: #f9f9f9;">
                <p><strong>📅 Date:</strong> ${date}</p>
                <p><strong>🌐 Source:</strong> <a href="${source}">${source}</a></p>
                <p><strong>📋 Type:</strong> ${formType.type}</p>
            </div>
            
            <div style="padding: 20px;">
                <h3>Informations reçues:</h3>
                <table style="width: 100%; border-collapse: collapse;">
        `;
        
        // Ajouter les données du formulaire
        Object.entries(formData).forEach(([key, value]) => {
            if (key !== 'timestamp' && key !== 'source' && key !== 'userAgent' && key !== 'formType' && value) {
                const label = this.getFieldLabel(key);
                html += `
                    <tr style="border-bottom: 1px solid #ddd;">
                        <td style="padding: 10px; font-weight: bold; background: #f5f5f5;">${label}:</td>
                        <td style="padding: 10px;">${value}</td>
                    </tr>
                `;
            }
        });
        
        html += `
                </table>
            </div>
            
            <div style="padding: 20px; background: #f0f0f0; text-align: center;">
                <p style="margin: 0; color: #666;">
                    <strong>Sorbo-Ingénierie</strong><br>
                    Excellence et Innovation en Génie civil<br>
                    🌐 <a href="https://sorbo-ingenierie.ci">sorbo-ingenierie.ci</a> | 
                    📧 <a href="mailto:contact@sorbo-ingenierie.ci">contact@sorbo-ingenierie.ci</a>
                </p>
            </div>
        </div>
        `;
        
        // Version texte
        let text = `${formType.title}\n\n`;
        text += `Date: ${date}\n`;
        text += `Source: ${source}\n`;
        text += `Type: ${formType.type}\n\n`;
        text += `Informations reçues:\n`;
        text += `${'='.repeat(30)}\n`;
        
        Object.entries(formData).forEach(([key, value]) => {
            if (key !== 'timestamp' && key !== 'source' && key !== 'userAgent' && key !== 'formType' && value) {
                const label = this.getFieldLabel(key);
                text += `${label}: ${value}\n`;
            }
        });
        
        text += `\n--\nSorbo-Ingénierie\ncontact@sorbo-ingenierie.ci\nhttps://sorbo-ingenierie.ci`;
        
        return { html, text };
    }
    
    getFieldLabel(key) {
        const labels = {
            'name': 'Nom',
            'nom': 'Nom',
            'prenom': 'Prénom',
            'email': 'Email',
            'telephone': 'Téléphone',
            'phone': 'Téléphone',
            'message': 'Message',
            'subject': 'Sujet',
            'sujet': 'Sujet',
            'formation': 'Formation',
            'date': 'Date',
            'datePreferee': 'Date préférée',
            'typeProjet': 'Type de projet',
            'entreprise': 'Entreprise',
            'poste': 'Poste',
            'ville': 'Ville',
            'pays': 'Pays'
        };
        
        return labels[key] || key.charAt(0).toUpperCase() + key.slice(1);
    }
    
    async sendConfirmationEmail(formData, formType) {
        try {
            const confirmationContent = this.buildConfirmationContent(formData, formType);
            
            await fetch(this.apiEndpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    to: formData.email,
                    subject: `Confirmation de votre ${formType.type} - Sorbo-Ingénierie`,
                    html: confirmationContent.html,
                    text: confirmationContent.text,
                    type: 'confirmation'
                })
            });
            
            console.log('✅ Email de confirmation envoyé');
            
        } catch (error) {
            console.log('⚠️ Erreur envoi confirmation:', error.message);
        }
    }
    
    buildConfirmationContent(formData, formType) {
        const html = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <div style="background: #d10000; color: white; padding: 20px; text-align: center;">
                <h1>Sorbo-Ingénierie</h1>
                <h2>Confirmation de réception</h2>
            </div>
            
            <div style="padding: 20px;">
                <p>Bonjour ${formData.nom || formData.name || ''},</p>
                
                <p>Nous avons bien reçu votre ${formType.type} et vous remercions de votre intérêt pour Sorbo-Ingénierie.</p>
                
                <p><strong>Notre équipe vous recontactera dans les plus brefs délais.</strong></p>
                
                ${formType.type === 'inscription' ? `
                <div style="background: #f0f8ff; padding: 15px; border-left: 4px solid #d10000; margin: 20px 0;">
                    <h3>Votre inscription</h3>
                    <p><strong>Formation:</strong> ${formData.formation}</p>
                    <p>Vous recevrez prochainement toutes les informations détaillées concernant cette formation.</p>
                </div>
                ` : ''}
                
                <p>En attendant, n'hésitez pas à visiter notre site web pour découvrir nos autres services :</p>
                <ul>
                    <li>🎓 <a href="https://sorbo-ingenierie.ci/nos-formations.html">Nos formations</a></li>
                    <li>💻 <a href="https://sorbo-ingenierie.ci/nos-logiciels.html">Nos logiciels</a></li>
                    <li>🏗️ <a href="https://sorbo-ingenierie.ci/nos-projets.html">Nos projets</a></li>
                </ul>
            </div>
            
            <div style="padding: 20px; background: #f0f0f0; text-align: center;">
                <p style="margin: 0; color: #666;">
                    <strong>Sorbo-Ingénierie</strong><br>
                    Excellence et Innovation en Génie civil<br>
                    🌐 <a href="https://sorbo-ingenierie.ci">sorbo-ingenierie.ci</a> | 
                    📧 <a href="mailto:contact@sorbo-ingenierie.ci">contact@sorbo-ingenierie.ci</a>
                </p>
            </div>
        </div>
        `;
        
        const text = `Confirmation de réception - Sorbo-Ingénierie\n\nBonjour ${formData.nom || formData.name || ''},\n\nNous avons bien reçu votre ${formType.type} et vous remercions de votre intérêt pour Sorbo-Ingénierie.\n\nNotre équipe vous recontactera dans les plus brefs délais.\n\n--\nSorbo-Ingénierie\ncontact@sorbo-ingenierie.ci\nhttps://sorbo-ingenierie.ci`;
        
        return { html, text };
    }
    
    openEmailClient(formData, formType) {
        console.log('📧 Ouverture du client email par défaut...');
        
        const subject = encodeURIComponent(formType.title);
        const body = encodeURIComponent(this.buildEmailContent(formData, formType).text);
        
        const mailtoLink = `mailto:${this.emailAddress}?subject=${subject}&body=${body}`;
        window.open(mailtoLink);
    }
    
    showSuccessMessage(form, formType) {
        // Créer un message de succès
        const successDiv = document.createElement('div');
        successDiv.className = 'form-success-message';
        successDiv.style.cssText = `
            background: #d4edda;
            border: 1px solid #c3e6cb;
            color: #155724;
            padding: 15px;
            border-radius: 8px;
            margin: 10px 0;
            text-align: center;
        `;
        
        successDiv.innerHTML = `
            <i class="fas fa-check-circle"></i>
            <strong>Message envoyé avec succès !</strong><br>
            Nous vous recontacterons dans les plus brefs délais.
        `;
        
        // Insérer le message
        form.parentNode.insertBefore(successDiv, form.nextSibling);
        
        // Réinitialiser le formulaire
        form.reset();
        
        // Supprimer le message après 5 secondes
        setTimeout(() => {
            if (successDiv.parentNode) {
                successDiv.remove();
            }
        }, 5000);
    }
    
    showErrorMessage(form, formType) {
        const errorDiv = document.createElement('div');
        errorDiv.className = 'form-error-message';
        errorDiv.style.cssText = `
            background: #f8d7da;
            border: 1px solid #f5c6cb;
            color: #721c24;
            padding: 15px;
            border-radius: 8px;
            margin: 10px 0;
            text-align: center;
        `;
        
        errorDiv.innerHTML = `
            <i class="fas fa-exclamation-triangle"></i>
            <strong>Erreur d'envoi</strong><br>
            Votre client email par défaut va s'ouvrir. Vous pouvez aussi nous contacter directement à 
            <a href="mailto:contact@sorbo-ingenierie.ci">contact@sorbo-ingenierie.ci</a>
        `;
        
        form.parentNode.insertBefore(errorDiv, form.nextSibling);
        
        setTimeout(() => {
            if (errorDiv.parentNode) {
                errorDiv.remove();
            }
        }, 8000);
    }
    
    setupGlobalFormHandler() {
        // Gestionnaire pour les formulaires non spécifiques
        document.addEventListener('submit', (e) => {
            const form = e.target;
            if (form.tagName === 'FORM' && !form.hasAttribute('data-zoho-handled')) {
                // Marquer comme géré pour éviter les doublons
                form.setAttribute('data-zoho-handled', 'true');
                
                console.log('📝 Formulaire générique détecté:', form);
                
                // Déterminer le type basé sur les champs ou classes
                const formType = this.detectFormType(form);
                this.attachFormHandler(form, formType);
            }
        });
    }
    
    detectFormType(form) {
        const classes = form.className.toLowerCase();
        const action = form.action.toLowerCase();
        
        if (classes.includes('inscription') || action.includes('inscription')) {
            return { type: 'inscription', title: 'Nouvelle inscription' };
        } else if (classes.includes('contact') || action.includes('contact')) {
            return { type: 'contact', title: 'Nouveau message de contact' };
        } else if (classes.includes('newsletter')) {
            return { type: 'newsletter', title: 'Nouvelle inscription newsletter' };
        } else if (classes.includes('devis')) {
            return { type: 'devis', title: 'Nouvelle demande de devis' };
        } else {
            return { type: 'general', title: 'Nouveau message depuis le site web' };
        }
    }
}

// Initialisation automatique
document.addEventListener('DOMContentLoaded', () => {
    window.zohoEmailIntegration = new ZohoEmailIntegration();
});

// Export pour utilisation externe
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ZohoEmailIntegration;
}
