/**
 * Script pour ajouter des actualités de test dans MongoDB Atlas
 */

const fs = require('fs');

const API_BASE_URL = process.env.API_BASE_URL || 'https://sorbo-api-production.up.railway.app';

async function addActualitesTest() {
  console.log('📰 Ajout d\'actualités de test dans MongoDB Atlas...\n');
  
  try {
    // Lire le fichier JSON des actualités de test
    const actualitesData = JSON.parse(fs.readFileSync('actualites-test.json', 'utf8'));
    console.log(`📝 ${actualitesData.length} actualités à ajouter`);
    
    for (let i = 0; i < actualitesData.length; i++) {
      const actualite = actualitesData[i];
      console.log(`\n${i + 1}. Ajout de "${actualite.title}"...`);
      
      try {
        const response = await fetch(`${API_BASE_URL}/api/actualites`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          body: JSON.stringify(actualite)
        });
        
        if (response.ok) {
          const result = await response.json();
          console.log(`   ✅ Ajouté avec succès (ID: ${result.data?._id || 'N/A'})`);
        } else {
          console.log(`   ❌ Erreur HTTP: ${response.status}`);
          const errorText = await response.text();
          console.log(`   📝 Détails: ${errorText.substring(0, 200)}`);
        }
      } catch (error) {
        console.log(`   ❌ Erreur: ${error.message}`);
      }
    }
    
    console.log('\n🎯 Vérification finale...');
    await testActualitesAPI();
    
  } catch (error) {
    console.log(`❌ Erreur lors de la lecture du fichier: ${error.message}`);
  }
}

async function testActualitesAPI() {
  try {
    const response = await fetch(`${API_BASE_URL}/api/actualites`);
    
    if (response.ok) {
      const data = await response.json();
      if (data.data && Array.isArray(data.data)) {
        console.log(`✅ ${data.data.length} actualité(s) maintenant disponible(s) dans l'API`);
      } else {
        console.log('❌ Format de réponse inattendu');
      }
    } else {
      console.log(`❌ API toujours en erreur: ${response.status}`);
    }
  } catch (error) {
    console.log(`❌ Erreur de test: ${error.message}`);
  }
}

addActualitesTest();
