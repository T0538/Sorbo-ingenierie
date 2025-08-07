// Interface d'administration des actualités
console.log('📰 Démarrage de l\'admin des actualités...');
const API_BASE_URL = 'https://sorbo-api-production.up.railway.app'; // Production Railway
// const API_BASE_URL = 'http://localhost:5000'; // Développement local

// Gestion du formulaire d'ajout
document.getElementById('actualite-form').addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const actualiteData = {
        titre: formData.get('titre'),
        description: formData.get('description'),
        contenu: formData.get('contenu'),
        auteur: formData.get('auteur') || 'Équipe Sorbo Ingénierie',
        image: formData.get('image') || '',
        categorie: formData.get('categorie') || 'Actualité',
        tags: formData.get('tags') ? formData.get('tags').split(',').map(tag => tag.trim()) : []
    };

    try {
        console.log('📤 Envoi de la nouvelle actualité...');
        
        const response = await fetch(`${API_BASE_URL}/api/actualites`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(actualiteData)
        });

        const result = await response.json();
        
        if (result.success) {
            showStatus('✅ Actualité ajoutée avec succès !', 'success');
            e.target.reset();
            loadActualites(); // Recharger la liste
        } else {
            showStatus('❌ Erreur: ' + result.message, 'error');
        }
    } catch (error) {
        console.error('❌ Erreur lors de l\'ajout:', error);
        showStatus('❌ Erreur de connexion. Vérifiez que le serveur est démarré.', 'error');
    }
});

// Charger les actualités existantes
async function loadActualites() {
    try {
        console.log('📡 Chargement des actualités...');
        
        const response = await fetch(`${API_BASE_URL}/api/actualites`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        const result = await response.json();
        
        if (result.success) {
            displayActualites(result.data);
            console.log(`✅ ${result.data.length} actualités chargées`);
        } else {
            throw new Error(result.message);
        }
    } catch (error) {
        console.error('❌ Erreur lors du chargement:', error);
        document.getElementById('actualites-container').innerHTML = `
            <div class="status-error">
                <i class="fas fa-exclamation-triangle"></i>
                Erreur lors du chargement des actualités. Vérifiez que le serveur est démarré.
            </div>
        `;
    }
}

function displayActualites(actualites) {
    const container = document.getElementById('actualites-container');
    
    if (!actualites || actualites.length === 0) {
        container.innerHTML = `
            <div class="loading">
                <i class="fas fa-info-circle"></i>
                Aucune actualité trouvée. Ajoutez votre première actualité !
            </div>
        `;
        return;
    }

    const actualitesHTML = actualites.map(actualite => `
        <div class="actualite-item">
            <div class="actualite-header">
                <div class="actualite-title">${actualite.titre}</div>
                <div class="actualite-date">${formatDate(actualite.date)}</div>
            </div>
            <div class="actualite-description">${actualite.description}</div>
            <div class="actualite-tags">
                <span class="tag">${actualite.categorie}</span>
                ${actualite.tags ? actualite.tags.map(tag => `<span class="tag">${tag}</span>`).join('') : ''}
            </div>
        </div>
    `).join('');

    container.innerHTML = actualitesHTML;
}

function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
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
    console.log('📄 Page d\'administration chargée');
    loadActualites();
});

console.log('✅ Script d\'administration des actualités chargé'); 