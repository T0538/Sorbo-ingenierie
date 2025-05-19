/**
 * Script pour vérifier et corriger la connexion MongoDB
 * 
 * Exécuter avec: node fix-mongodb.js
 */
const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');
require('dotenv').config();

console.log('🔍 Vérification de la connexion MongoDB...');

// Extraire l'URI MongoDB du fichier .env
let uri = process.env.MONGODB_URI || '';
if (!uri) {
  console.error('❌ MONGODB_URI non trouvé dans le fichier .env');
  process.exit(1);
}

console.log('URI actuel (masqué):', uri.replace(/\:([^:@]+)@/, ':***@'));

// Vérifier si l'URI contient un saut de ligne
if (uri.includes('\n')) {
  console.log('⚠️ Problème détecté: L\'URI MongoDB contient un saut de ligne');
  uri = uri.replace(/\n/g, '');
  console.log('✅ URI corrigé (sans sauts de ligne, masqué):', uri.replace(/\:([^:@]+)@/, ':***@'));
}

// Vérifier si le nom de la base de données est présent
if (!uri.includes('/sorbo-ingenierie?')) {
  console.log('⚠️ Problème détecté: Le nom de la base de données est manquant');
  uri = uri.replace(/\/?(\?|$)/, '/sorbo-ingenierie$1');
  console.log('✅ URI corrigé (avec nom de base de données, masqué):', uri.replace(/\:([^:@]+)@/, ':***@'));
}

// Essayer de se connecter avec l'URI corrigé
console.log('\n🔌 Test de connexion avec l\'URI corrigé...');

mongoose.connect(uri)
  .then(() => {
    console.log('✅ Connexion MongoDB réussie!');
    
    // Si le test est réussi, proposer de mettre à jour le fichier .env
    console.log('\n🔧 Souhaitez-vous mettre à jour votre fichier .env avec l\'URI corrigé?');
    console.log('Pour mettre à jour, exécutez:');
    console.log('node -e "require(\'fs\').writeFileSync(\'.env\', require(\'fs\').readFileSync(\'.env\', \'utf8\').replace(/MONGODB_URI=.*/g, \'MONGODB_URI=' + uri.replace(/\\/g, '\\\\').replace(/'/g, '\\\'') + '\'))"');
    
    mongoose.connection.close();
  })
  .catch(err => {
    console.error('❌ Échec de la connexion MongoDB:', err.message);
    
    if (err.code === 8000 && err.codeName === 'AtlasError') {
      console.log('\n⚠️ Problème d\'authentification détecté!');
      console.log('1. Vérifiez que le nom d\'utilisateur et le mot de passe sont corrects');
      console.log('2. Assurez-vous que votre IP est autorisée dans MongoDB Atlas');
      console.log('3. Vérifiez que l\'utilisateur a les bonnes permissions');
    }
    
    console.log('\nPour résoudre ce problème, connectez-vous à MongoDB Atlas et:');
    console.log('1. Allez dans "Database Access"');
    console.log('2. Cliquez sur "Edit" pour l\'utilisateur Kevin0150446754');
    console.log('3. Réinitialisez le mot de passe');
    console.log('4. Allez dans "Network Access" pour vérifier les accès IP');
  }); 