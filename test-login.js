const http = require('http');

function testLogin() {
    console.log('🧪 Test de connexion admin...');
    
    const postData = JSON.stringify({
        username: 'admin',
        password: 'AdminSorbo2024!'
    });
    
    const options = {
        hostname: 'localhost',
        port: 3000,
        path: '/api/admin/auth/login',
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Content-Length': Buffer.byteLength(postData)
        }
    };
    
    const req = http.request(options, (res) => {
        console.log('📡 Réponse du serveur:');
        console.log('Status:', res.statusCode);
        console.log('Headers:', res.headers);
        
        let data = '';
        res.on('data', (chunk) => {
            data += chunk;
        });
        
        res.on('end', () => {
            try {
                const responseData = JSON.parse(data);
                console.log('Data:', JSON.stringify(responseData, null, 2));
                
                if (res.statusCode === 200 && responseData.success) {
                    console.log('✅ Connexion réussie !');
                    console.log('Token:', responseData.data.token);
                    console.log('User:', responseData.data.user);
                } else {
                    console.log('❌ Échec de la connexion');
                }
            } catch (error) {
                console.error('❌ Erreur parsing JSON:', error.message);
                console.log('Raw response:', data);
            }
        });
    });
    
    req.on('error', (error) => {
        console.error('❌ Erreur lors du test:', error.message);
    });
    
    req.write(postData);
    req.end();
}

testLogin();
