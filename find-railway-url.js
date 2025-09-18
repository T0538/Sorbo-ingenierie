// Script pour trouver la bonne URL Railway
console.log('🔍 Recherche de la bonne URL Railway...');

const possibleRailwayURLs = [
    'https://sorbo-ingenierie-production.up.railway.app',
    'https://sorbo-api-production.up.railway.app',
    'https://sorbo-ingenierie.up.railway.app',
    'https://sorbo-api.up.railway.app'
];

async function testRailwayURL(baseURL) {
    console.log(`\n🌐 Test de ${baseURL}...`);
    
    try {
        // Test de base
        const response = await fetch(`${baseURL}/api/health`, {
            method: 'GET',
            headers: {
                'Accept': 'application/json'
            }
        });
        
        if (response.ok) {
            const data = await response.json();
            console.log(`✅ ${baseURL} - FONCTIONNE !`);
            console.log(`   Message: ${data.message}`);
            console.log(`   MongoDB: ${data.mongodb}`);
            console.log(`   Timestamp: ${data.timestamp}`);
            
            // Tester les autres endpoints
            await testEndpoints(baseURL);
            
            return baseURL;
        } else {
            console.log(`❌ ${baseURL} - Status: ${response.status} ${response.statusText}`);
        }
        
    } catch (error) {
        console.log(`❌ ${baseURL} - Erreur: ${error.message}`);
    }
    
    return null;
}

async function testEndpoints(baseURL) {
    const endpoints = ['/api/logiciels', '/api/formations', '/api/actualites'];
    
    for (const endpoint of endpoints) {
        try {
            const response = await fetch(`${baseURL}${endpoint}`);
            if (response.ok) {
                const data = await response.json();
                console.log(`   ✅ ${endpoint} - ${data.success ? 'OK' : 'Erreur'} (${Array.isArray(data.data) ? data.data.length : 'N/A'} éléments)`);
            } else {
                console.log(`   ❌ ${endpoint} - Status: ${response.status}`);
            }
        } catch (error) {
            console.log(`   ❌ ${endpoint} - Erreur: ${error.message}`);
        }
    }
}

async function findWorkingURL() {
    console.log('🚀 Recherche de l\'URL Railway fonctionnelle...');
    
    for (const url of possibleRailwayURLs) {
        const workingURL = await testRailwayURL(url);
        if (workingURL) {
            console.log(`\n🎯 URL FONCTIONNELLE TROUVÉE: ${workingURL}`);
            console.log(`\n📝 Pour corriger le frontend, remplacez dans tous les fichiers JS:`);
            console.log(`   Ancienne URL → ${workingURL}`);
            return workingURL;
        }
    }
    
    console.log('\n❌ Aucune URL Railway fonctionnelle trouvée');
    console.log('💡 Vérifiez que votre serveur Railway est bien déployé');
    
    return null;
}

// Exécuter la recherche
findWorkingURL();
