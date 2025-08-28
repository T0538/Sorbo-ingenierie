/**
 * Script pour tester l'API actualités
 */

const API_BASE_URL = process.env.API_BASE_URL || 'https://sorbo-api-production.up.railway.app';

async function testActualitesAPI() {
  console.log('🔄 Test de l\'API actualités...\n');
  
  try {
    console.log('📡 URL:', `${API_BASE_URL}/api/actualites`);
    const response = await fetch(`${API_BASE_URL}/api/actualites`);
    
    if (!response.ok) {
      console.log(`❌ Erreur HTTP: ${response.status}`);
      return;
    }
    
    const data = await response.json();
    console.log('✅ Statut:', data.success ? 'Success' : 'Failed');
    
    if (data.data && Array.isArray(data.data)) {
      console.log(`📰 ${data.data.length} actualité(s) trouvée(s):`);
      
      data.data.forEach((actualite, index) => {
        console.log(`\n${index + 1}. ${actualite.title || actualite.titre || 'Sans titre'}`);
        console.log(`   📅 Date: ${actualite.date || actualite.createdAt || 'Pas de date'}`);
        console.log(`   📝 Résumé: ${(actualite.content || actualite.contenu || '').substring(0, 100)}...`);
      });
    } else {
      console.log('📰 Aucune actualité ou format inattendu');
      console.log('Données reçues:', data);
    }
    
  } catch (error) {
    console.log(`❌ Erreur: ${error.message}`);
  }
}

testActualitesAPI();
