/**
 * Script de débogage pour les actualités
 */

// Script de debug pour vérifier le bon fonctionnement
console.log('🔍 DEBUG: Script de debug actualités chargé');

document.addEventListener('DOMContentLoaded', function() {
  console.log('🔍 DEBUG: DOM chargé');
  
  // Vérifier si on est sur la page d'accueil
  const homepageContainer = document.getElementById('latest-actualites');
  if (homepageContainer) {
    console.log('🏠 DEBUG: Sur la page d\'accueil');
    console.log('🔍 DEBUG: Conteneur latest-actualites trouvé:', homepageContainer);
    console.log('🔍 DEBUG: Contenu actuel:', homepageContainer.innerHTML.substring(0, 200) + '...');
  }
  
  // Vérifier si on est sur la page actualités
  const newsPageContainer = document.getElementById('actualites-container');
  if (newsPageContainer) {
    console.log('📰 DEBUG: Sur la page actualités');
    console.log('🔍 DEBUG: Conteneur actualites-container trouvé:', newsPageContainer);
    console.log('🔍 DEBUG: Contenu actuel:', newsPageContainer.innerHTML.substring(0, 200) + '...');
  }
  
  // Vérifier si le gestionnaire d'actualités existe
  if (typeof actualitesManager !== 'undefined') {
    console.log('✅ DEBUG: actualitesManager disponible');
    console.log('🔍 DEBUG: Nombre d\'actualités:', actualitesManager.actualites.length);
    
    // Forcer l'affichage après un petit délai
    setTimeout(() => {
      console.log('🔄 DEBUG: Tentative d\'affichage forcé...');
      
      if (homepageContainer) {
        console.log('🏠 DEBUG: Affichage forcé page d\'accueil');
        actualitesManager.displayLatestActualites();
      }
      
      if (newsPageContainer) {
        console.log('📰 DEBUG: Affichage forcé page actualités');
        actualitesManager.displayAllActualites();
        
        // Surveiller les changements de contenu
        const observer = new MutationObserver(function(mutations) {
          mutations.forEach(function(mutation) {
            if (mutation.type === 'childList') {
              console.log('🔍 DEBUG: Contenu du conteneur actualités modifié:', mutation);
              console.log('🔍 DEBUG: Nouveau contenu:', newsPageContainer.innerHTML.substring(0, 100) + '...');
            }
          });
        });
        
        observer.observe(newsPageContainer, { childList: true, subtree: true });
      }
    }, 1000);
    
    // Surveiller toutes les 5 secondes pendant 30 secondes
    let checkInterval = 0;
    const intervalId = setInterval(() => {
      checkInterval++;
      console.log(`🕒 DEBUG: Vérification ${checkInterval}/6`);
      
      if (newsPageContainer) {
        console.log('📰 DEBUG: Contenu actuel:', newsPageContainer.children.length, 'éléments');
        if (newsPageContainer.children.length === 0 || newsPageContainer.innerHTML.includes('loading-actualites')) {
          console.log('⚠️ DEBUG: Contenu vide ou loader détecté');
        }
      }
      
      if (checkInterval >= 6) {
        clearInterval(intervalId);
        console.log('✅ DEBUG: Surveillance terminée');
      }
    }, 5000);
    
  } else {
    console.error('❌ DEBUG: actualitesManager non disponible');
  }
  
  // Vérifier les autres scripts
  setTimeout(() => {
    console.log('🔍 DEBUG: Scripts chargés:');
    console.log('- actualitesManager:', typeof actualitesManager);
    console.log('- DynamicContentLoader:', typeof DynamicContentLoader);
    console.log('- loadActualitesFromAPI:', typeof loadActualitesFromAPI);
  }, 2000);
});
