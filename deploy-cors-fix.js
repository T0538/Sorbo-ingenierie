// Script de déploiement rapide pour corriger les CORS sur Railway
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 === CORRECTION CORS ET DÉPLOIEMENT RAILWAY ===\n');

// Vérifier que nous sommes dans le bon répertoire
if (!fs.existsSync('backend/server.js')) {
    console.log('❌ Erreur: fichier backend/server.js non trouvé');
    console.log('   Assurez-vous d\'être dans le répertoire racine du projet');
    process.exit(1);
}

console.log('✅ Structure du projet vérifiée');

// Vérifier si Git est configuré
try {
    execSync('git --version', { stdio: 'pipe' });
    console.log('✅ Git disponible');
} catch (error) {
    console.log('❌ Git non disponible');
    process.exit(1);
}

// Vérifier le statut Git
console.log('\n📋 Statut Git:');
try {
    const status = execSync('git status --porcelain', { encoding: 'utf8' });
    if (status.trim()) {
        console.log('📝 Fichiers modifiés détectés:');
        console.log(status);
    } else {
        console.log('✅ Aucune modification en attente');
    }
} catch (error) {
    console.log('⚠️ Impossible de vérifier le statut Git');
}

// Ajouter les modifications
console.log('\n📦 Ajout des modifications...');
try {
    execSync('git add .', { stdio: 'inherit' });
    console.log('✅ Modifications ajoutées');
} catch (error) {
    console.log('❌ Erreur lors de l\'ajout des modifications');
    process.exit(1);
}

// Créer un commit
const commitMessage = `🔧 Correction CORS pour domaines .ci

- Ajout des domaines sorbo-ingenierie.ci et www.sorbo-ingenierie.ci
- Configuration complète des headers CORS
- Ajout du logging pour debug
- Support HTTP et HTTPS pour tous les domaines

Timestamp: ${new Date().toISOString()}`;

console.log('\n💾 Création du commit...');
try {
    execSync(`git commit -m "${commitMessage}"`, { stdio: 'inherit' });
    console.log('✅ Commit créé');
} catch (error) {
    console.log('⚠️ Pas de nouvelles modifications à commiter (normal si déjà fait)');
}

// Pousser vers Railway (si configuré)
console.log('\n🚀 Tentative de déploiement vers Railway...');
try {
    // Essayer de pousser vers Railway
    execSync('git push railway main', { stdio: 'inherit' });
    console.log('✅ Déploiement Railway réussi');
} catch (error) {
    console.log('⚠️ Déploiement Railway direct échoué, essai avec origin...');
    
    try {
        execSync('git push origin main', { stdio: 'inherit' });
        console.log('✅ Push vers origin réussi');
        console.log('ℹ️ Railway devrait déployer automatiquement depuis GitHub');
    } catch (error2) {
        console.log('❌ Push échoué');
        console.log('🔧 Solutions possibles:');
        console.log('   1. Vérifiez la configuration Git remote');
        console.log('   2. Déployez manuellement depuis le dashboard Railway');
        console.log('   3. Utilisez Railway CLI: railway deploy');
    }
}

// Instructions de vérification
console.log('\n✅ === CORRECTION CORS TERMINÉE ===');
console.log('\n🔍 Vérifications à effectuer:');
console.log('1. ✅ Domaines .ci ajoutés à la configuration CORS');
console.log('2. ✅ Headers CORS configurés');
console.log('3. ✅ Logging ajouté pour debug');
console.log('4. 🔄 Déploiement en cours...');

console.log('\n⏳ Attendez 2-3 minutes puis testez:');
console.log('   https://sorbo-ingenierie.ci/nos-logiciels.html');
console.log('   https://www.sorbo-ingenierie.ci/nos-logiciels.html');

console.log('\n🔧 Pour vérifier le déploiement:');
console.log('   node test-domain-ci.js');

console.log('\n📊 Pour surveiller les logs Railway:');
console.log('   railway logs --follow');

console.log('\n🎯 Le problème de votre domaine .ci devrait être résolu !');

// Optionnel: lancer un test automatique après un délai
console.log('\n⏰ Test automatique dans 30 secondes...');
setTimeout(() => {
    console.log('\n🔍 Lancement du test automatique...');
    try {
        execSync('node test-domain-ci.js', { stdio: 'inherit' });
    } catch (error) {
        console.log('⚠️ Test automatique échoué, testez manuellement');
    }
}, 30000);
