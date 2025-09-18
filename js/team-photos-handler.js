/**
 * Gestionnaire des photos de l'équipe Sorbo Ingénierie
 * Gère le chargement des photos avec fallback et gestion d'erreurs
 */

class TeamPhotosHandler {
    constructor() {
        this.defaultPhoto = 'images/logo.png';
        this.photoMappings = {
            'alexis-koffi': 'images/logo.png', // Photo du DG - utiliser le logo en attendant
            'franck-zemin': 'images/Franck zemin.jpg',
            'kouakou-nguessan': 'images/florent.jpg',
            'berenice-echiffouo': 'images/Bere.num.jpg',
            'alexandre-yameogo': 'images/alex.num.jpg',
            'beniwa-allali': 'images/YVES.num.jpg',
            'estelle-ahoua': 'images/estelle.jpg',
            'moya-danho': 'images/moya.num.jpg'
        };
        
        this.init();
    }

    init() {
        this.setupImageErrorHandling();
        this.preloadImages();
        this.addLoadingStates();
    }

    /**
     * Configure la gestion d'erreur pour toutes les images
     */
    setupImageErrorHandling() {
        const teamImages = document.querySelectorAll('.org-card .org-icon img');
        
        teamImages.forEach(img => {
            // Ajouter un attribut data-original pour sauvegarder l'URL originale
            if (!img.dataset.original) {
                img.dataset.original = img.src;
            }
            
            // Gestionnaire d'erreur avec fallback
            img.addEventListener('error', (e) => {
                console.warn(`Erreur de chargement de l'image: ${img.src}`);
                this.handleImageError(img);
            });
            
            // Gestionnaire de chargement réussi
            img.addEventListener('load', (e) => {
                this.handleImageSuccess(img);
            });
        });
    }

    /**
     * Gère les erreurs de chargement d'images
     */
    handleImageError(img) {
        const originalSrc = img.dataset.original;
        const memberName = this.getMemberNameFromImage(img);
        
        // Essayer d'utiliser une photo alternative
        const alternativePhoto = this.getAlternativePhoto(memberName);
        
        if (alternativePhoto && alternativePhoto !== originalSrc) {
            img.src = alternativePhoto;
            img.dataset.retry = '1';
        } else {
            // Utiliser la photo par défaut
            img.src = this.defaultPhoto;
            img.classList.add('fallback-photo');
            
            // Ajouter un indicateur visuel
            this.addFallbackIndicator(img);
        }
    }

    /**
     * Gère le chargement réussi d'une image
     */
    handleImageSuccess(img) {
        img.classList.remove('fallback-photo');
        img.classList.add('photo-loaded');
        
        // Supprimer l'indicateur de fallback s'il existe
        const fallbackIndicator = img.parentElement.querySelector('.fallback-indicator');
        if (fallbackIndicator) {
            fallbackIndicator.remove();
        }
    }

    /**
     * Obtient le nom du membre à partir de l'image
     */
    getMemberNameFromImage(img) {
        const card = img.closest('.org-card');
        if (card) {
            const nameElement = card.querySelector('h4');
            if (nameElement) {
                return nameElement.textContent.toLowerCase().replace(/\s+/g, '-');
            }
        }
        return '';
    }

    /**
     * Obtient une photo alternative pour un membre
     */
    getAlternativePhoto(memberName) {
        // Mapping des alternatives
        const alternatives = {
            'alexis-koffi': 'images/logo.png',
            'franck-zemin': 'images/Franck zemin.jpg',
            'kouakou-nguessan': 'images/florent.jpg',
            'berenice-echiffouo': 'images/berenice.jpg',
            'alexandre-yameogo': 'images/alex.jpg',
            'beniwa-allali': 'images/YVES.num.jpg',
            'estelle-ahoua': 'images/estelle.jpg',
            'moya-danho': 'images/moya.num.jpg'
        };
        
        return alternatives[memberName] || null;
    }

    /**
     * Ajoute un indicateur visuel pour les photos de fallback
     */
    addFallbackIndicator(img) {
        const iconContainer = img.parentElement;
        
        // Vérifier si l'indicateur existe déjà
        if (iconContainer.querySelector('.fallback-indicator')) {
            return;
        }
        
        const indicator = document.createElement('div');
        indicator.className = 'fallback-indicator';
        indicator.innerHTML = '<i class="fas fa-user"></i>';
        indicator.title = 'Photo temporaire - Logo de l\'entreprise';
        
        // Positionner l'indicateur
        indicator.style.cssText = `
            position: absolute;
            top: -5px;
            right: -5px;
            background: #d10000;
            color: white;
            border-radius: 50%;
            width: 20px;
            height: 20px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 10px;
            z-index: 10;
        `;
        
        iconContainer.style.position = 'relative';
        iconContainer.appendChild(indicator);
    }

    /**
     * Précharge les images pour améliorer les performances
     */
    preloadImages() {
        const imageUrls = Object.values(this.photoMappings);
        
        imageUrls.forEach(url => {
            if (url && url !== this.defaultPhoto) {
                const img = new Image();
                img.src = url;
            }
        });
    }

    /**
     * Ajoute des états de chargement
     */
    addLoadingStates() {
        const teamImages = document.querySelectorAll('.org-card .org-icon img');
        
        teamImages.forEach(img => {
            const iconContainer = img.parentElement;
            
            // Ajouter une classe de chargement
            iconContainer.classList.add('loading');
            
            // Supprimer la classe de chargement une fois l'image chargée
            if (img.complete) {
                iconContainer.classList.remove('loading');
            } else {
                img.addEventListener('load', () => {
                    iconContainer.classList.remove('loading');
                });
            }
        });
    }

    /**
     * Vérifie la disponibilité de toutes les photos
     */
    checkPhotoAvailability() {
        const results = {};
        const teamImages = document.querySelectorAll('.org-card .org-icon img');
        
        teamImages.forEach(img => {
            const memberName = this.getMemberNameFromImage(img);
            const originalSrc = img.dataset.original;
            
            results[memberName] = {
                original: originalSrc,
                current: img.src,
                isFallback: img.classList.contains('fallback-photo'),
                loaded: img.complete,
                naturalWidth: img.naturalWidth,
                naturalHeight: img.naturalHeight
            };
        });
        
        console.log('État des photos de l\'équipe:', results);
        return results;
    }

    /**
     * Force le rechargement de toutes les images
     */
    reloadAllPhotos() {
        const teamImages = document.querySelectorAll('.org-card .org-icon img');
        
        teamImages.forEach(img => {
            const originalSrc = img.dataset.original;
            if (originalSrc) {
                img.src = originalSrc;
                img.classList.remove('fallback-photo', 'photo-loaded');
            }
        });
    }
}

// Initialisation automatique quand le DOM est prêt
document.addEventListener('DOMContentLoaded', () => {
    window.teamPhotosHandler = new TeamPhotosHandler();
    
    // Exposer la méthode de vérification pour le débogage
    window.checkTeamPhotos = () => {
        return window.teamPhotosHandler.checkPhotoAvailability();
    };
    
    // Exposer la méthode de rechargement
    window.reloadTeamPhotos = () => {
        window.teamPhotosHandler.reloadAllPhotos();
    };
});

// Export pour utilisation dans d'autres modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = TeamPhotosHandler;
}
