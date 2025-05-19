const axios = require('axios');
const dotenv = require('dotenv');
const colors = require('colors');

// Charger les variables d'environnement
dotenv.config();

// Configuration de base
const API_URL = process.env.API_URL || 'https://sorbo-api-production.up.railway.app/api/';
let token = null; // Token JWT pour les routes protégées

// Fonction pour afficher le résultat d'un test
const logResult = (endpoint, method, success, statusCode, message) => {
  const status = success ? '✓'.green : '✗'.red;
  const statusText = success ? 'OK'.green : 'ÉCHEC'.red;
  console.log(`${status} [${method.toUpperCase().padEnd(6)}] ${endpoint.padEnd(40)} ${statusCode} ${statusText} ${message || ''}`);
};

// Fonction pour exécuter un test d'API
const testEndpoint = async (endpoint, method = 'get', data = null, auth = false, expectedStatus = 200) => {
  try {
    const config = {
      method,
      url: `${API_URL}${endpoint}`,
      ...(data && { data }),
      ...(auth && token && { headers: { Authorization: `Bearer ${token}` } })
    };
    
    const response = await axios(config);
    const success = response.status === expectedStatus;
    logResult(endpoint, method, success, response.status, success ? '' : `Attendu: ${expectedStatus}`);
    return response.data;
  } catch (error) {
    const status = error.response ? error.response.status : 500;
    const isExpected = status === expectedStatus;
    logResult(
      endpoint, 
      method, 
      isExpected, 
      status, 
      isExpected ? '' : `Erreur: ${error.response ? error.response.data.message : error.message}`
    );
    return null;
  }
};

