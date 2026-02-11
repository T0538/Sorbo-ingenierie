const mongoose = require('mongoose');
require('dotenv').config();
const Logiciel = require('../backend/models/Logiciel');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://kevinyameogo01:Kevin2023@sorbo-ingenierie.ol32tmy.mongodb.net/sorbo_ingenierie?retryWrites=true&w=majority';

async function updateLogiciel() {
  try {
    console.log('Connexion à MongoDB...');
    await mongoose.connect(MONGODB_URI, {
        serverSelectionTimeoutMS: 30000, // 30 secondes
        socketTimeoutMS: 45000,
        family: 4 // Forcer IPv4
    });
    console.log('Connecté !');

    // 1. Lister tous les logiciels pour voir ce qu'on a
    const logiciels = await Logiciel.find({});
    console.log(`\n--- Liste des logiciels (${logiciels.length}) ---`);
    logiciels.forEach(l => {
        console.log(`- ID: ${l._id}`);
        console.log(`  Nom: ${l.nom}`);
        console.log(`  Catégorie actuelle: ${l.categorie}`);
        console.log(`  Logo: ${l.logo || l.image}`);
        console.log(`  Image Header: ${l.headerImage}`);
        console.log('-----------------------------------');
    });

    // 2. Identifier le logiciel cible
    // Critères : Contient "Chaussée" OU "Str" OU est le 2ème logiciel (index 1) si on trie par date
    let target = logiciels.find(l => /chaussée/i.test(l.nom) || /str-/i.test(l.nom));
    
    if (!target) {
        // Fallback : Prendre celui qui n'est pas OH-Route et pas TALREN
        target = logiciels.find(l => !/oh-route/i.test(l.nom) && !/talren/i.test(l.nom));
    }

    if (!target) {
        console.error('❌ Impossible de trouver le logiciel cible "Str-Chaussée" ou équivalent.');
        process.exit(1);
    }

    console.log(`\n🎯 Logiciel cible identifié : "${target.nom}"`);
    console.log('Mise à jour en cours...');

    // 3. Appliquer les modifications
    target.logo = 'images/geopavetotal.jpg.jpeg'; // Nom exact trouvé dans le dossier
    target.headerImage = 'images/Image autoroute.png'; // Nom exact trouvé dans le dossier
    target.categorie = 'Infrastructures et Transports';
    
    // Si le champ image (ancien) est utilisé, on le met à jour aussi pour cohérence
    target.image = 'images/geopavetotal.jpg.jpeg';

    await target.save();

    console.log('✅ Mise à jour réussie !');
    console.log(`  Nouveau Logo : ${target.logo}`);
    console.log(`  Nouvelle Header : ${target.headerImage}`);
    console.log(`  Nouvelle Catégorie : ${target.categorie}`);

  } catch (error) {
    console.error('❌ Erreur:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Déconnecté.');
  }
}

updateLogiciel();
