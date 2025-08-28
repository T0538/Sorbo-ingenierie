/**
 * Script pour tester si le fix des formations manquantes fonctionne
 */

const API_BASE_URL = process.env.API_BASE_URL || 'https://sorbo-api-production.up.railway.app';

async function testFormationsFix() {
  console.log('🔧 Test du fix formations manquantes...\n');
  
  try {
    console.log('📡 Appel API formations...');
    const response = await fetch(`${API_BASE_URL}/api/formations?limit=50`);
    
    if (!response.ok) {
      console.log(`❌ Erreur HTTP: ${response.status}`);
      return;
    }
    
    const data = await response.json();
    console.log(`✅ Réponse reçue. Statut: ${data.success ? 'Success' : 'Failed'}`);
    
    if (data.data && Array.isArray(data.data)) {
      console.log(`\n📊 ${data.data.length} formation(s) trouvée(s) :`);
      console.log(`📝 Total dans la base: ${data.total || 'N/A'}`);
      
      data.data.forEach((formation, index) => {
        const title = formation.title || formation.nom || formation.titre || 'Sans titre';
        const type = formation.type || 'sans type';
        const active = formation.active !== undefined ? `active: ${formation.active}` : 'pas de champ active';
        
        console.log(`  ${index + 1}. ${title} (${type}) - ${active}`);
      });
      
      // Vérifier si les nouvelles formations sont présentes
      const nouveauxTitres = [
        'ArchiCAD',
        'AutoCAD', 
        'Robot',
        'Gestion de projet'
      ];
      
      console.log(`\n🎯 Vérification des nouvelles formations :`);
      nouveauxTitres.forEach(titre => {
        const trouve = data.data.some(f => 
          (f.title || f.nom || f.titre || '').toLowerCase().includes(titre.toLowerCase())
        );
        console.log(`  ${trouve ? '✅' : '❌'} ${titre}: ${trouve ? 'Trouvé' : 'Manquant'}`);
      });
      
    } else {
      console.log('❌ Format de données invalide:', data);
    }
    
  } catch (error) {
    console.log(`❌ Erreur: ${error.message}`);
  }
}

testFormationsFix();
