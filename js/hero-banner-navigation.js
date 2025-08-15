// Script unifié pour la navigation des héros banners - Sorbo-Ingénierie
class HeroBannerNavigation {
    constructor() {
        this.slides = [];
        this.dots = [];
        this.prevBtn = null;
        this.nextBtn = null;
        this.currentSlide = 0;
        this.autoPlayInterval = null;
        this.heroBanner = null;
        this.isInitialized = false;
    }

    // Initialiser la navigation du héros banner
    init() {
        console.log('🎠 Initialisation de la navigation du héros banner...');
        
        // Trouver les éléments du héros banner
        this.heroBanner = document.querySelector('.hero-banner');
        if (!this.heroBanner) {
            console.log('ℹ️ Aucun héros banner trouvé sur cette page');
            return;
        }

        this.slides = this.heroBanner.querySelectorAll('.hero-slide');
        this.dots = this.heroBanner.querySelectorAll('.hero-dot');
        this.prevBtn = this.heroBanner.querySelector('.prev-slide');
        this.nextBtn = this.heroBanner.querySelector('.next-slide');

        // Vérifier que tous les éléments nécessaires sont présents
        if (this.slides.length === 0) {
            console.error('❌ Aucune slide trouvée dans le héros banner');
            return;
        }

        console.log(`✅ ${this.slides.length} slides trouvées`);
        console.log(`✅ ${this.dots.length} dots trouvés`);
        console.log(`✅ Bouton précédent: ${this.prevBtn ? 'trouvé' : 'non trouvé'}`);
        console.log(`✅ Bouton suivant: ${this.nextBtn ? 'trouvé' : 'non trouvé'}`);

        // Configurer les événements
        this.setupEventListeners();
        
        // Démarrer l'auto-play
        this.startAutoPlay();
        
        this.isInitialized = true;
        console.log('🎉 Navigation du héros banner initialisée avec succès !');
    }

