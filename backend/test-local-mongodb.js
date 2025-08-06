const mongoose = require('mongoose');

console.log('🧪 Test MongoDB Local - Backend Sorbo Ingénierie\n');

// Test avec MongoDB local
async function testLocalMongoDB() {
  try {
    console.log('🔗 Test de connexion MongoDB local...');
    
    // Connexion à MongoDB local
    await mongoose.connect('mongodb://localhost:27017/sorbo-ingenierie-test');
    console.log('✅ Connexion MongoDB local réussie!');
    
    // Test des modèles
    const Contact = require('./models/Contact');
    const Formation = require('./models/Formation');
    
    console.log('✅ Modèles chargés avec succès');
    
    // Test de création d'un contact
    const contact = new Contact({
      name: 'Test Local',
      email: 'test-local@sorbo-ingenierie.com',
      phone: '+1234567890',
      subject: 'test',
      message: 'Test avec MongoDB local'
    });
    
    await contact.save();
    console.log('✅ Contact créé avec succès');
    
    // Test de création d'une formation
    const formation = new Formation({
      title: 'Test Formation Local',
      description: 'Formation de test',
      price: 100000,
      duration: 2,
      category: 'logiciel',
      type: 'autocad'
    });
    
    await formation.save();
    console.log('✅ Formation créée avec succès');
    
    // Compter les documents
    const contactsCount = await Contact.countDocuments();
    const formationsCount = await Formation.countDocuments();
    
    console.log(`📊 Résultats:`);
    console.log(`   - Contacts: ${contactsCount}`);
    console.log(`   - Formations: ${formationsCount}`);
    
    console.log('\n🎉 Tous les tests sont passés !');
    console.log('🎯 MongoDB local fonctionne parfaitement !');
    
    // Fermer la connexion
    await mongoose.connection.close();
    console.log('🔌 Connexion fermée');
    
  } catch (error) {
    console.log('❌ Erreur:', error.message);
    
    if (error.message.includes('ECONNREFUSED')) {
      console.log('\n💡 Solution:');
      console.log('1. Installez MongoDB localement');
      console.log('2. Ou utilisez MongoDB Atlas avec les bonnes informations');
    }
  }
}

// Exécuter le test
testLocalMongoDB(); 