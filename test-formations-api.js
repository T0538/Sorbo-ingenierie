// Test de l'API formations
const https = require('https');

console.log('🧪 === TEST API FORMATIONS ===\n');

const apiUrl = 'https://sorbo-api-production.up.railway.app/api/formations';

function testFormationsAPI() {
    return new Promise((resolve, reject) => {
        console.log(`🔍 Test de l'endpoint: ${apiUrl}`);
        
        const req = https.get(apiUrl, {
            headers: {
                'Accept': 'application/json',
                'User-Agent': 'Sorbo-Test/1.0'
            },
            timeout: 10000
        }, (res) => {
            let data = '';
            
            console.log(`📊 Status: ${res.statusCode}`);
            console.log(`📋 Headers CORS:`);
            console.log(`   Access-Control-Allow-Origin: ${res.headers['access-control-allow-origin'] || 'Non configuré'}`);
            console.log(`   Access-Control-Allow-Methods: ${res.headers['access-control-allow-methods'] || 'Non configuré'}`);
            
            res.on('data', (chunk) => {
                data += chunk;
            });
            
            res.on('end', () => {
                try {
                    const result = JSON.parse(data);
                    
                    console.log(`\n✅ Réponse API réussie:`);
                    console.log(`📊 Nombre de formations: ${result.data ? result.data.length : 0}`);
                    console.log(`📄 Structure de la réponse:`, {
                        success: result.success,
                        count: result.count,
                        total: result.total,
                        pagination: result.pagination
                    });
                    
                    if (result.data && result.data.length > 0) {
                        console.log(`\n📋 Exemple de formation:`);
                        const firstFormation = result.data[0];
                        console.log(`   ID: ${firstFormation._id}`);
                        console.log(`   Titre: ${firstFormation.titre}`);
                        console.log(`   Catégorie: ${firstFormation.categorie}`);
                        console.log(`   Prix: ${firstFormation.prix} FCFA`);
                        console.log(`   Durée: ${firstFormation.duree}`);
                        console.log(`   Localisation: ${firstFormation.localisation}`);
                        console.log(`   Status: ${firstFormation.status}`);
                        
                        // Vérifier les champs requis
                        const requiredFields = ['_id', 'titre', 'categorie', 'prix'];
                        const missingFields = requiredFields.filter(field => !firstFormation[field]);
                        
                        if (missingFields.length === 0) {
                            console.log(`✅ Tous les champs requis sont présents`);
                        } else {
                            console.log(`⚠️ Champs manquants: ${missingFields.join(', ')}`);
                        }
                        
                        console.log(`\n📝 Toutes les formations:`);
                        result.data.forEach((formation, index) => {
                            console.log(`   ${index + 1}. ${formation.titre} (${formation.categorie}) - ${formation.prix} FCFA`);
                        });
                    }
                    
                    resolve(result);
                    
                } catch (error) {
                    console.log(`❌ Erreur de parsing JSON: ${error.message}`);
                    console.log(`📄 Réponse brute (premiers 500 caractères):`);
                    console.log(data.substring(0, 500));
                    reject(error);
                }
            });
        });
        
        req.on('error', (error) => {
            console.log(`❌ Erreur de requête: ${error.message}`);
            reject(error);
        });
        
        req.on('timeout', () => {
            console.log(`❌ Timeout de la requête`);
            req.destroy();
            reject(new Error('Timeout'));
        });
    });
}

// Test principal
async function runTest() {
    try {
        const result = await testFormationsAPI();
        
        console.log(`\n🎯 === RÉSUMÉ DU TEST ===`);
        console.log(`✅ API accessible: OUI`);
        console.log(`📊 Formations trouvées: ${result.data ? result.data.length : 0}`);
        console.log(`💾 Données valides: ${result.success ? 'OUI' : 'NON'}`);
        
        if (result.data && result.data.length > 0) {
            console.log(`\n💡 === SOLUTION ===`);
            console.log(`✅ L'API retourne bien les formations de MongoDB Atlas`);
            console.log(`✅ Le nouveau script formations-loader-fixed.js devrait les charger`);
            console.log(`🔧 Vérifiez que le script est bien chargé sur la page nos-formations.html`);
            console.log(`🌐 Testez sur le domaine .ci après déploiement`);
        } else {
            console.log(`\n⚠️ === PROBLÈME ===`);
            console.log(`❌ Aucune formation retournée par l'API`);
            console.log(`🔧 Vérifiez la base de données MongoDB Atlas`);
        }
        
    } catch (error) {
        console.log(`\n❌ === ÉCHEC DU TEST ===`);
        console.log(`💥 Erreur: ${error.message}`);
        console.log(`🔧 Vérifiez la connectivité et la configuration Railway`);
    }
}

// Exécuter le test
runTest();
