// Gestionnaire global pour les problèmes de domaine
(function() {
    'use strict';
    
    const GlobalDomainHandler = {
        currentDomain: window.location.hostname,
        isCIdomain: window.location.hostname.includes('.ci'),
        railwayAPI: 'https://sorbo-api-production.up.railway.app',
        
        init: function() {
            console.log('🌐 === GESTIONNAIRE GLOBAL DE DOMAINE ===');
            console.log(`🏠 Domaine: ${this.currentDomain}`);
            console.log(`🎯 Domaine .ci: ${this.isCIdomain}`);
            
            if (this.isCIdomain) {
                this.handleCIDomain();
            }
            
            this.setupGlobalErrorHandling();
            this.setupAPIInterceptors();
        },
        
        handleCIDomain: function() {
            console.log('🔧 Gestion spéciale du domaine .ci...');
            
            // Vérifier si une configuration proxy existe déjà
            const savedProxy = localStorage.getItem('sorbo-api-proxy');
            const savedUrl = localStorage.getItem('sorbo-api-url');
            
            if (savedProxy && savedUrl) {
                console.log(`🔄 Configuration proxy trouvée: ${savedProxy}`);
                this.updateGlobalConfig(savedUrl);
            } else {
                // Tester la connectivité et configurer un proxy si nécessaire
                this.testAndConfigureProxy();
            }
        },
        
        testAndConfigureProxy: async function() {
            console.log('🔍 Test de connectivité API...');
            
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
                    console.log('✅ API accessible directement');
                    return;
                }
            } catch (error) {
                console.log(`❌ API non accessible: ${error.message}`);
            }
            
            // Si on arrive ici, l'API n'est pas accessible, essayer avec un proxy
            await this.tryProxyConfigurations();
        },
        
        tryProxyConfigurations: async function() {
            console.log('🔄 Test des configurations proxy...');
            
            const proxies = [
                {
                    name: 'CORS Anywhere',
                    url: 'https://cors-anywhere.herokuapp.com/',
                    format: (url) => `https://cors-anywhere.herokuapp.com/${url}`
                },
                {
                    name: 'AllOrigins',
                    url: 'https://api.allorigins.win/raw?url=',
                    format: (url) => `https://api.allorigins.win/raw?url=${encodeURIComponent(url)}`
                },
                {
                    name: 'CorsProxy',
                    url: 'https://corsproxy.io/?',
                    format: (url) => `https://corsproxy.io/?${encodeURIComponent(url)}`
                }
            ];
            
            for (const proxy of proxies) {
                try {
                    console.log(`🔍 Test du proxy ${proxy.name}...`);
                    
                    const proxyUrl = proxy.format(`${this.railwayAPI}/api/health`);
                    const response = await fetch(proxyUrl, {
                        method: 'GET',
                        signal: AbortSignal.timeout(10000)
                    });
                    
                    if (response.ok) {
                        console.log(`✅ Proxy ${proxy.name} fonctionne`);
                        
                        // Sauvegarder la configuration
                        localStorage.setItem('sorbo-api-proxy', proxy.url);
                        localStorage.setItem('sorbo-api-proxy-format', proxy.name);
                        localStorage.setItem('sorbo-working-proxy', JSON.stringify(proxy));
                        
                        // Mettre à jour la configuration globale
                        this.updateGlobalConfig(proxy.format(this.railwayAPI));
                        
                        return;
                    }
                    
                } catch (error) {
                    console.log(`❌ Proxy ${proxy.name} échoué: ${error.message}`);
                }
            }
            
            console.log('❌ Aucun proxy fonctionnel trouvé');
            this.showConnectionError();
        },
        
        updateGlobalConfig: function(apiUrl) {
            console.log(`🔄 Mise à jour de la configuration globale: ${apiUrl}`);
            
            // Mettre à jour envConfig si disponible
            if (typeof envConfig !== 'undefined' && envConfig.config) {
                envConfig.config.apiUrl = apiUrl;
                console.log('✅ envConfig mis à jour');
            }
            
            // Mettre à jour corsProxy si disponible
            if (typeof corsProxy !== 'undefined') {
                corsProxy.railwayAPI = apiUrl;
                corsProxy.useProxy = true;
                console.log('✅ corsProxy mis à jour');
            }
            
            // Créer une variable globale pour l'URL API
            window.SORBO_API_URL = apiUrl;
            console.log('✅ Variable globale SORBO_API_URL créée');
        },
        
        setupGlobalErrorHandling: function() {
            console.log('🔧 Configuration de la gestion d\'erreurs globale...');
            
            // Intercepter les erreurs de fetch
            const originalFetch = window.fetch;
            window.fetch = async function(...args) {
                try {
                    const response = await originalFetch.apply(this, args);
                    
                    // Si c'est une requête vers notre API et qu'elle échoue
                    if (args[0].includes('sorbo-api') && !response.ok) {
                        console.log(`⚠️ Erreur API détectée: ${response.status} pour ${args[0]}`);
                        
                        // Essayer avec un proxy si disponible
                        const workingProxy = localStorage.getItem('sorbo-working-proxy');
                        if (workingProxy) {
                            const proxy = JSON.parse(workingProxy);
                            const proxyUrl = proxy.format(args[0]);
                            console.log(`🔄 Tentative avec proxy: ${proxyUrl}`);
                            
                            try {
                                const proxyResponse = await originalFetch.call(this, proxyUrl, args[1]);
                                if (proxyResponse.ok) {
                                    console.log('✅ Succès avec proxy');
                                    return proxyResponse;
                                }
                            } catch (proxyError) {
                                console.log(`❌ Échec du proxy: ${proxyError.message}`);
                            }
                        }
                    }
                    
                    return response;
                    
                } catch (error) {
                    console.log(`❌ Erreur fetch: ${error.message} pour ${args[0]}`);
                    
                    // Si c'est une erreur CORS ou de réseau sur notre API
                    if (args[0].includes('sorbo-api') && 
                        (error.message.includes('CORS') || 
                         error.message.includes('Failed to fetch') ||
                         error.message.includes('Network'))) {
                        
                        console.log('🔄 Tentative de récupération avec proxy...');
                        return await GlobalDomainHandler.handleFetchError(args, error);
                    }
                    
                    throw error;
                }
            };
            
            console.log('✅ Gestionnaire d\'erreurs fetch configuré');
        },
        
        handleFetchError: async function(fetchArgs, originalError) {
            const [url, options] = fetchArgs;
            
            // Essayer avec un proxy
            const workingProxy = localStorage.getItem('sorbo-working-proxy');
            if (workingProxy) {
                const proxy = JSON.parse(workingProxy);
                const proxyUrl = proxy.format(url);
                
                try {
                    console.log(`🔄 Récupération avec proxy: ${proxyUrl}`);
                    const response = await fetch(proxyUrl, options);
                    
                    if (response.ok) {
                        console.log('✅ Récupération réussie avec proxy');
                        return response;
                    }
                } catch (proxyError) {
                    console.log(`❌ Récupération échouée: ${proxyError.message}`);
                }
            }
            
            // Si tout échoue, relancer l'erreur originale
            throw originalError;
        },
        
        setupAPIInterceptors: function() {
            console.log('🔧 Configuration des intercepteurs API...');
            
            // Intercepter les requêtes XMLHttpRequest aussi
            const originalXHR = window.XMLHttpRequest;
            window.XMLHttpRequest = function() {
                const xhr = new originalXHR();
                const originalOpen = xhr.open;
                
                xhr.open = function(method, url, ...args) {
                    // Si c'est une requête vers notre API et on a un proxy configuré
                    if (url.includes('sorbo-api')) {
                        const workingProxy = localStorage.getItem('sorbo-working-proxy');
                        if (workingProxy) {
                            const proxy = JSON.parse(workingProxy);
                            url = proxy.format(url);
                            console.log(`🔄 XHR intercepté et redirigé: ${url}`);
                        }
                    }
                    
                    return originalOpen.call(this, method, url, ...args);
                };
                
                return xhr;
            };
            
            console.log('✅ Intercepteurs XHR configurés');
        },
        
        showConnectionError: function() {
            console.log('❌ Affichage d\'un message d\'erreur de connexion...');
            
            // Créer une notification d'erreur discrète
            const errorDiv = document.createElement('div');
            errorDiv.id = 'connection-error-notice';
            errorDiv.style.cssText = `
                position: fixed;
                top: 20px;
                right: 20px;
                background: #ff6b6b;
                color: white;
                padding: 15px 20px;
                border-radius: 8px;
                box-shadow: 0 4px 12px rgba(0,0,0,0.15);
                z-index: 10000;
                font-family: Arial, sans-serif;
                font-size: 14px;
                max-width: 300px;
                cursor: pointer;
            `;
            
            errorDiv.innerHTML = `
                <div style="display: flex; align-items: center; gap: 10px;">
                    <span>⚠️</span>
                    <div>
                        <strong>Problème de connexion</strong><br>
                        <small>Tentative de reconnexion en cours...</small>
                    </div>
                </div>
            `;
            
            // Ajouter un gestionnaire de clic pour fermer
            errorDiv.onclick = function() {
                errorDiv.remove();
            };
            
            document.body.appendChild(errorDiv);
            
            // Retirer automatiquement après 10 secondes
            setTimeout(() => {
                if (errorDiv.parentNode) {
                    errorDiv.remove();
                }
            }, 10000);
        },
        
        // Méthode pour tester manuellement la connectivité
        testConnectivity: async function() {
            console.log('🔍 Test manuel de connectivité...');
            
            const testUrl = window.SORBO_API_URL || `${this.railwayAPI}/api/health`;
            
            try {
                const response = await fetch(testUrl, {
                    method: 'GET',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                    },
                    signal: AbortSignal.timeout(10000)
                });
                
                if (response.ok) {
                    const data = await response.json();
                    console.log('✅ Test de connectivité réussi');
                    console.log('📊 Réponse:', data);
                    return true;
                } else {
                    console.log(`❌ Test de connectivité échoué: ${response.status}`);
                    return false;
                }
                
            } catch (error) {
                console.log(`❌ Erreur lors du test de connectivité: ${error.message}`);
                return false;
            }
        }
    };
    
    // Auto-initialisation
    document.addEventListener('DOMContentLoaded', function() {
        GlobalDomainHandler.init();
    });
    
    // Si le DOM est déjà chargé
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', function() {
            GlobalDomainHandler.init();
        });
    } else {
        GlobalDomainHandler.init();
    }
    
    // Exposer globalement pour le debug
    window.GlobalDomainHandler = GlobalDomainHandler;
    
})();
