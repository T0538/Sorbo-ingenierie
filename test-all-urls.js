// Test de toutes les URLs possibles pour Sorbo-Ingénierie
console.log('🧪 Test de toutes les URLs API possibles...');

const possibleURLs = [
    'https://sorbo-ingenierie-production.up.railway.app',
    'https://sorbo-api-production.up.railway.app',
    'https://sorbo-ingenierie.ci',
    'https://www.sorbo-ingenierie.ci'
];

async function testURL(baseURL) {
    console.log(`\n🔍 Test de ${baseURL}...`);
    
    const endpoints = ['/api/health', '/api/info', '/api/logiciels'];
    
    for (const endpoint of endpoints) {
        try {
            const url = `${baseURL}${endpoint}`;
            console.log(`  📡 ${endpoint}...`);
            
            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    'Accept': 'application/json'
                }
            });
            
            if (response.ok) {
                const data = await response.json();
                console.log(`    ✅ Status: ${response.status} - ${data.message || 'OK'}`);
            } else {
                console.log(`    ❌ Status: ${response.status} ${response.statusText}`);
            }
            
        } catch (error) {
            console.log(`    ❌ Erreur: ${error.message}`);
        }
    }
}

async function runAllTests() {
    for (const url of possibleURLs) {
        await testURL(url);
    }
    
    console.log('\n🏁 Tests terminés !');
}

// Exécuter les tests
runAllTests();
