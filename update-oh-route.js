/**
 * Script pour mettre à jour OH-Route dans la base de données MongoDB
 * et le rendre disponible au téléchargement
 */

const { MongoClient } = require('mongodb');

// Configuration de la base de données
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/sorbo-ingenierie';
const DB_NAME = 'sorbo-ingenierie';
const COLLECTION_NAME = 'logiciels';

async function updateOHRoute() {
    let client;
    
    try {
        console.log('🔌 Connexion à MongoDB...');
        client = new MongoClient(MONGODB_URI);
        await client.connect();
        
        const db = client.db(DB_NAME);
        const collection = db.collection(COLLECTION_NAME);
        
        console.log('📊 Base de données connectée');
        
        // Rechercher OH-Route dans la base de données
        const ohRoute = await collection.findOne({ 
            nom: { $regex: /oh-route/i } 
        });
        
        if (ohRoute) {
            console.log('✅ OH-Route trouvé dans la base de données');
            console.log('📝 Mise à jour des informations...');
            
            // Mettre à jour OH-Route pour le rendre disponible
            const updateResult = await collection.updateOne(
                { _id: ohRoute._id },
                {
                                         $set: {
                         disponible: true,
                         lienTelechargement: '/OH-Route v1.1.rar',
                         version: '1.0',
                        categorie: 'hydrologie',
                        fonctionnalites: [
                            'Études hydrologiques',
                            'Calculs hydrauliques',
                            'Génie routier',
                            'Analyse des bassins versants'
                        ],
                        specifications: {
                            systeme: 'Windows 10/11',
                            ram: '4 GB minimum',
                            espace: '500 MB',
                            processeur: 'Intel i3 ou équivalent'
                        }
                    }
                }
            );
            
            if (updateResult.modifiedCount > 0) {
                console.log('✅ OH-Route mis à jour avec succès !');
                console.log('📥 Le logiciel est maintenant disponible au téléchargement');
            } else {
                console.log('ℹ️ Aucune modification nécessaire');
            }
            
        } else {
            console.log('❌ OH-Route non trouvé dans la base de données');
            console.log('📝 Création d\'un nouvel enregistrement...');
            
            // Créer un nouvel enregistrement pour OH-Route
            const newOHRoute = {
                nom: 'OH-Route',
                slug: 'oh-route',
                description: 'Outil spécialisé pour les études hydrologiques et hydrauliques en génie routier. OH-Route v1 s\'appuie sur une architecture modulaire avec deux parties complémentaires : une interface graphique intuitive et un moteur de calcul performant.',
                version: '1.0',
                categorie: 'hydrologie',
                prix: 0,
                devise: 'FCFA',
                image: '/images/logiciels/oh-route.png',
                                 lienTelechargement: '/OH-Route v1.1.rar',
                lienDemo: null,
                fonctionnalites: [
                    'Études hydrologiques',
                    'Calculs hydrauliques',
                    'Génie routier',
                    'Analyse des bassins versants',
                    'Modélisation des écoulements',
                    'Calculs de débits'
                ],
                specifications: {
                    systeme: 'Windows 10/11',
                    ram: '4 GB minimum',
                    espace: '500 MB',
                    processeur: 'Intel i3 ou équivalent'
                },
                disponible: true,
                populaire: true,
                note: 4.5,
                nombreTelechargements: 0,
                dateAjout: new Date()
            };
            
            const insertResult = await collection.insertOne(newOHRoute);
            
            if (insertResult.acknowledged) {
                console.log('✅ OH-Route créé avec succès dans la base de données !');
                console.log('📥 Le logiciel est maintenant disponible au téléchargement');
            } else {
                console.log('❌ Erreur lors de la création d\'OH-Route');
            }
        }
        
        // Afficher le statut final
        const finalOHRoute = await collection.findOne({ 
            nom: { $regex: /oh-route/i } 
        });
        
        if (finalOHRoute) {
            console.log('\n📊 Statut final d\'OH-Route :');
            console.log(`   Nom: ${finalOHRoute.nom}`);
            console.log(`   Version: ${finalOHRoute.version}`);
            console.log(`   Disponible: ${finalOHRoute.disponible ? '✅ Oui' : '❌ Non'}`);
            console.log(`   Lien de téléchargement: ${finalOHRoute.lienTelechargement || 'Non défini'}`);
            console.log(`   Catégorie: ${finalOHRoute.categorie}`);
        }
        
    } catch (error) {
        console.error('❌ Erreur lors de la mise à jour:', error);
    } finally {
        if (client) {
            await client.close();
            console.log('🔌 Connexion à MongoDB fermée');
        }
    }
}

// Exécuter le script
if (require.main === module) {
    updateOHRoute()
        .then(() => {
            console.log('\n🎉 Script terminé avec succès !');
            process.exit(0);
        })
        .catch((error) => {
            console.error('💥 Erreur fatale:', error);
            process.exit(1);
        });
}

module.exports = { updateOHRoute };
