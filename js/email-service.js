// Service d'envoi d'emails direct avec EmailJS
// IMPORTANT: Remplacez ces valeurs par vos vraies clés EmailJS

const EMAIL_SERVICE_CONFIG = {
    // Vos clés EmailJS (à récupérer sur https://www.emailjs.com/)
    SERVICE_ID: 'service_o79gdtr', // Ex: 'service_abc123'
    TEMPLATE_ID_CONTACT: 'YOUR_CONTACT_TEMPLATE_ID', // Ex: 'template_contact_xyz'
    TEMPLATE_ID_NEWSLETTER: 'YOUR_NEWSLETTER_TEMPLATE_ID', // Ex: 'template_newsletter_xyz'
    PUBLIC_KEY: 'YOUR_PUBLIC_KEY', // Ex: 'user_abc123xyz'
    
    // Configuration des destinataires
    RECIPIENTS: {
        CONTACT: 'contact@sorbo-ingenierie.ci',
        NEWSLETTER: 'newsletter@sorbo-ingenierie.ci'
    }
};

// Service d'envoi d'emails
class EmailService {
    constructor() {
        this.initialized = false;
        this.init();
    }

    // Initialisation d'EmailJS
    async init() {
        try {
            // Charger EmailJS depuis le CDN
            await this.loadEmailJS();
            
            // Initialiser EmailJS avec votre clé publique
            emailjs.init(EMAIL_SERVICE_CONFIG.PUBLIC_KEY);
            this.initialized = true;
            console.log('✅ EmailJS initialisé');
        } catch (error) {
            console.error('❌ Erreur initialisation EmailJS:', error);
        }
    }

    // Charger la librairie EmailJS
    loadEmailJS() {
        return new Promise((resolve, reject) => {
            if (window.emailjs) {
                resolve();
                return;
            }

            const script = document.createElement('script');
            script.src = 'https://cdn.jsdelivr.net/npm/@emailjs/browser@3/dist/email.min.js';
            script.onload = resolve;
            script.onerror = reject;
            document.head.appendChild(script);
        });
    }

    // Envoi d'email de contact
    async sendContactEmail(data) {
        if (!this.initialized) {
            throw new Error('EmailJS non initialisé');
        }

        const templateParams = {
            to_email: EMAIL_SERVICE_CONFIG.RECIPIENTS.CONTACT,
            from_name: data.nom || data.name,
            from_email: data.email,
            phone: data.telephone || data.phone,
            subject_type: this.getSubjectText(data.sujet || data.subject),
            message: data.message,
            page: window.location.pathname,
            date: new Date().toLocaleString('fr-FR'),
            
            // Informations formations si présentes
            formation_nom: data['formation-nom'] || '',
            formation_prenom: data['formation-prenom'] || '',
            formation_email: data['formation-email'] || '',
            formation_telephone: data['formation-telephone'] || '',
            formation_nationalite: data['formation-nationalite'] || '',
            formation_cni: data['formation-cni'] || '',
            formation_adresse: data['formation-adresse'] || '',
            formation_fonction: data['formation-fonction'] || '',
            formation_secteur: data['formation-secteur'] || '',
            formation_niveau: data['formation-niveau'] || '',
            formation_prise_charge: data['formation-prise-charge'] || '',
            formation_paiement: data['formation-paiement'] || ''
        };

        return await this.sendEmail(EMAIL_SERVICE_CONFIG.TEMPLATE_ID_CONTACT, templateParams);
    }

    // Envoi d'email de newsletter
    async sendNewsletterEmail(data) {
        if (!this.initialized) {
            throw new Error('EmailJS non initialisé');
        }

        const templateParams = {
            to_email: EMAIL_SERVICE_CONFIG.RECIPIENTS.NEWSLETTER,
            subscriber_email: data.email,
            page: data.page || window.location.pathname,
            date: new Date().toLocaleString('fr-FR')
        };

        return await this.sendEmail(EMAIL_SERVICE_CONFIG.TEMPLATE_ID_NEWSLETTER, templateParams);
    }

    // Fonction générique d'envoi d'email
    async sendEmail(templateId, templateParams) {
        try {
            console.log('📧 Envoi email direct...', templateParams);
            
            const response = await emailjs.send(
                EMAIL_SERVICE_CONFIG.SERVICE_ID,
                templateId,
                templateParams
            );
            
            console.log('✅ Email envoyé avec succès:', response);
            return { success: true, response };
            
        } catch (error) {
            console.error('❌ Erreur envoi email:', error);
            return { success: false, error };
        }
    }

    // Obtenir le texte du sujet
    getSubjectText(value) {
        const subjects = {
            'rendezvous': 'Demande de rendez-vous',
            'ingenierie': 'Projet d\'ingénierie',
            'formation': 'Inscription à une formation',
            'logiciel': 'Logiciels',
            'carriere': 'Carrières',
            'autre': 'Autre'
        };
        return subjects[value] || value || 'Non spécifié';
    }
}

// Initialiser le service d'email
const emailService = new EmailService();

// Exposer globalement
window.emailService = emailService;
window.EMAIL_SERVICE_CONFIG = EMAIL_SERVICE_CONFIG;