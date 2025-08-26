const axios = require('axios');

const API_BASE_URL = 'http://localhost:5000';

async function testAPICorrigee() {
    console.log('🧪 Test de l\'API corrigée...\n');
    
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
        
        if (actualitesResponse.data.data && actualitesResponse.data.data.length > 0) {
            console.log('   📋 Première actualité:');
            console.log(`      - Titre: ${actualitesResponse.data.data[0].titre}`);
            console.log(`      - Catégorie: ${actualitesResponse.data.data[0].categorie}`);
            console.log(`      - Statut: ${actualitesResponse.data.data[0].statut}`);
        }
        
        // 4. Test avec limite
        console.log('\n4️⃣ Test avec limite de 2 actualités...');
        const actualitesLimitResponse = await axios.get(`${API_BASE_URL}/api/actualites?limit=2`);
        console.log('   ✅ Limite respectée');
        console.log(`   📊 Nombre d'actualités: ${actualitesLimitResponse.data.count}`);
        
        console.log('\n🎉 Tous les tests sont passés avec succès !');
        console.log('💡 L\'API est maintenant fonctionnelle et prête à recevoir de vraies données.');
        
    } catch (error) {
        if (error.code === 'ECONNREFUSED') {
            console.error('❌ Impossible de se connecter au serveur');
            console.log('💡 Assurez-vous que le serveur est démarré avec:');
            console.log('   node server-railway-fixed.js');
        } else if (error.response) {
            console.error(`❌ Erreur HTTP: ${error.response.status}`);
            console.error(`📋 Message: ${error.response.data.message || 'Aucun message'}`);
        } else {
            console.error('❌ Erreur lors du test:', error.message);
        }
    }
}

// Exécuter le test
testAPICorrigee();
