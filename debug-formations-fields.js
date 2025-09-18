// Script pour analyser les champs des formations dans MongoDB
console.log('🔍 === ANALYSE DES CHAMPS FORMATIONS ===\n');

const API_BASE_URL = 'https://sorbo-api-production.up.railway.app';

async function analyzerFormations() {
    try {
        console.log('📡 Récupération des formations...');
        
        const response = await fetch(`${API_BASE_URL}/api/formations`, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        });
        
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        
        const result = await response.json();
        const formations = result.data || result;
        
        console.log(`✅ ${formations.length} formations récupérées\n`);
        
        // Analyser chaque formation
        formations.forEach((formation, index) => {
            console.log(`📋 Formation ${index + 1}:`);
            console.log(`   ID: ${formation._id}`);
            
            // Lister tous les champs disponibles
            const champs = Object.keys(formation);
            console.log(`   📊 Champs disponibles (${champs.length}):`, champs);
            
            // Afficher les valeurs des champs principaux
            const champsImportants = ['titre', 'title', 'nom', 'name', 'description', 'desc', 'prix', 'price', 'categorie', 'category', 'type'];
            
            console.log(`   📝 Valeurs des champs:`);
            champsImportants.forEach(champ => {
                if (formation.hasOwnProperty(champ)) {
                    console.log(`      ${champ}: ${formation[champ] || 'VIDE'}`);
                }
            });
            
            // Afficher tous les champs et leurs valeurs
            console.log(`   🔍 Tous les champs:`);
            Object.entries(formation).forEach(([key, value]) => {
                const displayValue = value === null ? 'NULL' : 
                                   value === undefined ? 'UNDEFINED' : 
                                   value === '' ? 'VIDE' : 
                                   typeof value === 'object' ? JSON.stringify(value).substring(0, 50) + '...' :
                                   String(value).substring(0, 50);
                console.log(`      ${key}: ${displayValue}`);
            });
            
            console.log(''); // Ligne vide
        });
        
        // Recommandations
        console.log(`🎯 === RECOMMANDATIONS ===`);
        
        if (formations.length > 0) {
            const firstFormation = formations[0];
            const champs = Object.keys(firstFormation);
            
            console.log(`📋 Structure détectée avec ${champs.length} champs`);
            
            // Identifier les champs qui pourraient être le titre
            const possibleTitres = champs.filter(champ => 
                champ.toLowerCase().includes('titre') || 
                champ.toLowerCase().includes('title') || 
                champ.toLowerCase().includes('nom') || 
                champ.toLowerCase().includes('name')
            );
            
            if (possibleTitres.length > 0) {
                console.log(`✅ Champs titre possibles:`, possibleTitres);
            } else {
                console.log(`⚠️ Aucun champ titre évident trouvé`);
                console.log(`🔧 Champs disponibles:`, champs);
            }
            
            // Identifier les champs qui pourraient être le prix
            const possiblePrix = champs.filter(champ => 
                champ.toLowerCase().includes('prix') || 
                champ.toLowerCase().includes('price') || 
                champ.toLowerCase().includes('cout') || 
                champ.toLowerCase().includes('tarif')
            );
            
            if (possiblePrix.length > 0) {
                console.log(`✅ Champs prix possibles:`, possiblePrix);
            } else {
                console.log(`⚠️ Aucun champ prix évident trouvé`);
            }
            
            // Génerer un mapping automatique
            console.log(`\n🔧 Mapping automatique suggéré:`);
            console.log(`const mapping = {`);
            champs.forEach(champ => {
                const value = firstFormation[champ];
                if (value !== null && value !== undefined && value !== '') {
                    console.log(`  ${champ}: formation.${champ}, // ${typeof value} - ${String(value).substring(0, 30)}...`);
                }
            });
            console.log(`};`);
        }
        
    } catch (error) {
        console.error(`❌ Erreur: ${error.message}`);
    }
}

// Exécution
analyzerFormations();
