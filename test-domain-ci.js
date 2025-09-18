// Script de test pour vérifier la configuration du domaine .ci
const https = require('https');
const http = require('http');
const dns = require('dns');
const util = require('util');

const resolveDns = util.promisify(dns.resolve);
const lookup = util.promisify(dns.lookup);

console.log('🔍 === TEST DE CONFIGURATION DOMAINE .CI ===\n');

// Configuration
const domains = [
    'sorbo-ingenierie.ci',
    'www.sorbo-ingenierie.ci'
];

const railwayAPI = 'https://sorbo-api-production.up.railway.app';
const netlifyDomain = 'sorbo-ingenierie.netlify.app';

// Fonction pour faire une requête HTTP
function makeRequest(url, options = {}) {
    return new Promise((resolve, reject) => {
        const protocol = url.startsWith('https') ? https : http;
        
        const requestOptions = {
            timeout: 10000,
            headers: {
                'User-Agent': 'Sorbo-Domain-Test/1.0',
                'Accept': 'application/json, text/html, */*',
                ...options.headers
            },
            ...options
        };
        
        const req = protocol.get(url, requestOptions, (res) => {
            let data = '';
            
            res.on('data', (chunk) => {
                data += chunk;
            });
            
            res.on('end', () => {
                resolve({
                    statusCode: res.statusCode,
                    headers: res.headers,
                    data: data,
                    url: url
                });
            });
        });
        
        req.on('error', (error) => {
            reject({
                error: error.message,
                code: error.code,
                url: url
            });
        });
        
        req.on('timeout', () => {
            req.destroy();
            reject({
                error: 'Timeout',
                code: 'TIMEOUT',
                url: url
            });
        });
    });
}

// Test de résolution DNS
async function testDNS(domain) {
    console.log(`🔍 Test DNS pour ${domain}...`);
    
    try {
        // Test de résolution A
        const ipv4 = await lookup(domain, { family: 4 });
        console.log(`✅ IPv4: ${ipv4.address}`);
        
        // Test de résolution CNAME
        try {
            const cname = await resolveDns(domain, 'CNAME');
            console.log(`✅ CNAME: ${cname.join(', ')}`);
        } catch (error) {
            console.log(`ℹ️ Pas de CNAME (normal si record A direct)`);
        }
        
        return true;
        
    } catch (error) {
        console.log(`❌ Erreur DNS: ${error.message}`);
        return false;
    }
}

// Test de connectivité HTTP
async function testHTTP(domain) {
    console.log(`\n🌐 Test HTTP pour ${domain}...`);
    
    const urls = [
        `https://${domain}`,
        `https://${domain}/nos-logiciels.html`,
        `http://${domain}` // Fallback HTTP
    ];
    
    for (const url of urls) {
        try {
            console.log(`🔍 Tentative: ${url}`);
            const response = await makeRequest(url);
            
            console.log(`✅ Status: ${response.statusCode}`);
            console.log(`📄 Content-Type: ${response.headers['content-type'] || 'Non spécifié'}`);
            console.log(`📏 Taille: ${response.data.length} bytes`);
            
            // Vérifier si c'est du HTML valide
            if (response.data.includes('<html') || response.data.includes('<!DOCTYPE')) {
                console.log('✅ Contenu HTML valide détecté');
            }
            
            // Vérifier si c'est une redirection vers Netlify
            if (response.headers.location && response.headers.location.includes('netlify')) {
                console.log(`🔄 Redirection vers Netlify: ${response.headers.location}`);
            }
            
            return true;
            
        } catch (error) {
            console.log(`❌ Erreur ${url}: ${error.error} (${error.code})`);
        }
    }
    
    return false;
}

// Test de l'API Railway
async function testRailwayAPI() {
    console.log(`\n🚂 Test de l'API Railway...`);
    
    const endpoints = [
        '/api/health',
        '/api/logiciels',
        '/api/formations',
        '/api/actualites'
    ];
    
    let successCount = 0;
    
    for (const endpoint of endpoints) {
        try {
            console.log(`🔍 Test: ${railwayAPI}${endpoint}`);
            const response = await makeRequest(`${railwayAPI}${endpoint}`);
            
            if (response.statusCode === 200) {
                console.log(`✅ ${endpoint}: OK`);
                successCount++;
                
                // Essayer de parser le JSON
                try {
                    const data = JSON.parse(response.data);
                    if (Array.isArray(data)) {
                        console.log(`📊 ${data.length} éléments retournés`);
                    } else if (data.message) {
                        console.log(`📄 Message: ${data.message}`);
                    }
                } catch (parseError) {
                    console.log(`⚠️ Réponse non-JSON`);
                }
                
            } else {
                console.log(`❌ ${endpoint}: ${response.statusCode}`);
            }
            
        } catch (error) {
            console.log(`❌ ${endpoint}: ${error.error} (${error.code})`);
        }
    }
    
    console.log(`\n📊 API Railway: ${successCount}/${endpoints.length} endpoints fonctionnels`);
    return successCount === endpoints.length;
}

