/**
 * Script d'optimisation des performances pour le chargement progressif
 * Améliore l'expérience utilisateur et les performances
 */

// Configuration des performances
const PerformanceConfig = {
    // Préchargement des images importantes
    preloadCriticalImages: true,
    // Chargement différé des scripts non critiques
    deferNonCriticalScripts: true,
    // Optimisation du viewport
    optimizeViewport: true,
    // Cache des animations
    cacheAnimations: true
};

// Préchargement des images critiques
function preloadCriticalImages() {
    if (!PerformanceConfig.preloadCriticalImages) return;

    const criticalImages = [
        'images/logo.png',
        'images/hero-bg-4k.svg'
    ];

    criticalImages.forEach(src => {
        const link = document.createElement('link');
        link.rel = 'preload';
        link.as = 'image';
        link.href = src;
        document.head.appendChild(link);
    });

    console.log('🖼️ Images critiques préchargées');
}

// Optimisation du chargement des polices
function optimizeFonts() {
    // Préchargement de Font Awesome
    const fontAwesome = document.createElement('link');
    fontAwesome.rel = 'preload';
    fontAwesome.as = 'style';
    fontAwesome.href = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css';
    fontAwesome.onload = function() {
        this.rel = 'stylesheet';
    };
    document.head.appendChild(fontAwesome);

    console.log('🔤 Polices optimisées');
}

// Chargement progressif des images avec placeholder
function enhanceImageLoading() {
    const images = document.querySelectorAll('img:not([data-enhanced])');
    
    images.forEach(img => {
        // Marquer comme traitée
        img.setAttribute('data-enhanced', 'true');
        
        // Ajouter un placeholder avant le chargement
        if (!img.complete) {
            img.style.backgroundColor = '#f8f9fa';
            img.style.minHeight = '200px';
            
            // Créer un observateur pour cette image
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const image = entry.target;
                        
                        // Créer une nouvelle image pour le préchargement
                        const newImg = new Image();
                        newImg.onload = function() {
                            image.src = this.src;
                            image.style.backgroundColor = 'transparent';
                            image.classList.add('image-loaded');
                        };
                        
                        // Commencer le chargement
                        if (image.dataset.src) {
                            newImg.src = image.dataset.src;
                        } else if (image.src) {
                            newImg.src = image.src;
                        }
                        
                        observer.unobserve(image);
                    }
                });
            }, {
                threshold: 0.1,
                rootMargin: '100px'
            });
            
            observer.observe(img);
        }
    });
}

// Optimisation des animations selon les performances de l'appareil
function optimizeAnimations() {
    // Détecter si l'appareil préfère les animations réduites
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    
    if (prefersReducedMotion) {
        // Désactiver les animations complexes
        document.documentElement.style.setProperty('--animation-duration', '0.2s');
        
        // Réduire les délais AOS
        document.querySelectorAll('[data-aos-delay]').forEach(el => {
            el.setAttribute('data-aos-delay', '0');
        });
        
        console.log('⚡ Animations optimisées pour les performances');
    }
    
    // Optimiser selon la puissance de l'appareil
    const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
    if (connection && connection.effectiveType === 'slow-2g') {
        // Désactiver certaines animations sur connexion lente
        document.querySelectorAll('[data-aos]').forEach(el => {
            el.setAttribute('data-aos-duration', '400');
        });
        
        console.log('📱 Animations adaptées à la connexion lente');
    }
}

// Cache intelligent pour les éléments animés
function setupAnimationCache() {
    const animatedElements = new Set();
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !animatedElements.has(entry.target)) {
                animatedElements.add(entry.target);
                entry.target.classList.add('animation-triggered');
            }
        });
    });

    // Observer tous les éléments avec data-aos
    document.querySelectorAll('[data-aos]').forEach(el => {
        observer.observe(el);
    });
}

// Chargement différé des scripts non critiques
function deferNonCriticalScripts() {
    if (!PerformanceConfig.deferNonCriticalScripts) return;

    // Scripts à charger en différé
    const deferredScripts = [
        // Analytics, etc. peuvent être ajoutés ici
    ];

    // Charger après l'événement load
    window.addEventListener('load', () => {
        setTimeout(() => {
            deferredScripts.forEach(src => {
                const script = document.createElement('script');
                script.src = src;
                script.async = true;
                document.head.appendChild(script);
            });
        }, 1000);
    });
}

