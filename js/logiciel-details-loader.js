// Chargeur de détails de logiciel depuis MongoDB Atlas
console.log('💻 Démarrage du chargeur de détails de logiciel...');

const API_BASE_URL = 'https://sorbo-api-production.up.railway.app';

// Récupérer l'ID du logiciel depuis l'URL
function getLogicielIdFromURL() {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('id');
}

// Charger les détails du logiciel depuis l'API
async function loadLogicielDetails(logicielId) {
    try {
        console.log(`📡 Récupération des détails du logiciel ${logicielId}...`);
        
        const response = await fetch(`${API_BASE_URL}/api/logiciels/${logicielId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        const result = await response.json();
        
        if (result.success) {
            console.log('✅ Détails du logiciel récupérés:', result.data);
            displayLogicielDetails(result.data);
        } else {
            throw new Error(result.message || 'Erreur lors de la récupération');
        }
    } catch (error) {
        console.error('❌ Erreur lors du chargement des détails:', error);
        displayError('Erreur lors du chargement des détails du logiciel. Vérifiez que le serveur est démarré.');
    }
}

// Afficher les détails du logiciel
function displayLogicielDetails(logiciel) {
    const container = document.getElementById('logiciel-details-container');
    if (!container) {
        console.error('❌ Container logiciel-details-container non trouvé');
        return;
    }

    const nom = logiciel.nom || 'Logiciel';
    const description = logiciel.description || 'Aucune description disponible';
    const categorie = logiciel.categorie || 'Non spécifiée';
    const version = logiciel.version ? `v${logiciel.version}` : 'Non spécifiée';
    const prix = logiciel.prix || 'Gratuit';
    const image = logiciel.image || 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=1200&q=60';
    const fonctionnalites = Array.isArray(logiciel.fonctionnalites) ? logiciel.fonctionnalites : [];
    const systeme = logiciel.systeme || 'Windows, macOS, Linux';
    const taille = logiciel.taille || 'À définir';
    const langue = logiciel.langue || 'Français, Anglais';

    // Choix couleur d'icône selon catégorie
    const iconColorClass = categorie.toLowerCase().includes('géo') || categorie.toLowerCase().includes('hydro')
        ? 'green'
        : categorie.toLowerCase().includes('bim') || categorie.toLowerCase().includes('cao')
            ? 'blue'
            : '';

    container.innerHTML = `
        <div class="logiciel-details-card">
            <div class="logiciel-header" style="background-image: linear-gradient(rgba(209,0,0,0.8), rgba(179,0,0,0.8)), url('${image}');">
                <div class="logiciel-header-content">
                    <div class="logiciel-badge">${prix}</div>
                    <h2>${nom}</h2>
                    <p class="logiciel-subtitle">${categorie} • ${version}</p>
                </div>
            </div>
            
            <div class="logiciel-body">
                <div class="logiciel-section">
                    <h3 class="section-title">
                        <i class="fas fa-info-circle"></i>
                        Description
                    </h3>
                    <div class="logiciel-description">
                        ${description}
                    </div>
                </div>
                
                <div class="logiciel-section">
                    <h3 class="section-title">
                        <i class="fas fa-list-ul"></i>
                        Fonctionnalités principales
                    </h3>
                    <div class="logiciel-features">
                        ${fonctionnalites.length > 0 ? 
                            fonctionnalites.map(feature => `
                                <div class="feature-item">
                                    <h4><i class="fas fa-check"></i> ${feature}</h4>
                                    <p>Fonctionnalité avancée pour améliorer votre productivité.</p>
                                </div>
                            `).join('') :
                            `<div class="feature-item">
                                <h4><i class="fas fa-cog"></i> Fonctionnalités avancées</h4>
                                <p>Ce logiciel offre de nombreuses fonctionnalités professionnelles pour répondre à vos besoins.</p>
                            </div>
                            <div class="feature-item">
                                <h4><i class="fas fa-tools"></i> Interface intuitive</h4>
                                <p>Une interface utilisateur moderne et intuitive pour une prise en main rapide.</p>
                            </div>
                            <div class="feature-item">
                                <h4><i class="fas fa-rocket"></i> Performance optimisée</h4>
                                <p>Des performances optimisées pour traiter vos projets rapidement et efficacement.</p>
                            </div>`
                        }
                    </div>
                </div>
                
                <div class="logiciel-section">
                    <h3 class="section-title">
                        <i class="fas fa-cogs"></i>
                        Spécifications techniques
                    </h3>
                    <div class="logiciel-meta">
                        <div class="meta-item">
                            <div class="meta-icon">
                                <i class="fas fa-desktop"></i>
                            </div>
                            <div class="meta-label">Système d'exploitation</div>
                            <div class="meta-value">${systeme}</div>
                        </div>
                        
                        <div class="meta-item">
                            <div class="meta-icon">
                                <i class="fas fa-hdd"></i>
                            </div>
                            <div class="meta-label">Taille d'installation</div>
                            <div class="meta-value">${taille}</div>
                        </div>
                        
                        <div class="meta-item">
                            <div class="meta-icon">
                                <i class="fas fa-language"></i>
                            </div>
                            <div class="meta-label">Langues supportées</div>
                            <div class="meta-value">${langue}</div>
                        </div>
                        
                        <div class="meta-item">
                            <div class="meta-icon">
                                <i class="fas fa-code-branch"></i>
                            </div>
                            <div class="meta-label">Version</div>
                            <div class="meta-value">${version}</div>
                        </div>
                    </div>
                </div>
                
                <div class="logiciel-actions">
                    <h3>Prêt à utiliser ce logiciel ?</h3>
                    <p>Découvrez toutes les fonctionnalités et commencez à l'utiliser dès aujourd'hui</p>
                    <div class="action-buttons">
                        <a href="#" class="btn-action" onclick="handleDownload('${logiciel.id || logiciel._id}', 'download')">
                            <i class="fas fa-download"></i>
                            Télécharger maintenant
                        </a>
                        <a href="#" class="btn-action secondary" onclick="handleDownload('${logiciel.id || logiciel._id}', 'trial')">
                            <i class="fas fa-play"></i>
                            Version d'essai
                        </a>
                    </div>
                </div>
            </div>
        </div>
        
        <div class="back-to-logiciels">
            <a href="nos-logiciels.html" class="back-btn">
                <i class="fas fa-arrow-left"></i>
                Retour à la liste des logiciels
            </a>
        </div>
    `;
}

// Gérer le téléchargement
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

// Afficher une erreur
function displayError(message) {
    const container = document.getElementById('logiciel-details-container');
    if (container) {
        container.innerHTML = `
            <div class="error">
                <i class="fas fa-exclamation-triangle"></i>
                <h3>Erreur de chargement</h3>
                <p>${message}</p>
                <button onclick="location.reload()" style="
                    background: #d10000;
                    color: white;
                    border: none;
                    padding: 15px 30px;
                    border-radius: 25px;
                    cursor: pointer;
                    margin-top: 20px;
                    font-size: 1rem;
                    font-weight: 600;
                ">
                    <i class="fas fa-redo"></i> Recharger la page
                </button>
            </div>
        `;
    }
}

// Initialisation
document.addEventListener('DOMContentLoaded', function() {
    console.log('📄 Page détails logiciel chargée');
    
    const logicielId = getLogicielIdFromURL();
    if (!logicielId) {
        displayError('Aucun ID de logiciel spécifié dans l\'URL.');
        return;
    }
    
    console.log('🔍 ID du logiciel:', logicielId);
    
    // Charger les détails du logiciel
    loadLogicielDetails(logicielId);
});

console.log('✅ Script chargeur de détails de logiciel chargé');
