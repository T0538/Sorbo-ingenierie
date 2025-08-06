const axios = require('axios');

// Test de connectivité Railway
async function testRailwayConnection() {
    console.log('🔍 Test de connexion Railway...');
    
    // URLs possibles pour votre projet Railway
    const possibleUrls = [
        'https://sorbo-ingenierie-backend.railway.app',
        'https://sorbo-ingenierie.railway.app',
        'https://sorbo-backend.railway.app',
        'https://sorbo-ingenierie-production.railway.app'
    ];
    
    for (const url of possibleUrls) {
        try {
            console.log(`\n📡 Test de ${url}...`);
            
            // Test de santé
            const healthResponse = await axios.get(`${url}/api/health`, {
                timeout: 5000
            });
            
            if (healthResponse.status === 200) {
                console.log(`✅ SUCCÈS: ${url} est accessible!`);
                console.log('📊 Réponse:', healthResponse.data);
                
                // Test des formations
                try {
                    const formationsResponse = await axios.get(`${url}/api/formations`, {
                        timeout: 5000
                    });
                    
                    if (formationsResponse.status === 200) {
                        console.log(`📚 Formations trouvées: ${formationsResponse.data.data?.length || 0}`);
                    }
                } catch (formationError) {
                    console.log('⚠️  API formations non accessible');
                }
                
                return url; // Retourne l'URL qui fonctionne
            }
            
        } catch (error) {
            console.log(`❌ Échec: ${url} - ${error.message}`);
        }
    }
    
    console.log('\n❌ Aucune URL Railway accessible trouvée');
    return null;
}

// Test de déploiement local pour comparaison
async function testLocalConnection() {
    try {
        console.log('\n🔍 Test de connexion locale...');
        const response = await axios.get('http://localhost:5000/api/health', {
            timeout: 3000
        });
        
        if (response.status === 200) {
            console.log('✅ Serveur local fonctionne');
            return true;
        }
    } catch (error) {
        console.log('❌ Serveur local non accessible');
        return false;
    }
}

// Fonction principale
async function runTests() {
    console.log('🚀 Test de connectivité Railway vs Local...\n');
    
    const railwayUrl = await testRailwayConnection();
    const localWorks = await testLocalConnection();
    
    console.log('\n📋 RÉSUMÉ:');
    console.log('='.repeat(50));
    
    if (railwayUrl) {
        console.log(`✅ Railway: ${railwayUrl} - FONCTIONNE`);
        console.log('💡 Votre plan gratuit est encore actif!');
        console.log('💰 Vous pouvez continuer à utiliser Railway gratuitement');
    } else {
        console.log('❌ Railway: Non accessible');
        console.log('💡 Votre plan gratuit a peut-être expiré');
        console.log('💰 Vous devrez peut-être passer à un plan payant');
    }
    
    if (localWorks) {
        console.log('✅ Local: http://localhost:5000 - FONCTIONNE');
    } else {
        console.log('❌ Local: Non accessible');
    }
    
    console.log('\n🎯 RECOMMANDATIONS:');
    if (railwayUrl) {
        console.log('1. Continuez avec Railway - c\'est gratuit et fonctionne!');
        console.log('2. Mettez à jour votre frontend pour utiliser:', railwayUrl);
    } else {
        console.log('1. Essayez Render.com (gratuit)');
        console.log('2. Ou Vercel.com (gratuit)');
        console.log('3. Ou contactez Railway pour un plan payant');
    }
}

runTests().catch(console.error); 