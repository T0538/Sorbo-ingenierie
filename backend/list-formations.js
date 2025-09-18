// Script pour lister toutes les formations de MongoDB Atlas
const mongoose = require('mongoose');
require('dotenv').config();

const Formation = require('./models/Formation');

async function listAllFormations() {
    try {
        // Connexion à MongoDB
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('✅ Connecté à MongoDB Atlas');

        // Récupérer toutes les formations
        const formations = await Formation.find({}).sort({ createdAt: -1 });
        
        console.log('\n📋 Liste de toutes les formations:');
        console.log('=' .repeat(100));
        
        if (formations.length === 0) {
            console.log('📭 Aucune formation trouvée');
        } else {
            formations.forEach((formation, index) => {
                console.log(`\n${index + 1}. 📝 ${formation.title}`);
                console.log(`   🆔 ID: ${formation._id}`);
                console.log(`   📂 Catégorie: ${formation.category}`);
                console.log(`   🏷️  Type: ${formation.type}`);
                console.log(`   💰 Prix: ${formation.price.toLocaleString()} FCFA`);
                console.log(`   ⏱️  Durée: ${formation.duration} jours`);
                console.log(`   📍 Lieux: ${formation.locations.join(', ')}`);
                console.log(`   ✅ Actif: ${formation.active ? 'Oui' : 'Non'}`);
                console.log(`   ⭐ En vedette: ${formation.featured ? 'Oui' : 'Non'}`);
                console.log(`   📅 Créé le: ${formation.createdAt.toLocaleDateString()}`);
                console.log(`   📝 Description: ${formation.description.substring(0, 100)}...`);
                console.log('   ' + '-' .repeat(80));
            });
            
            console.log(`\n📊 Total: ${formations.length} formation(s)`);
        }
        
        mongoose.connection.close();
        console.log('🔌 Connexion fermée');
        
    } catch (error) {
        console.error('❌ Erreur lors de la récupération:', error.message);
        if (mongoose.connection.readyState === 1) {
            mongoose.connection.close();
        }
    }
}

// Instructions d'utilisation
console.log('📋 Script de liste des formations MongoDB Atlas');
console.log('🚀 Démarrage...\n');

listAllFormations(); 