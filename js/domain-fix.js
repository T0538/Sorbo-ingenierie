// Script de réparation automatique pour le domaine .ci
class DomainFix {
    constructor() {
        this.currentDomain = window.location.hostname;
        this.isCIdomain = this.currentDomain.includes('.ci');
        this.railwayAPI = 'https://sorbo-api-production.up.railway.app';
        this.fallbackAPI = 'https://sorbo-api-backup.up.railway.app';
        this.retryCount = 0;
        this.maxRetries = 3;
    }
    
    async init() {
        console.log('🔧 === RÉPARATION AUTOMATIQUE DU DOMAINE ===');
        console.log(`🏠 Domaine: ${this.currentDomain}`);
        console.log(`🎯 Domaine .ci détecté: ${this.isCIdomain}`);
        
        if (this.isCIdomain) {
            await this.fixCIdomain();
        } else {
            console.log('ℹ️ Domaine non-.ci détecté, pas de réparation nécessaire');
        }
    }
    
    async fixCIdomain() {
        console.log('\n🔧 Réparation du domaine .ci...');
        
        // Étape 1: Test de connectivité initial
        const isConnected = await this.testInitialConnectivity();
        
        if (!isConnected) {
            // Étape 2: Tentative de réparation
            await this.attemptRepair();
        } else {
            console.log('✅ Connectivité initiale OK, pas de réparation nécessaire');
        }
        
        // Étape 3: Configuration des fallbacks
        await this.setupFallbacks();
        
        // Étape 4: Test final
        await this.finalTest();
    }
    
    async testInitialConnectivity() {
        console.log('\n🔍 Test de connectivité initial...');
        
        try {
            const response = await fetch(`${this.railwayAPI}/api/health`, {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                signal: AbortSignal.timeout(5000)
            });
            
            if (response.ok) {
                console.log('✅ Connectivité initiale OK');
                return true;
            } else {
                console.log(`❌ Connectivité initiale échouée: ${response.status}`);
                return false;
            }
            
        } catch (error) {
            console.log(`❌ Erreur de connectivité initiale: ${error.message}`);
            return false;
        }
    }
    
    async attemptRepair() {
        console.log('\n🔧 Tentative de réparation...');
        
        // Méthode 1: Vider le cache
        await this.clearCache();
        
        // Méthode 2: Tester avec différents headers
        await this.testWithDifferentHeaders();
        
        // Méthode 3: Utiliser un proxy CORS
        await this.testWithCORSProxy();
        
        // Méthode 4: Forcer la reconnexion
        await this.forceReconnection();
    }
    
    async clearCache() {
        console.log('🗑️ Vidage du cache...');
        
        try {
            // Vider le cache du navigateur
            if ('caches' in window) {
                const cacheNames = await caches.keys();
                await Promise.all(cacheNames.map(name => caches.delete(name)));
                console.log('✅ Cache navigateur vidé');
            }
            
            // Vider le localStorage
            localStorage.clear();
            console.log('✅ LocalStorage vidé');
            
            // Vider le sessionStorage
            sessionStorage.clear();
            console.log('✅ SessionStorage vidé');
            
        } catch (error) {
            console.log(`❌ Erreur lors du vidage du cache: ${error.message}`);
        }
    }
    