// Fonction principale pour exécuter tous les tests
const runTests = async () => {
  console.log('\n=== TEST DES ROUTES API ===\n'.cyan);
  
  // 1. Test d'authentification
  console.log('\nAUTHENTIFICATION:'.yellow);
  
  // Inscription d'un nouvel utilisateur (peut échouer si l'utilisateur existe déjà)
  await testEndpoint('/auth/register', 'post', {
    name: 'Test User',
    email: 'test@example.com',
    password: 'password123',
    role: 'user'
  }, false, 201);
  
  // Connexion (doit réussir)
  const loginResponse = await testEndpoint('/auth/login', 'post', {
    email: 'test@example.com',
    password: 'password123'
  });
  
  if (loginResponse && loginResponse.token) {
    token = loginResponse.token;
    console.log('Token JWT obtenu avec succès'.green);
  } else {
    console.log('Impossible d\'obtenir le token JWT. Les tests des routes protégées vont échouer.'.red);
  }
  
  // Profil utilisateur
  await testEndpoint('/auth/profile', 'get', null, true);
  
  // 2. Test des routes de contact
  console.log('\nCONTACT:'.yellow);
  await testEndpoint('/contact', 'get', null, true); // Liste des contacts (admin)
  await testEndpoint('/contact', 'post', {
    name: 'Nom Test',
    email: 'test@example.com',
    subject: 'Test API',
    message: 'Ceci est un message de test.'
  });
  
  // 3. Test des routes de formations
  console.log('\nFORMATIONS:'.yellow);
  await testEndpoint('/formations'); // Liste des formations
  
  // Créer une formation (admin)
  const formationResponse = await testEndpoint('/formations', 'post', {
    title: 'Formation Test API',
    category: 'logiciel',
    type: 'covadis',
    description: 'Description de test',
    duration: 10,
    price: 100000
  }, true, 201);
  
  let formationId = null;
  if (formationResponse && formationResponse.data && formationResponse.data._id) {
    formationId = formationResponse.data._id;
    
    // Détail d'une formation
    await testEndpoint(`/formations/${formationId}`);
    
    // Mise à jour d'une formation (admin)
    await testEndpoint(`/formations/${formationId}`, 'put', {
      title: 'Formation Test API (mise à jour)'
    }, true);
    
    // Ajouter un témoignage
    await testEndpoint(`/formations/${formationId}/testimonials`, 'post', {
      name: 'Client Test',
      company: 'Entreprise Test',
      position: 'Directeur',
      comment: 'Excellente formation!',
      rating: 5
    }, true);
    
    // S'inscrire à une formation
    await testEndpoint(`/formations/${formationId}/inscription`, 'post', {
      nom: 'Participant Test',
      prenom: 'Prénom Test',
      email: 'participant@example.com',
      telephone: '01234567890',
      entreprise: 'Entreprise Test',
      fonction: 'Ingénieur'
    }, true);
    
    // Supprimer une formation (admin)
    await testEndpoint(`/formations/${formationId}`, 'delete', null, true);
  }
  
  // 4. Test des routes d'emplois
  console.log('\nEMPLOIS:'.yellow);
  await testEndpoint('/emplois'); // Liste des offres d'emploi
  
  // Créer une offre d'emploi (admin)
  const emploiResponse = await testEndpoint('/emplois', 'post', {
    titre: 'Poste Test API',
    type: 'cdi',
    departement: 'ingenierie',
    localisation: 'Abidjan',
    description: 'Description du poste test',
    experience: 'confirme',
    statut: 'active',
    salaire: 'Selon profil'
  }, true, 201);
  
  let emploiId = null;
  if (emploiResponse && emploiResponse.data && emploiResponse.data._id) {
    emploiId = emploiResponse.data._id;
    
    // Détail d'une offre d'emploi
    await testEndpoint(`/emplois/${emploiId}`);
    
    // Mise à jour d'une offre d'emploi (admin)
    await testEndpoint(`/emplois/${emploiId}`, 'put', {
      titre: 'Poste Test API (mise à jour)'
    }, true);
    
    // Ajouter une candidature
    // Note: ici on ne peut pas facilement tester l'upload de fichiers avec axios
    await testEndpoint(`/emplois/${emploiId}/candidatures`, 'post', {
      nom: 'Candidat Test',
      email: 'candidat@example.com',
      telephone: '01234567890'
    });
    
    // Récupérer les candidatures (admin)
    await testEndpoint(`/emplois/${emploiId}/candidatures`, 'get', null, true);
    
    // Supprimer une offre d'emploi (admin)
    await testEndpoint(`/emplois/${emploiId}`, 'delete', null, true);
  }
  
  // 5. Test des routes de projets
  console.log('\nPROJETS:'.yellow);
  await testEndpoint('/projets'); // Liste des projets
  
  // Créer un projet (admin)
  const projetResponse = await testEndpoint('/projets', 'post', {
    titre: 'Projet Test API',
    categorie: 'batiment',
    description: 'Description du projet test',
    client: 'Client Test',
    localisation: 'Abidjan',
    dateDebut: new Date().toISOString(),
    statut: 'en_cours'
  }, true, 201);
  
  let projetId = null;
  if (projetResponse && projetResponse.data && projetResponse.data._id) {
    projetId = projetResponse.data._id;
    
    // Détail d'un projet
    await testEndpoint(`/projets/${projetId}`);
    
    // Mise à jour d'un projet (admin)
    await testEndpoint(`/projets/${projetId}`, 'put', {
      titre: 'Projet Test API (mise à jour)'
    }, true);
    
    // Supprimer un projet (admin)
    await testEndpoint(`/projets/${projetId}`, 'delete', null, true);
  }
  
  // 6. Test des routes de logiciels
  console.log('\nLOGICIELS:'.yellow);
  await testEndpoint('/logiciels'); // Liste des logiciels
  
  // Créer un logiciel (admin)
  const logicielResponse = await testEndpoint('/logiciels', 'post', {
    nom: 'Logiciel Test API',
    categorie: 'structure',
    description: 'Description du logiciel test',
    fonctionnalites: ['Fonction 1', 'Fonction 2'],
    avantages: ['Avantage 1', 'Avantage 2'],
    systemes: ['windows']
  }, true, 201);
  
  let logicielId = null;
  if (logicielResponse && logicielResponse.data && logicielResponse.data._id) {
    logicielId = logicielResponse.data._id;
    
    // Détail d'un logiciel
    await testEndpoint(`/logiciels/${logicielId}`);
    
    // Mise à jour d'un logiciel (admin)
    await testEndpoint(`/logiciels/${logicielId}`, 'put', {
      nom: 'Logiciel Test API (mise à jour)'
    }, true);
    
    // Ajouter une version
    await testEndpoint(`/logiciels/${logicielId}/versions`, 'post', {
      numero: '1.0.0',
      datePublication: new Date().toISOString(),
      nouveautes: ['Nouveauté 1', 'Nouveauté 2'],
      corrections: ['Correction 1']
    }, true);
    
    // Ajouter un témoignage
    await testEndpoint(`/logiciels/${logicielId}/testimonials`, 'post', {
      nom: 'Utilisateur Test',
      entreprise: 'Entreprise Test',
      poste: 'Ingénieur',
      commentaire: 'Excellent logiciel!',
      note: 5
    }, true);
    
    // Supprimer un logiciel (admin)
    await testEndpoint(`/logiciels/${logicielId}`, 'delete', null, true);
  }
  
  console.log('\n=== FIN DES TESTS ===\n'.cyan);
};

// Exécuter les tests
runTests().catch(error => {
  console.error('Erreur lors de l\'exécution des tests:', error.message);
}); 