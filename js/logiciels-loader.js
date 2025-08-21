// Chargeur de logiciels depuis MongoDB Atlas
console.log('💻 Démarrage du chargeur de logiciels...');
const API_BASE_URL = 'https://sorbo-api-production.up.railway.app'; // Production Railway
// const API_BASE_URL = 'http://localhost:5000'; // Développement local

async function loadLogicielsFromAPI() {
    try {
        console.log('📡 Récupération des logiciels depuis l\'API...');
        const response = await fetch(`${API_BASE_URL}/api/logiciels`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            },
            signal: AbortSignal.timeout(10000) // 10 secondes
        });

        if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        const result = await response.json();
        
        if (result.success) {
            console.log(`✅ ${result.data.length} logiciels récupérés`);
            displayLogiciels(result.data);
        } else {
            throw new Error(result.message || 'Erreur lors de la récupération');
        }
    } catch (error) {
        console.error('❌ Erreur lors du chargement des logiciels:', error);
        if (error.name === 'AbortError' || error.message.includes('Failed to fetch')) {
            displayError('⏰ API en cours de démarrage... Rechargez la page dans quelques secondes.');
        } else {
            displayError('Erreur lors du chargement des logiciels. Vérifiez que le serveur est démarré.');
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
     
     // Formater la catégorie (première lettre de chaque mot en majuscule)
     const categorieFormatee = categorie.split(' ').map(word => 
         word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
     ).join(' ');
     
     // Déterminer si c'est Drainage Pro ou Pillar (en cours de développement)
     const isEnDeveloppement = nom.toLowerCase().includes('drainage') || nom.toLowerCase().includes('pillar');

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
      <div class="software-card modern-card" data-logiciel-id="${logiciel.id}">
        <div class="software-header-image">
          <img src="${headerImage}" alt="Image d'en-tête ${nom}" class="header-image" loading="lazy" />
        </div>
        <div class="software-header">
          <div class="software-icon-section">
            <img src="${image}" alt="Icône ${nom}" class="software-icon-image" loading="lazy" />
            <h4 class="software-name">${nom}</h4>
          </div>
        </div>

                         <div class="software-content">
            <div class="software-category">${categorieFormatee} • 2025</div>
            <p>${description}</p>
           <div class="features-list">
             ${featuresHTML}
           </div>
           <div class="software-buttons">
             ${isEnDeveloppement 
               ? '<button class="software-btn primary-btn" disabled style="opacity: 0.6; cursor: not-allowed;">🔄 En cours de développement</button>'
               : '<a href="#" class="software-btn primary-btn download-btn" data-logiciel-id="' + logiciel.id + '">📥 Télécharger</a>'
             }
                          <a href="logiciel-details.html" class="software-btn secondary-btn info-btn" target="_blank">
                <i class="fas fa-info-circle"></i> Consulter les informations
              </a>
           </div>
         </div>
      </div>
    `;
}

function addDownloadListeners() {
     // Boutons de téléchargement pour les logiciels disponibles
     document.querySelectorAll('.download-btn').forEach(btn => {
         btn.addEventListener('click', async (e) => {
             e.preventDefault();
             const logicielId = btn.getAttribute('data-logiciel-id');
             await handleDownload(logicielId, 'download');
         });
     });
     
     console.log('ℹ️ Boutons de téléchargement configurés pour les logiciels disponibles');
}

async function handleDownload(logicielId, type) {
    try {
        console.log(`📥 Téléchargement ${type} pour logiciel ${logicielId}...`);
        
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
                id: 'demo1',
                nom: 'TALREN',
                description: 'Stabilité des ouvrages géotechniques, avec ou sans renforcements',
                categorie: 'GÉOTECHNIQUE',
                version: '2024',
                fonctionnalites: ['Analyse de stabilité', 'Calculs géotechniques', 'Modélisation 3D'],
                headerImage: 'images/talren-header.jpg'
            },
            {
                id: 'demo2',
                nom: 'FOXTA',
                description: 'Dimensionnement des fondations superficielles et profondes',
                categorie: 'FONDATIONS',
                version: '3.2',
                fonctionnalites: ['Fondations superficielles', 'Pieux et micropieux', 'Calculs de portance'],
                headerImage: 'images/foxta-header.jpg'
            },
            {
                id: 'demo3',
                nom: 'K-RÉA',
                description: 'Dimensionnement des écrans de soutènement',
                categorie: 'STRUCTURES',
                version: '2024.1',
                fonctionnalites: ['Murs de soutènement', 'Écrans de sécurité', 'Calculs de stabilité'],
                headerImage: 'images/krea-header.jpg'
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