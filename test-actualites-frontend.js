// Test du chargement des actualités depuis l'API locale
console.log('🧪 Test du chargement des actualités depuis l\'API locale...');

const API_BASE_URL = 'http://localhost:5000';

async function testChargementActualites() {
    try {
        console.log('📡 Test de connexion à l\'API...');
        
        const response = await fetch(`${API_BASE_URL}/api/actualites`, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error(`Erreur HTTP: ${response.status}`);
        }

        const data = await response.json();
        console.log('✅ Données reçues:', data);
        
        if (data.success && data.data && data.data.length > 0) {
            console.log(`📰 ${data.data.length} actualités trouvées:`);
            data.data.forEach((actualite, index) => {
                console.log(`   ${index + 1}. ${actualite.titre}`);
                console.log(`      - Catégorie: ${actualite.categorie}`);
                console.log(`      - Date: ${actualite.datePublication || actualite.date}`);
                console.log(`      - Résumé: ${actualite.resume}`);
                console.log('');
            });
            
            console.log('🎉 Le chargement des actualités fonctionne parfaitement !');
            console.log('💡 Les actualités MongoDB devraient maintenant s\'afficher sur la page actualites.html');
            
        } else {
            console.log('⚠️ Aucune actualité trouvée dans la base de données');
        }
        
    } catch (error) {
        console.error('❌ Erreur lors du test:', error);
        
        if (error.message.includes('Failed to fetch')) {
            console.log('💡 Assurez-vous que le serveur local est démarré:');
            console.log('   node server-railway.js');
        }
    }
}

// Exécuter le test
testChargementActualites();
