// Interface d'administration des logiciels
console.log('💻 Démarrage de l\'admin des logiciels...');
const API_BASE_URL = 'https://sorbo-api-production.up.railway.app'; // Production Railway
// const API_BASE_URL = 'http://localhost:5000'; // Développement local

// Gestion du formulaire d'ajout
document.getElementById('logiciel-form').addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const logicielData = {
        nom: formData.get('nom'),
        description: formData.get('description'),
        categorie: formData.get('categorie') || 'CAO',
        version: formData.get('version') || '2024',
        prix: formData.get('prix') || 'Gratuit pour étudiants',
        image: formData.get('image') || '',
        downloadUrl: formData.get('downloadUrl') || '',
        trialUrl: formData.get('trialUrl') || '',
        fonctionnalites: formData.get('fonctionnalites') ? formData.get('fonctionnalites').split(',').map(f => f.trim()) : []
    };

    try {
        console.log('📤 Envoi du nouveau logiciel...');
        
        const response = await fetch(`${API_BASE_URL}/api/logiciels`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(logicielData)
        });

        const result = await response.json();
        
        if (result.success) {
            showStatus('✅ Logiciel ajouté avec succès !', 'success');
            e.target.reset();
            loadLogiciels(); // Recharger la liste
        } else {
            showStatus('❌ Erreur: ' + result.message, 'error');
        }
    } catch (error) {
        console.error('❌ Erreur lors de l\'ajout:', error);
        showStatus('❌ Erreur de connexion. Vérifiez que le serveur est démarré.', 'error');
    }
});

// Charger les logiciels existants
async function loadLogiciels() {
    try {
        console.log('📡 Chargement des logiciels...');
        
        const response = await fetch(`${API_BASE_URL}/api/logiciels`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        const result = await response.json();
        
        if (result.success) {
            displayLogiciels(result.data);
            console.log(`✅ ${result.data.length} logiciels chargés`);
        } else {
            throw new Error(result.message);
        }
    } catch (error) {
        console.error('❌ Erreur lors du chargement:', error);
        document.getElementById('logiciels-container').innerHTML = `
            <div class="status-error">
                <i class="fas fa-exclamation-triangle"></i>
                Erreur lors du chargement des logiciels. Vérifiez que le serveur est démarré.
            </div>
        `;
    }
}

function displayLogiciels(logiciels) {
    const container = document.getElementById('logiciels-container');
    
    if (!logiciels || logiciels.length === 0) {
        container.innerHTML = `
            <div class="loading">
                <i class="fas fa-info-circle"></i>
                Aucun logiciel trouvé. Ajoutez votre premier logiciel !
            </div>
        `;
        return;
    }

    const logicielsHTML = logiciels.map(logiciel => `
        <div class="logiciel-item">
            <div class="logiciel-header">
                <div class="logiciel-title">${logiciel.nom}</div>
                <div class="logiciel-categorie">${logiciel.categorie}</div>
            </div>
            <div class="logiciel-description">${logiciel.description}</div>
            <div class="logiciel-details">
                <span class="detail-tag">v${logiciel.version}</span>
                <span class="detail-tag">${logiciel.prix}</span>
                ${logiciel.fonctionnalites ? logiciel.fonctionnalites.map(f => `<span class="detail-tag">${f}</span>`).join('') : ''}
            </div>
        </div>
    `).join('');

    container.innerHTML = logicielsHTML;
}

function showStatus(message, type) {
    const statusDiv = document.getElementById('status-message');
    statusDiv.innerHTML = `
        <div class="status-message status-${type}">
            ${message}
        </div>
    `;
    
    // Masquer le message après 5 secondes
    setTimeout(() => {
        statusDiv.innerHTML = '';
    }, 5000);
}

// Initialisation
document.addEventListener('DOMContentLoaded', function() {
    console.log('📄 Page d\'administration des logiciels chargée');
    loadLogiciels();
});

console.log('✅ Script d\'administration des logiciels chargé'); 