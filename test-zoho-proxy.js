// Test du proxy Zoho via SendGrid
const testZohoProxy = async () => {
    console.log('🧪 Test du proxy Zoho Mail...');
    
    try {
        // Test 1: Vérifier le statut
        console.log('\n1️⃣ Vérification du statut...');
        const statusResponse = await fetch('https://sorbo-api-production.up.railway.app/api/zoho-proxy/status');
        const statusData = await statusResponse.json();
        console.log('📊 Statut:', statusData);
        
        if (!statusData.success) {
            throw new Error('Service proxy non disponible');
        }
        
        // Test 2: Envoyer un email de test
        console.log('\n2️⃣ Envoi d\'un email de test...');
        const testResponse = await fetch('https://sorbo-api-production.up.railway.app/api/zoho-proxy/test', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                to: 'contact@sorbo-ingenierie.ci',
                subject: 'Test Proxy Zoho',
                text: 'Test du proxy Zoho Mail via SendGrid'
            })
        });
        
        const testData = await testResponse.json();
        console.log('📧 Résultat test:', testData);
        
        if (testData.success) {
            console.log('✅ Test réussi ! Vérifiez votre boîte Zoho Mail.');
        } else {
            console.log('❌ Test échoué:', testData.message);
        }
        
    } catch (error) {
        console.error('❌ Erreur lors du test:', error.message);
    }
};

// Exécuter le test
testZohoProxy();
