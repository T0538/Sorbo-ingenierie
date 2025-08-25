require('dotenv').config();
const mongoose = require('mongoose');
const Actualite = require('./models/Actualite');

// Connexion MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('✅ Connecté à MongoDB Atlas'))
  .catch(err => console.error('❌ Erreur MongoDB:', err.message));

// Données d'actualités de test
const actualitesTest = [
  {
    titre: "Nouveau logiciel OH-Route v1 disponible",
    contenu: "Nous sommes ravis d'annoncer la sortie de notre nouveau logiciel OH-Route v1 pour la conception et le dimensionnement des ouvrages d'assainissement. Ce logiciel révolutionnaire simplifie la planification des projets d'ingénierie civile.",
    resume: "Sortie officielle du logiciel OH-Route v1 pour la conception d'ouvrages d'assainissement",
    image: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&h=600&fit=crop",
    categorie: "technologie",
    tags: ["logiciel", "assainissement", "ingénierie", "nouveau"],
    auteur: "Sorbo Ingénierie",
    statut: "publie",
    datePublication: new Date("2024-01-15")
  },
  {
    titre: "Formation en drainage urbain disponible",
    contenu: "Notre formation spécialisée en drainage urbain est maintenant disponible. Cette formation intensive de 5 jours couvre tous les aspects techniques et pratiques nécessaires pour concevoir des systèmes de drainage efficaces.",
    resume: "Formation intensive de 5 jours en drainage urbain pour les professionnels",
    image: "https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=800&h=600&fit=crop",
    categorie: "formation",
    tags: ["formation", "drainage", "urbain", "5 jours"],
    auteur: "Sorbo Ingénierie",
    statut: "publie",
    datePublication: new Date("2024-01-10")
  },
  {
    titre: "Projet de pont suspendu au Burkina Faso",
    contenu: "Nous sommes fiers d'annoncer le début de notre projet de pont suspendu au Burkina Faso. Ce projet d'envergure démontre notre expertise en ingénierie des structures et notre engagement en Afrique de l'Ouest.",
    resume: "Début du projet de pont suspendu au Burkina Faso, démontrant notre expertise",
    image: "https://images.unsplash.com/photo-1545558014-8692077e9b5c?w=800&h=600&fit=crop",
    categorie: "ingenierie",
    tags: ["projet", "pont", "Burkina Faso", "structures"],
    auteur: "Sorbo Ingénierie",
    statut: "publie",
    datePublication: new Date("2024-01-05")
  }
];

// Fonction pour ajouter les actualités
async function seedActualites() {
  try {
    console.log('🌱 Début de l\'ajout des actualités de test...');
    
    // Supprimer les anciennes actualités de test
    await Actualite.deleteMany({});
    console.log('🗑️ Anciennes actualités supprimées');
    
    // Ajouter les nouvelles actualités
    const actualitesAjoutees = await Actualite.insertMany(actualitesTest);
    console.log(`✅ ${actualitesAjoutees.length} actualités ajoutées avec succès`);
    
    // Afficher les détails
    actualitesAjoutees.forEach(actualite => {
      console.log(`📰 ${actualite.titre} - Slug: ${actualite.slug}`);
    });
    
    console.log('🎉 Actualités de test ajoutées avec succès !');
    
  } catch (error) {
    console.error('❌ Erreur lors de l\'ajout des actualités:', error);
  } finally {
    mongoose.connection.close();
    console.log('🔌 Connexion MongoDB fermée');
  }
}

// Exécuter le script
seedActualites();