// Optimisation du smooth scroll
function optimizeSmoothScroll() {
    // Utiliser CSS scroll-behavior quand possible
    if (CSS.supports('scroll-behavior', 'smooth')) {
        document.documentElement.style.scrollBehavior = 'smooth';
    }
    
    // Optimiser les liens d'ancrage
    document.querySelectorAll('a[href^="#"]').forEach(link => {
        link.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);
            
            if (targetElement) {
                e.preventDefault();
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// Gestion de la mémoire pour les animations
function setupMemoryManagement() {
    let animationFrame;
    
    // Throttle des animations lors du scroll
    window.addEventListener('scroll', () => {
        if (animationFrame) {
            cancelAnimationFrame(animationFrame);
        }
        
        animationFrame = requestAnimationFrame(() => {
            // Logique d'optimisation du scroll
            const scrollTop = window.pageYOffset;
            const windowHeight = window.innerHeight;
            
            // Désactiver les animations hors de la vue
            document.querySelectorAll('[data-aos]').forEach(el => {
                const rect = el.getBoundingClientRect();
                const isVisible = rect.top < windowHeight && rect.bottom > 0;
                
                if (!isVisible && rect.top > windowHeight * 2) {
                    // Élément trop loin, pas besoin d'animation
                    el.style.willChange = 'auto';
                } else if (isVisible) {
                    // Élément visible, préparer l'animation
                    el.style.willChange = 'transform, opacity';
                }
            });
        });
    });
}

// Initialisation de toutes les optimisations
function initPerformanceOptimizer() {
    // Attendre que le DOM soit prêt
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', runOptimizations);
    } else {
        runOptimizations();
    }
}

function runOptimizations() {
    console.log('⚡ Initialisation de l\'optimiseur de performances...');
    
    // Exécuter les optimisations
    preloadCriticalImages();
    optimizeFonts();
    
    // Attendre un peu pour les optimisations plus lourdes
    setTimeout(() => {
        enhanceImageLoading();
        optimizeAnimations();
        setupAnimationCache();
        optimizeSmoothScroll();
        setupMemoryManagement();
        deferNonCriticalScripts();
        
        console.log('✅ Optimisations de performance appliquées');
    }, 100);
}

// Surveiller les changements de performance
if ('PerformanceObserver' in window) {
    const perfObserver = new PerformanceObserver((list) => {
        list.getEntries().forEach(entry => {
            if (entry.entryType === 'navigation') {
                console.log('📊 Navigation Performance:', {
                    loadTime: entry.loadEventEnd - entry.loadEventStart,
                    domContentLoaded: entry.domContentLoadedEventEnd - entry.domContentLoadedEventStart,
                    totalTime: entry.loadEventEnd - entry.fetchStart
                });
            }
        });
    });
    
    try {
        perfObserver.observe({ entryTypes: ['navigation'] });
    } catch (e) {
        console.log('Performance Observer non disponible');
    }
}

// Démarrer les optimisations
initPerformanceOptimizer();

// Styles CSS pour les optimisations
const performanceStyles = `
<style>
/* Optimisations de performance */
.image-loaded {
    animation: imageSlideIn 0.6s ease-out;
}

@keyframes imageSlideIn {
    from {
        opacity: 0;
        transform: translateY(20px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

.animation-triggered {
    animation-play-state: running;
}

/* Optimisations GPU */
[data-aos] {
    will-change: transform, opacity;
    backface-visibility: hidden;
    perspective: 1000px;
}

/* Optimisations pour mobile */
@media (max-width: 768px) {
    [data-aos] {
        animation-duration: 0.4s !important;
    }
    
    .image-loaded {
        animation-duration: 0.3s;
    }
}

/* Optimisations pour connexion lente */
@media (prefers-reduced-motion: reduce) {
    [data-aos] {
        animation: none !important;
        transition: none !important;
    }
    
    .image-loaded {
        animation: none;
    }
}
</style>
`;

// Injecter les styles d'optimisation
document.head.insertAdjacentHTML('beforeend', performanceStyles);