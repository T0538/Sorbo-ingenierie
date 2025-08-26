// Test de la version de l'API Railway et diagnostic MongoDB
console.log('🔍 Diagnostic complet de l\'API Railway...');

const API_BASE_URL = 'https://sorbo-api-production.up.railway.app';

async function testRailwayVersion() {
    try {
        console.log('📡 Test de la version de l\'API Railway...');
        
        // Test 1: Endpoint de santé
        console.log('\n1️⃣ Test de l\'endpoint de santé...');
        const healthResponse = await fetch(`${API_BASE_URL}/api/health`);
        console.log(`   Status: ${healthResponse.status}`);
        
        if (healthResponse.ok) {
            const healthData = await healthResponse.json();
            console.log('   ✅ Données de santé:', healthData);
            
            // Vérifier si MongoDB est mentionné
            if (healthData.mongodb) {
                console.log(`   🗄️ MongoDB: ${healthData.mongodb}`);
            } else {
                console.log('   ⚠️ MongoDB non mentionné dans la réponse');
            }
        }
        
        // Test 2: Endpoint racine
        console.log('\n2️⃣ Test de l\'endpoint racine...');
        try {
            const rootResponse = await fetch(API_BASE_URL);
            console.log(`   Status: ${rootResponse.status}`);
            
            if (rootResponse.ok) {
                const rootData = await rootResponse.json();
                console.log('   ✅ Données racine:', rootData);
            }
        } catch (error) {
            console.log(`   ❌ Erreur endpoint racine: ${error.message}`);
        }
        
        // Test 3: Endpoint des actualités
        console.log('\n3️⃣ Test de l\'endpoint des actualités...');
        try {
            const actualitesResponse = await fetch(`${API_BASE_URL}/api/actualites`);
            console.log(`   Status: ${actualitesResponse.status}`);
            
            if (actualitesResponse.ok) {
                const actualitesData = await actualitesResponse.json();
                console.log('   ✅ Actualités trouvées:', actualitesData.count || 0);
                
                if (actualitesData.data && actualitesData.data.length > 0) {
                    console.log('   📰 Première actualité:', actualitesData.data[0].titre);
                }
            } else {
                console.log(`   ❌ Erreur HTTP: ${actualitesResponse.status}`);
                
                // Essayer de lire le message d'erreur
                try {
                    const errorData = await actualitesResponse.text();
                    console.log('   📋 Message d\'erreur:', errorData.substring(0, 200));
                } catch (e) {
                    console.log('   📋 Impossible de lire le message d\'erreur');
                }
            }
        } catch (error) {
            console.log(`   ❌ Erreur endpoint actualités: ${error.message}`);
        }
        
        // Test 4: Endpoint des formations
        console.log('\n4️⃣ Test de l\'endpoint des formations...');
        try {
            const formationsResponse = await fetch(`${API_BASE_URL}/api/formations`);
            console.log(`   Status: ${formationsResponse.status}`);
            
            if (formationsResponse.ok) {
                const formationsData = await formationsResponse.json();
                console.log('   ✅ Formations trouvées:', formationsData.count || 0);
            }
        } catch (error) {
            console.log(`   ❌ Erreur endpoint formations: ${error.message}`);
        }
        
        // Test 5: Endpoint des logiciels
        console.log('\n5️⃣ Test de l\'endpoint des logiciels...');
        try {
            const logicielsResponse = await fetch(`${API_BASE_URL}/api/logiciels`);
            console.log(`   Status: ${logicielsResponse.status}`);
            
            if (logicielsResponse.ok) {
                const logicielsData = await logicielsResponse.json();
                console.log('   ✅ Logiciels trouvés:', logicielsData.count || 0);
            }
        } catch (error) {
            console.log(`   ❌ Erreur endpoint logiciels: ${error.message}`);
        }
        
        console.log('\n📋 Résumé du diagnostic:');
        console.log('   - Endpoint de santé: Testé');
        console.log('   - Endpoint racine: Testé');
        console.log('   - Endpoint actualités: Testé');
        console.log('   - Endpoint formations: Testé');
        console.log('   - Endpoint logiciels: Testé');
        
        console.log('\n💡 Prochaines étapes:');
        console.log('   1. Vérifier les logs Railway pour les erreurs MongoDB');
        console.log('   2. Vérifier que le serveur utilise le bon code');
        console.log('   3. Forcer un redéploiement si nécessaire');
        
    } catch (error) {
        console.error('❌ Erreur lors du diagnostic:', error);
    }
}

// Exécuter le diagnostic
testRailwayVersion();
