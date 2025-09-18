// Script pour supprimer une formation de MongoDB Atlas
const mongoose = require('mongoose');
require('dotenv').config();

const Formation = require('./models/Formation');

async function deleteFormation(formationId) {
    try {
        // Connexion à MongoDB
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('✅ Connecté à MongoDB Atlas');

        // Vérifier si la formation existe
        const formation = await Formation.findById(formationId);
        
        if (!formation) {
            console.log('❌ Formation non trouvée avec l\'ID:', formationId);
            console.log('💡 Utilisez list-formations.js pour voir tous les IDs');
            return;
        }

        console.log('📝 Formation trouvée:', formation.title);
        console.log('💰 Prix:', formation.price.toLocaleString(), 'FCFA');
        console.log('⏱️  Durée:', formation.duration, 'jours');

        // Demander confirmation (simulation)
        console.log('\n⚠️  ATTENTION: Cette action est irréversible !');
        console.log('🔴 La formation sera définitivement supprimée.');
        console.log('💡 Pour continuer, modifiez le script et décommentez la ligne de suppression');
        
        // DÉCOMMENTEZ LA LIGNE CI-DESSOUS POUR VRAIMENT SUPPRIMER
        // const deletedFormation = await Formation.findByIdAndDelete(formationId);
        
        // console.log('✅ Formation supprimée avec succès !');
        // console.log('📝 Titre supprimé:', deletedFormation.title);
        
        mongoose.connection.close();
        console.log('🔌 Connexion fermée');
        
    } catch (error) {
        console.error('❌ Erreur lors de la suppression:', error.message);
        if (mongoose.connection.readyState === 1) {
            mongoose.connection.close();
        }
    }
}

async function listAllFormations() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('✅ Connecté à MongoDB Atlas');

        const formations = await Formation.find({}).select('_id title price duration active');
        
        console.log('\n📋 Liste de toutes les formations:');
        console.log('=' .repeat(80));
        
        formations.forEach((formation, index) => {
            console.log(`${index + 1}. ID: ${formation._id}`);
            console.log(`   📝 Titre: ${formation.title}`);
            console.log(`   💰 Prix: ${formation.price.toLocaleString()} FCFA`);
            console.log(`   ⏱️  Durée: ${formation.duration} jours`);
            console.log(`   ✅ Actif: ${formation.active ? 'Oui' : 'Non'}`);
            console.log('   ' + '-' .repeat(60));
        });
        
        mongoose.connection.close();
        
    } catch (error) {
        console.error('❌ Erreur:', error.message);
        if (mongoose.connection.readyState === 1) {
            mongoose.connection.close();
        }
    }
}

// Instructions d'utilisation
console.log('🗑️  Script de suppression de formation MongoDB Atlas');
console.log('📋 Affichage de toutes les formations...\n');

// Afficher toutes les formations d'abord
listAllFormations().then(() => {
    console.log('\n💡 Pour supprimer une formation:');
    console.log('1. Copiez l\'ID de la formation à supprimer');
    console.log('2. Modifiez la ligne: deleteFormation("ID_ICI")');
    console.log('3. Décommentez la ligne de suppression dans le script');
    console.log('4. Relancez le script');
    
    // Exemple d'utilisation (décommentez et modifiez l'ID)
    // deleteFormation("6892ffca89599a8e5301a849");
}); 