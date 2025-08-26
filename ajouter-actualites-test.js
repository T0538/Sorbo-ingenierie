require('dotenv').config();
const mongoose = require('mongoose');

// Connexion MongoDB Atlas
async function connectDB() {
    try {
        console.log('📡 Connexion à MongoDB Atlas...');
        
        if (!process.env.MONGODB_URI) {
            console.error('❌ MONGODB_URI non définie dans les variables d\'environnement');
            console.log('💡 Créez un fichier .env avec MONGODB_URI=mongodb+srv://...');
            process.exit(1);
        }
        
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('✅ Connexion MongoDB Atlas réussie !');
    } catch (error) {
        console.error('❌ Erreur de connexion MongoDB:', error.message);
        process.exit(1);
    }
}

// Données d'actualités de test
const actualitesTest = [
    {
        titre: "Nouveau logiciel OH-Route v1.1 disponible",
        contenu: "Nous sommes ravis d'annoncer la sortie de notre nouveau logiciel OH-Route v1.1 pour la conception et le dimensionnement des ouvrages d'assainissement. Ce logiciel révolutionnaire simplifie la planification des projets d'ingénierie civile et offre des fonctionnalités avancées pour la modélisation hydraulique.",
        resume: "Sortie officielle du logiciel OH-Route v1.1 pour la conception d'ouvrages d'assainissement avec des fonctionnalités avancées",
        image: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&h=600&fit=crop",
        categorie: "technologie",
        tags: ["logiciel", "assainissement", "ingénierie", "nouveau", "v1.1"],
        auteur: "Sorbo Ingénierie",
        statut: "publie",
        datePublication: new Date("2024-01-15")
    },
    {
        titre: "Formation en drainage urbain disponible",
        contenu: "Notre formation spécialisée en drainage urbain est maintenant disponible. Cette formation intensive de 5 jours couvre tous les aspects techniques et pratiques nécessaires pour concevoir des systèmes de drainage efficaces. Les participants apprendront les dernières techniques et normes en vigueur.",
        resume: "Formation intensive de 5 jours en drainage urbain pour les professionnels avec techniques et normes actuelles",
        image: "https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=800&h=600&fit=crop",
        categorie: "formation",
        tags: ["formation", "drainage", "urbain", "5 jours", "normes"],
        auteur: "Sorbo Ingénierie",
        statut: "publie",
        datePublication: new Date("2024-01-10")
    },
    {
        titre: "Projet de pont suspendu au Burkina Faso",
        contenu: "Nous sommes fiers d'annoncer le début de notre projet de pont suspendu au Burkina Faso. Ce projet d'envergure démontre notre expertise en ingénierie des structures et notre engagement en Afrique de l'Ouest. Le pont permettra de relier deux régions importantes et facilitera le développement économique local.",
        resume: "Début du projet de pont suspendu au Burkina Faso, démontrant notre expertise et engagement en Afrique de l'Ouest",
        image: "https://images.unsplash.com/photo-1545558014-8692077e9b5c?w=800&h=600&fit=crop",
        categorie: "ingenierie",
        tags: ["projet", "pont", "Burkina Faso", "structures", "développement"],
        auteur: "Sorbo Ingénierie",
        statut: "publie",
        datePublication: new Date("2024-01-05")
    },
    {
        titre: "Nouvelle certification ISO 9001 obtenue",
        contenu: "Sorbo Ingénierie est fière d'annoncer l'obtention de sa certification ISO 9001:2015. Cette certification atteste de notre engagement envers la qualité et l'amélioration continue dans tous nos processus. Elle renforce la confiance de nos clients et partenaires.",
        resume: "Obtention de la certification ISO 9001:2015, attestant de notre engagement envers la qualité et l'amélioration continue",
        image: "https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=800&h=600&fit=crop",
        categorie: "entreprise",
        tags: ["certification", "ISO 9001", "qualité", "amélioration continue"],
        auteur: "Sorbo Ingénierie",
        statut: "publie",
        datePublication: new Date("2024-01-20")
    },
    {
        titre: "Partenariat avec l'Université de Ouagadougou",
        contenu: "Nous sommes heureux d'annoncer un nouveau partenariat avec l'Université de Ouagadougou. Cette collaboration permettra de développer des programmes de recherche innovants en ingénierie civile et de former la prochaine génération d'ingénieurs africains.",
        resume: "Nouveau partenariat avec l'Université de Ouagadougou pour la recherche et la formation en ingénierie civile",
        image: "https://images.unsplash.com/photo-1523050854058-8df90110cfe1?w=800&h=600&fit=crop",
        categorie: "entreprise",
        tags: ["partenariat", "université", "Ouagadougou", "recherche", "formation"],
        auteur: "Sorbo Ingénierie",
        statut: "publie",
        datePublication: new Date("2024-01-25")
    }
];

// Fonction pour ajouter les actualités
async function ajouterActualitesTest() {
    try {
        console.log('🌱 Début de l\'ajout des actualités de test...');
        
        // Importer le modèle Actualite
        const Actualite = require('./backend/models/Actualite');
        
        // Supprimer les anciennes actualités de test (optionnel)
        const deleteResult = await Actualite.deleteMany({});
        console.log(`🗑️ ${deleteResult.deletedCount} anciennes actualités supprimées`);
        
        // Ajouter les nouvelles actualités
        const actualitesAjoutees = await Actualite.insertMany(actualitesTest);
        console.log(`✅ ${actualitesAjoutees.length} actualités ajoutées avec succès`);
        
        // Afficher les détails
        console.log('\n📋 Détails des actualités ajoutées:');
        actualitesAjoutees.forEach((actualite, index) => {
            console.log(`   ${index + 1}. ${actualite.titre}`);
            console.log(`      - Slug: ${actualite.slug}`);
            console.log(`      - Catégorie: ${actualite.categorie}`);
            console.log(`      - Statut: ${actualite.statut}`);
            console.log(`      - Date: ${actualite.datePublication.toLocaleDateString()}`);
            console.log('');
        });
        
        console.log('🎉 Actualités de test ajoutées avec succès !');
        console.log('💡 Vous pouvez maintenant tester l\'API avec:');
        console.log('   node test-api-corrected.js');
        
    } catch (error) {
        console.error('❌ Erreur lors de l\'ajout des actualités:', error);
    } finally {
        if (mongoose.connection.readyState === 1) {
            await mongoose.connection.close();
            console.log('🔌 Connexion MongoDB fermée');
        }
    }
}

// Exécuter le script
connectDB().then(() => {
    ajouterActualitesTest();
}).catch(error => {
    console.error('❌ Erreur de connexion:', error);
});
