// Configuration d'environnement pour Sorbo-Ingénierie
class EnvironmentConfig {
    constructor() {
        this.currentDomain = window.location.hostname;
        this.isProduction = this.currentDomain !== 'localhost' && 
                           this.currentDomain !== '127.0.0.1';
        
        // Configuration des URLs API selon l'environnement
        this.apiConfigs = {
            // Production - Domaine principal
            'sorbo-ingenierie.ci': {
                apiUrl: 'https://sorbo-api-production.up.railway.app',
                environment: 'production',
                fallbackUrls: [
                    'https://sorbo-api-production.up.railway.app',
                    'https://sorbo-api-backup.up.railway.app'
                ]
            },
            // Production - Domaine avec www
            'www.sorbo-ingenierie.ci': {
                apiUrl: 'https://sorbo-api-production.up.railway.app',
                environment: 'production',
                fallbackUrls: [
                    'https://sorbo-api-production.up.railway.app',
                    'https://sorbo-api-backup.up.railway.app'
                ]
            },
            // Netlify (fonctionne)
            'sorbo-ingenierie.netlify.app': {
                apiUrl: 'https://sorbo-api-production.up.railway.app',
                environment: 'production',
                fallbackUrls: [
                    'https://sorbo-api-production.up.railway.app',
                    'https://sorbo-api-backup.up.railway.app'
                ]
            },
            // Développement local
            'localhost': {
                apiUrl: 'http://localhost:5000',
                environment: 'development',
                fallbackUrls: [
                    'http://localhost:5000',
                    'https://sorbo-api-production.up.railway.app'
                ]
            },
            '127.0.0.1': {
                apiUrl: 'http://localhost:5000',
                environment: 'development',
                fallbackUrls: [
                    'http://localhost:5000',
                    'https://sorbo-api-production.up.railway.app'
                ]
            }
        };
        
        // Configuration par défaut
        this.defaultConfig = {
            apiUrl: 'https://sorbo-api-production.up.railway.app',
            environment: 'production',
            fallbackUrls: [
                'https://sorbo-api-production.up.railway.app',
                'https://sorbo-api-backup.up.railway.app'
            ]
        };
        
        this.config = this.apiConfigs[this.currentDomain] || this.defaultConfig;
        
        console.log(`🌐 Environnement détecté: ${this.config.environment}`);
        console.log(`🏠 Domaine: ${this.currentDomain}`);
        console.log(`📡 URL API: ${this.config.apiUrl}`);
    }
    
    get apiUrl() {
        return this.config.apiUrl;
    }
    
    get environment() {
        return this.config.environment;
    }
    
    // Obtenir l'URL complète pour un endpoint
    getEndpointUrl(endpoint) {
        const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
        return `${this.config.apiUrl}${cleanEndpoint}`;
    }
    
    // URLs des endpoints principaux
    get healthUrl() {
        return this.getEndpointUrl('/api/health');
    }
    
    get logicielsUrl() {
        return this.getEndpointUrl('/api/logiciels');
    }
    
    get formationsUrl() {
        return this.getEndpointUrl('/api/formations');
    }
    
    get actualitesUrl() {
        return this.getEndpointUrl('/api/actualites');
    }
    
    // Configuration pour fetch
    get fetchConfig() {
        return {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            cache: 'no-store'
        };
    }
    
    // Test de connectivité avec fallback
    async testConnectivity() {
        const urls = this.config.fallbackUrls || [this.config.apiUrl];
        
        for (let i = 0; i < urls.length; i++) {
            const testUrl = urls[i];
            try {
                console.log(`🔍 Test de connectivité vers ${testUrl}... (${i + 1}/${urls.length})`);
                
                const response = await fetch(`${testUrl}/api/health`, this.fetchConfig);
                
                if (response.ok) {
                    const data = await response.json();
                    console.log(`✅ API accessible: ${data.message}`);
                    
                    // Mettre à jour l'URL API si on utilise un fallback
                    if (testUrl !== this.config.apiUrl) {
                        console.log(`🔄 Mise à jour de l'URL API vers: ${testUrl}`);
                        this.config.apiUrl = testUrl;
                    }
                    
                    return true;
                } else {
                    console.log(`❌ API non accessible: ${response.status} ${response.statusText}`);
                }
            } catch (error) {
                console.log(`❌ Erreur de connexion vers ${testUrl}: ${error.message}`);
            }
        }
        
        console.log(`❌ Aucune API accessible sur ${urls.length} URL(s) testée(s)`);
        return false;
    }
    
    // Test de connectivité simple (pour compatibilité)
    async testConnectivitySimple() {
        try {
            console.log(`🔍 Test de connectivité vers ${this.config.apiUrl}...`);
            
            const response = await fetch(this.healthUrl, this.fetchConfig);
            
            if (response.ok) {
                const data = await response.json();
                console.log(`✅ API accessible: ${data.message}`);
                return true;
            } else {
                console.log(`❌ API non accessible: ${response.status} ${response.statusText}`);
                return false;
            }
        } catch (error) {
            console.log(`❌ Erreur de connexion: ${error.message}`);
            return false;
        }
    }
}

// Instance globale
const envConfig = new EnvironmentConfig();

// Export pour utilisation dans d'autres modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = EnvironmentConfig;
}
