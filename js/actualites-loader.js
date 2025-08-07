// Chargeur d'actualités depuis MongoDB Atlas
console.log('📰 Démarrage du chargeur d\'actualités...');
const API_BASE_URL = 'https://sorbo-api-production.up.railway.app'; // Production Railway
// const API_BASE_URL = 'http://localhost:5000'; // Développement local

async function loadActualitesFromAPI() {
    try {
        console.log('📡 Connexion à l\'API actualités...');
        
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 10000);
        
        const response = await fetch(`${API_BASE_URL}/api/actualites`, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            signal: controller.signal
        });

        clearTimeout(timeoutId);

        if (!response.ok) {
            throw new Error(`Erreur HTTP: ${response.status}`);
        }

        const data = await response.json();
        console.log('✅ Données actualités reçues:', data);
        
        if (data.success && data.data && data.data.length > 0) {
            displayActualites(data.data);
        } else {
            displayNoActualites();
        }
        
    } catch (error) {
        console.error('❌ Erreur:', error);
        if (error.name === 'AbortError') {
            displayError('L\'API prend du temps à répondre. Veuillez patienter.');
        } else if (error.message.includes('Failed to fetch')) {
            displayError('L\'API n\'est pas disponible. Vérifiez que le serveur local est démarré.');
        } else {
            displayError(error.message);
        }
    }
}

function displayActualites(actualites) {
    const container = document.getElementById('actualites-container');
    if (!container) {
        console.error('❌ Conteneur actualités non trouvé');
        return;
    }

    container.innerHTML = '';
    
    actualites.forEach(actualite => {
        const actualiteCard = createActualiteCard(actualite);
        container.appendChild(actualiteCard);
    });

    console.log(`✅ ${actualites.length} actualités affichées`);
}

function createActualiteCard(actualite) {
    const card = document.createElement('div');
    card.className = 'actualite-card';
    
    // Formater la date
    const date = new Date(actualite.date);
    const formattedDate = date.toLocaleDateString('fr-FR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
    
    card.innerHTML = `
        <div class="actualite-image">
            <img src="${actualite.image}" alt="${actualite.titre}" onerror="this.src='images/default-news.jpg'">
        </div>
        <div class="actualite-content">
            <div class="actualite-meta">
                <span class="actualite-date">${formattedDate}</span>
                <span class="actualite-categorie">${actualite.categorie}</span>
                <span class="actualite-auteur">${actualite.auteur}</span>
            </div>
            <h3 class="actualite-titre">${actualite.titre}</h3>
            <p class="actualite-description">${actualite.description}</p>
            <div class="actualite-tags">
                ${actualite.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
            </div>
            <button class="actualite-lire-plus" onclick="showActualiteDetails(${actualite.id})">
                Lire la suite
            </button>
        </div>
    `;
    return card;
}

function showActualiteDetails(actualiteId) {
    // Fonction pour afficher les détails d'une actualité
    console.log(`📰 Affichage des détails de l'actualité ${actualiteId}`);
    // Ici vous pouvez implémenter une modal ou une nouvelle page
    alert(`Détails de l'actualité ${actualiteId} - Fonctionnalité à implémenter`);
}

function displayNoActualites() {
    const container = document.getElementById('actualites-container');
    if (container) {
        container.innerHTML = `
            <div class="no-actualites" style="text-align: center; padding: 40px;">
                <i class="fas fa-newspaper" style="font-size: 3rem; color: #666; margin-bottom: 20px;"></i>
                <h3>Aucune actualité disponible</h3>
                <p>Les actualités seront bientôt disponibles.</p>
            </div>
        `;
    }
}

function displayError(message) {
    const container = document.getElementById('actualites-container');
    if (container) {
        container.innerHTML = `
            <div class="error-message" style="text-align: center; padding: 40px; color: #e74c3c;">
                <i class="fas fa-exclamation-triangle" style="font-size: 3rem; margin-bottom: 20px;"></i>
                <h3>Erreur de chargement</h3>
                <p>${message}</p>
                <button onclick="loadActualitesFromAPI()" style="
                    background: #3498db;
                    color: white;
                    border: none;
                    padding: 10px 20px;
                    border-radius: 5px;
                    cursor: pointer;
                    margin-top: 15px;
                ">🔄 Réessayer</button>
            </div>
        `;
    }
}

// Initialisation
document.addEventListener('DOMContentLoaded', function() {
    console.log('📄 DOM chargé, lancement du chargeur d\'actualités...');
    setTimeout(() => {
        loadActualitesFromAPI();
    }, 1000);
});

console.log('✅ Script chargeur d\'actualités chargé'); 