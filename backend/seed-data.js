const mongoose = require('mongoose');
const Formation = require('./models/Formation');
require('dotenv').config();

const formationsData = [
  {
    title: 'Formation AutoCAD',
    description: 'Apprenez AutoCAD de A à Z avec nos experts certifiés. Formation complète incluant la modélisation 2D et 3D.',
    price: 150000,
    duration: 5,
    category: 'logiciel',
    type: 'autocad'
  },
  {
    title: 'Formation Covadis',
    description: 'Maîtrisez Covadis pour vos projets de génie civil. Formation spécialisée en conception routière et hydraulique.',
    price: 120000,
    duration: 4,
    category: 'logiciel',
    type: 'covadis'
  },
  {
    title: 'Formation Robot Structural Analysis',
    description: 'Analysez vos structures avec Robot. Formation avancée en calcul de structures et dimensionnement.',
    price: 200000,
    duration: 6,
    category: 'logiciel',
    type: 'robot'
  },
  {
    title: 'Formation Revit Architecture',
    description: 'Créez des modèles 3D avec Revit. Formation complète en BIM et modélisation architecturale.',
    price: 180000,
    duration: 5,
    category: 'logiciel',
    type: 'revit'
  },
  {
    title: 'Génie Civil - Fondations',
    description: 'Spécialisation en conception de fondations. Formation technique pour ingénieurs et techniciens.',
    price: 100000,
    duration: 3,
    category: 'technique',
    type: 'genie-civil'
  },
  {
    title: 'Hydraulique Urbaine',
    description: 'Conception de réseaux d\'assainissement et d\'adduction d\'eau. Formation spécialisée en hydraulique.',
    price: 130000,
    duration: 4,
    category: 'technique',
    type: 'hydraulique'
  }
];

async function seedData() {
  try {
    // Connexion à MongoDB
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    
    console.log('🗄️  Connecté à MongoDB Atlas');
    
    // Supprimer les données existantes
    await Formation.deleteMany({});
    console.log('🗑️  Anciennes formations supprimées');
    
    // Insérer les nouvelles données
    const formations = await Formation.insertMany(formationsData);
    console.log(`✅ ${formations.length} formations ajoutées`);
    
    // Afficher les formations ajoutées
    formations.forEach(formation => {
      console.log(`   - ${formation.title} (${formation.price} FCFA)`);
    });
    
    console.log('\n🎉 Données initiales créées avec succès !');
    process.exit(0);
  } catch (error) {
    console.error('❌ Erreur lors de la création des données:', error);
    process.exit(1);
  }
}

seedData(); 