// Test de comparaison Netlify vs .ci
async function compareWithNetlify() {
    console.log(`\n🔄 Comparaison Netlify vs .ci...`);
    
    try {
        // Test Netlify
        console.log(`🔍 Test Netlify: https://${netlifyDomain}`);
        const netlifyResponse = await makeRequest(`https://${netlifyDomain}`);
        console.log(`✅ Netlify Status: ${netlifyResponse.statusCode}`);
        
        // Test domaine .ci
        for (const domain of domains) {
            console.log(`🔍 Test .ci: https://${domain}`);
            try {
                const ciResponse = await makeRequest(`https://${domain}`);
                console.log(`✅ ${domain} Status: ${ciResponse.statusCode}`);
                
                // Comparer les contenus
                if (netlifyResponse.data.length > 0 && ciResponse.data.length > 0) {
                    const sizeDiff = Math.abs(netlifyResponse.data.length - ciResponse.data.length);
                    const percentDiff = (sizeDiff / netlifyResponse.data.length) * 100;
                    
                    if (percentDiff < 10) {
                        console.log(`✅ Contenu similaire (différence: ${percentDiff.toFixed(1)}%)`);
                    } else {
                        console.log(`⚠️ Contenu différent (différence: ${percentDiff.toFixed(1)}%)`);
                    }
                }
                
            } catch (error) {
                console.log(`❌ ${domain}: ${error.error} (${error.code})`);
            }
        }
        
    } catch (error) {
        console.log(`❌ Erreur lors de la comparaison: ${error.error}`);
    }
}

// Test des headers CORS
async function testCORS() {
    console.log(`\n🔧 Test des headers CORS...`);
    
    try {
        const response = await makeRequest(`${railwayAPI}/api/health`);
        
        const corsHeaders = [
            'access-control-allow-origin',
            'access-control-allow-methods',
            'access-control-allow-headers'
        ];
        
        console.log('📋 Headers CORS:');
        corsHeaders.forEach(header => {
            const value = response.headers[header];
            if (value) {
                console.log(`✅ ${header}: ${value}`);
            } else {
                console.log(`❌ ${header}: Non configuré`);
            }
        });
        
        return true;
        
    } catch (error) {
        console.log(`❌ Erreur test CORS: ${error.error}`);
        return false;
    }
}

// Fonction principale
async function runTests() {
    console.log(`🕐 Démarrage des tests à ${new Date().toLocaleString()}\n`);
    
    const results = {
        dns: {},
        http: {},
        railway: false,
        netlify: false,
        cors: false
    };
    
    // Test DNS pour chaque domaine
    for (const domain of domains) {
        results.dns[domain] = await testDNS(domain);
        console.log(''); // Ligne vide
    }
    
    // Test HTTP pour chaque domaine
    for (const domain of domains) {
        results.http[domain] = await testHTTP(domain);
    }
    
    // Test API Railway
    results.railway = await testRailwayAPI();
    
    // Test CORS
    results.cors = await testCORS();
    
    // Comparaison avec Netlify
    await compareWithNetlify();
    
    // Résumé final
    console.log(`\n📊 === RÉSUMÉ DES TESTS ===`);
    
    console.log(`\n🌐 DNS:`);
    Object.entries(results.dns).forEach(([domain, success]) => {
        console.log(`   ${success ? '✅' : '❌'} ${domain}`);
    });
    
    console.log(`\n🔗 HTTP:`);
    Object.entries(results.http).forEach(([domain, success]) => {
        console.log(`   ${success ? '✅' : '❌'} ${domain}`);
    });
    
    console.log(`\n🚂 API Railway: ${results.railway ? '✅' : '❌'}`);
    console.log(`🔧 CORS: ${results.cors ? '✅' : '❌'}`);
    
    // Diagnostic et recommandations
    console.log(`\n💡 === DIAGNOSTIC ===`);
    
    const dnsOk = Object.values(results.dns).some(v => v);
    const httpOk = Object.values(results.http).some(v => v);
    
    if (!dnsOk) {
        console.log(`❌ PROBLÈME DNS:`);
        console.log(`   - Les domaines .ci ne sont pas configurés correctement`);
        console.log(`   - Vérifiez les records DNS chez votre fournisseur`);
        console.log(`   - Assurez-vous que les domaines pointent vers Netlify`);
    }
    
    if (!httpOk && dnsOk) {
        console.log(`❌ PROBLÈME HTTP:`);
        console.log(`   - DNS OK mais site non accessible`);
        console.log(`   - Vérifiez la configuration Netlify`);
        console.log(`   - Vérifiez les certificats SSL`);
    }
    
    if (!results.railway) {
        console.log(`❌ PROBLÈME API:`);
        console.log(`   - L'API Railway n'est pas accessible`);
        console.log(`   - Vérifiez le déploiement Railway`);
        console.log(`   - Vérifiez les variables d'environnement`);
    }
    
    if (!results.cors) {
        console.log(`❌ PROBLÈME CORS:`);
        console.log(`   - Headers CORS non configurés`);
        console.log(`   - Ajoutez les domaines .ci à la configuration CORS`);
    }
    
    if (dnsOk && httpOk && results.railway) {
        console.log(`✅ TOUT FONCTIONNE:`);
        console.log(`   - Les domaines .ci sont correctement configurés`);
        console.log(`   - L'API Railway est accessible`);
        console.log(`   - Le site devrait fonctionner correctement`);
    }
    
    console.log(`\n🕐 Tests terminés à ${new Date().toLocaleString()}`);
}

// Exécuter les tests
runTests().catch(error => {
    console.error(`💥 Erreur fatale: ${error.message}`);
    process.exit(1);
});
