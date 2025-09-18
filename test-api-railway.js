// Test des API Railway pour vérifier le bon fonctionnement
const https = require('https');

const API_BASE = 'https://sorbo-ingenierie-production.up.railway.app';

async function testAPI(endpoint) {
    return new Promise((resolve, reject) => {
        const url = `${API_BASE}${endpoint}`;
        console.log(`🔍 Test de l'endpoint: ${url}`);
        
        https.get(url, (res) => {
            let data = '';
            
            res.on('data', (chunk) => {
                data += chunk;
            });
            
            res.on('end', () => {
                try {
                    const jsonData = JSON.parse(data);
                    console.log(`✅ ${endpoint} - Status: ${res.statusCode}`);
                    console.log(`📊 Données reçues: ${Array.isArray(jsonData) ? jsonData.length : 1} élément(s)`);
                    resolve({ status: res.statusCode, data: jsonData });
                } catch (error) {
                    console.log(`❌ ${endpoint} - Erreur parsing JSON: ${error.message}`);
                    resolve({ status: res.statusCode, error: error.message });
                }
            });
        }).on('error', (error) => {
            console.log(`❌ ${endpoint} - Erreur réseau: ${error.message}`);
            reject(error);
        });
    });
}

async function runTests() {
    console.log('🚀 Test des API Railway - Sorbo-Ingénierie');
    console.log('=' .repeat(50));
    
    const endpoints = [
        '/api/logiciels',
        '/api/formations',
        '/api/actualites',
        '/api/health'
    ];
    
    for (const endpoint of endpoints) {
        try {
            await testAPI(endpoint);
            console.log(''); // Ligne vide pour la lisibilité
        } catch (error) {
            console.log(`❌ Erreur pour ${endpoint}: ${error.message}`);
        }
    }
    
    console.log('🏁 Tests terminés');
}

// Exécuter les tests
runTests();
