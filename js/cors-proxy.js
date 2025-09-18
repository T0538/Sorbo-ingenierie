// Proxy CORS pour contourner les problèmes de CORS
class CORSProxy {
    constructor() {
        this.railwayAPI = 'https://sorbo-api-production.up.railway.app';
        this.corsProxy = 'https://cors-anywhere.herokuapp.com/';
        this.useProxy = false; // D'abord essayer sans proxy
    }
    
    async makeRequest(endpoint) {
        const url = this.useProxy ? 
            `${this.corsProxy}${this.railwayAPI}${endpoint}` : 
            `${this.railwayAPI}${endpoint}`;
            
        console.log(`🌐 Requête: ${url}`);
        
        try {
            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                mode: this.useProxy ? 'cors' : 'cors'
            });
            
            if (response.ok) {
                const data = await response.json();
                console.log(`✅ Succès: ${endpoint}`);
                return { success: true, data };
            } else {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }
            
        } catch (error) {
            console.log(`❌ Erreur ${endpoint}: ${error.message}`);
            
            // Si c'est une erreur CORS et qu'on n'utilise pas encore le proxy
            if (error.message.includes('CORS') && !this.useProxy) {
                console.log('🔄 Tentative avec proxy CORS...');
                this.useProxy = true;
                return await this.makeRequest(endpoint);
            }
            
            return { success: false, error: error.message };
        }
    }
    
    async getHealth() {
        return await this.makeRequest('/api/health');
    }
    
    async getLogiciels() {
        return await this.makeRequest('/api/logiciels');
    }
    
    async getFormations() {
        return await this.makeRequest('/api/formations');
    }
    
    async getActualites() {
        return await this.makeRequest('/api/actualites');
    }
}

// Instance globale
const corsProxy = new CORSProxy();

// Export pour utilisation dans d'autres modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = CORSProxy;
}
