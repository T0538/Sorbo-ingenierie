// Test de l'endpoint de santé Railway
console.log('🏥 Test de l\'endpoint de santé Railway...');

const API_BASE_URL = 'https://sorbo-api-production.up.railway.app';

async function testRailwayHealth() {
    try {
        console.log('📡 Test de l\'endpoint de santé...');
        console.log(`🌐 URL: ${API_BASE_URL}/api/health`);
        
        const response = await fetch(`${API_BASE_URL}/api/health`, {
            method: 'GET',
            headers: {
                'Accept': 'application/json'
            }
        });

        console.log(`📊 Status HTTP: ${response.status}`);
        console.log(`📋 Headers:`, Object.fromEntries(response.headers.entries()));

        if (!response.ok) {
            throw new Error(`Erreur HTTP: ${response.status}`);
        }

        const data = await response.json();
        console.log('✅ Endpoint de santé accessible:', data);
        
        if (data.mongodb === 'connecté') {
            console.log('🎉 MongoDB est connecté sur Railway !');
            console.log('💡 Le problème vient probablement de l\'endpoint /api/actualites');
        } else {
            console.log('⚠️ MongoDB n\'est pas connecté sur Railway');
            console.log('🔧 Vérifiez la variable MONGODB_URI sur Railway');
        }
        
    } catch (error) {
        console.error('❌ Erreur lors du test de santé:', error);
        
        if (error.message.includes('Failed to fetch')) {
            console.log('\n💡 Problèmes possibles:');
            console.log('   1. L\'application Railway n\'est pas démarrée');
            console.log('   2. L\'URL de production est incorrecte');
            console.log('   3. Problème de déploiement Railway');
        } else if (error.message.includes('500')) {
            console.log('\n💡 Erreur 500 détectée:');
            console.log('   1. Problème de démarrage du serveur');
            console.log('   2. Variables d\'environnement manquantes');
            console.log('   3. Erreur dans le code du serveur');
        }
        
        console.log('\n🔧 Solutions:');
        console.log('   1. Vérifier les logs Railway');
        console.log('   2. Vérifier les variables d\'environnement');
        console.log('   3. Forcer un redéploiement');
    }
}

// Test également l'endpoint racine
async function testRailwayRoot() {
    try {
        console.log('\n🏠 Test de l\'endpoint racine...');
        console.log(`🌐 URL: ${API_BASE_URL}/`);
        
        const response = await fetch(API_BASE_URL, {
            method: 'GET',
            headers: {
                'Accept': 'application/json'
            }
        });

        console.log(`📊 Status HTTP: ${response.status}`);

        if (response.ok) {
            const data = await response.json();
            console.log('✅ Endpoint racine accessible:', data);
        } else {
            console.log('⚠️ Endpoint racine non accessible');
        }
        
    } catch (error) {
        console.error('❌ Erreur endpoint racine:', error.message);
    }
}

// Exécuter les tests
async function runAllTests() {
    await testRailwayHealth();
    await testRailwayRoot();
    
    console.log('\n📋 Résumé des tests:');
    console.log('   1. Endpoint de santé : Testé');
    console.log('   2. Endpoint racine : Testé');
    console.log('   3. Endpoint actualités : À tester après résolution des erreurs');
}

runAllTests();
