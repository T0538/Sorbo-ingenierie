// Script pour corriger les données des formations dans MongoDB Atlas
console.log('🔧 === CORRECTION DES DONNÉES FORMATIONS ===\n');

// Configuration
const API_BASE_URL = 'https://sorbo-api-production.up.railway.app';

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

// Fonction pour mettre à jour une formation
async function updateFormation(formationId, nouvellesDonnees) {
    try {
        console.log(`🔄 Mise à jour de la formation ${formationId}...`);
        
        const response = await fetch(`${API_BASE_URL}/api/formations/${formationId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify(nouvellesDonnees)
        });
        
        if (response.ok) {
            const result = await response.json();
            console.log(`✅ Formation ${formationId} mise à jour`);
            return result;
        } else {
            console.log(`❌ Erreur ${response.status}: ${response.statusText}`);
            return null;
        }
        
    } catch (error) {
        console.log(`❌ Erreur lors de la mise à jour: ${error.message}`);
        return null;
    }
}

// Fonction pour récupérer les formations existantes
async function getFormations() {
    try {
        console.log('📡 Récupération des formations existantes...');
        
        const response = await fetch(`${API_BASE_URL}/api/formations`, {
            method: 'GET',
            headers: {
                'Accept': 'application/json'
            }
        });
        
        if (response.ok) {
            const result = await response.json();
            console.log(`✅ ${result.data.length} formations récupérées`);
            return result.data;
        } else {
            console.log(`❌ Erreur ${response.status}: ${response.statusText}`);
            return [];
        }
        
    } catch (error) {
        console.log(`❌ Erreur lors de la récupération: ${error.message}`);
        return [];
    }
}

// Fonction pour créer une nouvelle formation
async function createFormation(donneesFormation) {
    try {
        console.log(`➕ Création d'une nouvelle formation: ${donneesFormation.titre}`);
        
        const response = await fetch(`${API_BASE_URL}/api/formations`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify(donneesFormation)
        });
        
        if (response.ok) {
            const result = await response.json();
            console.log(`✅ Formation créée: ${result._id}`);
            return result;
        } else {
            const errorText = await response.text();
            console.log(`❌ Erreur ${response.status}: ${errorText}`);
            return null;
        }
        
    } catch (error) {
        console.log(`❌ Erreur lors de la création: ${error.message}`);
        return null;
    }
}

// Fonction principale de correction
async function corrigerFormations() {
    console.log('🚀 Début de la correction des formations...\n');
    
    // 1. Récupérer les formations existantes
    const formationsExistantes = await getFormations();
    
    if (formationsExistantes.length === 0) {
        console.log('📝 Aucune formation existante, création de nouvelles formations...');
        
        // Créer toutes les formations
        for (let i = 0; i < formationsCorrigees.length; i++) {
            const formation = formationsCorrigees[i];
            await createFormation(formation);
            
            // Attendre un peu entre les créations
            await new Promise(resolve => setTimeout(resolve, 1000));
        }
        
    } else {
        console.log(`📝 ${formationsExistantes.length} formations existantes trouvées, mise à jour...`);
        
        // Mettre à jour les formations existantes
        for (let i = 0; i < Math.min(formationsExistantes.length, formationsCorrigees.length); i++) {
            const formationExistante = formationsExistantes[i];
            const nouvellesDonnees = formationsCorrigees[i];
            
            await updateFormation(formationExistante._id, nouvellesDonnees);
            
            // Attendre un peu entre les mises à jour
            await new Promise(resolve => setTimeout(resolve, 1000));
        }
        
        // Si on a plus de nouvelles formations que d'existantes, créer les manquantes
        if (formationsCorrigees.length > formationsExistantes.length) {
            console.log('➕ Création des formations supplémentaires...');
            
            for (let i = formationsExistantes.length; i < formationsCorrigees.length; i++) {
                const formation = formationsCorrigees[i];
                await createFormation(formation);
                
                await new Promise(resolve => setTimeout(resolve, 1000));
            }
        }
    }
    
    // 2. Vérifier le résultat
    console.log('\n🔍 Vérification du résultat...');
    const formationsFinales = await getFormations();
    
    console.log(`\n📊 === RÉSUMÉ ===`);
    console.log(`✅ Formations finales: ${formationsFinales.length}`);
    
    if (formationsFinales.length > 0) {
        console.log(`\n📋 Liste des formations:`);
        formationsFinales.forEach((formation, index) => {
            console.log(`   ${index + 1}. ${formation.titre || 'Titre manquant'}`);
            console.log(`      Catégorie: ${formation.categorie || 'Non définie'}`);
            console.log(`      Prix: ${formation.prix || 'Non défini'} FCFA`);
            console.log(`      Statut: ${formation.status || 'Non défini'}`);
            console.log('');
        });
        
        // Vérifier si les données sont complètes
        const formationsCompletes = formationsFinales.filter(f => 
            f.titre && f.categorie && f.prix && f.status
        );
        
        console.log(`✅ Formations complètes: ${formationsCompletes.length}/${formationsFinales.length}`);
        
        if (formationsCompletes.length === formationsFinales.length) {
            console.log(`🎉 Toutes les formations ont des données complètes !`);
            console.log(`🌐 Votre domaine .ci devrait maintenant afficher les vraies formations`);
        } else {
            console.log(`⚠️ Certaines formations ont encore des données incomplètes`);
        }
        
    } else {
        console.log(`❌ Aucune formation trouvée après correction`);
    }
}

// Exécuter la correction
corrigerFormations().catch(error => {
    console.error(`💥 Erreur fatale: ${error.message}`);
    process.exit(1);
});
