const axios = require('axios');

const API_BASE_URL = 'http://localhost:5000';

async function testPreDeploiement() {
    console.log('🧪 Test pré-déploiement Railway...\n');
    
    try {
        // 1. Test de la route racine
        console.log('1️⃣ Test de la route racine...');
        const rootResponse = await axios.get(API_BASE_URL);
        console.log('   ✅ Route racine accessible');
        console.log(`   📊 Version: ${rootResponse.data.version}`);
        console.log(`   📡 MongoDB: ${rootResponse.data.mongodb}`);
        
        // 2. Test de la route de santé
        console.log('\n2️⃣ Test de la route de santé...');
        const healthResponse = await axios.get(`${API_BASE_URL}/api/health`);
        console.log('   ✅ Route de santé accessible');
        console.log(`   📊 Status: ${healthResponse.data.message}`);
        console.log(`   📡 MongoDB: ${healthResponse.data.mongodb}`);
        
        // 3. Test de la route des actualités
        console.log('\n3️⃣ Test de la route des actualités...');
        const actualitesResponse = await axios.get(`${API_BASE_URL}/api/actualites`);
        console.log('   ✅ Route des actualités accessible');
        console.log(`   📊 Status: ${actualitesResponse.status}`);
        console.log(`   📰 Actualités trouvées: ${actualitesResponse.data.count}`);
        console.log(`   📡 Source: ${actualitesResponse.data.source}`);
        
        // 4. Test des autres endpoints
        console.log('\n4️⃣ Test des autres endpoints...');
        
        // Formations
        const formationsResponse = await axios.get(`${API_BASE_URL}/api/formations`);
        console.log(`   📚 Formations: ${formationsResponse.data.count} trouvées`);
        
        // Logiciels
        const logicielsResponse = await axios.get(`${API_BASE_URL}/api/logiciels`);
        console.log(`   💻 Logiciels: ${logicielsResponse.data.count} trouvés`);
        
        console.log('\n🎉 Tous les tests sont passés avec succès !');
        console.log('🚀 Le serveur est prêt pour le déploiement sur Railway !');
        console.log('\n💡 Prochaines étapes:');
        console.log('   1. Configurer les variables d\'environnement sur Railway');
        console.log('   2. Pousser le code sur Git');
        console.log('   3. Railway déploie automatiquement');
        
    } catch (error) {
        if (error.code === 'ECONNREFUSED') {
            console.error('❌ Impossible de se connecter au serveur');
            console.log('💡 Assurez-vous que le serveur est démarré:');
            console.log('   node server-railway.js');
        } else if (error.response) {
            console.error(`❌ Erreur HTTP: ${error.response.status}`);
            console.error(`📋 Message: ${error.response.data.message || 'Aucun message'}`);
        } else {
            console.error('❌ Erreur lors du test:', error.message);
        }
    }
}

testPreDeploiement();
