/**
 * Système de validation avancé pour les newsletters
 * Inclut validation email, protection anti-spam et reCAPTCHA
 */

class NewsletterValidator {
    constructor() {
        this.emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
        this.disposableEmailDomains = [
            '10minutemail.com', 'guerrillamail.com', 'mailinator.com', 'tempmail.org',
            'temp-mail.org', 'throwaway.email', 'yopmail.com', 'maildrop.cc'
        ];
        this.minDelay = 3000; // Délai minimum entre soumissions (3 secondes)
        this.lastSubmission = 0;
        this.initReCaptcha();
    }

    // Initialisation de reCAPTCHA v3
    initReCaptcha() {
        // Clé publique reCAPTCHA v3 (à remplacer par votre clé)
        this.recaptchaSiteKey = '6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI'; // Clé de test
        
        // Charger le script reCAPTCHA
        if (!document.querySelector('script[src*="recaptcha"]')) {
            const script = document.createElement('script');
            script.src = `https://www.google.com/recaptcha/api.js?render=${this.recaptchaSiteKey}`;
            script.async = true;
            document.head.appendChild(script);
        }
    }

    // Validation complète de l'email
    validateEmail(email) {
        const errors = [];

        // Vérification du format
        if (!this.emailRegex.test(email)) {
            errors.push('Format d\'email invalide');
        }

        // Vérification de la longueur
        if (email.length > 254) {
            errors.push('Email trop long (max 254 caractères)');
        }

        // Vérification des domaines jetables
        const domain = email.split('@')[1]?.toLowerCase();
        if (domain && this.disposableEmailDomains.includes(domain)) {
            errors.push('Les emails temporaires ne sont pas autorisés');
        }

        // Vérification des caractères consécutifs
        if (email.includes('..')) {
            errors.push('L\'email ne peut pas contenir de points consécutifs');
        }

        return {
            isValid: errors.length === 0,
            errors: errors
        };
    }

    // Protection anti-spam (rate limiting)
    checkRateLimit() {
        const now = Date.now();
        if (now - this.lastSubmission < this.minDelay) {
            return {
                isValid: false,
                error: `Veuillez attendre ${Math.ceil((this.minDelay - (now - this.lastSubmission)) / 1000)} secondes avant de soumettre à nouveau`
            };
        }
        return { isValid: true };
    }

    // Vérification reCAPTCHA
    async verifyRecaptcha() {
        return new Promise((resolve) => {
            if (typeof grecaptcha === 'undefined') {
                // Si reCAPTCHA n'est pas chargé, on continue sans (mode dégradé)
                resolve({ isValid: true, score: 0.5 });
                return;
            }

            grecaptcha.ready(() => {
                grecaptcha.execute(this.recaptchaSiteKey, { action: 'newsletter_signup' })
                    .then((token) => {
                        // Ici, vous devriez vérifier le token côté serveur
                        // Pour la démo, on simule une validation
                        resolve({ 
                            isValid: true, 
                            token: token,
                            score: Math.random() > 0.1 ? 0.9 : 0.1 // Simulation
                        });
                    })
                    .catch(() => {
                        resolve({ isValid: false, error: 'Erreur de vérification anti-spam' });
                    });
            });
        });
    }

    // Validation de la honeypot (champ caché anti-bot)
    validateHoneypot(honeypotValue) {
        return {
            isValid: honeypotValue === '' || honeypotValue === undefined,
            error: honeypotValue ? 'Activité de bot détectée' : null
        };
    }

