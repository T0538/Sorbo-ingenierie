const axios = require('axios');

const BASE_URL = 'http://localhost:5000';

console.log('🧪 Test MongoDB - Backend Sorbo Ingénierie\n');

// Test de connectivité
async function testHealth() {
  try {
    console.log('🔗 Test de connectivité...');
    const response = await axios.get(`${BASE_URL}/api/health`);
    console.log('✅ Serveur accessible');
    console.log(`   Status: ${response.data.status}`);
    console.log(`   Database: ${response.data.database}`);
    return true;
  } catch (error) {
    console.log('❌ Serveur inaccessible');
    console.log(`   Erreur: ${error.message}`);
    return false;
  }
}

// Test de l'API
async function testAPI() {
  try {
    console.log('\n📡 Test de l\'API...');
    const response = await axios.get(`${BASE_URL}/api/test`);
    console.log('✅ API fonctionnelle');
    console.log(`   Message: ${response.data.message}`);
    console.log(`   Contacts: ${response.data.data.contacts}`);
    console.log(`   Formations: ${response.data.data.formations}`);
    return true;
  } catch (error) {
    console.log('❌ API non fonctionnelle');
    console.log(`   Erreur: ${error.message}`);
    return false;
  }
}

// Test de création d'un contact
async function testContact() {
  try {
    console.log('\n📞 Test de création d\'un contact...');
    const contactData = {
      name: 'Test User MongoDB',
      email: 'test-mongodb@sorbo-ingenierie.com',
      phone: '+1234567890',
      subject: 'formation',
      message: 'Test avec MongoDB Atlas'
    };
    
    const response = await axios.post(`${BASE_URL}/api/contact`, contactData);
    console.log('✅ Contact créé avec succès');
    console.log(`   Status: ${response.status}`);
    console.log(`   ID: ${response.data.data.id}`);
    console.log(`   Message: ${response.data.message}`);
    return true;
  } catch (error) {
    console.log('❌ Erreur lors de la création du contact');
    console.log(`   Erreur: ${error.response?.data?.message || error.message}`);
    return false;
  }
}

// Test des formations
async function testFormations() {
  try {
    console.log('\n🎓 Test de récupération des formations...');
    const response = await axios.get(`${BASE_URL}/api/formations`);
    console.log('✅ Formations récupérées avec succès');
    console.log(`   Nombre de formations: ${response.data.data.length}`);
    return true;
  } catch (error) {
    console.log('❌ Erreur lors de la récupération des formations');
    console.log(`   Erreur: ${error.response?.data?.message || error.message}`);
    return false;
  }
}

// Fonction principale
async function runTests() {
  console.log('🚀 Démarrage des tests MongoDB...\n');
  
  const tests = [
    { name: 'Connectivité', fn: testHealth },
    { name: 'API', fn: testAPI },
    { name: 'Contact', fn: testContact },
    { name: 'Formations', fn: testFormations }
  ];
  
  let passed = 0;
  let failed = 0;
  
  for (const test of tests) {
    const result = await test.fn();
    if (result) {
      passed++;
    } else {
      failed++;
    }
  }
  
  // Résumé
  console.log('\n📊 Résumé des tests');
  console.log(`✅ Tests réussis: ${passed}`);
  console.log(`❌ Tests échoués: ${failed}`);
  
  if (failed === 0) {
    console.log('\n🎉 Tous les tests sont passés !');
    console.log('\n🎯 Votre backend avec MongoDB Atlas fonctionne parfaitement !');
  } else {
    console.log('\n⚠️  Certains tests ont échoué.');
  }
}

// Exécuter les tests
runTests().catch(error => {
  console.log(`\n💥 Erreur lors des tests: ${error.message}`);
  process.exit(1);
}); 