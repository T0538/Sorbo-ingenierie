// Version simplifiée du chargeur de formations MongoDB Atlas
console.log('🚀 Démarrage du chargeur MongoDB simplifié...');

// URL de l'API - Production Render
const API_BASE_URL = 'https://sorbo-api-production.up.railway.app'; // Production Railway
// const API_BASE_URL = 'http://localhost:5000'; // Développement local

const MAX_RETRIES = 3; // Nombre maximum de tentatives de connexion à l'API
let retryCount = 0; // Compteur de tentatives

// Fonction principale avec timeout amélioré et mécanisme de tentatives
async function loadFormationsFromMongoDB() {
    try {
        console.log(`📡 Connexion à l\'API MongoDB... (Tentative ${retryCount + 1}/${MAX_RETRIES})`);
        
        // Créer un contrôleur d'abandon avec timeout de 20 secondes
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 20000);
        
        const response = await fetch(`${API_BASE_URL}/api/formations`, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            signal: controller.signal,
            cache: 'no-store' // Désactiver le cache pour forcer une nouvelle requête
        });

        clearTimeout(timeoutId);

        if (!response.ok) {
            throw new Error(`Erreur HTTP: ${response.status}`);
        }

        const data = await response.json();
        console.log('✅ Données reçues:', data);
        
        // Réinitialiser le compteur de tentatives en cas de succès
        retryCount = 0;
        
        if (data.success && data.data && data.data.length > 0) {
            console.log(`📊 ${data.data.length} formations trouvées`);
            displayFormations(data.data);
        } else {
            console.log('📭 Aucune formation trouvée');
            displayNoFormations();
        }
        
    } catch (error) {
        console.error(`❌ Erreur (Tentative ${retryCount + 1}/${MAX_RETRIES}):`, error);
        
        if (error.name === 'AbortError') {
            if (retryCount < MAX_RETRIES - 1) {
                retryCount++;
                console.log(`🔄 Nouvelle tentative ${retryCount}/${MAX_RETRIES} dans 3 secondes...`);
                displayError(`L'API prend du temps à répondre. Nouvelle tentative ${retryCount}/${MAX_RETRIES}...`);
                setTimeout(loadFormationsFromMongoDB, 3000); // Réessayer après 3 secondes
            } else {
                console.log('⚠️ Nombre maximum de tentatives atteint, affichage du message de démarrage...');
                displayRenderStarting();
            }
        } else if (error.message.includes('Failed to fetch')) {
            if (retryCount < MAX_RETRIES - 1) {
                retryCount++;
                console.log(`🔄 Nouvelle tentative ${retryCount}/${MAX_RETRIES} dans 3 secondes...`);
                displayError(`Connexion à l'API impossible. Nouvelle tentative ${retryCount}/${MAX_RETRIES}...`);
                setTimeout(loadFormationsFromMongoDB, 3000); // Réessayer après 3 secondes
            } else {
                console.log('⚠️ Nombre maximum de tentatives atteint, affichage du message de démarrage...');
                displayRenderStarting();
            }
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

    // Sécuriser/normaliser les données venant de MongoDB
    const category = getCategoryFromType((formation.type || '').toString().toLowerCase());
    const priceRaw = formation.price ?? formation.prix ?? formation.cost ?? formation.cout ?? formation['coût'];
    const priceNum = typeof priceRaw === 'number' ? priceRaw : Number(String(priceRaw).replace(/[^0-9.-]/g, ''));
    const priceDisplay = Number.isFinite(priceNum) ? priceNum.toLocaleString() : (priceRaw ?? '—');

    const durationRaw = formation.duration ?? formation.duree ?? formation['durée'] ?? formation.hours ?? formation.heures;
    const durationDisplay = durationRaw != null ? durationRaw : '4 séances - samedis ou dimanches de 09h à 16h';

    const title = formation.title || formation.nom || 'Formation';
    const description = formation.description || '';

    card.innerHTML = `
        <div class="formation-header">
            <div class="formation-category">${category}</div>
            <div class="formation-price">${priceDisplay} FCFA</div>
        </div>
        <h3>${title}</h3>
        <div class="formation-details">
            <div class="detail"><i class="fas fa-calendar-alt"></i> Prochaine session à définir</div>
            <div class="detail"><i class="fas fa-clock"></i> ${durationDisplay} ${/jour|h/i.test(String(durationRaw)) ? '' : 'jours'}</div>
            <div class="detail"><i class="fas fa-map-marker-alt"></i> Abidjan, Cocody</div>
            <div class="detail"><i class="fas fa-users"></i> Places disponibles</div>
        </div>
        <p>${description}</p>
        <div class="formation-footer">
            <button class="btn primary-btn inscription-btn" onclick="handleInscription('${title.replace(/'/g, "\'")}', ${Number.isFinite(priceNum) ? priceNum : 0})">S'inscrire maintenant</button>
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

// Afficher message "Render en démarrage"
function displayRenderStarting() {
    const container = document.getElementById('formations-grid');
    if (container) {
        container.innerHTML = `
            <div class="render-starting" style="text-align: center; padding: 40px; color: #3498db;">
                <i class="fas fa-cloud" style="font-size: 3rem; margin-bottom: 20px;"></i>
                <h3>🚀 API Render en cours de démarrage</h3>
                <p>L'instance Render prend quelques minutes à démarrer.</p>
                <p style="font-size: 0.9rem; margin-top: 15px; color: #666;">
                    ⏰ Temps estimé: 2-3 minutes
                </p>
                <button onclick="location.reload()" style="
                    background: #3498db;
                    color: white;
                    border: none;
                    padding: 10px 20px;
                    border-radius: 5px;
                    cursor: pointer;
                    margin-top: 15px;
                ">🔄 Recharger dans 2 minutes</button>
                <p style="font-size: 0.8rem; margin-top: 10px; color: #999;">
                    En attendant, vous pouvez voir les formations statiques ci-dessous
                </p>
            </div>
        `;
    }
}

// Gérer l'inscription
function handleInscription(title, price) {
    const contactUrl = `contact.html?formation=${encodeURIComponent(title)}&prix=${price}&subject=formation`;
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