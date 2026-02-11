// Chargeur de logiciels depuis MongoDB Atlas
console.log('💻 Démarrage du chargeur de logiciels...');

// Chargement de la configuration d'environnement
let API_BASE_URL;
if (typeof envConfig !== 'undefined') {
    API_BASE_URL = envConfig.apiUrl;
    console.log(`🌐 Configuration automatique: ${API_BASE_URL}`);
} else {
    // Fallback si la configuration n'est pas chargée
    API_BASE_URL = 'https://sorbo-api-production.up.railway.app';
    console.log(`⚠️ Configuration par défaut: ${API_BASE_URL}`);
}

const MAX_RETRIES = 3; // Nombre maximum de tentatives de connexion à l'API
let retryCount = 0; // Compteur de tentatives

async function loadLogicielsFromAPI() {
    try {
        console.log(`📡 Récupération des logiciels depuis l\'API... (Tentative ${retryCount + 1}/${MAX_RETRIES})`);
        
        // Utiliser le proxy CORS si disponible
        let response;
        if (typeof corsProxy !== 'undefined') {
            const result = await corsProxy.getLogiciels();
            if (result.success) {
                response = { ok: true, json: () => Promise.resolve(result.data) };
            } else {
                throw new Error(result.error);
            }
        } else {
            response = await fetch(`${API_BASE_URL}/api/logiciels`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            },
            signal: AbortSignal.timeout(15000), // 15 secondes
            cache: 'no-store' // Désactiver le cache pour forcer une nouvelle requête
        });
        }

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
     
     // Utilisation des images de la base de données ou fallback sur les défauts
     let image = logiciel.logo || logiciel.image || 'images/image1.png';
     let headerImage = logiciel.headerImage || 'images/drainageroute.png';
     
     // Correction forcée côté client pour Str-Chaussée (au cas où la DB n'est pas à jour)
     if (nom.toLowerCase().includes('str-chaussée') || nom.toLowerCase().includes('str chaussée')) {
         image = 'images/geopavetotal.jpg.jpeg';
         headerImage = 'images/Image autoroute.png';
         // On force aussi la catégorie si besoin
         // categorie = 'Infrastructures et Transports'; 
     }

     // Formater la catégorie (première lettre de chaque mot en majuscule, sauf les mots de liaison)
     const motsLiaison = ['et', 'de', 'du', 'des', 'le', 'la', 'les', 'en', 'à', 'au', 'aux'];
     let categorieFormatee = categorie.split(' ').map((word, index) => {
        const motMinuscule = word.toLowerCase();
        // Garder les mots de liaison en minuscules, sauf s'ils sont en première position
        if (index > 0 && motsLiaison.includes(motMinuscule)) {
            return motMinuscule;
        }
        return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
    }).join(' ');
    
    // Correction forcée catégorie pour Str-Chaussée
    if (nom.toLowerCase().includes('str-chaussée') || nom.toLowerCase().includes('str chaussée')) {
        categorieFormatee = 'Infrastructures et Transports';
    }
     
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
      <article class="software-card" aria-label="${nom}" data-logiciel-id="${logiciel.id}" style="background: #ffffff; border-radius: 12px; box-shadow: 0 6px 25px rgba(20,20,40,0.08); overflow: hidden; display: grid; grid-template-columns: 1fr; max-width: 400px; margin: 0 0 20px 0; width: 100%;">
        <!-- Illustration / media -->
        <div class="software-media" style="background: transparent; padding: 0; overflow: hidden; position: relative; z-index: 1;">
          <img src="${headerImage}" alt="Illustration ${nom}" style="width:100%; height:200px; object-fit:cover; display:block;">
        </div>

        <!-- Contenu -->
        <div class="software-content" style="padding: 20px 24px; text-align: left; position: relative; z-index: 2;">
          <!-- Logo + Nom alignés horizontalement à gauche (sans cadre, sans ombre) -->
          <header class="software-header" style="display:flex; align-items:center; justify-content:flex-start; gap:8px; margin: 6px 0 10px 0; padding: 0; background: transparent; box-shadow: none; border: none;">
            <img src="${image}" alt="Logo ${nom}" class="software-logo" style="width: 36px; height: 36px; object-fit: contain; border-radius: 6px;">
            <div class="software-title" style="font-size: 1.25rem; font-weight: 700; color: #1f2937;"><strong>${nom}</strong></div>
          </header>

          <div class="software-category" style="color:#6b7280; font-size:0.85rem; margin-bottom:12px; font-weight:500;">${categorieFormatee}</div>

          <p class="software-description" style="color:#374155; line-height:1.5; font-size:0.95rem; margin-bottom:16px;">
            ${description}
          </p>

          <div class="software-buttons" style="display:flex; flex-direction:column; gap:8px; position: relative; z-index: 3;">
            ${isDisponible 
              ? '<a href="#" class="btn btn-primary download-btn" data-logiciel-id="' + logiciel.id + '" style="padding:8px 14px; border-radius:6px; text-decoration:none; display:inline-flex; align-items:center; justify-content:center; gap:6px; font-weight:600; cursor:pointer; background:#d10000; color:white; box-shadow: 0 3px 10px rgba(209,0,0,0.15); font-size:0.9rem; pointer-events:auto; text-align:center;"><i class="fas fa-download"></i> Télécharger</a>'
              : '<button class="btn btn-primary" disabled style="padding:8px 14px; border-radius:6px; display:inline-flex; align-items:center; justify-content:center; gap:6px; font-weight:600; opacity: 0.6; cursor: not-allowed; background:#d10000; color:white; font-size:0.9rem; pointer-events:auto; text-align:center;"><i class="fas fa-clock"></i> En cours de développement</button>'
            }
            <a href="logiciel-details.html" class="btn btn-secondary info-btn" data-nom="${nom}" data-is-disponible="${isDisponible}" style="padding:8px 14px; border-radius:6px; text-decoration:none; display:inline-flex; align-items:center; justify-content:center; gap:6px; font-weight:600; cursor:pointer; background:white; color:#374155; border:1px solid #d1d5db; font-size:0.9rem; pointer-events:auto; text-align:center;"><i class="fas fa-info-circle"></i> Infos</a>
          </div>
        </div>
      </article>
    `;
}

function showComingSoonModal(softwareName) {
    // Créer l'overlay
    const overlay = document.createElement('div');
    overlay.style.position = 'fixed';
    overlay.style.top = '0';
    overlay.style.left = '0';
    overlay.style.width = '100%';
    overlay.style.height = '100%';
    overlay.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
    overlay.style.zIndex = '9999';
    overlay.style.display = 'flex';
    overlay.style.alignItems = 'center';
    overlay.style.justifyContent = 'center';
    overlay.style.backdropFilter = 'blur(5px)';
    overlay.style.opacity = '0';
    overlay.style.transition = 'opacity 0.3s ease';

    // Créer la modale
    const modal = document.createElement('div');
    modal.style.backgroundColor = 'white';
    modal.style.borderRadius = '16px';
    modal.style.padding = '30px';
    modal.style.maxWidth = '400px';
    modal.style.width = '90%';
    modal.style.textAlign = 'center';
    modal.style.boxShadow = '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)';
    modal.style.transform = 'scale(0.9)';
    modal.style.transition = 'transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)';

    modal.innerHTML = `
        <div style="margin-bottom: 20px;">
            <div style="width: 60px; height: 60px; background-color: rgba(209, 0, 0, 0.1); border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto;">
                <i class="fas fa-rocket" style="font-size: 24px; color: #D10000;"></i>
            </div>
        </div>
        <h3 style="color: #1f2937; font-size: 1.5rem; font-weight: 700; margin-bottom: 10px;">Bientôt disponible !</h3>
        <p style="color: #4b5563; font-size: 1rem; line-height: 1.5; margin-bottom: 25px;">
            Les informations détaillées sur <strong>${softwareName}</strong> seront bientôt mises en ligne. Notre équipe finalise actuellement la documentation.
        </p>
        <button id="closeModalBtn" style="background-color: #D10000; color: white; border: none; padding: 12px 24px; border-radius: 8px; font-weight: 600; cursor: pointer; transition: background-color 0.2s;">
            Compris
        </button>
    `;

    overlay.appendChild(modal);
    document.body.appendChild(overlay);

    // Animation d'entrée
    requestAnimationFrame(() => {
        overlay.style.opacity = '1';
        modal.style.transform = 'scale(1)';
    });

    // Gestion de la fermeture
    const closeBtn = modal.querySelector('#closeModalBtn');
    
    const closeModal = () => {
        overlay.style.opacity = '0';
        modal.style.transform = 'scale(0.9)';
        setTimeout(() => {
            document.body.removeChild(overlay);
        }, 300);
    };

    closeBtn.addEventListener('click', closeModal);
    overlay.addEventListener('click', (e) => {
        if (e.target === overlay) closeModal();
    });
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
                 downloadLink.href = 'downloads/OH-Route v1.1.rar';
                 downloadLink.download = 'OH-Route v1.1.rar';
                 document.body.appendChild(downloadLink);
                 downloadLink.click();
                 document.body.removeChild(downloadLink);
                 return;
             }
             
             await handleDownload(logicielId, 'download');
         });
     });

     // NOUVEAU : Gestion des boutons "Infos"
     document.querySelectorAll('.info-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const isDisponible = btn.getAttribute('data-is-disponible') === 'true';
            const nomLogiciel = btn.getAttribute('data-nom');

            // Si le logiciel n'est PAS disponible (en cours de dév), on affiche la modale
            if (!isDisponible) {
                e.preventDefault(); // Empêcher la navigation vers la page infos
                showComingSoonModal(nomLogiciel);
            }
            // Sinon, on laisse le lien fonctionner normalement vers la page infos
        });
     });
     
     console.log('ℹ️ Boutons de téléchargement et infos configurés');
}

async function handleDownload(logicielId, type) {
    try {
        console.log(`📥 Téléchargement ${type} pour logiciel ${logicielId}...`);
        
        // Vérifier si c'est le logiciel TALREN (disponible en local)
        if (logicielId === 'demo1') {
            // Téléchargement direct du fichier local
            const downloadLink = document.createElement('a');
            downloadLink.href = 'downloads/OH-Route v1.1.rar';
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
            downloadLink.href = 'downloads/OH-Route v1.1.rar';
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
                        downloadLink.href = 'downloads/OH-Route v1.1.rar';
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
            downloadLink.href = 'downloads/OH-Route v1.1.rar';
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
                        downloadLink.href = 'downloads/OH-Route v1.1.rar';
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