// Script de diagnostic pour les domaines Sorbo Ingénierie
class DomainDiagnostics {
    constructor() {
        this.currentDomain = window.location.hostname;
        this.railwayAPI = 'https://sorbo-api-production.up.railway.app';
        this.testResults = {};
    }
    
    async runFullDiagnostics() {
        console.log('🔍 === DIAGNOSTIC COMPLET DU DOMAINE ===');
        console.log(`🏠 Domaine actuel: ${this.currentDomain}`);
        console.log(`🌐 URL complète: ${window.location.href}`);
        console.log(`📡 API Railway: ${this.railwayAPI}`);
        
        // Test 1: Vérification du domaine
        await this.testDomainResolution();
        
        // Test 2: Test de connectivité API
        await this.testAPIConnectivity();
        
        // Test 3: Test des endpoints spécifiques
        await this.testSpecificEndpoints();
        
        // Test 4: Test des ressources statiques
        await this.testStaticResources();
        
        // Test 5: Test CORS
        await this.testCORS();
        
        // Affichage des résultats
        this.displayResults();
        
        return this.testResults;
    }
    
    async testDomainResolution() {
        console.log('\n🔍 Test 1: Résolution du domaine...');
        
        try {
            // Test de résolution DNS via une requête simple
            const testUrl = `https://${this.currentDomain}/`;
            const response = await fetch(testUrl, { 
                method: 'HEAD',
                mode: 'no-cors' // Pour éviter les erreurs CORS
            });
            
            this.testResults.domainResolution = {
                success: true,
                message: 'Domaine résolu correctement',
                url: testUrl
            };
            console.log('✅ Domaine résolu correctement');
            
        } catch (error) {
            this.testResults.domainResolution = {
                success: false,
                message: `Erreur de résolution: ${error.message}`,
                error: error
            };
            console.log(`❌ Erreur de résolution du domaine: ${error.message}`);
        }
    }
    
    async testAPIConnectivity() {
        console.log('\n🔍 Test 2: Connectivité API Railway...');
        
        try {
            const response = await fetch(`${this.railwayAPI}/api/health`, {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                signal: AbortSignal.timeout(10000) // 10 secondes
            });
            
            if (response.ok) {
                const data = await response.json();
                this.testResults.apiConnectivity = {
                    success: true,
                    message: 'API Railway accessible',
                    status: response.status,
                    data: data
                };
                console.log('✅ API Railway accessible');
                console.log(`📊 Status: ${response.status}`);
                console.log(`📄 Réponse:`, data);
            } else {
                this.testResults.apiConnectivity = {
                    success: false,
                    message: `API non accessible: ${response.status} ${response.statusText}`,
                    status: response.status
                };
                console.log(`❌ API non accessible: ${response.status} ${response.statusText}`);
            }
            
        } catch (error) {
            this.testResults.apiConnectivity = {
                success: false,
                message: `Erreur de connexion: ${error.message}`,
                error: error
            };
            console.log(`❌ Erreur de connexion API: ${error.message}`);
        }
    }
    
