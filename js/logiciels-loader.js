// Chargeur de logiciels depuis MongoDB Atlas
console.log('💻 Démarrage du chargeur de logiciels...');
const API_BASE_URL = 'https://sorbo-api-production.up.railway.app'; // Production Railway
// const API_BASE_URL = 'http://localhost:5000'; // Développement local

const MAX_RETRIES = 3; // Nombre maximum de tentatives de connexion à l'API
let retryCount = 0; // Compteur de tentatives

async function loadLogicielsFromAPI() {
    try {
        console.log(`📡 Récupération des logiciels depuis l\'API... (Tentative ${retryCount + 1}/${MAX_RETRIES})`);
        const response = await fetch(`${API_BASE_URL}/api/logiciels`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            },
            signal: AbortSignal.timeout(15000), // 15 secondes
            cache: 'no-store' // Désactiver le cache pour forcer une nouvelle requête
        });

        if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        const result = await response.json();
        
        // Réinitialiser le compteur de tentatives en cas de succès
        retryCount = 0;
        
        if (result.success) {
            console.log(`✅ ${result.data.length} logiciels récupérés`);
            displayLogiciels(result.data);
        } else {
            throw new Error(result.message || 'Erreur lors de la récupération');
        }
    } catch (error) {
        console.error(`❌ Erreur lors du chargement des logiciels (Tentative ${retryCount + 1}/${MAX_RETRIES}):`, error);
        
        if (error.name === 'AbortError' || error.message.includes('Failed to fetch')) {
            if (retryCount < MAX_RETRIES - 1) {
                retryCount++;
                console.log(`🔄 Nouvelle tentative ${retryCount}/${MAX_RETRIES} dans 3 secondes...`);
                displayError(`Connexion à l'API impossible. Nouvelle tentative ${retryCount}/${MAX_RETRIES}...`);
                setTimeout(loadLogicielsFromAPI, 3000); // Réessayer après 3 secondes
            } else {
                console.log('⚠️ Nombre maximum de tentatives atteint, chargement des logiciels de démonstration...');
                displayNoLogiciels();
            }
        } else {
            if (retryCount < MAX_RETRIES - 1) {
                retryCount++;
                console.log(`🔄 Nouvelle tentative ${retryCount}/${MAX_RETRIES} dans 2 secondes...`);
                displayError(`Erreur lors du chargement. Nouvelle tentative ${retryCount}/${MAX_RETRIES}...`);
                setTimeout(loadLogicielsFromAPI, 2000); // Réessayer après 2 secondes
            } else {
                displayError('Erreur lors du chargement des logiciels. Vérifiez que le serveur est démarré.');
                displayNoLogiciels();
            }
        }
    }
}

function displayLogiciels(logiciels) {
    const container = document.getElementById('logiciels-grid') || document.getElementById('software-grid');
    if (!container) {
        console.error('❌ Container logiciels-grid/software-grid non trouvé');
        return;
    }

    if (!logiciels || logiciels.length === 0) {
        displayNoLogiciels();
        return;
    }

         const logicielsHTML = logiciels.map((logiciel, index) => createLogicielCard(logiciel, index, logiciels.length)).join('');
    container.innerHTML = logicielsHTML;
    
    // Ajouter les event listeners pour les boutons
    addDownloadListeners();
}

