/**
 * Script pour ajouter les 4 formations réelles inter-entreprise dans MongoDB Atlas
 * 
 * Ces formations remplacent 4 anciennes formations et sont destinées à la page
 * formations-inter-entreprise.html qui charge dynamiquement via MongoDB
 */

const API_BASE_URL = process.env.API_BASE_URL || 'https://sorbo-api-production.up.railway.app';
const API_TOKEN = process.env.API_TOKEN || '';

function authHeaders() {
  const headers = { 'Content-Type': 'application/json', 'Accept': 'application/json' };
  if (API_TOKEN) headers['Authorization'] = `Bearer ${API_TOKEN}`;
  return headers;
}

async function getAllFormations() {
  const res = await fetch(`${API_BASE_URL}/api/formations`, { headers: authHeaders() });
  if (!res.ok) throw new Error(`GET formations failed: ${res.status}`);
  const data = await res.json();
  if (!data.success) throw new Error('API returned success=false');
  return data.data || [];
}

async function deleteFormation(id) {
  const res = await fetch(`${API_BASE_URL}/api/formations/${id}`, {
    method: 'DELETE',
    headers: authHeaders()
  });
  if (!res.ok && res.status !== 404) throw new Error(`DELETE formation ${id} failed: ${res.status}`);
}

async function createFormation(payload) {
  const res = await fetch(`${API_BASE_URL}/api/formations`, {
    method: 'POST',
    headers: authHeaders(),
    body: JSON.stringify(payload)
  });
  if (!res.ok) throw new Error(`POST formation failed: ${res.status}`);
  return res.json();
}

(async () => {
  try {
    console.log('🔎 Lecture des formations existantes...');
    const existing = await getAllFormations();

    // Supprimer 4 formations existantes (best effort)
    const toRemove = existing.slice(0, 4);
    if (toRemove.length > 0) {
      console.log(`🗑️ Suppression de ${toRemove.length} formation(s) existante(s)...`);
      for (const f of toRemove) {
        try {
          await deleteFormation(f._id);
          console.log(`  - supprimée: ${f.title} (${f._id})`);
        } catch (e) {
          console.warn(`  ! suppression ignorée (${f._id}) → ${e.message}`);
        }
      }
    }

    // Créer les 4 nouvelles formations réelles
    const NOUVELLES_FORMATIONS = [
      {
        title: "ArchiCAD - Conception et dessin de plans 2D/3D de bâtiments",
        type: "revit", // pour image BIM
        price: 150000,
        duration: "40 heures",
        schedule: "5 séances - samedis ou dimanches de 09h à 16h",
        dates: "Du 18 octobre au 15 novembre",
        description: "Formation complète à ArchiCAD pour la conception et le dessin de plans 2D/3D de bâtiments.",
        location: "Abidjan, Cocody",
        objectifs: [
          "Appréhender la méthodologie du travail sur ArchiCAD",
          "Organiser l'environnement de travail du logiciel",
          "Paramétrer et utiliser les outils essentiels pour créer et modifier des dessins",
          "Présenter les projets avec des mises en pages détaillées",
          "Préparer les documents pour l'impression"
        ],
        category: "Logiciels",
        niveau: "Débutant à intermédiaire"
      },
      {
        title: "AutoCAD - Conception et dessin de plans 2D de bâtiments",
        type: "autocad",
        price: 100000,
        duration: "32 heures",
        schedule: "4 séances - samedis ou dimanches de 09h à 16h",
        dates: "Du 25 octobre au 15 novembre",
        description: "Maîtrisez AutoCAD pour la conception et le dessin de plans 2D de bâtiments avec précision.",
        location: "Abidjan, Cocody",
        objectifs: [
          "Appréhender la méthodologie du travail sur AutoCAD",
          "Organiser l'interface de travail",
          "Utiliser les outils essentiels pour créer des dessins de précision",
          "Créer et gérer les calques et blocs de dessins",
          "Gérer les annotations, les cotations et les échelles",
          "Modifier et importer des éléments préexistants",
          "Présenter les projets avec des mises en pages détaillées",
          "Préparer les documents pour l'impression"
        ],
        category: "Logiciels",
        niveau: "Débutant à intermédiaire"
      },
      {
        title: "Robot - Conception et dimensionnement des bâtiments en BA",
        type: "robot",
        price: 150000,
        duration: "40 heures",
        schedule: "4 séances - samedis ou dimanches de 09h à 16h",
        dates: "Du 19 octobre au 16 novembre 2025",
        description: "Formation approfondie au logiciel Robot pour la conception et le dimensionnement des structures en béton armé.",
        location: "Abidjan, Cocody",
        objectifs: [
          "Définir les hypothèses de calculs et de vérifications des structures bâtiments en béton armé",
          "Réaliser le pré-dimensionnement de la structure porteuse d'un bâtiment",
          "Modéliser et faire la descente de charges à l'aide du logiciel Robot",
          "Réaliser l'analyse structurelle conformément aux normes internationales",
          "Générer les plans d'exécution et les notes de calculs détaillés"
        ],
        category: "Logiciels",
        niveau: "Intermédiaire à avancé"
      },
      {
        title: "Gestion de projet - Microsoft Project",
        type: "genie-civil",
        price: 100000,
        duration: "32 heures",
        schedule: "4 séances - samedis ou dimanches de 09h à 16h",
        dates: "Du 02 au 23 novembre",
        description: "Maîtrisez Microsoft Project pour une gestion de projet efficace dans le BTP et l'ingénierie.",
        location: "Abidjan, Cocody",
        objectifs: [
          "Maîtriser les bases de Microsoft Project",
          "Planifier des projets",
          "Gérer des ressources",
          "Suivre et contrôler des projets",
          "Analyser des données de projet",
          "Utiliser des fonctionnalités avancées du logiciel",
          "Élaborer un devis quantitatif et estimatif (D.Q.E)",
          "Faire des sous-détails des prix unitaires"
        ],
        category: "Gestion de projet",
        niveau: "Débutant à intermédiaire"
      }
    ];

    console.log('➕ Création des 4 nouvelles formations réelles...');
    for (const payload of NOUVELLES_FORMATIONS) {
      const created = await createFormation(payload);
      console.log(`  - créée: ${payload.title} → ${payload.price.toLocaleString()} FCFA`);
    }

    console.log('✅ Formations inter-entreprise mises à jour avec succès !');
    console.log('📋 Ces formations sont maintenant disponibles via MongoDB Atlas');
    
  } catch (err) {
    console.error('❌ Échec de la mise à jour:', err.message);
    process.exit(1);
  }
})();
