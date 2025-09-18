/**
 * Système de double opt-in conforme RGPD pour les newsletters
 * Gère l'envoi d'emails de confirmation et la validation des abonnements
 */

class NewsletterDoubleOptIn {
    constructor() {
        this.emailService = null;
        this.templates = {
            confirmation: this.getConfirmationEmailTemplate(),
            welcome: this.getWelcomeEmailTemplate(),
            unsubscribe: this.getUnsubscribeEmailTemplate()
        };
        this.baseUrl = window.location.origin;
        this.confirmationRoute = '/confirm-newsletter';
        this.unsubscribeRoute = '/unsubscribe-newsletter';
        this.init();
    }

    // Initialisation
    init() {
        this.setupConfirmationHandler();
        this.setupUnsubscribeHandler();
        console.log('📧 Double Opt-in système initialisé');
    }

    // Configurer le service d'email (EmailJS)
    configureEmailService(serviceConfig) {
        this.emailService = serviceConfig;
        
        // Initialiser EmailJS si pas déjà fait
        if (typeof emailjs !== 'undefined' && this.emailService) {
            emailjs.init(this.emailService.publicKey);
        }
    }

    // Envoyer l'email de confirmation
    async sendConfirmationEmail(subscriberData) {
        if (!this.emailService) {
            console.warn('Service d\'email non configuré');
            return { success: false, error: 'Service d\'email non configuré' };
        }

        const confirmationLink = this.generateConfirmationLink(subscriberData.doubleOptInToken);
        const unsubscribeLink = this.generateUnsubscribeLink(subscriberData.email);

        const emailData = {
            to_email: subscriberData.email,
            to_name: subscriberData.firstName || 'Cher(e) abonné(e)',
            confirmation_link: confirmationLink,
            unsubscribe_link: unsubscribeLink,
            categories: subscriberData.categoryNames ? subscriberData.categoryNames.join(', ') : 'Toutes les actualités',
            company_name: 'Sorbo-Ingénierie',
            website_url: this.baseUrl,
            current_year: new Date().getFullYear()
        };

        try {
            const response = await emailjs.send(
                this.emailService.serviceId,
                this.emailService.templateIds.confirmation,
                emailData
            );

            console.log('✅ Email de confirmation envoyé:', response);
            return { success: true, response };

        } catch (error) {
            console.error('❌ Erreur envoi email confirmation:', error);
            return { success: false, error: error.message };
        }
    }

    // Envoyer l'email de bienvenue
    async sendWelcomeEmail(subscriberData) {
        if (!this.emailService) return { success: false, error: 'Service non configuré' };

        const unsubscribeLink = this.generateUnsubscribeLink(subscriberData.email);

        const emailData = {
            to_email: subscriberData.email,
            to_name: subscriberData.firstName || 'Cher(e) abonné(e)',
            categories: subscriberData.categoryNames ? subscriberData.categoryNames.join(', ') : 'Toutes les actualités',
            unsubscribe_link: unsubscribeLink,
            company_name: 'Sorbo-Ingénierie',
            website_url: this.baseUrl,
            current_year: new Date().getFullYear()
        };

        try {
            const response = await emailjs.send(
                this.emailService.serviceId,
                this.emailService.templateIds.welcome,
                emailData
            );

            console.log('✅ Email de bienvenue envoyé:', response);
            return { success: true, response };

        } catch (error) {
            console.error('❌ Erreur envoi email bienvenue:', error);
            return { success: false, error: error.message };
        }
    }

    // Générer le lien de confirmation
    generateConfirmationLink(token) {
        return `${this.baseUrl}${this.confirmationRoute}?token=${token}`;
    }

    // Générer le lien de désinscription
    generateUnsubscribeLink(email) {
        const encodedEmail = encodeURIComponent(email);
        return `${this.baseUrl}${this.unsubscribeRoute}?email=${encodedEmail}`;
    }

    // Gérer la confirmation d'abonnement
    setupConfirmationHandler() {
        // Vérifier si on est sur la page de confirmation
        const urlParams = new URLSearchParams(window.location.search);
        const token = urlParams.get('token');
        
        if (token && window.location.pathname.includes('confirm')) {
            this.handleConfirmation(token);
        }
    }

