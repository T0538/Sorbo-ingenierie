require('dotenv').config();
const mongoose = require('mongoose');

console.log('🔍 Test de connexion MongoDB...');
console.log('URI:', process.env.MONGODB_URI);
console.log('JWT_SECRET:', process.env.JWT_SECRET);

async function testConnection() {
    try {
        console.log('\n📡 Tentative de connexion...');
        
        await mongoose.connect(process.env.MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        
        console.log('✅ Connexion réussie !');
        
        // Lister les collections
        const collections = await mongoose.connection.db.listCollections().toArray();
        console.log('\n🗄️ Collections disponibles :');
        collections.forEach(collection => {
            console.log(`   • ${collection.name}`);
        });
        
    } catch (error) {
        console.error('\n❌ Erreur de connexion :');
        console.error('Type:', error.name);
        console.error('Message:', error.message);
        
        if (error.message.includes('bad auth')) {
            console.log('\n💡 Problème d\'authentification :');
            console.log('   • Vérifiez le nom d\'utilisateur et mot de passe');
            console.log('   • Vérifiez les permissions dans MongoDB Atlas');
        } else if (error.message.includes('ENOTFOUND')) {
            console.log('\n💡 Problème de réseau :');
            console.log('   • Vérifiez l\'URL du cluster');
            console.log('   • Vérifiez votre connexion internet');
        }
        
    } finally {
        if (mongoose.connection.readyState === 1) {
            await mongoose.connection.close();
            console.log('\n🔌 Connexion fermée');
        }
        process.exit(0);
    }
}

testConnection();

