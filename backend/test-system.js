const axios = require('axios');

const API_BASE_URL = 'https://sorbo-api-production.up.railway.app';
const ADMIN_TOKEN = 'admin123';

// Configuration axios
const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${ADMIN_TOKEN}`
    }
});

// Couleurs pour les logs
const colors = {
    green: '\x1b[32m',
    red: '\x1b[31m',
    yellow: '\x1b[33m',
    blue: '\x1b[34m',
    reset: '\x1b[0m'
};

function log(message, color = 'reset') {
    console.log(`${colors[color]}${message}${colors.reset}`);
}

async function testSystem() {
    log('🧪 DÉBUT DES TESTS DU SYSTÈME D\'ADMINISTRATION', 'blue');
    log('================================================', 'blue');

    try {
        // 1. Test de connexion au serveur
        log('\n1️⃣ Test de connexion au serveur...', 'yellow');
        const healthResponse = await api.get('/health');
        log(`✅ Serveur connecté: ${healthResponse.data.message}`, 'green');

        // 2. Test des statistiques
        log('\n2️⃣ Test des statistiques...', 'yellow');
        const statsResponse = await api.get('/admin/stats');
        log(`✅ Statistiques récupérées:`, 'green');
        console.log(statsResponse.data.data);

        // 3. Test des actualités
        log('\n3️⃣ Test des actualités...', 'yellow');
        
        // Créer une actualité
        const nouvelleActualite = {
            titre: "Test - Nouvelle formation AutoCAD 2024",
            resume: "Nous lançons une nouvelle formation AutoCAD pour débutants",
            contenu: "Contenu complet de la formation AutoCAD 2024. Cette formation s'adresse aux débutants qui souhaitent maîtriser AutoCAD.",
            categorie: "formation",
            statut: "publie"
        };

        const actualiteResponse = await api.post('/admin/actualites', nouvelleActualite);
        log(`✅ Actualité créée avec l'ID: ${actualiteResponse.data.data._id}`, 'green');

        // Récupérer les actualités
        const actualitesResponse = await api.get('/admin/actualites');
        log(`✅ ${actualitesResponse.data.data.length} actualité(s) trouvée(s)`, 'green');

        // 4. Test des logiciels
        log('\n4️⃣ Test des logiciels...', 'yellow');
        
        const nouveauLogiciel = {
            nom: "AutoCAD 2024",
            description: "Logiciel de CAO professionnel pour l'ingénierie",
            categorie: "autocad",
            prix: 250000,
            disponible: true
        };

        const logicielResponse = await api.post('/admin/logiciels', nouveauLogiciel);
        log(`✅ Logiciel créé avec l'ID: ${logicielResponse.data.data._id}`, 'green');

        // 5. Test des emplois
        log('\n5️⃣ Test des emplois...', 'yellow');
        
        const nouvelEmploi = {
            titre: "Ingénieur Civil",
            entreprise: "Sorbo Ingénierie",
            description: "Nous recherchons un ingénieur civil expérimenté",
            lieu: { ville: "Abidjan" },
            typeContrat: "cdi",
            dateLimite: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 jours
            urgent: true
        };

        const emploiResponse = await api.post('/admin/emplois', nouvelEmploi);
        log(`✅ Emploi créé avec l'ID: ${emploiResponse.data.data._id}`, 'green');

        // 6. Test des formations
        log('\n6️⃣ Test des formations...', 'yellow');
        
        const nouvelleFormation = {
            titre: "Formation AutoCAD Débutant",
            description: "Apprenez AutoCAD de A à Z en 5 jours",
            categorie: "autocad",
            niveau: "debutant",
            prix: 150000,
            duree: "5 jours",
            disponible: true
        };

        const formationResponse = await api.post('/admin/formations', nouvelleFormation);
        log(`✅ Formation créée avec l'ID: ${formationResponse.data.data._id}`, 'green');

        // 7. Test des routes publiques
        log('\n7️⃣ Test des routes publiques...', 'yellow');
        
        const actualitesPubliques = await axios.get(`${API_BASE_URL}/actualites`);
        log(`✅ ${actualitesPubliques.data.data.length} actualité(s) publique(s)`, 'green');

        const logicielsPublics = await axios.get(`${API_BASE_URL}/logiciels`);
        log(`✅ ${logicielsPublics.data.data.length} logiciel(s) public(s)`, 'green');

        const emploisPublics = await axios.get(`${API_BASE_URL}/emplois`);
        log(`✅ ${emploisPublics.data.data.length} emploi(s) public(s)`, 'green');

        const formationsPubliques = await axios.get(`${API_BASE_URL}/formations`);
        log(`✅ ${formationsPubliques.data.data.length} formation(s) publique(s)`, 'green');

        // 8. Test de modification
        log('\n8️⃣ Test de modification...', 'yellow');
        
        const actualiteId = actualiteResponse.data.data._id;
        const modification = {
            titre: "Test - Formation AutoCAD 2024 (MODIFIÉE)",
            resume: "Formation modifiée avec succès"
        };

        const modifResponse = await api.put(`/admin/actualites/${actualiteId}`, modification);
        log(`✅ Actualité modifiée avec succès`, 'green');

        // 9. Test de suppression
        log('\n9️⃣ Test de suppression...', 'yellow');
        
        const logicielId = logicielResponse.data.data._id;
        await api.delete(`/admin/logiciels/${logicielId}`);
        log(`✅ Logiciel supprimé avec succès`, 'green');

        // 10. Test final des statistiques
        log('\n🔟 Test final des statistiques...', 'yellow');
        const statsFinales = await api.get('/admin/stats');
        log(`✅ Statistiques finales:`, 'green');
        console.log(statsFinales.data.data);

        log('\n🎉 TOUS LES TESTS SONT PASSÉS AVEC SUCCÈS !', 'green');
        log('==============================================', 'green');
        log('\n📋 RÉSUMÉ DES TESTS:', 'blue');
        log('✅ Connexion au serveur', 'green');
        log('✅ Authentification admin', 'green');
        log('✅ Création d\'actualités', 'green');
        log('✅ Création de logiciels', 'green');
        log('✅ Création d\'emplois', 'green');
        log('✅ Création de formations', 'green');
        log('✅ Routes publiques', 'green');
        log('✅ Modification de contenu', 'green');
        log('✅ Suppression de contenu', 'green');
        log('✅ Statistiques', 'green');

        log('\n🌐 PROCHAINES ÉTAPES:', 'blue');
        log('1. Ouvrir http://localhost:5000/admin-dashboard.html', 'yellow');
        log('2. Tester l\'interface d\'administration', 'yellow');
        log('3. Ajouter du contenu via le dashboard', 'yellow');
        log('4. Vérifier l\'affichage sur le site web', 'yellow');

    } catch (error) {
        log('\n❌ ERREUR LORS DES TESTS:', 'red');
        if (error.response) {
            log(`Status: ${error.response.status}`, 'red');
            log(`Message: ${error.response.data.message || error.message}`, 'red');
        } else {
            log(`Erreur: ${error.message}`, 'red');
        }
        
        log('\n🔧 DÉPANNAGE:', 'yellow');
        log('1. Vérifiez que le serveur est démarré (npm run dev)', 'yellow');
        log('2. Vérifiez la connexion MongoDB Atlas', 'yellow');
        log('3. Vérifiez le fichier .env', 'yellow');
        log('4. Vérifiez les logs du serveur', 'yellow');
    }
}

// Lancer les tests
testSystem();











