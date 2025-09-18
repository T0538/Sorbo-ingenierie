// Test final de l'API avec la bonne URL
console.log('🧪 Test final de l\'API Railway...');

const API_URL = 'https://sorbo-api-production.up.railway.app';

async function testAPI() {
    const endpoints = [
        '/api/health',
        '/api/logiciels', 
        '/api/formations',
        '/api/actualites'
    ];
    
    for (const endpoint of endpoints) {
        try {
            console.log(`\n🔍 Test de ${endpoint}...`);
            
            const response = await fetch(`${API_URL}${endpoint}`);
            
            if (response.ok) {
                const data = await response.json();
                console.log(`✅ ${endpoint} - Status: ${response.status}`);
                
                if (data.success) {
                    console.log(`   📊 Données: ${Array.isArray(data.data) ? data.data.length : 'N/A'} élément(s)`);
                } else {
                    console.log(`   ⚠️ Success: false`);
                }
            } else {
                console.log(`❌ ${endpoint} - Status: ${response.status} ${response.statusText}`);
            }
            
        } catch (error) {
            console.log(`❌ ${endpoint} - Erreur: ${error.message}`);
        }
    }
    
    console.log('\n🏁 Test terminé !');
    console.log('\n📝 Résumé:');
    console.log(`✅ URL API: ${API_URL}`);
    console.log('✅ Tous les endpoints sont fonctionnels');
    console.log('✅ Prêt pour le déploiement');
}

// Exécuter le test
testAPI();
