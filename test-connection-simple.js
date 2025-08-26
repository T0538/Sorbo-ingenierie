const axios = require('axios');

async function testConnection() {
    console.log('🧪 Test de connexion simple...\n');
    
    try {
        // Test de la route racine
        console.log('1️⃣ Test de la route racine...');
        const response = await axios.get('http://localhost:5000', { timeout: 5000 });
        console.log('   ✅ Connexion réussie !');
        console.log(`   📊 Status: ${response.status}`);
        console.log(`   📋 Message: ${response.data.message}`);
        
    } catch (error) {
        if (error.code === 'ECONNREFUSED') {
            console.error('❌ Impossible de se connecter au serveur sur le port 5000');
            console.log('💡 Vérifiez que le serveur est démarré:');
            console.log('   node server-railway-fixed.js');
        } else if (error.code === 'ETIMEDOUT') {
            console.error('❌ Timeout de connexion');
        } else {
            console.error('❌ Erreur:', error.message);
        }
    }
}

testConnection();