    async testSpecificEndpoints() {
        console.log('\n🔍 Test 3: Endpoints spécifiques...');
        
        const endpoints = [
            '/api/logiciels',
            '/api/formations',
            '/api/actualites'
        ];
        
        this.testResults.endpoints = {};
        
        for (const endpoint of endpoints) {
            try {
                const response = await fetch(`${this.railwayAPI}${endpoint}`, {
                    method: 'GET',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                    },
                    signal: AbortSignal.timeout(10000)
                });
                
                if (response.ok) {
                    const data = await response.json();
                    this.testResults.endpoints[endpoint] = {
                        success: true,
                        status: response.status,
                        dataCount: Array.isArray(data) ? data.length : 1
                    };
                    console.log(`✅ ${endpoint}: ${response.status} (${Array.isArray(data) ? data.length : 1} éléments)`);
                } else {
                    this.testResults.endpoints[endpoint] = {
                        success: false,
                        status: response.status,
                        message: response.statusText
                    };
                    console.log(`❌ ${endpoint}: ${response.status} ${response.statusText}`);
                }
                
            } catch (error) {
                this.testResults.endpoints[endpoint] = {
                    success: false,
                    error: error.message
                };
                console.log(`❌ ${endpoint}: ${error.message}`);
            }
        }
    }
    
    async testStaticResources() {
        console.log('\n🔍 Test 4: Ressources statiques...');
        
        const resources = [
            '/images/logo.png',
            '/images/hero-bg-4k.svg',
            '/css/style.css',
            '/js/environment-config.js'
        ];
        
        this.testResults.staticResources = {};
        
        for (const resource of resources) {
            try {
                const response = await fetch(resource, {
                    method: 'HEAD',
                    signal: AbortSignal.timeout(5000)
                });
                
                this.testResults.staticResources[resource] = {
                    success: response.ok,
                    status: response.status,
                    size: response.headers.get('content-length')
                };
                
                if (response.ok) {
                    console.log(`✅ ${resource}: ${response.status}`);
                } else {
                    console.log(`❌ ${resource}: ${response.status}`);
                }
                
            } catch (error) {
                this.testResults.staticResources[resource] = {
                    success: false,
                    error: error.message
                };
                console.log(`❌ ${resource}: ${error.message}`);
            }
        }
    }
    
    async testCORS() {
        console.log('\n🔍 Test 5: Configuration CORS...');
        
        try {
            const response = await fetch(`${this.railwayAPI}/api/health`, {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                mode: 'cors'
            });
            
            if (response.ok) {
                this.testResults.cors = {
                    success: true,
                    message: 'CORS configuré correctement'
                };
                console.log('✅ CORS configuré correctement');
            } else {
                this.testResults.cors = {
                    success: false,
                    message: `Erreur CORS: ${response.status}`
                };
                console.log(`❌ Erreur CORS: ${response.status}`);
            }
            
        } catch (error) {
            this.testResults.cors = {
                success: false,
                message: `Erreur CORS: ${error.message}`,
                error: error
            };
            console.log(`❌ Erreur CORS: ${error.message}`);
        }
    }
    
    displayResults() {
        console.log('\n📊 === RÉSULTATS DU DIAGNOSTIC ===');
        
        const results = this.testResults;
        
        // Résumé global
        const totalTests = Object.keys(results).length;
        const successfulTests = Object.values(results).filter(r => r.success).length;
        
        console.log(`\n📈 Résumé: ${successfulTests}/${totalTests} tests réussis`);
        
        // Détails par test
        Object.entries(results).forEach(([testName, result]) => {
            const status = result.success ? '✅' : '❌';
            console.log(`${status} ${testName}: ${result.message || result.status || 'Test effectué'}`);
        });
        
        // Recommandations
        console.log('\n💡 === RECOMMANDATIONS ===');
        
        if (!results.apiConnectivity?.success) {
            console.log('🔧 Problème API détecté:');
            console.log('   - Vérifiez que Railway est en ligne');
            console.log('   - Vérifiez les variables d\'environnement');
            console.log('   - Testez l\'URL API directement dans le navigateur');
        }
        
        if (!results.cors?.success) {
            console.log('🔧 Problème CORS détecté:');
            console.log('   - Vérifiez la configuration CORS sur Railway');
            console.log('   - Ajoutez votre domaine à la liste des origines autorisées');
        }
        
        if (this.currentDomain.includes('.ci') && !results.domainResolution?.success) {
            console.log('🔧 Problème de domaine .ci détecté:');
            console.log('   - Vérifiez la configuration DNS');
            console.log('   - Vérifiez que le domaine pointe vers Netlify');
            console.log('   - Contactez votre fournisseur de domaine');
        }
        
        // Solutions automatiques
        console.log('\n🚀 === SOLUTIONS AUTOMATIQUES ===');
        console.log('1. Rechargement de la page avec cache vidé');
        console.log('2. Test de connectivité avec fallback');
        console.log('3. Utilisation du proxy CORS si nécessaire');
        
        return results;
    }
    
    // Méthode pour forcer la reconnexion
    async forceReconnection() {
        console.log('🔄 Forçage de la reconnexion...');
        
        // Vider le cache
        if ('caches' in window) {
            const cacheNames = await caches.keys();
            await Promise.all(cacheNames.map(name => caches.delete(name)));
            console.log('🗑️ Cache vidé');
        }
        
        // Recharger la page
        window.location.reload(true);
    }
}

// Instance globale
const domainDiagnostics = new DomainDiagnostics();

// Auto-diagnostic si on est sur le domaine .ci
if (window.location.hostname.includes('.ci')) {
    console.log('🔍 Domaine .ci détecté, lancement du diagnostic automatique...');
    domainDiagnostics.runFullDiagnostics();
}

// Export pour utilisation dans d'autres modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = DomainDiagnostics;
}

