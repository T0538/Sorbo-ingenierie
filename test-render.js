const axios = require('axios');

// Test de l'API Render en production
async function testRenderAPI() {
    console.log('🚀 Test de l\'API Render en production...\n');
    
    const renderUrl = 'https://sorbo-ingenierie-1.onrender.com';
    
    try {
        console.log('📡 Test de santé...');
        const healthResponse = await axios.get(`${renderUrl}/api/health`, {
            timeout: 10000 // 10 secondes pour le premier démarrage
        });
        
        if (healthResponse.status === 200) {
            console.log('✅ API Render fonctionne!');
            console.log('📊 Réponse:', healthResponse.data);
            
            // Test des formations
            console.log('\n📚 Test des formations...');
            const formationsResponse = await axios.get(`${renderUrl}/api/formations`, {
                timeout: 10000
            });
            
            if (formationsResponse.status === 200) {
                console.log(`✅ ${formationsResponse.data.data?.length || 0} formations trouvées`);
                console.log('📋 Première formation:', formationsResponse.data.data?.[0]?.title || 'Aucune');
            }
            
            console.log('\n🎉 SUCCÈS: Votre backend est opérationnel!');
            console.log(`🌐 URL: ${renderUrl}`);
            console.log('💡 Vous pouvez maintenant mettre à jour votre frontend');
            
        }
        
    } catch (error) {
        console.log('❌ Erreur:', error.message);
        
        if (error.code === 'ECONNABORTED') {
            console.log('⏰ L\'instance est en cours de démarrage...');
            console.log('🔄 Réessayez dans 30 secondes');
        }
    }
}

testRenderAPI(); 