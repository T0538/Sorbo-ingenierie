/**
 * Configuration Email pour Sorbo-Ingénierie
 * Ce fichier centralise la configuration de tous les formulaires
 */

// Configuration Formspree (recommandé pour commencer)
const EMAIL_CONFIG = {
                    // Remplacez ces URLs par celles de vos formulaires Formspree
                contact: 'https://formspree.io/f/mldwgbbp',
    candidature: 'https://formspree.io/f/VOTRE_FORM_ID_CANDIDATURE', 
    devis: 'https://formspree.io/f/VOTRE_FORM_ID_DEVIS',
    newsletter: 'https://formspree.io/f/xzzadraj',
    
    // Configuration alternative : EmailJS (si vous préférez)
    emailjs: {
        serviceId: 'VOTRE_SERVICE_ID',
        templateId: 'VOTRE_TEMPLATE_ID',
        userId: 'VOTRE_USER_ID'
    },
    
    // Configuration SMTP personnalisée (option avancée)
    smtp: {
        host: 'smtp.gmail.com',
        port: 587,
        secure: false,
        auth: {
            user: 'votre-email@gmail.com',
            pass: 'votre-mot-de-passe-app'
        }
    }
};

// Messages de succès personnalisés
const SUCCESS_MESSAGES = {
    contact: 'Votre message a été envoyé avec succès ! Nous vous répondrons dans les 24h.',
    candidature: 'Votre candidature a été reçue ! Nous l\'étudierons et vous recontacterons rapidement.',
    devis: 'Votre demande de devis a été envoyée ! Nous vous enverrons une proposition détaillée.',
    newsletter: 'Vous êtes maintenant inscrit à notre newsletter !'
};

// Messages d'erreur personnalisés
const ERROR_MESSAGES = {
    contact: 'Erreur lors de l\'envoi. Veuillez réessayer ou nous contacter directement.',
    candidature: 'Erreur lors de l\'envoi de votre candidature. Veuillez réessayer.',
    devis: 'Erreur lors de l\'envoi de votre demande. Veuillez réessayer.',
    newsletter: 'Erreur lors de l\'inscription. Veuillez réessayer.'
};

// Exporter la configuration
window.EMAIL_CONFIG = EMAIL_CONFIG;
window.SUCCESS_MESSAGES = SUCCESS_MESSAGES;
window.ERROR_MESSAGES = ERROR_MESSAGES;
