// Test de l'API corrigée pour Sorbo-Ingénierie
console.log('🧪 Test de l\'API corrigée Railway...');

const API_BASE_URL = 'https://sorbo-api-production.up.railway.app';

async function testCorrectedAPI() {
    console.log('📡 Test de l\'API avec la nouvelle URL...');
    console.log(`🌐 URL: ${API_BASE_URL}`);
    
    const endpoints = [
        '/api/health',
        '/api/logiciels',
        '/api/formations',
        '/api/actualites'
    ];
    
    for (const endpoint of endpoints) {
        try {
            console.log(`\n🔍 Test de ${endpoint}...`);
            
            const response = await fetch(`${API_BASE_URL}${endpoint}`, {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                }
            });
            
            if (response.ok) {
                const data = await response.json();
                console.log(`✅ ${endpoint} - Status: ${response.status}`);
                console.log(`📊 Données: ${Array.isArray(data) ? data.length : 1} élément(s)`);
                
                if (endpoint === '/api/health') {
                    console.log(`💚 Message: ${data.message}`);
                }
            } else {
                console.log(`❌ ${endpoint} - Status: ${response.status} ${response.statusText}`);
            }
            
        } catch (error) {
            console.log(`❌ ${endpoint} - Erreur: ${error.message}`);
        }
    }
    
    console.log('\n🏁 Test terminé !');
}

// Exécuter le test
testCorrectedAPI();
