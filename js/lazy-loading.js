/**
 * Script de chargement progressif universel pour toutes les pages
 * Désactivation des animations (AOS et CSS) sur toutes les pages
 */

// Drapeau global pour désactiver toute animation
window.DISABLE_ANIMATIONS = true;

// Configuration AOS (non utilisée si animations désactivées)
const AOSConfig = {
    duration: 0,
    delay: 0,
    easing: 'linear',
    once: true,
    mirror: false,
    offset: 0,
    disable: true
};

// Initialiser AOS si disponible
function initAOS() {
    if (window.DISABLE_ANIMATIONS) return;
    if (typeof AOS !== 'undefined') {
        AOS.init(AOSConfig);
    }
}

// Fonction pour ajouter les attributs data-aos aux éléments
function addLazyLoadingAttributes() {
    if (window.DISABLE_ANIMATIONS) return;
    // Sélecteurs des éléments à animer
    const selectors = [
        // Sections principales
        'section:not([data-aos])',
        // Titres
        'h1:not([data-aos]), h2:not([data-aos]), h3:not([data-aos])',
        // Cartes et blocs de contenu
        '.card:not([data-aos]), .service-card:not([data-aos]), .value-card:not([data-aos])',
        '.benefit-card:not([data-aos]), .feature-card:not([data-aos])',
        '.software-card:not([data-aos]), .formation-card:not([data-aos])',
        '.job-card:not([data-aos]), .team-member:not([data-aos])',
        '.domain-item:not([data-aos]), .sector-card:not([data-aos])',
        // Images
        'img:not([data-aos])',
        // Formulaires
        '.contact-form:not([data-aos]), .contact-info:not([data-aos])',
        '.customer-service:not([data-aos])',
        // Paragraphes dans les sections importantes
        '.presentation p:not([data-aos]), .intro-section p:not([data-aos])',
        // Boutons
        '.btn:not([data-aos]), .hero-btn:not([data-aos])',
        // Listes et grilles
        '.grid:not([data-aos]), .container > div:not([data-aos])'
    ];

    let delay = 0;
    const delayIncrement = 100;

    selectors.forEach(selector => {
        const elements = document.querySelectorAll(selector);
        
        elements.forEach((element, index) => {
            // Éviter d'ajouter l'animation aux éléments cachés ou très petits
            const rect = element.getBoundingClientRect();
            if (rect.height < 10 || element.style.display === 'none') {
                return;
            }

            // Déterminer le type d'animation selon l'élément
            let animation = 'fade-up';
            let elementDelay = delay + (index * 50);

            // Animations spécifiques selon le type d'élément
            if (element.tagName === 'IMG') {
                animation = 'zoom-in';
            } else if (element.classList.contains('card') || element.classList.contains('service-card')) {
                animation = 'fade-up';
            } else if (element.tagName === 'H1' || element.tagName === 'H2') {
                animation = 'fade-down';
                elementDelay = delay;
            } else if (element.classList.contains('btn')) {
                animation = 'zoom-in';
            }

            // Ajouter les attributs AOS
            element.setAttribute('data-aos', animation);
            element.setAttribute('data-aos-duration', '800');
            element.setAttribute('data-aos-delay', elementDelay.toString());

            // Animation différée pour les éléments à droite/gauche
            if (index % 2 === 0) {
                element.setAttribute('data-aos', 'fade-right');
            } else {
                element.setAttribute('data-aos', 'fade-left');
            }
        });

        delay += delayIncrement;
    });
}

// Optimisation des images avec Intersection Observer
function initImageLazyLoading() {
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    
                    // Charger l'image si elle a un data-src
                    if (img.dataset.src) {
                        img.src = img.dataset.src;
                        img.classList.remove('lazy');
                        img.classList.add('loaded');
                    }
                    
                    // Ajouter une classe pour l'animation
                    img.classList.add('image-loaded');
                    
                    observer.unobserve(img);
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '50px'
        });

        // Observer toutes les images
        document.querySelectorAll('img').forEach(img => {
            imageObserver.observe(img);
        });
    }
}

// Initialisation au chargement de la page
function initLazyLoading() {
    // Attendre que le DOM soit chargé
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            setTimeout(() => {
                if (!window.DISABLE_ANIMATIONS) {
                    addLazyLoadingAttributes();
                    initAOS();
                }
                initImageLazyLoading();
            }, 100);
        });
    } else {
        setTimeout(() => {
            if (!window.DISABLE_ANIMATIONS) {
                addLazyLoadingAttributes();
                initAOS();
            }
            initImageLazyLoading();
        }, 100);
    }
}

// Réinitialiser AOS quand la fenêtre est redimensionnée
window.addEventListener('resize', () => {
    if (window.DISABLE_ANIMATIONS) return;
    if (typeof AOS !== 'undefined') {
        AOS.refresh();
    }
});

// Démarrer l'initialisation
initLazyLoading();

// Styles pour désactiver toutes les animations du site
const noAnimationStyles = `
<style>
  *, *::before, *::after { animation: none !important; transition: none !important; }
  html { scroll-behavior: auto !important; }
  [data-aos] { opacity: 1 !important; transform: none !important; }
  .image-loaded { animation: none !important; }
</style>
`;

document.head.insertAdjacentHTML('beforeend', noAnimationStyles);

// Réactiver explicitement l'animation de la barre d'actualités du hero
const reenableTickerStyles = `
<style>
  .ticker-track { animation: tickerScroll 60s linear infinite !important; }
  .ticker-content:hover .ticker-track { animation-play-state: paused !important; }
</style>
`;

document.head.insertAdjacentHTML('beforeend', reenableTickerStyles);

console.log('🛑 Animations désactivées sur toutes les pages');