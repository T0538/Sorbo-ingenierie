// Moniteur de l'API Render
console.log('📡 Moniteur Render initialisé');

let renderCheckCount = 0;
const MAX_CHECKS = 10; // 10 vérifications maximum

// Fonction pour vérifier l'API Render
async function checkRenderAPI() {
    renderCheckCount++;
    console.log(`🔍 Vérification Render #${renderCheckCount}/${MAX_CHECKS}...`);
    
    try {
        const response = await fetch('https://sorbo-ingenierie-1.onrender.com/api/health', {
            method: 'GET',
            headers: {
                'Accept': 'application/json'
            },
            signal: AbortSignal.timeout(5000) // 5 secondes max
        });
        
        if (response.ok) {
            console.log('✅ API Render est prête !');
            console.log('🎉 Vous pouvez maintenant recharger la page pour voir les formations MongoDB');
            
            // Afficher une notification
            showRenderReadyNotification();
            
            return true;
        } else {
            console.log(`❌ API Render erreur: ${response.status}`);
            return false;
        }
    } catch (error) {
        console.log(`❌ API Render non disponible (tentative ${renderCheckCount}): ${error.message}`);
        return false;
    }
}

// Fonction pour afficher une notification
function showRenderReadyNotification() {
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: #27ae60;
        color: white;
        padding: 15px 20px;
        border-radius: 5px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        z-index: 10000;
        font-family: Arial, sans-serif;
        max-width: 300px;
    `;
    
    notification.innerHTML = `
        <div style="display: flex; align-items: center; gap: 10px;">
            <i class="fas fa-check-circle" style="font-size: 1.2rem;"></i>
            <div>
                <strong>🎉 API Render prête !</strong><br>
                <small>Rechargez la page pour voir les formations MongoDB</small>
            </div>
        </div>
        <button onclick="this.parentElement.remove()" style="
            position: absolute;
            top: 5px;
            right: 5px;
            background: none;
            border: none;
            color: white;
            cursor: pointer;
            font-size: 1.2rem;
        ">×</button>
    `;
    
    document.body.appendChild(notification);
    
    // Supprimer automatiquement après 10 secondes
    setTimeout(() => {
        if (notification.parentElement) {
            notification.remove();
        }
    }, 10000);
}

// Démarrer la surveillance
function startRenderMonitoring() {
    console.log('🚀 Démarrage de la surveillance Render...');
    
    const checkInterval = setInterval(async () => {
        const isReady = await checkRenderAPI();
        
        if (isReady || renderCheckCount >= MAX_CHECKS) {
            clearInterval(checkInterval);
            if (renderCheckCount >= MAX_CHECKS) {
                console.log('⏰ Surveillance terminée - API Render prend plus de temps que prévu');
            }
        }
    }, 30000); // Vérifier toutes les 30 secondes
}

// Exposer les fonctions globalement
window.checkRenderAPI = checkRenderAPI;
window.startRenderMonitoring = startRenderMonitoring;

// Démarrer automatiquement après 30 secondes
setTimeout(() => {
    startRenderMonitoring();
}, 30000);

console.log('✅ Moniteur Render configuré'); 