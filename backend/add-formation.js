// Script pour ajouter une formation à MongoDB Atlas
const mongoose = require('mongoose');
require('dotenv').config();

const Formation = require('./models/Formation');

async function addFormation() {
    try {
        // Connexion à MongoDB
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('✅ Connecté à MongoDB Atlas');

        // Nouvelle formation - MODIFIEZ CES VALEURS
        const newFormation = new Formation({
            title: "Formation AutoCAD Avancé",
            category: "logiciel",
            type: "autocad",
            description: "Formation avancée sur AutoCAD pour professionnels expérimentés. Maîtrisez les fonctionnalités avancées et automatisez vos tâches répétitives.",
            objectives: [
                "Maîtriser les fonctionnalités avancées d'AutoCAD",
                "Automatiser les tâches répétitives avec AutoLISP",
                "Créer des blocs dynamiques complexes",
                "Optimiser les performances de dessin"
            ],
            prerequisites: [
                "Connaissance de base d'AutoCAD",
                "Expérience en dessin technique"
            ],
            duration: 7,
            price: 250000,
            discount: 10,
            locations: ["nos-locaux", "client"],
            image: "",
            syllabus: [
                {
                    title: "Module 1: Fonctionnalités avancées",
                    content: [
                        "Interface utilisateur avancée",
                        "Gestion des calques complexes",
                        "Styles de dimensionnement personnalisés"
                    ]
                },
                {
                    title: "Module 2: Automatisation",
                    content: [
                        "Introduction à AutoLISP",
                        "Création de macros",
                        "Scripts de personnalisation"
                    ]
                },
                {
                    title: "Module 3: Blocs dynamiques",
                    content: [
                        "Création de blocs paramétriques",
                        "Actions et paramètres",
                        "Bibliothèques de blocs"
                    ]
                }
            ],
            upcomingSessions: [
                {
                    startDate: new Date("2025-02-15"),
                    endDate: new Date("2025-02-22"),
                    location: "nos-locaux",
                    availableSeats: 8,
                    status: "planifiee"
                }
            ],
            rating: {
                average: 0,
                count: 0
            },
            testimonials: [],
            active: true,
            featured: true
        });

        // Sauvegarder
        const savedFormation = await newFormation.save();
        console.log('✅ Formation ajoutée avec succès !');
        console.log('📝 Titre:', savedFormation.title);
        console.log('💰 Prix:', savedFormation.price.toLocaleString(), 'FCFA');
        console.log('⏱️  Durée:', savedFormation.duration, 'jours');
        console.log('🆔 ID:', savedFormation._id);
        
        mongoose.connection.close();
        console.log('🔌 Connexion fermée');
        
    } catch (error) {
        console.error('❌ Erreur lors de l\'ajout:', error.message);
        if (mongoose.connection.readyState === 1) {
            mongoose.connection.close();
        }
    }
}

// Instructions d'utilisation
console.log('🎓 Script d\'ajout de formation MongoDB Atlas');
console.log('📝 Modifiez les valeurs dans le script avant de l\'exécuter');
console.log('🚀 Démarrage...\n');

addFormation(); 