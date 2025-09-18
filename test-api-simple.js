const http = require('http');

console.log('🧪 Test simple de l\'API d\'authentification...');

// Test 1: Vérifier que l'API répond
const req1 = http.request({
    hostname: 'localhost',
    port: 3000,
    path: '/api/admin/auth/login',
    method: 'GET'
}, (res) => {
    console.log('📡 Test GET - Status:', res.statusCode);
    let data = '';
    res.on('data', chunk => data += chunk);
    res.on('end', () => {
        console.log('Réponse GET:', data);
    });
});

req1.on('error', (error) => {
    console.error('❌ Erreur GET:', error.message);
});

req1.end();

// Test 2: Test avec données minimales
setTimeout(() => {
    console.log('\n🧪 Test POST avec données minimales...');
    
    const postData = JSON.stringify({
        username: 'admin',
        password: 'AdminSorbo2024!'
    });
    
    const req2 = http.request({
        hostname: 'localhost',
        port: 3000,
        path: '/api/admin/auth/login',
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Content-Length': Buffer.byteLength(postData)
        }
    }, (res) => {
        console.log('📡 Test POST - Status:', res.statusCode);
        console.log('Headers:', res.headers);
        
        let data = '';
        res.on('data', chunk => data += chunk);
        res.on('end', () => {
            try {
                const responseData = JSON.parse(data);
                console.log('Réponse POST:', JSON.stringify(responseData, null, 2));
            } catch (error) {
                console.log('Réponse brute:', data);
            }
        });
    });
    
    req2.on('error', (error) => {
        console.error('❌ Erreur POST:', error.message);
    });
    
    req2.write(postData);
    req2.end();
}, 1000);