    // Traiter la confirmation
    async handleConfirmation(token) {
        try {
            // Récupérer la base de données
            const db = window.newsletterDB || new NewsletterDatabase();
            
            // Confirmer l'abonné
            const subscriber = await db.confirmSubscriber(token);
            
            // Envoyer l'email de bienvenue
            await this.sendWelcomeEmail(subscriber);
            
            // Afficher le message de succès
            this.showConfirmationSuccess(subscriber);
            
        } catch (error) {
            console.error('Erreur confirmation:', error);
            this.showConfirmationError(error.message);
        }
    }

    // Gérer la désinscription
    setupUnsubscribeHandler() {
        const urlParams = new URLSearchParams(window.location.search);
        const email = urlParams.get('email');
        
        if (email && window.location.pathname.includes('unsubscribe')) {
            this.showUnsubscribeForm(email);
        }
    }

    // Afficher le formulaire de désinscription
    showUnsubscribeForm(email) {
        const container = document.body;
        
        const unsubscribeHTML = `
            <div class="unsubscribe-container" style="
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0,0,0,0.8);
                display: flex;
                align-items: center;
                justify-content: center;
                z-index: 10000;
            ">
                <div class="unsubscribe-modal" style="
                    background: white;
                    padding: 40px;
                    border-radius: 12px;
                    max-width: 500px;
                    width: 90%;
                    text-align: center;
                    box-shadow: 0 20px 40px rgba(0,0,0,0.3);
                ">
                    <div class="unsubscribe-icon" style="
                        font-size: 48px;
                        color: #e74c3c;
                        margin-bottom: 20px;
                    ">
                        <i class="fas fa-envelope-open-text"></i>
                    </div>
                    <h2 style="color: #2c3e50; margin-bottom: 20px;">
                        Désinscription de la newsletter
                    </h2>
                    <p style="color: #6c757d; margin-bottom: 30px; line-height: 1.6;">
                        Nous sommes désolés de vous voir partir !<br>
                        Confirmez-vous vouloir vous désabonner de notre newsletter ?
                    </p>
                    <div class="unsubscribe-email" style="
                        background: #f8f9fa;
                        padding: 15px;
                        border-radius: 8px;
                        margin-bottom: 30px;
                        font-weight: 500;
                        color: #495057;
                    ">
                        ${email}
                    </div>
                    <div class="unsubscribe-actions" style="
                        display: flex;
                        gap: 15px;
                        justify-content: center;
                    ">
                        <button id="confirmUnsubscribe" style="
                            background: #e74c3c;
                            color: white;
                            border: none;
                            padding: 12px 30px;
                            border-radius: 6px;
                            cursor: pointer;
                            font-weight: 500;
                        ">
                            Oui, me désabonner
                        </button>
                        <button id="cancelUnsubscribe" style="
                            background: #6c757d;
                            color: white;
                            border: none;
                            padding: 12px 30px;
                            border-radius: 6px;
                            cursor: pointer;
                            font-weight: 500;
                        ">
                            Annuler
                        </button>
                    </div>
                </div>
            </div>
        `;
        
        container.insertAdjacentHTML('beforeend', unsubscribeHTML);
        
        // Gestionnaires d'événements
        document.getElementById('confirmUnsubscribe').addEventListener('click', () => {
            this.processUnsubscribe(email);
        });
        
        document.getElementById('cancelUnsubscribe').addEventListener('click', () => {
            document.querySelector('.unsubscribe-container').remove();
            window.location.href = this.baseUrl;
        });
    }

    // Traiter la désinscription
    async processUnsubscribe(email) {
        try {
            const db = window.newsletterDB || new NewsletterDatabase();
            await db.unsubscribeUser(email, 'user_request');
            
            this.showUnsubscribeSuccess();
            
        } catch (error) {
            console.error('Erreur désinscription:', error);
            this.showUnsubscribeError(error.message);
        }
    }

    // Afficher le succès de confirmation
    showConfirmationSuccess(subscriber) {
        document.body.innerHTML = `
            <div style="
                font-family: Arial, sans-serif;
                max-width: 600px;
                margin: 50px auto;
                padding: 40px;
                text-align: center;
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                color: white;
                border-radius: 12px;
            ">
                <div style="font-size: 72px; margin-bottom: 30px;">
                    <i class="fas fa-check-circle"></i>
                </div>
                <h1 style="margin-bottom: 20px;">Abonnement confirmé !</h1>
                <p style="font-size: 18px; margin-bottom: 30px; opacity: 0.9;">
                    Merci ${subscriber.email}, votre abonnement à notre newsletter a été confirmé avec succès.
                </p>
                <div style="
                    background: rgba(255,255,255,0.1);
                    padding: 20px;
                    border-radius: 8px;
                    margin-bottom: 30px;
                ">
                    <p style="margin: 0; font-weight: 500;">
                        Catégories sélectionnées :
                    </p>
                    <p style="margin: 10px 0 0 0;">
                        ${subscriber.categoryNames ? subscriber.categoryNames.join(', ') : 'Toutes les actualités'}
                    </p>
                </div>
                <a href="${this.baseUrl}" style="
                    display: inline-block;
                    background: white;
                    color: #667eea;
                    padding: 15px 30px;
                    text-decoration: none;
                    border-radius: 6px;
                    font-weight: 500;
                    transition: transform 0.2s;
                " onmouseover="this.style.transform='scale(1.05)'" onmouseout="this.style.transform='scale(1)'">
                    Retour au site
                </a>
            </div>
        `;
    }

