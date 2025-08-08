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

    const logicielsHTML = logiciels.map(logiciel => createLogicielCard(logiciel)).join('');
    container.innerHTML = logicielsHTML;
    
    // Ajouter les event listeners pour les boutons
    addDownloadListeners();
}

function createLogicielCard(logiciel) {
    const fonctionnalitesHTML = logiciel.fonctionnalites ? 
        logiciel.fonctionnalites.map(f => `<span class="tag">${f}</span>`).join('') : '';
    
    return `
        <div class="logiciel-card" data-logiciel-id="${logiciel.id}">
            <div class="logiciel-image">
                <img src="${logiciel.image || 'images/default-software.jpg'}" alt="${logiciel.nom}" loading="lazy">
            </div>
            <div class="logiciel-content">
                <h3 class="logiciel-title">${logiciel.nom}</h3>
                <p class="logiciel-description">${logiciel.description}</p>
                <div class="logiciel-details">
                    <span class="logiciel-categorie">${logiciel.categorie}</span>
                    <span class="logiciel-version">v${logiciel.version}</span>
                    <span class="logiciel-prix">${logiciel.prix}</span>
                </div>
                <div class="logiciel-fonctionnalites">
                    ${fonctionnalitesHTML}
                </div>
                <div class="logiciel-actions">
                    <button class="btn btn-primary download-btn" data-logiciel-id="${logiciel.id}">
                        📥 Télécharger
                    </button>
                    <button class="btn btn-secondary trial-btn" data-logiciel-id="${logiciel.id}">
                        🆓 Version d'essai
                    </button>
                </div>
            </div>
        </div>
    `;
}

function addDownloadListeners() {
    // Boutons de téléchargement
    document.querySelectorAll('.download-btn').forEach(btn => {
        btn.addEventListener('click', async (e) => {
            e.preventDefault();
            const logicielId = btn.getAttribute('data-logiciel-id');
            await handleDownload(logicielId, 'download');
        });
    });

    // Boutons d'essai
    document.querySelectorAll('.trial-btn').forEach(btn => {
        btn.addEventListener('click', async (e) => {
            e.preventDefault();
            const logicielId = btn.getAttribute('data-logiciel-id');
            await handleDownload(logicielId, 'trial');
        });
    });
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
    const container = document.getElementById('logiciels-grid');
    if (container) {
        container.innerHTML = `
            <div class="no-logiciels" style="text-align: center; padding: 40px; color: #666;">
                <i class="fas fa-desktop" style="font-size: 3rem; margin-bottom: 20px;"></i>
                <h3>Aucun logiciel disponible</h3>
                <p>Les logiciels seront bientôt disponibles.</p>
            </div>
        `;
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
                    background: #3498db;
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