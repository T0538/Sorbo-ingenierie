/**
 * Script de test pour vérifier la connexion aux actualités MongoDB
 */

const axios = require('axios');
const API_BASE_URL = 'https://sorbo-api-production.up.railway.app';

async function testActualitesAPI() {
    try {
        console.log('🧪 Test de l\'API actualités...\n');
        
        // Test 1: Connexion à l'API
        console.log('1️⃣ Test de connexion à l\'API...');
        const response = await axios.get(`${API_BASE_URL}/api/actualites`, {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        });
        
        if (response.status === 200) {
            console.log('   ✅ Connexion réussie');
            console.log(`   📊 Status: ${response.status} ${response.statusText}`);
        } else {
            console.log(`   ❌ Erreur HTTP: ${response.status}`);
            return;
        }
        
        // Test 2: Récupération des données
        console.log('\n2️⃣ Récupération des actualités...');
        const data = response.data;
        
        if (data.success) {
            console.log(`   ✅ ${data.data.length} actualités récupérées`);
            
            if (data.data.length > 0) {
                console.log('\n3️⃣ Détails des actualités:');
                data.data.forEach((actualite, index) => {
                    console.log(`   📰 Actualité ${index + 1}:`);
                    console.log(`      Titre: ${actualite.titre}`);
                    console.log(`      Catégorie: ${actualite.categorie}`);
                    console.log(`      Auteur: ${actualite.auteur || 'Non spécifié'}`);
                    console.log(`      Date: ${actualite.date}`);
                    console.log(`      Tags: ${Array.isArray(actualite.tags) ? actualite.tags.join(', ') : 'Aucun'}`);
                    console.log(`      Image: ${actualite.image || 'Aucune'}`);
                    console.log('');
                });
            } else {
                console.log('   ⚠️ Aucune actualité trouvée dans la base de données');
            }
        } else {
            console.log(`   ❌ Erreur API: ${data.message || 'Message d\'erreur non spécifié'}`);
        }
        
        // Test 3: Vérification de la structure des données
        console.log('4️⃣ Vérification de la structure des données...');
        if (data.data && data.data.length > 0) {
            const firstActualite = data.data[0];
            const requiredFields = ['titre', 'description', 'categorie', 'date'];
            const missingFields = requiredFields.filter(field => !firstActualite[field]);
            
            if (missingFields.length === 0) {
                console.log('   ✅ Structure des données correcte');
            } else {
                console.log(`   ⚠️ Champs manquants: ${missingFields.join(', ')}`);
            }
        }
        
        console.log('\n🎉 Test terminé avec succès !');
        
    } catch (error) {
        console.error('❌ Erreur lors du test:', error);
        
        if (error.name === 'TypeError' && error.message.includes('fetch')) {
            console.log('💡 Vérifiez que vous êtes connecté à Internet');
        }
    }
}

// Exécuter le test
if (require.main === module) {
    testActualitesAPI();
} else {
    // Si importé comme module
    module.exports = { testActualitesAPI };
}