    // Afficher l'erreur de confirmation
    showConfirmationError(message) {
        document.body.innerHTML = `
            <div style="
                font-family: Arial, sans-serif;
                max-width: 600px;
                margin: 50px auto;
                padding: 40px;
                text-align: center;
                background: #e74c3c;
                color: white;
                border-radius: 12px;
            ">
                <div style="font-size: 72px; margin-bottom: 30px;">
                    <i class="fas fa-exclamation-triangle"></i>
                </div>
                <h1 style="margin-bottom: 20px;">Erreur de confirmation</h1>
                <p style="font-size: 18px; margin-bottom: 30px;">
                    ${message}
                </p>
                <a href="${this.baseUrl}" style="
                    display: inline-block;
                    background: white;
                    color: #e74c3c;
                    padding: 15px 30px;
                    text-decoration: none;
                    border-radius: 6px;
                    font-weight: 500;
                ">
                    Retour au site
                </a>
            </div>
        `;
    }

    // Afficher le succès de désinscription
    showUnsubscribeSuccess() {
        document.querySelector('.unsubscribe-modal').innerHTML = `
            <div class="success-icon" style="
                font-size: 48px;
                color: #27ae60;
                margin-bottom: 20px;
            ">
                <i class="fas fa-check-circle"></i>
            </div>
            <h2 style="color: #2c3e50; margin-bottom: 20px;">
                Désinscription réussie
            </h2>
            <p style="color: #6c757d; margin-bottom: 30px; line-height: 1.6;">
                Vous avez été désabonné(e) avec succès de notre newsletter.<br>
                Nous espérons vous revoir bientôt !
            </p>
            <button onclick="window.location.href='${this.baseUrl}'" style="
                background: #27ae60;
                color: white;
                border: none;
                padding: 12px 30px;
                border-radius: 6px;
                cursor: pointer;
                font-weight: 500;
            ">
                Retour au site
            </button>
        `;
    }

    // Afficher l'erreur de désinscription
    showUnsubscribeError(message) {
        document.querySelector('.unsubscribe-modal').innerHTML = `
            <div class="error-icon" style="
                font-size: 48px;
                color: #e74c3c;
                margin-bottom: 20px;
            ">
                <i class="fas fa-exclamation-triangle"></i>
            </div>
            <h2 style="color: #2c3e50; margin-bottom: 20px;">
                Erreur de désinscription
            </h2>
            <p style="color: #6c757d; margin-bottom: 30px;">
                ${message}
            </p>
            <button onclick="window.location.href='${this.baseUrl}'" style="
                background: #6c757d;
                color: white;
                border: none;
                padding: 12px 30px;
                border-radius: 6px;
                cursor: pointer;
                font-weight: 500;
            ">
                Retour au site
            </button>
        `;
    }

