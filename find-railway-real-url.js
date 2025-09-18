// Script pour trouver la vraie URL Railway
console.log('🔍 Recherche de la vraie URL Railway...');

// URLs possibles basées sur les patterns Railway
const possibleURLs = [
    'https://sorbo-ingenierie-production.up.railway.app',
    'https://sorbo-api-production.up.railway.app', 
    'https://sorbo-ingenierie.up.railway.app',
    'https://sorbo-api.up.railway.app',
    'https://sorbo-ingenierie-production.railway.app',
    'https://sorbo-api-production.railway.app'
];

async function testRailwayURL(baseURL) {
    console.log(`\n🌐 Test de ${baseURL}...`);
    
    try {
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
            return baseURL;
        } else {
            console.log(`❌ ${baseURL} - Status: ${response.status} ${response.statusText}`);
            
            // Afficher la réponse pour debug
            try {
                const errorData = await response.text();
                console.log(`   Réponse: ${errorData}`);
            } catch (e) {
                console.log(`   Pas de réponse textuelle`);
            }
        }
        
    } catch (error) {
        console.log(`❌ ${baseURL} - Erreur: ${error.message}`);
    }
    
    return null;
}

async function findRealRailwayURL() {
    console.log('🚀 Recherche de l\'URL Railway réelle...');
    
    for (const url of possibleURLs) {
        const workingURL = await testRailwayURL(url);
        if (workingURL) {
            console.log(`\n🎯 URL RAILWAY FONCTIONNELLE: ${workingURL}`);
            console.log(`\n📝 Instructions pour corriger:`);
            console.log(`1. Remplacez dans tous les fichiers JS:`);
            console.log(`   "sorbo-ingenierie-production.up.railway.app" → "${workingURL.replace('https://', '').replace('http://', '')}"`);
            console.log(`\n2. Ou utilisez cette URL complète: ${workingURL}`);
            return workingURL;
        }
    }
    
    console.log('\n❌ Aucune URL Railway fonctionnelle trouvée');
    console.log('\n💡 Solutions possibles:');
    console.log('1. Vérifiez que votre app Railway est bien déployée');
    console.log('2. Regardez dans Railway Dashboard → votre projet → Deployments');
    console.log('3. Copiez l\'URL réelle depuis le dashboard Railway');
    console.log('4. Ou créez une nouvelle application Railway');
    
    return null;
}

// Exécuter la recherche
findRealRailwayURL();
