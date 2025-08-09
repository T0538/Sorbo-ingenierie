const mongoose = require('mongoose');
require('dotenv').config();

console.log('🧪 Test de connexion MongoDB Atlas');
console.log('==================================');

// Afficher la configuration
console.log('📋 Configuration:');
console.log(`MONGODB_URI: ${process.env.MONGODB_URI ? '✅ Configuré' : '❌ Non configuré'}`);
console.log(`PORT: ${process.env.PORT || '5000'}`);
console.log(`ADMIN_TOKEN: ${process.env.ADMIN_TOKEN || 'admin123'}`);

// Test de connexion
async function testMongoDB() {
    try {
        console.log('\n🔌 Tentative de connexion à MongoDB Atlas...');
        
        const conn = await mongoose.connect(process.env.MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        
        console.log('✅ Connexion MongoDB réussie !');
        console.log(`📍 Host: ${conn.connection.host}`);
        console.log(`🗄️ Database: ${conn.connection.name}`);
        console.log(`🔗 URL: ${conn.connection.client.s.url}`);
        
        // Test de création d'un document
        const TestModel = mongoose.model('Test', {
            name: String,
            createdAt: { type: Date, default: Date.now }
        });
        
        const testDoc = new TestModel({ name: 'Test Sorbo Ingénierie' });
        await testDoc.save();
        console.log('✅ Test d\'écriture réussi !');
        
        // Test de lecture
        const docs = await TestModel.find();
        console.log(`✅ Test de lecture réussi ! (${docs.length} document(s))`);
        
        // Nettoyage
        await TestModel.deleteMany({});
        console.log('✅ Test de suppression réussi !');
        
        console.log('\n🎉 TOUS LES TESTS MONGODB SONT PASSÉS !');
        console.log('==========================================');
        
        process.exit(0);
        
    } catch (error) {
        console.error('\n❌ ERREUR MONGODB:');
        console.error('==================');
        console.error(`Message: ${error.message}`);
        console.error(`Code: ${error.code}`);
        console.error(`Stack: ${error.stack}`);
        
        console.log('\n🔧 DÉPANNAGE:');
        console.log('1. Vérifiez votre connexion internet');
        console.log('2. Vérifiez l\'URL MongoDB Atlas dans .env');
        console.log('3. Vérifiez les permissions de votre cluster');
        console.log('4. Vérifiez que votre IP est autorisée');
        
        process.exit(1);
    }
}

// Lancer le test
testMongoDB();