    // Template d'email de confirmation
    getConfirmationEmailTemplate() {
        return `
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="utf-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Confirmez votre abonnement</title>
            </head>
            <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f4f4f4;">
                <div style="max-width: 600px; margin: 0 auto; background-color: white;">
                    <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px; text-align: center; color: white;">
                        <h1 style="margin: 0; font-size: 28px;">Confirmez votre abonnement</h1>
                        <p style="margin: 15px 0 0 0; font-size: 16px; opacity: 0.9;">
                            {{company_name}}
                        </p>
                    </div>
                    
                    <div style="padding: 40px;">
                        <p style="font-size: 16px; line-height: 1.6; color: #333;">
                            Bonjour {{to_name}},
                        </p>
                        
                        <p style="font-size: 16px; line-height: 1.6; color: #333;">
                            Merci de votre intérêt pour notre newsletter ! Pour finaliser votre abonnement, 
                            veuillez cliquer sur le bouton ci-dessous :
                        </p>
                        
                        <div style="text-align: center; margin: 40px 0;">
                            <a href="{{confirmation_link}}" style="
                                display: inline-block;
                                background: #667eea;
                                color: white;
                                padding: 15px 30px;
                                text-decoration: none;
                                border-radius: 6px;
                                font-weight: 500;
                                font-size: 16px;
                            ">
                                Confirmer mon abonnement
                            </a>
                        </div>
                        
                        <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 30px 0;">
                            <h3 style="margin: 0 0 10px 0; color: #2c3e50;">Vos préférences :</h3>
                            <p style="margin: 0; color: #6c757d;">{{categories}}</p>
                        </div>
                        
                        <p style="font-size: 14px; color: #6c757d; line-height: 1.6;">
                            Si vous n'avez pas demandé cette inscription, vous pouvez ignorer cet email.
                            Le lien de confirmation expirera dans 48 heures.
                        </p>
                    </div>
                    
                    <div style="background: #f8f9fa; padding: 20px; text-align: center; border-top: 1px solid #e9ecef;">
                        <p style="margin: 0; font-size: 14px; color: #6c757d;">
                            © {{current_year}} {{company_name}}. Tous droits réservés.
                        </p>
                        <p style="margin: 10px 0 0 0; font-size: 12px;">
                            <a href="{{unsubscribe_link}}" style="color: #6c757d;">Se désabonner</a>
                        </p>
                    </div>
                </div>
            </body>
            </html>
        `;
    }

    // Template d'email de bienvenue
    getWelcomeEmailTemplate() {
        return `
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="utf-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Bienvenue dans notre newsletter</title>
            </head>
            <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f4f4f4;">
                <div style="max-width: 600px; margin: 0 auto; background-color: white;">
                    <div style="background: linear-gradient(135deg, #27ae60 0%, #2ecc71 100%); padding: 40px; text-align: center; color: white;">
                        <h1 style="margin: 0; font-size: 28px;">Bienvenue !</h1>
                        <p style="margin: 15px 0 0 0; font-size: 16px; opacity: 0.9;">
                            Votre abonnement est maintenant actif
                        </p>
                    </div>
                    
                    <div style="padding: 40px;">
                        <p style="font-size: 16px; line-height: 1.6; color: #333;">
                            Bonjour {{to_name}},
                        </p>
                        
                        <p style="font-size: 16px; line-height: 1.6; color: #333;">
                            Félicitations ! Votre abonnement à notre newsletter {{company_name}} a été confirmé avec succès.
                            Vous recevrez désormais nos dernières actualités directement dans votre boîte email.
                        </p>
                        
                        <div style="background: #e8f5e8; padding: 20px; border-radius: 8px; margin: 30px 0;">
                            <h3 style="margin: 0 0 10px 0; color: #27ae60;">Vos abonnements :</h3>
                            <p style="margin: 0; color: #2c3e50; font-weight: 500;">{{categories}}</p>
                        </div>
                        
                        <div style="text-align: center; margin: 40px 0;">
                            <a href="{{website_url}}" style="
                                display: inline-block;
                                background: #27ae60;
                                color: white;
                                padding: 15px 30px;
                                text-decoration: none;
                                border-radius: 6px;
                                font-weight: 500;
                                font-size: 16px;
                            ">
                                Découvrir notre site
                            </a>
                        </div>
                        
                        <p style="font-size: 14px; color: #6c757d; line-height: 1.6;">
                            Vous pouvez modifier vos préférences ou vous désabonner à tout moment 
                            en utilisant les liens présents dans nos emails.
                        </p>
                    </div>
                    
                    <div style="background: #f8f9fa; padding: 20px; text-align: center; border-top: 1px solid #e9ecef;">
                        <p style="margin: 0; font-size: 14px; color: #6c757d;">
                            © {{current_year}} {{company_name}}. Tous droits réservés.
                        </p>
                        <p style="margin: 10px 0 0 0; font-size: 12px;">
                            <a href="{{unsubscribe_link}}" style="color: #6c757d;">Se désabonner</a>
                        </p>
                    </div>
                </div>
            </body>
            </html>
        `;
    }

    // Template d'email de désinscription
    getUnsubscribeEmailTemplate() {
        return `<!-- Template de confirmation de désinscription -->`;
    }
}

// Exporter la classe
window.NewsletterDoubleOptIn = NewsletterDoubleOptIn;
