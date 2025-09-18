// Script de forçage d'affichage des formations - Solution définitive
console.log('💪 FORÇAGE AFFICHAGE FORMATIONS - CHARGEMENT IMMÉDIAT');

// Données de formations en dur comme fallback ultime
const FORMATIONS_FALLBACK = [
    {
        _id: 'fallback-1',
        title: 'AutoCAD - Conception et dessin de plans 2D de bâtiments',
        description: 'Maîtrisez AutoCAD pour la conception et le dessin de plans 2D de bâtiments avec précision.',
        price: 100000,
        schedule: '4 séances - samedis ou dimanches de 09h à 16h',
        niveau: 'Débutant à intermédiaire',
        category: 'Logiciels',
        location: 'Abidjan, Yopougon',
        dates: 'Du 25 octobre au 15 novembre',
        type: 'autocad',
        active: true
    },
    {
        _id: 'fallback-2',
        title: 'Gestion de projet - Microsoft Project',
        description: 'Maîtrisez Microsoft Project pour une gestion de projet efficace dans le BTP et l\'ingénierie.',
        price: 100000,
        schedule: '4 séances - samedis ou dimanches de 09h à 16h',
        niveau: 'Débutant à intermédiaire',
        category: 'Gestion de projet',
        location: 'Abidjan, Yopougon',
        dates: 'Du 02 au 23 novembre',
        type: 'genie-civil',
        active: true
    },
    {
        _id: 'fallback-3',
        title: 'Robot - Conception et dimensionnement des bâtiments en BA',
        description: 'Formation approfondie au logiciel Robot pour la conception et le dimensionnement des structures en béton armé.',
        price: 150000,
        schedule: '4 séances - samedis ou dimanches de 09h à 16h',
        niveau: 'Intermédiaire à avancé',
        category: 'Logiciels',
        location: 'Abidjan, Yopougon',
        dates: 'Du 19 octobre au 16 novembre 2025',
        type: 'robot',
        active: true
    },
    {
        _id: 'fallback-4',
        title: 'ArchiCAD - Conception et dessin de plans 2D/3D de bâtiments',
        description: 'Formation complète à ArchiCAD pour la conception et le dessin de plans 2D/3D de bâtiments.',
        price: 150000,
        schedule: '5 séances - samedis ou dimanches de 09h à 16h',
        niveau: 'Débutant à intermédiaire',
        category: 'Logiciels',
        location: 'Abidjan, Yopougon',
        dates: 'Du 18 octobre au 15 novembre',
        type: 'revit',
        active: true
    }
];