function createLogicielCard(logiciel, index, total) {
     const nom = logiciel.nom || 'Logiciel';
     const description = logiciel.description || '';
     const categorie = logiciel.categorie || '';
     const version = logiciel.version ? `v${logiciel.version}` : '';
     const prix = logiciel.prix || 'Gratuit';
     // Le logo est toujours chargé depuis le dossier local images/
     const image = 'images/image1.png';
     const headerImage = logiciel.headerImage || 'images/drainageroute.png';
     
         // Formater la catégorie (première lettre de chaque mot en majuscule, sauf les mots de liaison)
    const motsLiaison = ['et', 'de', 'du', 'des', 'le', 'la', 'les', 'en', 'à', 'au', 'aux'];
    const categorieFormatee = categorie.split(' ').map((word, index) => {
        const motMinuscule = word.toLowerCase();
        // Garder les mots de liaison en minuscules, sauf s'ils sont en première position
        if (index > 0 && motsLiaison.includes(motMinuscule)) {
            return motMinuscule;
        }
        return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
    }).join(' ');
     
     // Déterminer si le logiciel est disponible au téléchargement
     // TALREN et OH-Route sont disponibles
     const isDisponible = nom.toLowerCase().includes('talren') || nom.toLowerCase().includes('oh-route');

    const features = Array.isArray(logiciel.fonctionnalites)
      ? logiciel.fonctionnalites.slice(0, 4)
      : [];

    const featuresHTML = features
      .map(f => `<div class="feature-item"><i class="fas fa-check"></i><span>${f}</span></div>`)
      .join('');

    // Choix couleur d'icône selon catégorie
    const iconColorClass = categorie.toLowerCase().includes('géo') || categorie.toLowerCase().includes('hydro')
      ? 'green'
      : categorie.toLowerCase().includes('bim') || categorie.toLowerCase().includes('cao')
        ? 'blue'
        : '';

    return `
      <article class="software-card" aria-label="${nom}" data-logiciel-id="${logiciel.id}" style="background: #ffffff; border-radius: 14px; box-shadow: 0 8px 30px rgba(20,20,40,0.06); overflow: hidden; display: grid; grid-template-columns: 1fr; max-width: 820px; margin: 0 auto 18px auto;">
        <!-- Illustration / media -->
        <div class="software-media" style="background: transparent; padding: 0; overflow: hidden;">
          <img src="${headerImage}" alt="Illustration ${nom}" style="width:100%; height:180px; object-fit:cover; display:block;">
        </div>

        <!-- Contenu -->
        <div class="software-content" style="padding: 22px 28px;">
          <!-- Logo aligné à gauche -->
          <img src="${image}" alt="Logo ${nom}" class="software-logo" style="float: left; margin-right: 12px; margin-bottom: 8px;">
          
          <!-- Titre aligné à gauche -->
          <div class="software-title" style="text-align: left; margin-bottom: 12px; clear: both;">${nom} ${version}</div>

          <div class="software-category" style="color:#6b7280; font-size:0.95rem; margin-bottom:14px; font-weight:600;">${categorieFormatee.toUpperCase()} • 2025</div>

          <p class="software-description" style="color:#334155; line-height:1.6; font-size:1.02rem; margin-bottom:18px;">
            ${description}
          </p>

          <div class="software-buttons" style="display:flex; flex-wrap:wrap; gap:10px;">
            ${isDisponible 
              ? '<a href="#" class="btn btn-primary download-btn" data-logiciel-id="' + logiciel.id + '" style="padding:10px 16px; border-radius:8px; text-decoration:none; display:inline-flex; align-items:center; gap:8px; font-weight:600; cursor:pointer; background:#d10000; color:white; box-shadow: 0 4px 12px rgba(209,0,0,0.15); font-size:0.95rem;"><i class="fas fa-download"></i> Télécharger</a>'
              : '<button class="btn btn-primary" disabled style="padding:10px 16px; border-radius:8px; display:inline-flex; align-items:center; gap:8px; font-weight:600; opacity: 0.6; cursor: not-allowed; background:#d10000; color:white; font-size:0.95rem;"><i class="fas fa-clock"></i> En cours de développement</button>'
            }
            <a href="logiciel-details.html" class="btn btn-secondary" style="padding:10px 16px; border-radius:8px; text-decoration:none; display:inline-flex; align-items:center; gap:8px; font-weight:600; cursor:pointer; background:white; color:#111827; border:1px solid #e6e9ee; font-size:0.95rem;"><i class="fas fa-info-circle"></i> Consulter les informations</a>
          </div>
        </div>
      </article>
    `;
}

