// Script pour corriger directement les formations dans MongoDB
const mongoose = require('mongoose');
const Formation = require('./models/Formation');
require('dotenv').config();

console.log('🔧 === CORRECTION DIRECTE DES FORMATIONS ===\n');

// Configuration MongoDB
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/sorbo-ingenierie';

// Nouvelles données de formations complètes
const formationsCorrigees = [
    {
        titre: "Dimensionnement des structures de chaussées routières",
        description: "Formation complète sur la conception et le calcul des structures de chaussées neuves selon les normes internationales. Maîtrisez les méthodes modernes de dimensionnement et les outils de calcul.",
        prix: 150000,
        duree: "2 jours (16h)",
        niveau: "Intermédiaire",
        categorie: "Génie civil",
        localisation: "Abidjan, Cocody",
        dates: "Du 15 au 20 janvier 2025",
        image: "images/formationi2.JPG",
        objectifs: [
            "Maîtriser les méthodes de dimensionnement",
            "Analyser les sols et matériaux",
            "Concevoir des structures durables",
            "Utiliser les outils de calcul"
        ],
        prerequisites: [
            "Notions de génie civil",
            "Bases en mécanique des sols"
        ],
        status: "active",
        modalite: "En présentiel",
        maxParticipants: 15,
        tags: ["Génie civil", "Routier", "Dimensionnement"]
    },
    {
        titre: "Diagnostic et renforcement des chaussées routières",
        description: "Méthodes CEREMA-IDRRIM pour l'évaluation et le renforcement des structures existantes. Apprenez à diagnostiquer l'état des chaussées et concevoir des solutions de renforcement.",
        prix: 200000,
        duree: "3 jours (24h)",
        niveau: "Avancé",
        categorie: "Génie civil",
        localisation: "Abidjan, Plateau",
        dates: "Du 5 au 12 février 2025",
        image: "images/formationi3.JPG",
        objectifs: [
            "Diagnostiquer l'état des chaussées",
            "Analyser les dégradations",
            "Concevoir des renforcements",
            "Optimiser la maintenance"
        ],
        prerequisites: [
            "Expérience en génie civil",
            "Connaissance des matériaux routiers"
        ],
        status: "active",
        modalite: "En présentiel",
        maxParticipants: 12,
        tags: ["Génie civil", "Diagnostic", "Renforcement"]
    },
    {
        titre: "Dimensionnement des chaussées sous charges spéciales",
        description: "Conception pour véhicules lourds et charges exceptionnelles selon les normes en vigueur. Formation spécialisée pour les infrastructures à usage intensif.",
        prix: 130000,
        duree: "2 jours (16h)",
        niveau: "Avancé",
        categorie: "Génie civil",
        localisation: "Abidjan, Zone 4",
        dates: "Du 18 au 22 mars 2025",
        image: "images/formationi4.JPG",
        objectifs: [
            "Comprendre les charges spéciales",
            "Dimensionner pour véhicules lourds",
            "Analyser les contraintes",
            "Optimiser les structures"
        ],
        prerequisites: [
            "Formation en dimensionnement classique",
            "Expérience pratique"
        ],
        status: "active",
        modalite: "En présentiel",
        maxParticipants: 10,
        tags: ["Génie civil", "Charges spéciales", "Véhicules lourds"]
    },
    {
        titre: "Topographie appliquée et relevés de terrain",
        description: "Formation pratique sur les techniques modernes de topographie et les relevés de terrain. Utilisation d'équipements de pointe et logiciels spécialisés.",
        prix: 175000,
        duree: "3 jours (24h)",
        niveau: "Intermédiaire",
        categorie: "Topographie",
        localisation: "Abidjan, Cocody",
        dates: "Du 8 au 12 avril 2025",
        image: "images/formationi5.JPG",
        objectifs: [
            "Maîtriser les instruments de mesure",
            "Réaliser des relevés précis",
            "Traiter les données topographiques",
            "Produire des plans techniques"
        ],
        prerequisites: [
            "Notions de géométrie",
            "Bases informatiques"
        ],
        status: "active",
        modalite: "En présentiel",
        maxParticipants: 15,
        tags: ["Topographie", "Relevés", "Terrain"]
    }
];

