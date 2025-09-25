// Configuration des formulaires Sorbo-Ingénierie
// Utilise Formspree pour l'envoi d'emails

// Configuration Zoho Mail pour l'envoi de formulaires
window.EMAIL_CONFIG = {
    // Configuration Zoho Mail
    zoho: {
        endpoint: 'https://mail.zoho.com/api/accounts/accountkey/messages',
        email: 'contact@sorbo-ingenierie.ci', // Votre email Zoho Mail
        apiKey: '28b71574bcad5fe5339cb5f836c4d3a8183a697102' // À remplacer par votre clé API Zoho
    },
    // Fallback vers mailto si Zoho n'est pas disponible
    contact: 'mailto:contact@sorbo-ingenierie.ci',
    candidature: 'mailto:contact@sorbo-ingenierie.ci',
    devis: 'mailto:contact@sorbo-ingenierie.ci',
    newsletter: 'mailto:contact@sorbo-ingenierie.ci'
};

// Messages de succès
window.SUCCESS_MESSAGES = {
    contact: '✅ Votre message a été envoyé avec succès ! Nous vous répondrons dans les plus brefs délais.',
    formation: '✅ Votre inscription à la formation a été envoyée avec succès ! Nous vous contacterons bientôt.',
    candidature: '✅ Votre candidature a été envoyée avec succès ! Nous examinerons votre profil.',
    devis: '✅ Votre demande de devis a été envoyée avec succès ! Nous vous répondrons rapidement.',
    newsletter: '✅ Vous êtes maintenant inscrit à notre newsletter !'
};

// Messages d'erreur
window.ERROR_MESSAGES = {
    contact: '❌ Une erreur est survenue lors de l\'envoi de votre message. Veuillez réessayer.',
    formation: '❌ Une erreur est survenue lors de l\'envoi de votre inscription. Veuillez réessayer.',
    candidature: '❌ Une erreur est survenue lors de l\'envoi de votre candidature. Veuillez réessayer.',
    devis: '❌ Une erreur est survenue lors de l\'envoi de votre demande. Veuillez réessayer.',
    newsletter: '❌ Une erreur est survenue lors de l\'inscription. Veuillez réessayer.'
};

// Configuration des champs requis par type de formulaire
window.REQUIRED_FIELDS = {
    contact: ['name', 'email', 'subject', 'message'],
    formation: ['formation-nom', 'formation-prenom', 'formation-email', 'formation-telephone'],
    candidature: ['nom', 'prenom', 'email', 'telephone', 'poste'],
    devis: ['name', 'email', 'project-type', 'project-description']
};

// Fonction utilitaire pour valider les emails
window.isValidEmail = function(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};

// Fonction utilitaire pour envoyer vers Formspree
window.sendToFormspree = async function(endpoint, data) {
    const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
    });
    
    if (!response.ok) {
        throw new Error(`Erreur HTTP: ${response.status}`);
    }
    
    return response;
};

console.log('📧 Configuration des formulaires chargée');