function addDownloadListeners() {
     // Boutons de téléchargement pour les logiciels disponibles
     document.querySelectorAll('.download-btn').forEach(btn => {
         btn.addEventListener('click', async (e) => {
             e.preventDefault();
             const logicielId = btn.getAttribute('data-logiciel-id');
             
             // Détecter OH-Route par son nom affiché sur la carte
             const softwareCard = btn.closest('.software-card');
             const softwareName = softwareCard.querySelector('.software-title');
             if (softwareName && softwareName.textContent.toLowerCase().includes('oh-route')) {
                 // C'est OH-Route, télécharger directement
                 const downloadLink = document.createElement('a');
                 downloadLink.href = 'OH-Route v1.1.rar';
                 downloadLink.download = 'OH-Route v1.1.rar';
                 document.body.appendChild(downloadLink);
                 downloadLink.click();
                 document.body.removeChild(downloadLink);
                 return;
             }
             
             await handleDownload(logicielId, 'download');
         });
     });
     
     console.log('ℹ️ Boutons de téléchargement configurés pour les logiciels disponibles');
}

async function handleDownload(logicielId, type) {
    try {
        console.log(`📥 Téléchargement ${type} pour logiciel ${logicielId}...`);
        
        // Vérifier si c'est le logiciel TALREN (disponible en local)
        if (logicielId === 'demo1') {
            // Téléchargement direct du fichier local
            const downloadLink = document.createElement('a');
            downloadLink.href = 'OH-Route v1.1.rar';
            downloadLink.download = 'OH-Route v1.1.rar';
            document.body.appendChild(downloadLink);
            downloadLink.click();
            document.body.removeChild(downloadLink);
            return;
        }
        
        // Vérifier si c'est OH-Route (disponible en local)
        // Rechercher par nom dans la base de données pour trouver l'ID d'OH-Route
        if (logicielId && (logicielId === 'oh-route' || logicielId === 'demo2' || 
            logicielId.toString().toLowerCase().includes('oh-route') ||
            logicielId.toString().toLowerCase().includes('ohroute'))) {
            // Téléchargement direct du fichier local OH-Route
            const downloadLink = document.createElement('a');
            downloadLink.href = 'OH-Route v1.1.rar';
            downloadLink.download = 'OH-Route v1.1.rar';
            document.body.appendChild(downloadLink);
            downloadLink.click();
            document.body.removeChild(downloadLink);
            return;
        }
        
        // Solution alternative : chercher OH-Route par son nom dans la base de données
        try {
            const response = await fetch(`${API_BASE_URL}/api/logiciels`, {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' }
            });
            
            if (response.ok) {
                const result = await response.json();
                if (result.success && result.data) {
                    const ohRoute = result.data.find(logiciel => 
                        logiciel.nom && logiciel.nom.toLowerCase().includes('oh-route')
                    );
                    
                    if (ohRoute && ohRoute.id === logicielId) {
                        // C'est bien OH-Route, télécharger le fichier local
                        const downloadLink = document.createElement('a');
                        downloadLink.href = 'OH-Route v1.1.rar';
                        downloadLink.download = 'OH-Route v1.1.rar';
                        document.body.appendChild(downloadLink);
                        downloadLink.click();
                        document.body.removeChild(downloadLink);
                        return;
                    }
                }
            }
        } catch (apiError) {
            console.log('API non disponible, tentative de téléchargement local...');
        }
        
        // Vérifier si c'est OH-Route (disponible en local)
        // Rechercher par nom dans la base de données pour trouver l'ID d'OH-Route
        if (logicielId && (logicielId === 'oh-route' || logicielId === 'demo2' || 
            logicielId.toString().toLowerCase().includes('oh-route') ||
            logicielId.toString().toLowerCase().includes('ohroute'))) {
            // Téléchargement direct du fichier local OH-Route
            const downloadLink = document.createElement('a');
            downloadLink.href = 'OH-Route v1.1.rar';
            downloadLink.download = 'OH-Route v1.1.rar';
            document.body.appendChild(downloadLink);
            downloadLink.click();
            document.body.removeChild(downloadLink);
            return;
        }
        
        // Solution alternative : chercher OH-Route par son nom dans la base de données
        try {
            const response = await fetch(`${API_BASE_URL}/api/logiciels`, {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' }
            });
            
            if (response.ok) {
                const result = await response.json();
                if (result.success && result.data) {
                    const ohRoute = result.data.find(logiciel => 
                        logiciel.nom && logiciel.nom.toLowerCase().includes('oh-route')
                    );
                    
                    if (ohRoute && ohRoute.id === logicielId) {
                        // C'est bien OH-Route, télécharger le fichier local
                        const downloadLink = document.createElement('a');
                        downloadLink.href = 'OH-Route v1.1.rar';
                        downloadLink.download = 'OH-Route v1.1.rar';
                        document.body.appendChild(downloadLink);
                        downloadLink.click();
                        document.body.removeChild(downloadLink);
                        return;
                    }
                }
            }
        } catch (apiError) {
            console.log('API non disponible, tentative de téléchargement local...');
        }
        
        // Pour les autres logiciels, continuer avec l'API
        const response = await fetch(`${API_BASE_URL}/api/logiciels/${logicielId}/download`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error(`HTTP ${response.status}`);
        }

        const result = await response.json();
        
        if (result.success) {
            const url = type === 'trial' ? result.data.trialUrl : result.data.downloadUrl;
            const nom = result.data.nom;
            
            // Afficher une confirmation
            if (confirm(`Vous allez être redirigé vers ${nom} pour le téléchargement. Continuer ?`)) {
                window.open(url, '_blank');
            }
        } else {
            alert('Erreur lors du téléchargement: ' + result.message);
        }
    } catch (error) {
        console.error('❌ Erreur téléchargement:', error);
        alert('Erreur lors du téléchargement. Vérifiez votre connexion.');
    }
}

