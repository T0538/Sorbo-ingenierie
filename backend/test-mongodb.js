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
    console.log(`   ID: ${response.data.data._id}`);
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

// Test des actualités
async function testActualites() {
  try {
    console.log('\n📰 Test de récupération des actualités...');
    const response = await axios.get(`${BASE_URL}/api/actualites`);
    console.log('✅ Actualités récupérées avec succès');
    console.log(`   Nombre d'actualités: ${response.data.data.length}`);
    return true;
  } catch (error) {
    console.log('❌ Erreur lors de la récupération des actualités');
    console.log(`   Erreur: ${error.response?.data?.message || error.message}`);
    return false;
  }
}

// Test des logiciels
async function testLogiciels() {
  try {
    console.log('\n💻 Test de récupération des logiciels...');
    const response = await axios.get(`${BASE_URL}/api/logiciels`);
    console.log('✅ Logiciels récupérés avec succès');
    console.log(`   Nombre de logiciels: ${response.data.data.length}`);
    return true;
  } catch (error) {
    console.log('❌ Erreur lors de la récupération des logiciels');
    console.log(`   Erreur: ${error.response?.data?.message || error.message}`);
    return false;
  }
}

// Test des emplois
async function testEmplois() {
  try {
    console.log('\n💼 Test de récupération des emplois...');
    const response = await axios.get(`${BASE_URL}/api/emplois`);
    console.log('✅ Emplois récupérés avec succès');
    console.log(`   Nombre d'emplois: ${response.data.data.length}`);
    return true;
  } catch (error) {
    console.log('❌ Erreur lors de la récupération des emplois');
    console.log(`   Erreur: ${error.response?.data?.message || error.message}`);
    return false;
  }
}

// Test des routes d'administration
async function testAdminRoutes() {
  try {
    console.log('\n🔐 Test des routes d\'administration...');
    
    // Test des statistiques
    const statsResponse = await axios.get(`${BASE_URL}/api/admin/stats`, {
      headers: { 'Authorization': 'Bearer admin123' }
    });
    console.log('✅ Statistiques récupérées');
    console.log(`   Contacts: ${statsResponse.data.data.contacts}`);
    console.log(`   Formations: ${statsResponse.data.data.formations}`);
    console.log(`   Actualités: ${statsResponse.data.data.actualites}`);
    console.log(`   Logiciels: ${statsResponse.data.data.logiciels}`);
    console.log(`   Emplois: ${statsResponse.data.data.emplois}`);
    
    return true;
  } catch (error) {
    console.log('❌ Erreur lors du test des routes d\'administration');
    console.log(`   Erreur: ${error.response?.data?.message || error.message}`);
    return false;
  }
}

// Fonction principale
async function runTests() {
  console.log('🚀 Démarrage des tests MongoDB...\n');
  
  const tests = [
    { name: 'Connectivité', fn: testHealth },
    { name: 'Contact', fn: testContact },
    { name: 'Formations', fn: testFormations },
    { name: 'Actualités', fn: testActualites },
    { name: 'Logiciels', fn: testLogiciels },
    { name: 'Emplois', fn: testEmplois },
    { name: 'Admin Routes', fn: testAdminRoutes }
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
    console.log('\n📋 Prochaines étapes :');
    console.log('1. Configurez MongoDB Atlas avec votre URI');
    console.log('2. Créez le fichier .env avec vos variables');
    console.log('3. Ajoutez des données initiales');
    console.log('4. Testez l\'interface d\'administration');
  } else {
    console.log('\n⚠️  Certains tests ont échoué.');
    console.log('\n🔧 Vérifiez :');
    console.log('1. Le serveur est-il démarré ?');
    console.log('2. MongoDB Atlas est-il configuré ?');
    console.log('3. Les variables d\'environnement sont-elles correctes ?');
  }
}

// Exécuter les tests
runTests().catch(error => {
  console.log(`\n💥 Erreur lors des tests: ${error.message}`);
  process.exit(1);
});


