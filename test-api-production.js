// Test de l'API de production Railway pour les actualités MongoDB
console.log('🧪 Test de l\'API de production Railway...');

const API_BASE_URL = 'https://sorbo-api-production.up.railway.app';

async function testAPIProduction() {
    try {
        console.log('📡 Connexion à l\'API de production Railway...');
        console.log(`🌐 URL: ${API_BASE_URL}/api/actualites`);
        
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
        console.log('✅ Données reçues de Railway:', data);
        
        if (data.success && data.data && data.data.length > 0) {
            console.log(`📰 ${data.data.length} actualités MongoDB trouvées sur Railway !`);
            
            // Afficher les détails de chaque actualité
            data.data.forEach((actualite, index) => {
                console.log(`\n📰 Actualité ${index + 1}:`);
                console.log(`   Titre: ${actualite.titre}`);
                console.log(`   Catégorie: ${actualite.categorie}`);
                console.log(`   Auteur: ${actualite.auteur}`);
                console.log(`   Date: ${actualite.datePublication}`);
                console.log(`   Résumé: ${actualite.resume.substring(0, 80)}...`);
            });
            
            console.log('\n🎉 L\'API de production Railway fonctionne parfaitement !');
            console.log('💡 Les actualités MongoDB s\'afficheront maintenant sur votre site.');
            
        } else {
            console.log('⚠️ Aucune actualité trouvée sur Railway');
        }
        
    } catch (error) {
        console.error('❌ Erreur lors du test de l\'API Railway:', error);
        
        if (error.message.includes('Failed to fetch')) {
            console.log('\n💡 Problèmes possibles:');
            console.log('   1. L\'API Railway n\'est pas encore déployée');
            console.log('   2. Problème de CORS');
            console.log('   3. L\'URL de production est incorrecte');
            console.log('\n🔧 Solutions:');
            console.log('   1. Vérifier que Railway est déployé');
            console.log('   2. Vérifier l\'URL dans railway.json');
            console.log('   3. Tester l\'API directement sur Railway');
        }
    }
}

// Exécuter le test
testAPIProduction();