    // Configurer les écouteurs d'événements
    setupEventListeners() {
        // Événements pour les flèches
        if (this.prevBtn) {
            this.prevBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.prevSlide();
                this.resetAutoPlay();
            });
            console.log('✅ Événement clic ajouté au bouton précédent');
        }

        if (this.nextBtn) {
            this.nextBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.nextSlide();
                this.resetAutoPlay();
            });
            console.log('✅ Événement clic ajouté au bouton suivant');
        }

        // Événements pour les dots
        this.dots.forEach((dot, index) => {
            dot.addEventListener('click', (e) => {
                e.preventDefault();
                this.showSlide(index);
                this.resetAutoPlay();
            });
        });
        console.log('✅ Événements clic ajoutés aux dots');

        // Pause au survol (optionnel)
        if (this.heroBanner) {
            this.heroBanner.addEventListener('mouseenter', () => {
                this.pauseAutoPlay();
            });
            
            this.heroBanner.addEventListener('mouseleave', () => {
                this.resumeAutoPlay();
            });
            console.log('✅ Pause au survol configurée');
        }

        // Navigation au clavier
        document.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowLeft') {
                e.preventDefault();
                this.prevSlide();
                this.resetAutoPlay();
            } else if (e.key === 'ArrowRight') {
                e.preventDefault();
                this.nextSlide();
                this.resetAutoPlay();
            }
        });
        console.log('✅ Navigation au clavier configurée');
    }

    // Afficher une slide spécifique
    showSlide(index) {
        if (index < 0 || index >= this.slides.length) {
            console.warn(`⚠️ Index de slide invalide: ${index}`);
            return;
        }

        // Masquer toutes les slides
        this.slides.forEach(slide => {
            slide.classList.remove('active');
        });

        // Désactiver tous les dots
        this.dots.forEach(dot => {
            dot.classList.remove('active');
        });

        // Afficher la slide actuelle
        this.slides[index].classList.add('active');
        
        // Activer le dot correspondant
        if (this.dots[index]) {
            this.dots[index].classList.add('active');
        }

        this.currentSlide = index;
        console.log(`🔄 Slide ${index + 1}/${this.slides.length} affichée`);
    }

    // Passer à la slide suivante
    nextSlide() {
        const nextIndex = (this.currentSlide + 1) % this.slides.length;
        this.showSlide(nextIndex);
    }

    // Passer à la slide précédente
    prevSlide() {
        const prevIndex = (this.currentSlide - 1 + this.slides.length) % this.slides.length;
        this.showSlide(prevIndex);
    }

    // Démarrer l'auto-play
    startAutoPlay() {
        if (this.autoPlayInterval) {
            clearInterval(this.autoPlayInterval);
        }
        
        this.autoPlayInterval = setInterval(() => {
            this.nextSlide();
        }, 6000);
        
        console.log('▶️ Auto-play démarré (6 secondes)');
    }

    // Pause l'auto-play
    pauseAutoPlay() {
        if (this.autoPlayInterval) {
            clearInterval(this.autoPlayInterval);
            this.autoPlayInterval = null;
            console.log('⏸️ Auto-play mis en pause');
        }
    }

    // Reprendre l'auto-play
    resumeAutoPlay() {
        if (!this.autoPlayInterval) {
            this.startAutoPlay();
            console.log('▶️ Auto-play repris');
        }
    }

    // Reset l'auto-play
    resetAutoPlay() {
        this.pauseAutoPlay();
        setTimeout(() => {
            this.startAutoPlay();
        }, 1000);
        console.log('🔄 Auto-play reset');
    }

    // Arrêter complètement l'auto-play
    stopAutoPlay() {
        if (this.autoPlayInterval) {
            clearInterval(this.autoPlayInterval);
            this.autoPlayInterval = null;
            console.log('⏹️ Auto-play arrêté');
        }
    }

    // Obtenir l'état actuel
    getStatus() {
        return {
            isInitialized: this.isInitialized,
            currentSlide: this.currentSlide,
            totalSlides: this.slides.length,
            autoPlayActive: !!this.autoPlayInterval,
            hasPrevBtn: !!this.prevBtn,
            hasNextBtn: !!this.nextBtn,
            hasDots: this.dots.length > 0
        };
    }

    // Nettoyer les ressources
    destroy() {
        this.stopAutoPlay();
        
        // Supprimer les écouteurs d'événements
        if (this.prevBtn) {
            this.prevBtn.removeEventListener('click', this.prevSlide);
        }
        if (this.nextBtn) {
            this.nextBtn.removeEventListener('click', this.nextSlide);
        }
        
        this.dots.forEach(dot => {
            dot.removeEventListener('click', () => {});
        });
        
        console.log('🧹 Navigation du héros banner nettoyée');
    }
}

// Initialisation automatique quand le DOM est chargé
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 DOM chargé, initialisation de la navigation des héros banners...');
    
    // Créer et initialiser la navigation
    window.heroBannerNav = new HeroBannerNavigation();
    window.heroBannerNav.init();
    
    // Afficher le statut dans la console
    setTimeout(() => {
        const status = window.heroBannerNav.getStatus();
        console.log('📊 Statut de la navigation:', status);
    }, 1000);
});

// Fonction globale pour tester la navigation (pour debug)
window.testHeroBannerNavigation = function() {
    if (window.heroBannerNav && window.heroBannerNav.isInitialized) {
        console.log('🧪 Test de la navigation du héros banner...');
        console.log('Statut:', window.heroBannerNav.getStatus());
        
        // Test de navigation
        console.log('Test: passage à la slide suivante...');
        window.heroBannerNav.nextSlide();
        
        setTimeout(() => {
            console.log('Test: passage à la slide précédente...');
            window.heroBannerNav.prevSlide();
        }, 1000);
        
        return true;
    } else {
        console.error('❌ Navigation du héros banner non initialisée');
        return false;
    }
};

// Export pour utilisation dans d'autres scripts
if (typeof module !== 'undefined' && module.exports) {
    module.exports = HeroBannerNavigation;
}
