// Script de débogage pour diagnostiquer le problème de chargement des formations
console.log('🔍 Script de débogage des formations MongoDB Atlas');

// Vérifier si le conteneur existe
document.addEventListener('DOMContentLoaded', function() {
    console.log('📄 DOM chargé, début du débogage...');
    
    const formationsGrid = document.getElementById('formations-grid');
    console.log('🎯 Conteneur formations-grid trouvé:', formationsGrid);
    
    if (formationsGrid) {
        console.log('📋 Contenu actuel du conteneur:', formationsGrid.innerHTML);
    }
    
    // Vérifier les scripts chargés
    console.log('📜 Scripts chargés:');
    const scripts = document.querySelectorAll('script[src]');
    scripts.forEach((script, index) => {
        console.log(`${index + 1}. ${script.src}`);
    });
    
    // Tester l'API directement
    console.log('🌐 Test de l\'API MongoDB...');
    fetch('http://localhost:5000/api/formations')
        .then(response => {
            console.log('📡 Réponse API:', response.status, response.statusText);
            return response.json();
        })
        .then(data => {
            console.log('📊 Données API:', data);
            console.log('📈 Nombre de formations:', data.data ? data.data.length : 'N/A');
        })
        .catch(error => {
            console.error('❌ Erreur API:', error);
        });
    
    // Vérifier les variables globales
    console.log('🌍 Variables globales:');
    console.log('window.formationsMongoDBLoader:', window.formationsMongoDBLoader);
    console.log('window.formationsIntegration:', window.formationsIntegration);
    
    // Attendre un peu puis vérifier à nouveau
    setTimeout(() => {
        console.log('⏰ Vérification après 3 secondes...');
        if (formationsGrid) {
            console.log('📋 Contenu du conteneur après 3s:', formationsGrid.innerHTML);
        }
        
        // Vérifier si des formations ont été ajoutées
        const formationCards = document.querySelectorAll('.formation-card');
        console.log('🎴 Cartes de formations trouvées:', formationCards.length);
        
        formationCards.forEach((card, index) => {
            console.log(`Carte ${index + 1}:`, card.textContent.substring(0, 100) + '...');
        });
    }, 3000);
});

// Fonction pour forcer le chargement des formations
window.forceLoadFormations = function() {
    console.log('🚀 Forçage du chargement des formations...');
    
    if (window.formationsMongoDBLoader) {
        console.log('✅ Chargeur MongoDB trouvé, réinitialisation...');
        window.formationsMongoDBLoader.init();
    } else {
        console.log('❌ Chargeur MongoDB non trouvé');
    }
};

// Fonction pour nettoyer le conteneur
window.clearFormationsContainer = function() {
    console.log('🧹 Nettoyage du conteneur...');
    const formationsGrid = document.getElementById('formations-grid');
    if (formationsGrid) {
        formationsGrid.innerHTML = '<div class="debug-info">Conteneur nettoyé</div>';
    }
};

console.log('🔧 Fonctions de débogage disponibles:');
console.log('- forceLoadFormations() : Forcer le chargement');
console.log('- clearFormationsContainer() : Nettoyer le conteneur'); 