#!/usr/bin/env node

const axios = require('axios');
const colors = require('colors');

const BASE_URL = process.env.API_URL || 'http://localhost:5000';

console.log('🧪 Test Rapide - Backend Sorbo Ingénierie\n'.bold.cyan);

// Configuration des couleurs
colors.setTheme({
  success: 'green',
  error: 'red',
  info: 'blue',
  warning: 'yellow'
});

// Fonction de test
async function testEndpoint(method, endpoint, data = null, description = '') {
  try {
    const config = {
      method,
      url: `${BASE_URL}${endpoint}`,
      headers: {
        'Content-Type': 'application/json'
      }
    };

    if (data) {
      config.data = data;
    }

    const start = Date.now();
    const response = await axios(config);
    const duration = Date.now() - start;

    console.log(`✅ ${description || `${method} ${endpoint}`}`.success);
    console.log(`   Status: ${response.status} | Temps: ${duration}ms`.info);
    
    if (response.data && Object.keys(response.data).length > 0) {
      console.log(`   Données: ${JSON.stringify(response.data).substring(0, 100)}...`.info);
    }
    
    return { success: true, data: response.data, duration };
  } catch (error) {
    console.log(`❌ ${description || `${method} ${endpoint}`}`.error);
    console.log(`   Erreur: ${error.response?.status || error.code} - ${error.message}`.error);
    return { success: false, error: error.message };
  }
}

// Tests principaux
async function runTests() {
  console.log('🚀 Démarrage des tests...\n'.info);

  const tests = [
    // Test de santé
    {
      method: 'GET',
      endpoint: '/api/health',
      description: 'Test de santé du serveur'
    },
    
    // Test des statistiques
    {
      method: 'GET',
      endpoint: '/api/stats',
      description: 'Test des statistiques'
    },
    
    // Test des formations
    {
      method: 'GET',
      endpoint: '/api/formations',
      description: 'Test de récupération des formations'
    },
    
    // Test de création d'un contact
    {
      method: 'POST',
      endpoint: '/api/contact',
      data: {
        name: 'Test User',
        email: 'test@sorbo-ingenierie.com',
        phone: '+1234567890',
        subject: 'formation',
        message: 'Ceci est un test automatique'
      },
      description: 'Test de création d\'un contact'
    },
    
    // Test des emplois
    {
      method: 'GET',
      endpoint: '/api/emplois',
      description: 'Test de récupération des emplois'
    },
    
    // Test des projets
    {
      method: 'GET',
      endpoint: '/api/projets',
      description: 'Test de récupération des projets'
    },
    
    // Test des logiciels
    {
      method: 'GET',
      endpoint: '/api/logiciels',
      description: 'Test de récupération des logiciels'
    }
  ];

  let passed = 0;
  let failed = 0;
  let totalDuration = 0;

  for (const test of tests) {
    const result = await testEndpoint(
      test.method,
      test.endpoint,
      test.data,
      test.description
    );
    
    if (result.success) {
      passed++;
      totalDuration += result.duration;
    } else {
      failed++;
    }
    
    console.log(''); // Ligne vide pour la lisibilité
  }

  // Résumé
  console.log('📊 Résumé des tests'.bold.cyan);
  console.log(`✅ Tests réussis: ${passed}`.success);
  console.log(`❌ Tests échoués: ${failed}`.error);
  console.log(`⏱️  Temps total: ${totalDuration}ms`.info);
  console.log(`📈 Temps moyen: ${passed > 0 ? Math.round(totalDuration / passed) : 0}ms`.info);

  if (failed === 0) {
    console.log('\n🎉 Tous les tests sont passés !'.bold.green);
  } else {
    console.log('\n⚠️  Certains tests ont échoué.'.bold.yellow);
  }
}

// Test de performance
async function performanceTest() {
  console.log('\n⚡ Test de performance...'.info);
  
  const iterations = 10;
  const results = [];
  
  for (let i = 0; i < iterations; i++) {
    const start = Date.now();
    try {
      await axios.get(`${BASE_URL}/api/health`);
      const duration = Date.now() - start;
      results.push(duration);
    } catch (error) {
      console.log(`❌ Erreur lors du test de performance: ${error.message}`.error);
      return;
    }
  }
  
  const avg = results.reduce((a, b) => a + b, 0) / results.length;
  const min = Math.min(...results);
  const max = Math.max(...results);
  
  console.log(`📊 Performance (${iterations} requêtes):`.info);
  console.log(`   Moyenne: ${Math.round(avg)}ms`.info);
  console.log(`   Min: ${min}ms`.success);
  console.log(`   Max: ${max}ms`.warning);
}

// Test de connectivité
async function connectivityTest() {
  console.log('\n🔗 Test de connectivité...'.info);
  
  try {
    const response = await axios.get(`${BASE_URL}/api/health`, {
      timeout: 5000
    });
    
    if (response.data.status === 'OK') {
      console.log('✅ Serveur accessible et fonctionnel'.success);
      console.log(`   Uptime: ${Math.round(response.data.uptime)}s`.info);
      console.log(`   Redis: ${response.data.redis}`.info);
    } else {
      console.log('⚠️  Serveur accessible mais statut anormal'.warning);
    }
  } catch (error) {
    console.log('❌ Serveur inaccessible'.error);
    console.log(`   Erreur: ${error.message}`.error);
    console.log('\n💡 Vérifiez que le serveur est démarré avec:'.info);
    console.log('   npm run dev'.info);
  }
}

// Fonction principale
async function main() {
  try {
    await connectivityTest();
    await runTests();
    await performanceTest();
    
    console.log('\n🎯 Tests terminés !'.bold.cyan);
  } catch (error) {
    console.log(`\n💥 Erreur lors des tests: ${error.message}`.error);
    process.exit(1);
  }
}

// Exécuter les tests
if (require.main === module) {
  main();
}

module.exports = { testEndpoint, runTests, performanceTest, connectivityTest }; 