function displayNoLogiciels() {
    const container = document.getElementById('logiciels-grid') || document.getElementById('software-grid');
    if (container) {
        // Afficher 3 logiciels de démonstration
        const demoLogiciels = [
            {
                id: 'demo1', // ID utilisé pour le téléchargement direct
                nom: 'TALREN',
                description: 'Stabilité des ouvrages géotechniques, avec ou sans renforcements',
                categorie: 'GÉOTECHNIQUE',
                version: '2024',
                fonctionnalites: ['Analyse de stabilité', 'Calculs géotechniques', 'Modélisation 3D'],
                headerImage: 'images/image1.jpg'
            },
            {
                id: 'demo2',
                nom: 'OH-Route',
                description: 'Outil spécialisé pour les études hydrologiques et hydrauliques en génie routier',
                categorie: 'HYDROLOGIE',
                version: '1.0',
                fonctionnalites: ['Études hydrologiques', 'Calculs hydrauliques', 'Génie routier'],
                headerImage: 'images/drainageroute.png'
            },
            {
                id: 'demo3',
                nom: 'K-RÉA',
                description: 'Dimensionnement des écrans de soutènement',
                categorie: 'STRUCTURES',
                version: '2024.1',
                fonctionnalites: ['Murs de soutènement', 'Écrans de sécurité', 'Calculs de stabilité'],
                headerImage: 'images/image3.jpg'
            }
        ];
        
                 const logicielsHTML = demoLogiciels.map((logiciel, index) => createLogicielCard(logiciel, index, demoLogiciels.length)).join('');
        container.innerHTML = logicielsHTML;
        
        // Ajouter les event listeners pour les boutons
        addDownloadListeners();
    }
}

function displayError(message) {
    const container = document.getElementById('logiciels-grid');
    if (container) {
        container.innerHTML = `
            <div class="error-message" style="text-align: center; padding: 40px; color: #e74c3c;">
                <i class="fas fa-exclamation-triangle" style="font-size: 3rem; margin-bottom: 20px;"></i>
                <h3>Erreur de chargement</h3>
                <p>${message}</p>
                <button onclick="location.reload()" style="
                    background:rgb(199, 24, 24);
                    color: white;
                    border: none;
                    padding: 10px 20px;
                    border-radius: 5px;
                    cursor: pointer;
                    margin-top: 15px;
                ">🔄 Recharger</button>
            </div>
        `;
    }
}

// Initialisation
document.addEventListener('DOMContentLoaded', function() {
    console.log('📄 Page logiciels chargée');
    setTimeout(() => {
        loadLogicielsFromAPI();
    }, 1000);
});

console.log('✅ Script chargeur de logiciels chargé');