    async testWithDifferentHeaders() {
        console.log('🔧 Test avec différents headers...');
        
        const headerConfigs = [
            {
                name: 'Standard',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                }
            },
            {
                name: 'CORS',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Origin': window.location.origin
                }
            },
            {
                name: 'Minimal',
                headers: {
                    'Accept': '*/*'
                }
            }
        ];
        
        for (const config of headerConfigs) {
            try {
                console.log(`🔍 Test avec headers ${config.name}...`);
                
                const response = await fetch(`${this.railwayAPI}/api/health`, {
                    method: 'GET',
                    headers: config.headers,
                    signal: AbortSignal.timeout(5000)
                });
                
                if (response.ok) {
                    console.log(`✅ Headers ${config.name} fonctionnent`);
                    return true;
                } else {
                    console.log(`❌ Headers ${config.name} échouent: ${response.status}`);
                }
                
            } catch (error) {
                console.log(`❌ Erreur avec headers ${config.name}: ${error.message}`);
            }
        }
        
        return false;
    }
    
    async testWithCORSProxy() {
        console.log('🔧 Test avec proxy CORS...');
        
        const corsProxies = [
            'https://cors-anywhere.herokuapp.com/',
            'https://api.allorigins.win/raw?url=',
            'https://corsproxy.io/?'
        ];
        
        for (const proxy of corsProxies) {
            try {
                console.log(`🔍 Test avec proxy: ${proxy}...`);
                
                const proxyUrl = `${proxy}${encodeURIComponent(this.railwayAPI)}/api/health`;
                const response = await fetch(proxyUrl, {
                    method: 'GET',
                    signal: AbortSignal.timeout(10000)
                });
                
                if (response.ok) {
                    console.log(`✅ Proxy ${proxy} fonctionne`);
                    
                    // Mettre à jour la configuration pour utiliser ce proxy
                    this.updateAPIConfig(proxy);
                    return true;
                } else {
                    console.log(`❌ Proxy ${proxy} échoué: ${response.status}`);
                }
                
            } catch (error) {
                console.log(`❌ Erreur avec proxy ${proxy}: ${error.message}`);
            }
        }
        
        return false;
    }
    
    updateAPIConfig(proxy) {
        console.log(`🔄 Mise à jour de la configuration API avec proxy: ${proxy}`);
        
        // Mettre à jour la configuration globale si elle existe
        if (typeof envConfig !== 'undefined') {
            envConfig.config.apiUrl = `${proxy}${this.railwayAPI}`;
            console.log('✅ Configuration envConfig mise à jour');
        }
        
        // Mettre à jour le proxy CORS si il existe
        if (typeof corsProxy !== 'undefined') {
            corsProxy.railwayAPI = `${proxy}${this.railwayAPI}`;
            corsProxy.useProxy = true;
            console.log('✅ Configuration corsProxy mise à jour');
        }
        
        // Stocker en localStorage pour persistance
        localStorage.setItem('sorbo-api-proxy', proxy);
        localStorage.setItem('sorbo-api-url', `${proxy}${this.railwayAPI}`);
        console.log('✅ Configuration sauvegardée en localStorage');
    }
    
    async forceReconnection() {
        console.log('🔄 Forçage de la reconnexion...');
        
        // Attendre un peu avant de recharger
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        // Recharger la page avec cache vidé
        window.location.reload(true);
    }
    
    async setupFallbacks() {
        console.log('\n🔧 Configuration des fallbacks...');
        
        // Créer un système de fallback automatique
        const fallbackConfig = {
            primary: this.railwayAPI,
            secondary: this.fallbackAPI,
            corsProxies: [
                'https://cors-anywhere.herokuapp.com/',
                'https://api.allorigins.win/raw?url=',
                'https://corsproxy.io/?'
            ],
            retryDelay: 1000,
            maxRetries: 3
        };
        
        // Stocker la configuration
        localStorage.setItem('sorbo-fallback-config', JSON.stringify(fallbackConfig));
        console.log('✅ Configuration de fallback sauvegardée');
        
        // Créer un listener pour les erreurs de réseau
        this.setupNetworkErrorHandler();
    }
    
    setupNetworkErrorHandler() {
        console.log('🔧 Configuration du gestionnaire d\'erreurs réseau...');
        
        // Intercepter les erreurs de fetch
        const originalFetch = window.fetch;
        window.fetch = async (...args) => {
            try {
                return await originalFetch(...args);
            } catch (error) {
                if (error.name === 'TypeError' && error.message.includes('Failed to fetch')) {
                    console.log('🔄 Erreur réseau détectée, tentative de fallback...');
                    await this.handleNetworkError(args);
                }
                throw error;
            }
        };
        
        console.log('✅ Gestionnaire d\'erreurs réseau configuré');
    }
    
    async handleNetworkError(fetchArgs) {
        const [url, options] = fetchArgs;
        
        // Si c'est une requête vers notre API
        if (url.includes('sorbo-api-production.up.railway.app')) {
            console.log('🔄 Tentative de fallback pour l\'API...');
            
            // Essayer avec un proxy CORS
            const corsProxy = 'https://cors-anywhere.herokuapp.com/';
            const proxyUrl = `${corsProxy}${url}`;
            
            try {
                const response = await fetch(proxyUrl, options);
                if (response.ok) {
                    console.log('✅ Fallback réussi avec proxy CORS');
                    return response;
                }
            } catch (error) {
                console.log(`❌ Fallback échoué: ${error.message}`);
            }
        }
    }
    
    async finalTest() {
        console.log('\n🔍 Test final de réparation...');
        
        try {
            const response = await fetch(`${this.railwayAPI}/api/health`, {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                signal: AbortSignal.timeout(10000)
            });
            
            if (response.ok) {
                const data = await response.json();
                console.log('✅ Test final réussi');
                console.log(`📊 Réponse API: ${data.message}`);
                
                // Marquer la réparation comme réussie
                localStorage.setItem('sorbo-domain-fixed', 'true');
                localStorage.setItem('sorbo-fix-timestamp', Date.now().toString());
                
                return true;
            } else {
                console.log(`❌ Test final échoué: ${response.status}`);
                return false;
            }
            
        } catch (error) {
            console.log(`❌ Erreur lors du test final: ${error.message}`);
            return false;
        }
    }
    
    // Méthode pour vérifier si une réparation a été effectuée récemment
    static isRecentlyFixed() {
        const fixTimestamp = localStorage.getItem('sorbo-fix-timestamp');
        if (!fixTimestamp) return false;
        
        const fixTime = parseInt(fixTimestamp);
        const now = Date.now();
        const oneHour = 60 * 60 * 1000; // 1 heure
        
        return (now - fixTime) < oneHour;
    }
    
    // Méthode pour forcer une nouvelle réparation
    static forceNewFix() {
        localStorage.removeItem('sorbo-domain-fixed');
        localStorage.removeItem('sorbo-fix-timestamp');
        window.location.reload(true);
    }
}

// Auto-initialisation si on est sur le domaine .ci
if (window.location.hostname.includes('.ci')) {
    console.log('🔧 Domaine .ci détecté, initialisation de la réparation automatique...');
    
    // Vérifier si une réparation a été effectuée récemment
    if (!DomainFix.isRecentlyFixed()) {
        const domainFix = new DomainFix();
        domainFix.init();
    } else {
        console.log('ℹ️ Réparation récente détectée, pas de nouvelle réparation nécessaire');
    }
}

// Export pour utilisation dans d'autres modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = DomainFix;
}