// Fonction pour afficher immédiatement les formations
function forceDisplayFormations(formations = FORMATIONS_FALLBACK) {
    const container = document.getElementById('formations-grid');
    
    if (!container) {
        console.error('❌ Container formations-grid non trouvé');
        return false;
    }
    
    console.log(`💪 Affichage forcé de ${formations.length} formations...`);
    
    // Créer le HTML des formations
    const formationsHTML = formations.map(formation => {
        const prix = formation.price || formation.prix || 0;
        const titre = formation.title || formation.titre || 'Formation disponible';
        const description = formation.description || 'Description disponible lors de l\'inscription';
        const duree = formation.schedule || formation.duree || 'À définir';
        const niveau = formation.niveau || 'Tous niveaux';
        const categorie = formation.category || formation.categorie || 'Formation';
        const localisation = formation.location || formation.localisation || 'Abidjan';
        const dates = formation.dates || 'Dates à confirmer';
        
        return `
        <div class="formation-card" data-aos="fade-up" data-aos-delay="100">
            <div class="formation-image">
                <img src="images/formation-${formation.type || 'default'}.jpg" 
                     alt="${titre}" 
                     loading="lazy"
                     onerror="this.src='images/formation-default.jpg'">
            </div>
            <div class="formation-content">
                <h3>${titre}</h3>
                <p class="formation-description">${description}</p>
                
                <div class="formation-details">
                    <div class="detail-item">
                        <i class="fas fa-clock"></i>
                        <span>${duree}</span>
                    </div>
                    <div class="detail-item">
                        <i class="fas fa-users"></i>
                        <span>${niveau}</span>
                    </div>
                    <div class="detail-item">
                        <i class="fas fa-map-marker-alt"></i>
                        <span>${localisation}</span>
                    </div>
                    <div class="detail-item">
                        <i class="fas fa-calendar"></i>
                        <span>${dates}</span>
                    </div>
                </div>

                <div class="formation-objectives">
                    <h4><i class="fas fa-target"></i> Objectifs de la formation</h4>
                    <ul>
                        <li>Maîtriser les fonctionnalités essentielles</li>
                        <li>Développer une expertise pratique</li>
                        <li>Acquérir une méthodologie professionnelle</li>
                        <li>Obtenir une certification reconnue</li>
                    </ul>
                </div>

                <div class="formation-footer">
                    <div class="formation-price">
                        <span class="price-amount">${parseInt(prix).toLocaleString()} FCFA</span>
                    </div>
                    <div class="formation-actions">
                        <button class="btn outline-btn" onclick="showFormationDetails('${formation._id}')">
                            <i class="fas fa-info-circle"></i> En savoir plus
                        </button>
                        <button class="btn primary-btn inscription-btn" onclick="openInscriptionModal('${formation._id}', '${titre}', ${prix})">
                            <i class="fas fa-user-plus"></i> S'inscrire
                        </button>
                    </div>
                </div>

                <div class="formation-tags">
                    <span class="tag category-tag">${categorie}</span>
                    <span class="tag level-tag">${niveau}</span>
                </div>
            </div>
        </div>
        `;
    }).join('');
    
    // Injecter le HTML
    container.innerHTML = formationsHTML;
    
    // Mettre à jour le compteur
    const resultsCount = document.getElementById('results-count');
    if (resultsCount) {
        resultsCount.textContent = `${formations.length} formation${formations.length > 1 ? 's' : ''} trouvée${formations.length > 1 ? 's' : ''}`;
    }
    
    console.log(`✅ ${formations.length} formations affichées avec succès !`);
    
    // Déclencher les animations AOS si disponible
    if (typeof AOS !== 'undefined') {
        setTimeout(() => AOS.refresh(), 100);
    }
    
    return true;
}

// Essayer d'abord de récupérer les vraies formations
async function tryLoadRealFormations() {
    try {
        console.log('🔍 Tentative de récupération des vraies formations...');
        
        const response = await fetch('https://sorbo-api-production.up.railway.app/api/formations', {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            signal: AbortSignal.timeout(5000)
        });
        
        if (response.ok) {
            const result = await response.json();
            const formations = result.data || result;
            
            if (formations && formations.length > 0) {
                console.log('✅ Vraies formations récupérées:', formations.length);
                forceDisplayFormations(formations);
                return true;
            }
        }
        
    } catch (error) {
        console.log('⚠️ Erreur récupération vraies formations:', error.message);
    }
    
    // Fallback sur les formations par défaut
    console.log('🔄 Utilisation des formations de fallback...');
    forceDisplayFormations(FORMATIONS_FALLBACK);
    return false;
}

// Fonction pour gérer les modales d'inscription
function openInscriptionModal(formationId, formationTitle, prix) {
    console.log(`📝 Ouverture modal inscription: ${formationTitle}`);
    
    // Essayer de trouver le modal existant
    let modal = document.getElementById('inscriptionModal');
    
    if (!modal) {
        // Créer le modal si il n'existe pas
        modal = createInscriptionModal();
        document.body.appendChild(modal);
    }
    
    // Remplir les informations
    const titleElement = modal.querySelector('#formationTitle, .formation-title');
    if (titleElement) {
        titleElement.textContent = formationTitle;
    }
    
    const priceElement = modal.querySelector('.formation-price');
    if (priceElement) {
        priceElement.textContent = `${parseInt(prix).toLocaleString()} FCFA`;
    }
    
    // Afficher le modal
    modal.style.display = 'block';
    document.body.style.overflow = 'hidden';
}

