/**
 * Script de test pour vérifier la configuration d'OH-Route
 */

const { MongoClient } = require('mongodb');

// Configuration de la base de données
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/sorbo-ingenierie';
const DB_NAME = 'sorbo-ingenierie';
const COLLECTION_NAME = 'logiciels';

async function testOHRoute() {
    let client;
    
    try {
        console.log('🧪 Test de la configuration d\'OH-Route...\n');
        
        // Test 1: Connexion à MongoDB
        console.log('1️⃣ Test de connexion à MongoDB...');
        client = new MongoClient(MONGODB_URI);
        await client.connect();
        console.log('   ✅ Connexion réussie\n');
        
        const db = client.db(DB_NAME);
        const collection = db.collection(COLLECTION_NAME);
        
        // Test 2: Recherche d'OH-Route
        console.log('2️⃣ Recherche d\'OH-Route dans la base de données...');
        const ohRoute = await collection.findOne({ 
            nom: { $regex: /oh-route/i } 
        });
        
        if (ohRoute) {
            console.log('   ✅ OH-Route trouvé');
            console.log(`   📝 ID: ${ohRoute._id}`);
            console.log(`   📝 Nom: ${ohRoute.nom}`);
            console.log(`   📝 Version: ${ohRoute.version}`);
            console.log(`   📝 Catégorie: ${ohRoute.categorie}`);
            console.log(`   📝 Disponible: ${ohRoute.disponible ? '✅ Oui' : '❌ Non'}`);
            console.log(`   📝 Lien de téléchargement: ${ohRoute.lienTelechargement || 'Non défini'}`);
        } else {
            console.log('   ❌ OH-Route non trouvé');
            console.log('   💡 Exécutez d\'abord: node update-oh-route.js');
        }
        console.log('');
        
        // Test 3: Vérification du fichier de téléchargement
        console.log('3️⃣ Vérification du fichier de téléchargement...');
        const fs = require('fs');
        const path = require('path');
        
        const downloadPath = path.join(__dirname, 'OH-Route v1.1.exe');
        if (fs.existsSync(downloadPath)) {
            const stats = fs.statSync(downloadPath);
            console.log('   ✅ Fichier OH-Route v1.1.exe trouvé');
            console.log(`   📝 Taille: ${(stats.size / 1024).toFixed(2)} KB`);
            console.log(`   📝 Dernière modification: ${stats.mtime.toLocaleString()}`);
        } else {
            console.log('   ❌ Fichier OH-Route v1.1.exe non trouvé');
            console.log('   💡 Placez le fichier exécutable dans ce répertoire');
        }
        console.log('');
        
        // Test 4: Vérification de la logique JavaScript
        console.log('4️⃣ Vérification de la logique JavaScript...');
        const logicielsLoaderPath = path.join(__dirname, 'js', 'logiciels-loader.js');
        if (fs.existsSync(logicielsLoaderPath)) {
            const content = fs.readFileSync(logicielsLoaderPath, 'utf8');
            
            if (content.includes('talren') && content.includes('oh-route')) {
                console.log('   ✅ Logique de disponibilité inclut OH-Route');
            } else {
                console.log('   ❌ Logique de disponibilité ne semble pas inclure OH-Route');
            }
            
            if (content.includes('OH-Route v1.1.exe')) {
                console.log('   ✅ Lien de téléchargement configuré');
            } else {
                console.log('   ❌ Lien de téléchargement non configuré');
            }
        } else {
            console.log('   ❌ Fichier logiciels-loader.js non trouvé');
        }
        console.log('');
        
        // Test 5: Résumé des tests
        console.log('5️⃣ Résumé des tests...');
        if (ohRoute && ohRoute.disponible && fs.existsSync(downloadPath)) {
            console.log('   🎉 Tous les tests sont passés !');
            console.log('   📥 OH-Route devrait être disponible au téléchargement');
        } else {
            console.log('   ⚠️ Certains tests ont échoué');
            console.log('   🔧 Vérifiez la configuration');
        }
        
    } catch (error) {
        console.error('❌ Erreur lors des tests:', error);
    } finally {
        if (client) {
            await client.close();
        }
    }
}

// Exécuter les tests
if (require.main === module) {
    testOHRoute()
        .then(() => {
            console.log('\n🏁 Tests terminés');
            process.exit(0);
        })
        .catch((error) => {
            console.error('💥 Erreur fatale:', error);
            process.exit(1);
        });
}

module.exports = { testOHRoute };
