/**
 * Script de lecture des formations (vérification côté API)
 * Utilisation:
 *   API_BASE_URL=https://sorbo-api-production.up.railway.app node scripts/read-formations.js
 */

// Pour Node < 18 (décommentez si nécessaire)
// const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

const API_BASE_URL = process.env.API_BASE_URL || 'https://sorbo-api-production.up.railway.app';

(async () => {
  try {
    const res = await fetch(`${API_BASE_URL}/api/formations`, {
      method: 'GET',
      headers: { 'Accept': 'application/json' }
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    if (!data?.success) throw new Error('Réponse API invalide');

    const rows = (data.data || []).map(f => ({
      id: f._id,
      title: f.title,
      type: f.type,
      price: f.price,
      duration: f.duration,
    }));

    console.log(`✅ ${rows.length} formation(s) trouvée(s)`);
    console.table(rows);
  } catch (e) {
    console.error('❌ Lecture impossible:', e.message);
    process.exit(1);
  }
})();


