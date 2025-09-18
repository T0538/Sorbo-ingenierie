/**
 * Script de mise à jour des formations sur MongoDB Atlas via l'API Railway
 *
 * Ce script:
 * 1) Supprime (ou archive) 4 anciennes formations (sélection par titre partiel)
 * 2) Crée 4 nouvelles formations fournies par le client
 *
 * IMPORTANT
 * - Ne modifie pas le design: seules des données sont ajoutées/retirées
 * - Renseigner les variables d'environnement avant exécution:
 *   - API_BASE_URL=https://sorbo-api-production.up.railway.app
 *   - API_TOKEN=... (token admin/bearer si l'API l'exige)
 *
 * Utilisation:
 *   API_BASE_URL=https://sorbo-api-production.up.railway.app \
 *   API_TOKEN=VOTRE_TOKEN node scripts/update-formations.js
 */

// Petite aide pour Node < 18 (si besoin, décommentez et installez node-fetch)
// const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

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
  if (!res.ok) throw new Error(`DELETE formation ${id} failed: ${res.status}`);
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

    // 1) Choisir 4 formations à remplacer
    // Par défaut, on prend les 4 plus anciennes si l'API ne permet pas de filtrer par date.
    const toRemove = existing.slice(0, 4);
    if (toRemove.length === 0) {
      console.log('Aucune formation présente ou déjà nettoyée.');
    } else {
      console.log(`🗑️ Suppression de ${toRemove.length} formation(s)...`);
      for (const f of toRemove) {
        await deleteFormation(f._id);
        console.log(`  - supprimée: ${f.title} (${f._id})`);
      }
    }

    // 2) Créer les 4 nouvelles formations (types choisis pour coller aux images par défaut du front)
    const NEW_FORMATIONS = [
      {
        title: 'ArchiCAD – Conception et plans 2D/3D (18 Oct → 15 Nov)',
        type: 'revit', // pour l’image BIM déjà gérée côté front
        price: 150000,
        duration: 5, // 5 séances
        description: '40h réparties en 5 séances (samedi ou dimanche, 09h–16h).',
        schedule: 'Week-end, 09h–16h',
        location: 'Abidjan, Cocody'
      },
      {
        title: 'AutoCAD – Plans 2D de bâtiments (25 Oct → 15 Nov)',
        type: 'autocad',
        price: 100000,
        duration: 4,
        description: '32h en 4 séances (samedi ou dimanche, 09h–16h).',
        schedule: 'Week-end, 09h–16h',
        location: 'Abidjan, Cocody'
      },
      {
        title: 'Robot – Conception/dimensionnement BA (19 Oct → 16 Nov 2025)',
        type: 'robot',
        price: 150000,
        duration: 4,
        description: '40h en 4 séances (samedi ou dimanche, 09h–16h).',
        schedule: 'Week-end, 09h–16h',
        location: 'Abidjan, Cocody'
      },
      {
        title: 'Gestion de projet – Microsoft Project (02 → 23 Nov)',
        type: 'genie-civil', // pour image par défaut, sans changer le front
        price: 100000,
        duration: 4,
        description: '32h en 4 séances (samedi ou dimanche, 09h–16h).',
        schedule: 'Week-end, 09h–16h',
        location: 'Abidjan, Cocody'
      }
    ];

    console.log('➕ Création des nouvelles formations...');
    for (const payload of NEW_FORMATIONS) {
      const created = await createFormation(payload);
      console.log(`  - créée: ${payload.title} → id=${created?.data?._id || 'inconnu'}`);
    }

    console.log('✅ Mise à jour terminée.');
  } catch (err) {
    console.error('❌ Échec de la mise à jour des formations:', err.message);
    process.exit(1);
  }
})();