async function corrigerFormationsDirectement() {
    try {
        console.log('📡 Connexion à MongoDB...');
        await mongoose.connect(MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log('✅ Connexion MongoDB réussie\n');

        // 1. Vérifier les formations existantes
        console.log('🔍 Vérification des formations existantes...');
        const formationsExistantes = await Formation.find();
        console.log(`📊 ${formationsExistantes.length} formations trouvées\n`);

        // Afficher les données existantes
        console.log('📋 Formations actuelles:');
        formationsExistantes.forEach((formation, index) => {
            console.log(`   ${index + 1}. ID: ${formation._id}`);
            console.log(`      Titre: ${formation.titre || 'MANQUANT'}`);
            console.log(`      Catégorie: ${formation.categorie || 'MANQUANT'}`);
            console.log(`      Prix: ${formation.prix || 'MANQUANT'}`);
            console.log('');
        });

        // 2. Supprimer toutes les formations existantes
        console.log('🗑️ Suppression des formations existantes...');
        const deleteResult = await Formation.deleteMany({});
        console.log(`✅ ${deleteResult.deletedCount} formations supprimées\n`);

        // 3. Créer les nouvelles formations
        console.log('➕ Création des nouvelles formations...');
        const nouvelles = [];

        for (let i = 0; i < formationsCorrigees.length; i++) {
            const formationData = formationsCorrigees[i];
            console.log(`   📝 Création: ${formationData.titre}`);
            
            const formation = new Formation(formationData);
            const saved = await formation.save();
            nouvelles.push(saved);
            
            console.log(`   ✅ Créée avec ID: ${saved._id}`);
        }

        console.log(`\n🎉 ${nouvelles.length} nouvelles formations créées !\n`);

        // 4. Vérification finale
        console.log('🔍 Vérification finale...');
        const formationsFinales = await Formation.find();
        
        console.log(`📊 === RÉSUMÉ FINAL ===`);
        console.log(`✅ Formations total: ${formationsFinales.length}`);
        console.log(`\n📋 Liste finale:`);
        
        formationsFinales.forEach((formation, index) => {
            console.log(`   ${index + 1}. ${formation.titre}`);
            console.log(`      📂 Catégorie: ${formation.categorie}`);
            console.log(`      💰 Prix: ${formation.prix} FCFA`);
            console.log(`      📅 Durée: ${formation.duree}`);
            console.log(`      📍 Lieu: ${formation.localisation}`);
            console.log(`      🎯 Statut: ${formation.status}`);
            console.log('');
        });

        // Vérifier la complétude
        const formationsCompletes = formationsFinales.filter(f => 
            f.titre && f.categorie && f.prix && f.status
        );

        console.log(`✅ Formations complètes: ${formationsCompletes.length}/${formationsFinales.length}`);

        if (formationsCompletes.length === formationsFinales.length) {
            console.log(`\n🎉 SUCCÈS TOTAL !`);
            console.log(`🌐 Toutes les formations sont maintenant complètes`);
            console.log(`🚀 Votre domaine .ci devrait afficher les vraies formations`);
            console.log(`📱 Testez sur: https://sorbo-ingenierie.ci/nos-formations.html`);
        } else {
            console.log(`\n⚠️ Certaines formations sont encore incomplètes`);
        }

    } catch (error) {
        console.error(`💥 Erreur: ${error.message}`);
        throw error;
    } finally {
        // Fermer la connexion
        await mongoose.connection.close();
        console.log(`\n📡 Connexion MongoDB fermée`);
    }
}

// Exécution
corrigerFormationsDirectement()
    .then(() => {
        console.log(`\n✅ Script terminé avec succès`);
        process.exit(0);
    })
    .catch(error => {
        console.error(`\n💥 Script échoué: ${error.message}`);
        process.exit(1);
    });
