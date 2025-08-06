// Script pour forcer le chargement des formations MongoDB
console.log('🔧 Script de force MongoDB chargé');

// Fonction pour forcer le chargement
function forceMongoDBLoad() {
    console.log('🚀 Force chargement MongoDB...');
    
    // Vérifier si le script MongoDB est chargé
    if (typeof loadFormationsFromMongoDB === 'function') {
        console.log('✅ Fonction loadFormationsFromMongoDB trouvée');
        loadFormationsFromMongoDB();
    } else {
        console.log('❌ Fonction loadFormationsFromMongoDB non trouvée');
        
        // Attendre et réessayer
        setTimeout(() => {
            if (typeof loadFormationsFromMongoDB === 'function') {
                console.log('✅ Fonction trouvée après attente');
                loadFormationsFromMongoDB();
            } else {
                console.log('❌ Fonction toujours non trouvée');
            }
        }, 2000);
    }
}

// Fonction pour nettoyer le conteneur
function clearFormationsContainer() {
    const container = document.getElementById('formations-grid');
    if (container) {
        container.innerHTML = `
            <div class="loading-formations" style="text-align: center; padding: 40px;">
                <i class="fas fa-spinner fa-spin" style="font-size: 2rem; color: #3498db; margin-bottom: 20px;"></i>
                <p>Chargement des formations depuis MongoDB Atlas...</p>
            </div>
        `;
        console.log('🧹 Conteneur nettoyé');
    }
}

// Fonction pour tester l'API Render directement
async function testRenderAPI() {
    console.log('🌐 Test direct de l\'API Render...');
    
    try {
        const response = await fetch('https://sorbo-ingenierie-1.onrender.com/api/formations', {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        });
        
        if (response.ok) {
            const data = await response.json();
            console.log('✅ API Render fonctionne:', data);
            return true;
        } else {
            console.log('❌ API Render erreur:', response.status);
            return false;
        }
    } catch (error) {
        console.log('❌ Erreur API Render:', error.message);
        return false;
    }
}

// Exposer les fonctions globalement
window.forceMongoDBLoad = forceMongoDBLoad;
window.clearFormationsContainer = clearFormationsContainer;
window.testRenderAPI = testRenderAPI;

// Démarrer automatiquement après 2 secondes
setTimeout(() => {
    console.log('🔄 Démarrage automatique du force load...');
    forceMongoDBLoad();
}, 2000);

console.log('✅ Script de force MongoDB initialisé'); 