    // Validation complète du formulaire
    async validateNewsletterForm(formData) {
        const results = {
            isValid: true,
            errors: [],
            warnings: []
        };

        // 1. Validation de l'email
        const email = formData.get('email');
        if (!email) {
            results.errors.push('L\'email est requis');
            results.isValid = false;
        } else {
            const emailValidation = this.validateEmail(email);
            if (!emailValidation.isValid) {
                results.errors.push(...emailValidation.errors);
                results.isValid = false;
            }
        }

        // 2. Vérification du rate limiting
        const rateLimitCheck = this.checkRateLimit();
        if (!rateLimitCheck.isValid) {
            results.errors.push(rateLimitCheck.error);
            results.isValid = false;
        }

        // 3. Validation honeypot
        const honeypotCheck = this.validateHoneypot(formData.get('website'));
        if (!honeypotCheck.isValid) {
            results.errors.push(honeypotCheck.error);
            results.isValid = false;
        }

        // 4. Vérification reCAPTCHA
        if (results.isValid) {
            const recaptchaResult = await this.verifyRecaptcha();
            if (!recaptchaResult.isValid) {
                results.errors.push(recaptchaResult.error || 'Vérification anti-spam échouée');
                results.isValid = false;
            } else if (recaptchaResult.score < 0.5) {
                results.warnings.push('Activité suspecte détectée, vérification manuelle requise');
            }
        }

        // Mettre à jour le timestamp si validation réussie
        if (results.isValid) {
            this.lastSubmission = Date.now();
        }

        return results;
    }

    // Affichage des erreurs de validation
    displayValidationErrors(errors, container) {
        // Supprimer les erreurs existantes
        const existingErrors = container.querySelectorAll('.validation-error');
        existingErrors.forEach(error => error.remove());

        // Afficher les nouvelles erreurs
        errors.forEach(error => {
            const errorElement = document.createElement('div');
            errorElement.className = 'validation-error';
            errorElement.innerHTML = `
                <i class="fas fa-exclamation-triangle"></i>
                <span>${error}</span>
            `;
            errorElement.style.cssText = `
                color: #e74c3c;
                font-size: 14px;
                margin-top: 5px;
                display: flex;
                align-items: center;
                gap: 8px;
                animation: shake 0.5s ease-in-out;
            `;
            container.appendChild(errorElement);
        });
    }

    // Validation en temps réel de l'email
    setupRealTimeValidation(emailInput) {
        let timeout;
        
        emailInput.addEventListener('input', (e) => {
            clearTimeout(timeout);
            timeout = setTimeout(() => {
                const email = e.target.value;
                const container = e.target.parentElement;
                
                if (email) {
                    const validation = this.validateEmail(email);
                    
                    // Supprimer les erreurs existantes
                    const existingErrors = container.querySelectorAll('.validation-error');
                    existingErrors.forEach(error => error.remove());
                    
                    // Style de l'input selon la validation
                    if (validation.isValid) {
                        e.target.style.borderColor = '#27ae60';
                        e.target.style.boxShadow = '0 0 5px rgba(39, 174, 96, 0.3)';
                    } else {
                        e.target.style.borderColor = '#e74c3c';
                        e.target.style.boxShadow = '0 0 5px rgba(231, 76, 60, 0.3)';
                        this.displayValidationErrors(validation.errors, container);
                    }
                } else {
                    // Reset du style
                    e.target.style.borderColor = '';
                    e.target.style.boxShadow = '';
                }
            }, 300);
        });
    }
}

// Styles CSS pour les erreurs de validation
const validationStyles = `
    @keyframes shake {
        0%, 100% { transform: translateX(0); }
        25% { transform: translateX(-5px); }
        75% { transform: translateX(5px); }
    }
    
    .validation-error {
        animation: fadeIn 0.3s ease-in-out;
    }
    
    @keyframes fadeIn {
        from { opacity: 0; transform: translateY(-10px); }
        to { opacity: 1; transform: translateY(0); }
    }
    
    .newsletter-form-container {
        position: relative;
    }
    
    .honeypot {
        position: absolute !important;
        left: -9999px !important;
        width: 1px !important;
        height: 1px !important;
        overflow: hidden !important;
    }
`;

// Ajouter les styles
const styleSheet = document.createElement('style');
styleSheet.textContent = validationStyles;
document.head.appendChild(styleSheet);

// Exporter la classe
window.NewsletterValidator = NewsletterValidator;
