/**
 * Gestionnaire des images pour les actualités
 * Ce script facilite l'ajout et la gestion des images personnalisées
 */

class ActualitesImagesManager {
  constructor() {
    this.imageExtensions = ['.jpg', '.jpeg', '.png', '.webp'];
    this.init();
  }

  init() {
    console.log('📸 Gestionnaire d\'images actualités initialisé');
    this.checkAndActivateImages();
    this.createImageHelper();
  }

  // Vérifier et activer les images disponibles
  checkAndActivateImages() {
    const imageContainers = document.querySelectorAll('[data-actualite-id]');
    
    imageContainers.forEach(img => {
      const actualiteId = img.getAttribute('data-actualite-id');
      const imagePath = img.getAttribute('data-image-path');
      
      if (imagePath) {
        this.testImageExists(imagePath, img);
      }
    });
  }

  // Tester si une image existe
  testImageExists(imagePath, imgElement) {
    const testImg = new Image();
    testImg.onload = () => {
      console.log(`✅ Image trouvée: ${imagePath}`);
      this.activateImage(imgElement, imagePath);
    };
    testImg.onerror = () => {
      console.log(`❌ Image manquante: ${imagePath}`);
    };
    testImg.src = imagePath;
  }

  // Activer une image trouvée
  activateImage(imgElement, imagePath) {
    const container = imgElement.closest('.news-image, .blog-image');
    if (container) {
      // Masquer l'image de fallback
      const fallbackImg = container.querySelector('img[src*="default.jpg"], img[src*="autocad"], img[src*="prix"], img[src*="oh-route"], img[src*="grand-bassam"], img[src*="recrutement"]');
      if (fallbackImg && fallbackImg !== imgElement) {
        fallbackImg.style.display = 'none';
      }
      
      // Activer la nouvelle image
      imgElement.src = imagePath;
      imgElement.style.display = 'block';
      imgElement.style.opacity = '1';
    }
  }

  // Créer un helper pour visualiser les images manquantes
  createImageHelper() {
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
      this.displayImageHelper();
    }
  }

  // Afficher l'aide pour les images (uniquement en local)
  displayImageHelper() {
    const helper = document.createElement('div');
    helper.id = 'images-helper';
    helper.style.cssText = `
      position: fixed;
      top: 10px;
      right: 10px;
      background: rgba(0,0,0,0.9);
      color: white;
      padding: 15px;
      border-radius: 8px;
      font-family: monospace;
      font-size: 12px;
      max-width: 400px;
      z-index: 10000;
      max-height: 200px;
      overflow-y: auto;
    `;

    let helpContent = '<strong>📸 Images actualités requises:</strong><br><br>';
    
    const imageContainers = document.querySelectorAll('[data-actualite-id]');
    imageContainers.forEach(img => {
      const actualiteId = img.getAttribute('data-actualite-id');
      const imagePath = img.getAttribute('data-image-path');
      const title = img.getAttribute('alt');
      
      helpContent += `<div style="margin-bottom: 8px;">
        <strong style="color: #4CAF50;">${actualiteId}</strong><br>
        <span style="color: #FFC107;">${title}</span><br>
        <code style="color: #03A9F4;">${imagePath}</code>
      </div>`;
    });

    helpContent += `<br><button onclick="document.getElementById('images-helper').remove()" 
      style="background: #f44336; color: white; border: none; padding: 5px 10px; border-radius: 4px; cursor: pointer;">
      Fermer
    </button>`;

    helper.innerHTML = helpContent;
    document.body.appendChild(helper);

    // Auto-masquer après 10 secondes
    setTimeout(() => {
      if (document.getElementById('images-helper')) {
        helper.style.opacity = '0.3';
      }
    }, 10000);
  }

  // Fonction manuelle pour activer une image
  static activateCustomImage(actualiteId, imagePath) {
    const imgElement = document.querySelector(`[data-actualite-id="${actualiteId}"]`);
    if (imgElement) {
      const manager = new ActualitesImagesManager();
      manager.activateImage(imgElement, imagePath);
      console.log(`✅ Image activée manuellement: ${actualiteId} -> ${imagePath}`);
    } else {
      console.error(`❌ Actualité non trouvée: ${actualiteId}`);
    }
  }

  // Lister toutes les images attendues
  static listExpectedImages() {
    const imageContainers = document.querySelectorAll('[data-actualite-id]');
    const expectedImages = [];
    
    imageContainers.forEach(img => {
      expectedImages.push({
        id: img.getAttribute('data-actualite-id'),
        path: img.getAttribute('data-image-path'),
        title: img.getAttribute('alt')
      });
    });

    console.table(expectedImages);
    return expectedImages;
  }
}

// Instance globale
const actualitesImagesManager = new ActualitesImagesManager();

// Auto-initialisation
document.addEventListener('DOMContentLoaded', function() {
  // Démarrer le gestionnaire après un délai pour s'assurer que les actualités sont chargées
  setTimeout(() => {
    if (typeof actualitesImagesManager !== 'undefined') {
      actualitesImagesManager.checkAndActivateImages();
    }
  }, 2000);
});

// Fonctions globales pour faciliter l'utilisation
window.activateActualiteImage = ActualitesImagesManager.activateCustomImage;
window.listActualiteImages = ActualitesImagesManager.listExpectedImages;