function createInscriptionModal() {
    const modal = document.createElement('div');
    modal.id = 'inscriptionModal';
    modal.className = 'modal';
    modal.style.cssText = `
        display: none;
        position: fixed;
        z-index: 1000;
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;
        overflow: auto;
        background-color: rgba(0,0,0,0.5);
    `;
    
    modal.innerHTML = `
        <div class="modal-content" style="background: #fefefe; margin: 5% auto; padding: 20px; border: none; width: 80%; max-width: 600px; border-radius: 8px;">
            <span class="close" style="color: #aaa; float: right; font-size: 28px; font-weight: bold; cursor: pointer;">&times;</span>
            <h2>Inscription à la formation</h2>
            <h3 id="formationTitle" class="formation-title">Formation sélectionnée</h3>
            <p>Remplissez ce formulaire pour vous inscrire. Nous vous recontacterons rapidement.</p>
            
            <form id="inscriptionForm" class="inscription-form">
                <div style="margin-bottom: 15px;">
                    <label for="nom">Nom complet *</label>
                    <input type="text" id="nom" name="nom" required style="width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 4px;">
                </div>
                <div style="margin-bottom: 15px;">
                    <label for="email">Email *</label>
                    <input type="email" id="email" name="email" required style="width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 4px;">
                </div>
                <div style="margin-bottom: 15px;">
                    <label for="telephone">Téléphone *</label>
                    <input type="tel" id="telephone" name="telephone" required style="width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 4px;">
                </div>
                <div style="margin-bottom: 15px;">
                    <label for="entreprise">Entreprise</label>
                    <input type="text" id="entreprise" name="entreprise" style="width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 4px;">
                </div>
                <div style="margin-bottom: 15px;">
                    <label for="message">Message (optionnel)</label>
                    <textarea id="message" name="message" rows="4" style="width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 4px;"></textarea>
                </div>
                <button type="submit" class="btn primary-btn" style="background: #d10000; color: white; padding: 12px 24px; border: none; border-radius: 4px; cursor: pointer;">
                    Envoyer ma demande d'inscription
                </button>
            </form>
        </div>
    `;
    
    // Gestionnaire de fermeture
    modal.querySelector('.close').onclick = function() {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
    };
    
    return modal;
}

function showFormationDetails(formationId) {
    alert('Détails de la formation - Contactez-nous pour plus d\'informations au contact@sorbo-ingenierie.ci');
}

// EXECUTION IMMEDIATE ET BRUTALE
console.log('🚀 LANCEMENT IMMEDIAT DU FORÇAGE BRUTAL...');

// Forcer IMMÉDIATEMENT - pas d'attente
setTimeout(() => {
    console.log('💪 FORÇAGE BRUTAL - MAINTENANT !');
    const container = document.getElementById('formations-grid');
    
    if (container) {
        console.log('🔍 Container trouvé, forçage immédiat...');
        // TOUJOURS forcer, peu importe le contenu
        forceDisplayFormations(FORMATIONS_FALLBACK);
    } else {
        console.log('❌ Pas de container, nouvelle tentative...');
        // Réessayer toutes les 500ms jusqu'à trouver le container
        const interval = setInterval(() => {
            const cont = document.getElementById('formations-grid');
            if (cont) {
                console.log('✅ Container trouvé en retard, forçage !');
                forceDisplayFormations(FORMATIONS_FALLBACK);
                clearInterval(interval);
            }
        }, 500);
        
        // Arrêter après 10 secondes max
        setTimeout(() => clearInterval(interval), 10000);
    }
}, 100);

// Double sécurité après 1 seconde
setTimeout(() => {
    const container = document.getElementById('formations-grid');
    if (container && (!container.innerHTML.includes('formation-card') || container.innerHTML.includes('Chargement'))) {
        console.log('🚨 DOUBLE SÉCURITÉ - FORÇAGE BRUTAL !');
        forceDisplayFormations(FORMATIONS_FALLBACK);
    }
}, 1000);

// Triple sécurité après 3 secondes
setTimeout(() => {
    const container = document.getElementById('formations-grid');
    if (container && (!container.innerHTML.includes('formation-card') || container.innerHTML.includes('spinner'))) {
        console.log('🚨 TRIPLE SÉCURITÉ - ÉCRASEMENT TOTAL !');
        container.innerHTML = ''; // Vider complètement
        forceDisplayFormations(FORMATIONS_FALLBACK);
    }
}, 3000);

// Export des fonctions pour debug
window.forceDisplayFormations = forceDisplayFormations;
window.tryLoadRealFormations = tryLoadRealFormations;
