// Debug et correction rapide pour l'affichage des formations
console.log('🔧 Debug formations - chargement forcé...');

// Forcer le chargement après 3 secondes si pas encore fait
setTimeout(() => {
    const container = document.getElementById('formations-grid');
    
    if (container) {
        console.log('🔍 Container trouvé, contenu actuel:', container.innerHTML.substring(0, 100));
        
        // Toujours forcer l'affichage si on voit le spinner ou texte de chargement
        if (container.innerHTML.includes('Chargement') || 
            container.innerHTML.includes('loading') || 
            container.innerHTML.includes('spinner') ||
            container.innerHTML.includes('MongoDB Atlas')) {
            console.log('🚀 Forçage du chargement des formations...');
            
            // Chargement manuel des formations
            loadFormationsManual();
        }
    }
}, 2000);

// Deuxième tentative après 5 secondes
setTimeout(() => {
    const container = document.getElementById('formations-grid');
    
    if (container && !container.innerHTML.includes('formation-card')) {
        console.log('🔄 Deuxième tentative de chargement...');
        loadFormationsManual();
    }
}, 5000);

async function loadFormationsManual() {
    const container = document.getElementById('formations-grid');
    
    try {
        const response = await fetch('https://sorbo-api-production.up.railway.app/api/formations');
        const result = await response.json();
        const formations = result.data || result;
        
        console.log('✅ Formations récupérées manuellement:', formations);
        
        if (formations && formations.length > 0) {
            // Créer le HTML directement
            const formationsHTML = formations.map(formation => {
                return `
                <div class="formation-card">
                    <div class="formation-image">
                        <img src="images/formation-default.jpg" alt="${formation.title}" loading="lazy">
                    </div>
                    <div class="formation-content">
                        <h3>${formation.title}</h3>
                        <p class="formation-description">${formation.description}</p>
                        
                        <div class="formation-details">
                            <div class="detail-item">
                                <i class="fas fa-clock"></i>
                                <span>${formation.schedule || 'À définir'}</span>
                            </div>
                            <div class="detail-item">
                                <i class="fas fa-users"></i>
                                <span>${formation.niveau || 'Tous niveaux'}</span>
                            </div>
                            <div class="detail-item">
                                <i class="fas fa-map-marker-alt"></i>
                                <span>${formation.location || 'Abidjan'}</span>
                            </div>
                            <div class="detail-item">
                                <i class="fas fa-calendar"></i>
                                <span>${formation.dates || 'Dates à confirmer'}</span>
                            </div>
                        </div>

                        <div class="formation-footer">
                            <div class="formation-price">
                                <span class="price-amount">${formation.price ? `${parseInt(formation.price).toLocaleString()} FCFA` : 'Prix sur demande'}</span>
                            </div>
                            <div class="formation-actions">
                                <button class="btn outline-btn">
                                    <i class="fas fa-info-circle"></i> En savoir plus
                                </button>
                                <button class="btn primary-btn inscription-btn">
                                    <i class="fas fa-user-plus"></i> S'inscrire
                                </button>
                            </div>
                        </div>

                        <div class="formation-tags">
                            <span class="tag category-tag">${formation.category}</span>
                            <span class="tag level-tag">${formation.niveau}</span>
                        </div>
                    </div>
                </div>
                `;
            }).join('');
            
            container.innerHTML = formationsHTML;
            
            // Mettre à jour le compteur
            const resultsCount = document.getElementById('results-count');
            if (resultsCount) {
                resultsCount.textContent = `${formations.length} formation${formations.length > 1 ? 's' : ''} trouvée${formations.length > 1 ? 's' : ''}`;
            }
            
            console.log(`✅ ${formations.length} formations affichées manuellement`);
        }
        
    } catch (error) {
        console.error('❌ Erreur chargement manuel:', error);
        container.innerHTML = `
            <div style="text-align: center; padding: 40px;">
                <h3>Erreur de chargement</h3>
                <p>Impossible de charger les formations. Veuillez rafraîchir la page.</p>
                <button class="btn primary-btn" onclick="window.location.reload()">Actualiser</button>
            </div>
        `;
    }
}

// Export global pour debug
window.debugFormations = {
    loadFormationsManual,
    checkContainer: () => {
        const container = document.getElementById('formations-grid');
        console.log('Container:', container);
        console.log('Contenu:', container ? container.innerHTML : 'Non trouvé');
    }
};
