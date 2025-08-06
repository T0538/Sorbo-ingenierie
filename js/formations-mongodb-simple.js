// Version simplifiée du chargeur de formations MongoDB Atlas
console.log('🚀 Démarrage du chargeur MongoDB simplifié...');

// URL de l'API - Production Render
const API_BASE_URL = 'https://sorbo-ingenierie-1.onrender.com'; // Production Render
// const API_BASE_URL = 'http://localhost:5000'; // Développement local

// Fonction principale avec timeout amélioré
async function loadFormationsFromMongoDB() {
    try {
        console.log('📡 Connexion à l\'API MongoDB...');
        
        // Créer un contrôleur d'abandon avec timeout de 15 secondes
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 15000);
        
        const response = await fetch(`${API_BASE_URL}/api/formations`, {
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
        console.log('✅ Données reçues:', data);
        
        if (data.success && data.data && data.data.length > 0) {
            console.log(`📊 ${data.data.length} formations trouvées`);
            displayFormations(data.data);
        } else {
            console.log('📭 Aucune formation trouvée');
            displayNoFormations();
        }
        
    } catch (error) {
        console.error('❌ Erreur:', error);
        
        if (error.name === 'AbortError') {
            displayError('L\'API prend du temps à démarrer. Veuillez patienter quelques minutes et recharger la page.');
        } else if (error.message.includes('Failed to fetch')) {
            displayError('L\'API n\'est pas encore disponible. L\'instance Render est en cours de démarrage.');
        } else {
            displayError(error.message);
        }
    }
}

// Afficher les formations
function displayFormations(formations) {
    console.log('🎨 Affichage des formations...');
    
    const container = document.getElementById('formations-grid');
    if (!container) {
        console.error('❌ Conteneur non trouvé');
        return;
    }
    
    // Vider le conteneur
    container.innerHTML = '';
    
    // Créer les cartes
    formations.forEach((formation, index) => {
        const card = createFormationCard(formation, index);
        container.appendChild(card);
    });
    
    // Mettre à jour le compteur
    updateResultsCount(formations.length);
    
    console.log('✅ Formations affichées avec succès');
}

// Créer une carte de formation
function createFormationCard(formation, index) {
    const card = document.createElement('div');
    card.className = 'formation-card';
    card.setAttribute('data-aos', 'fade-up');
    card.setAttribute('data-aos-delay', `${(index + 1) * 100}`);
    card.setAttribute('data-aos-duration', '800');
    
    const category = getCategoryFromType(formation.type);
    const price = formation.price.toLocaleString();
    
    card.innerHTML = `
        <div class="formation-header">
            <div class="formation-category">${category}</div>
            <div class="formation-price">${price} FCFA</div>
        </div>
        <h3>${formation.title}</h3>
        <div class="formation-details">
            <div class="detail"><i class="fas fa-calendar-alt"></i> Prochaine session à définir</div>
            <div class="detail"><i class="fas fa-clock"></i> ${formation.duration} jours</div>
            <div class="detail"><i class="fas fa-map-marker-alt"></i> Abidjan, Cocody</div>
            <div class="detail"><i class="fas fa-users"></i> Places disponibles</div>
        </div>
        <p>${formation.description}</p>
        <div class="formation-footer">
            <button class="btn primary-btn inscription-btn" onclick="handleInscription('${formation.title}', ${formation.price})">S'inscrire maintenant</button>
            <a href="#" class="more-info">En savoir plus</a>
        </div>
    `;
    
    return card;
}

// Obtenir la catégorie
function getCategoryFromType(type) {
    const typeMap = {
        'autocad': 'Logiciels',
        'covadis': 'Logiciels',
        'robot': 'Logiciels',
        'revit': 'Logiciels',
        'genie-civil': 'Génie civil',
        'hydraulique': 'Ingénierie de l\'eau'
    };
    
    return typeMap[type] || 'Formation';
}

// Mettre à jour le compteur
function updateResultsCount(count) {
    const resultsCount = document.getElementById('results-count');
    if (resultsCount) {
        resultsCount.textContent = `${count} formation${count > 1 ? 's' : ''} trouvée${count > 1 ? 's' : ''}`;
    }
}

// Afficher message d'erreur
function displayError(message) {
    const container = document.getElementById('formations-grid');
    if (container) {
        container.innerHTML = `
            <div class="error" style="text-align: center; padding: 40px; color: #e74c3c;">
                <i class="fas fa-exclamation-triangle" style="font-size: 2rem; margin-bottom: 20px;"></i>
                <h3>Erreur de chargement</h3>
                <p>Impossible de charger les formations depuis MongoDB Atlas.</p>
                <p style="font-size: 0.9rem; margin-top: 10px; color: #666;">
                    Erreur: ${message}
                </p>
                <button onclick="location.reload()" style="
                    background: #3498db;
                    color: white;
                    border: none;
                    padding: 10px 20px;
                    border-radius: 5px;
                    cursor: pointer;
                    margin-top: 15px;
                ">Réessayer</button>
            </div>
        `;
    }
}

// Afficher message "aucune formation"
function displayNoFormations() {
    const container = document.getElementById('formations-grid');
    if (container) {
        container.innerHTML = `
            <div class="no-formations" style="text-align: center; padding: 40px;">
                <i class="fas fa-info-circle" style="font-size: 3rem; color: #3498db; margin-bottom: 20px;"></i>
                <h3>Aucune formation disponible</h3>
                <p>Les formations seront bientôt disponibles.</p>
            </div>
        `;
    }
}

// Gérer l'inscription
function handleInscription(title, price) {
    const contactUrl = `contact.html?formation=${encodeURIComponent(title)}&prix=${price}`;
    window.location.href = contactUrl;
}

// Démarrer quand le DOM est chargé
document.addEventListener('DOMContentLoaded', function() {
    console.log('📄 DOM chargé, lancement du chargeur MongoDB...');
    
    // Attendre un peu pour laisser les autres scripts se charger
    setTimeout(() => {
        loadFormationsFromMongoDB();
    }, 1000);
});

console.log('✅ Script MongoDB simplifié chargé'); 