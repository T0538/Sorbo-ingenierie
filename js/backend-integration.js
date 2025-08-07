// Script d'intégration backend-frontend pour Sorbo Ingénierie
class BackendIntegration {
    constructor() {
        this.apiBaseUrl = 'https://sorbo-api-production.up.railway.app';
        this.isBackendAvailable = false;
        this.retryCount = 0;
        this.maxRetries = 3;
    }

    // Vérifier si le backend est disponible
    async checkBackendHealth() {
        try {
            const response = await fetch(`${this.apiBaseUrl}/api/health`, {
                method: 'GET',
                headers: {
                    'Accept': 'application/json'
                }
            });
            
            if (response.ok) {
                const data = await response.json();
                console.log('✅ Backend disponible:', data.message);
                this.isBackendAvailable = true;
                return true;
            }
        } catch (error) {
            console.log('❌ Backend non disponible:', error.message);
            this.isBackendAvailable = false;
            return false;
        }
    }

    // Tenter de démarrer le backend automatiquement
    async startBackendIfNeeded() {
        if (this.retryCount >= this.maxRetries) {
            console.log('⚠️ Nombre maximum de tentatives atteint');
            this.showBackendWarning();
            return;
        }

        this.retryCount++;
        console.log(`🔄 Tentative ${this.retryCount}/${this.maxRetries} de connexion au backend...`);

        const isAvailable = await this.checkBackendHealth();
        
        if (!isAvailable) {
            // Attendre avant de réessayer
            setTimeout(() => {
                this.startBackendIfNeeded();
            }, 2000);
        }
    }

    // Afficher un avertissement si le backend n'est pas disponible
    showBackendWarning() {
        const warningDiv = document.createElement('div');
        warningDiv.className = 'backend-warning';
        warningDiv.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: #fff3cd;
            border: 1px solid #ffeaa7;
            border-radius: 5px;
            padding: 15px;
            max-width: 300px;
            z-index: 1000;
            box-shadow: 0 4px 6px rgba(0,0,0,0.1);
        `;
        
        warningDiv.innerHTML = `
            <div style="display: flex; align-items: center; margin-bottom: 10px;">
                <i class="fas fa-exclamation-triangle" style="color: #f39c12; margin-right: 10px;"></i>
                <strong>Backend non disponible</strong>
            </div>
            <p style="margin: 0; font-size: 14px; color: #856404;">
                Le serveur backend n'est pas démarré. 
                <br>Démarrez-le avec: <code>node server-ultra-simple.js</code>
            </p>
            <button onclick="this.parentElement.remove()" style="
                position: absolute;
                top: 5px;
                right: 5px;
                background: none;
                border: none;
                font-size: 18px;
                cursor: pointer;
                color: #856404;
            ">&times;</button>
        `;
        
        document.body.appendChild(warningDiv);
        
        // Supprimer automatiquement après 10 secondes
        setTimeout(() => {
            if (warningDiv.parentElement) {
                warningDiv.remove();
            }
        }, 10000);
    }

    // Envoyer un contact au backend
    async sendContact(contactData) {
        if (!this.isBackendAvailable) {
            throw new Error('Backend non disponible');
        }

        try {
            const response = await fetch(`${this.apiBaseUrl}/api/contact`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify(contactData)
            });

            const data = await response.json();
            
            if (!response.ok) {
                throw new Error(data.message || 'Erreur lors de l\'envoi');
            }

            return data;
        } catch (error) {
            console.error('Erreur lors de l\'envoi du contact:', error);
            throw error;
        }
    }

    // Récupérer les formations depuis le backend
    async getFormations() {
        if (!this.isBackendAvailable) {
            throw new Error('Backend non disponible');
        }

        try {
            const response = await fetch(`${this.apiBaseUrl}/api/formations`, {
                method: 'GET',
                headers: {
                    'Accept': 'application/json'
                }
            });

            const data = await response.json();
            
            if (!response.ok) {
                throw new Error(data.message || 'Erreur lors de la récupération');
            }

            return data;
        } catch (error) {
            console.error('Erreur lors de la récupération des formations:', error);
            throw error;
        }
    }

    // Initialiser l'intégration
    async init() {
        console.log('🚀 Initialisation de l\'intégration backend-frontend...');
        
        // Vérifier le backend au chargement
        await this.checkBackendHealth();
        
        // Si le backend n'est pas disponible, tenter de le démarrer
        if (!this.isBackendAvailable) {
            this.startBackendIfNeeded();
        }
        
        // Vérifier périodiquement la disponibilité du backend
        setInterval(() => {
            this.checkBackendHealth();
        }, 30000); // Vérifier toutes les 30 secondes
    }
}

// Initialiser l'intégration quand le DOM est chargé
document.addEventListener('DOMContentLoaded', function() {
    window.backendIntegration = new BackendIntegration();
    window.backendIntegration.init();
}); 