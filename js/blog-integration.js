/**
 * Intégration Blog pour Sorbo-Ingénierie
 * Gestion des liens "Lire la suite" et affichage des actualités
 */

class BlogIntegration {
    constructor() {
        this.actualitesContainer = null;
        this.init();
    }

    init() {
        // Attendre que le DOM soit chargé
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.setup());
        } else {
            this.setup();
        }
    }

    setup() {
        // Identifier tous les conteneurs possibles des actualités
        this.actualitesContainer = document.getElementById('latest-actualites') || 
                                   document.getElementById('actualites-container') ||
                                   document.querySelector('.actualites-grid') ||
                                   document.querySelector('.news-grid') ||
                                   document.querySelector('.blog-container') ||
                                   document.body; // Fallback vers le body

        console.log('📰 Blog Integration: Conteneur trouvé:', this.actualitesContainer);
        
        // Forcer la mise à jour immédiate
        this.updateActualitesWithBlogLinks();

        // Observer les changements pour les actualités chargées dynamiquement
        this.observeActualitesChanges();
        
        // Mettre à jour périodiquement (pour les chargements tardifs)
        this.startPeriodicUpdates();
    }

    updateActualitesWithBlogLinks() {
        // Attendre un peu pour que les actualités soient chargées
        setTimeout(() => {
            this.processActualitesCards();
        }, 1000);

        // Aussi vérifier périodiquement pour les chargements tardifs
        setTimeout(() => {
            this.processActualitesCards();
        }, 3000);
    }

    processActualitesCards() {
        // Traitement de tous les types de cartes d'actualités
        const allCardSelectors = [
            '.actualite-mini-card',
            '.news-card', 
            '.actualite-card',
            '.blog-post',
            '.card',
            '[class*="actualite"]',
            '[class*="news"]',
            '[class*="article"]'
        ];
        
        let allCards = [];
        allCardSelectors.forEach(selector => {
            const cards = document.querySelectorAll(selector);
            allCards.push(...cards);
        });
        
        // Dédoublonner les cartes
        allCards = [...new Set(allCards)];
        
        console.log(`📰 Blog Integration: ${allCards.length} cartes d'actualités trouvées`);

        allCards.forEach((card, index) => {
            this.enhanceActualiteCard(card, index);
        });
        
        // Traitement spécial des liens existants dans toute la page
        this.processAllReadMoreLinks();
    }

    processAllReadMoreLinks() {
        // Traiter tous les liens "Lire la suite" existants
        const readMoreLinks = document.querySelectorAll('a.read-more, a.lire-plus, a[href*="#"], a[onclick*="showActualiteDetails"], a[onclick*="openArticleModal"]');
        
        console.log(`🔗 Blog Integration: ${readMoreLinks.length} liens "Lire la suite" trouvés`);
        
        readMoreLinks.forEach((link, index) => {
            this.enhanceReadMoreLink(link, index);
        });
    }

    enhanceReadMoreLink(link, index) {
        // Éviter de traiter le même lien plusieurs fois
        if (link.hasAttribute('data-blog-processed')) {
            return;
        }
        
        link.setAttribute('data-blog-processed', 'true');
        
        // Trouver le titre associé à ce lien
        const card = link.closest('.actualite-mini-card, .news-card, .actualite-card, .blog-post, .card, [class*="actualite"], [class*="news"]');
        
        if (card) {
            const titleElement = card.querySelector('h3, h4, .actualite-title, .news-title, .blog-title');
            if (titleElement) {
                const title = titleElement.textContent.trim();
                const articleId = this.generateArticleId(title, index);
                
                // Mettre à jour le lien
                link.href = `article-template.html?id=${articleId}`;
                link.removeAttribute('onclick');
                link.setAttribute('data-article-id', articleId);
                
                console.log(`🔗 Lien mis à jour: "${title}" -> article-template.html?id=${articleId}`);
            }
        }
    }

    startPeriodicUpdates() {
        // Vérifier et mettre à jour toutes les 2 secondes pendant les 30 premières secondes
        let updateCount = 0;
        const maxUpdates = 15;
        
        const updateInterval = setInterval(() => {
            this.processActualitesCards();
            updateCount++;
            
            if (updateCount >= maxUpdates) {
                clearInterval(updateInterval);
                console.log('📰 Blog Integration: Mise à jour périodique terminée');
            }
        }, 2000);
    }

    enhanceActualiteCard(card, index) {
        // Vérifier si la carte a déjà été traitée
        if (card.hasAttribute('data-blog-enhanced')) {
            return;
        }

        // Marquer comme traitée
        card.setAttribute('data-blog-enhanced', 'true');

        // Extraire les informations de la carte
        const titleElement = card.querySelector('h3, h4, .actualite-title, .news-title');
        const linkElement = card.querySelector('a.lire-plus, .read-more, .btn');
        
        if (!titleElement) {
            console.warn('Titre non trouvé pour la carte:', card);
            return;
        }

        const title = titleElement.textContent.trim();
        
        // Générer un ID d'article basé sur le titre ou utiliser l'index
        let articleId = this.generateArticleId(title, index);

        // Chercher dans les données d'actualités si disponibles
        if (window.actualitesData && window.actualitesData.length > 0) {
            const matchingArticle = window.actualitesData.find(article => 
                article.title === title || 
                article.titre === title ||
                article.slug === articleId
            );
            
            if (matchingArticle) {
                articleId = matchingArticle.id || matchingArticle.slug || articleId;
            }
        }

        // Mettre à jour ou créer le lien "Lire la suite"
        if (linkElement) {
            linkElement.href = `article-template.html?id=${articleId}`;
            // Garder le texte original du lien
            linkElement.setAttribute('data-article-id', articleId);
        }
        // Ne pas créer de nouveaux liens - seulement modifier les existants

        // Rendre toute la carte cliquable (optionnel)
        this.makeCardClickable(card, articleId);

        console.log(`✅ Carte enrichie: ${title} -> article-template.html?id=${articleId}`);
    }

    generateArticleId(title, index) {
        // Convertir le titre en slug
        let slug = title.toLowerCase()
            .replace(/[àáâãäå]/g, 'a')
            .replace(/[èéêë]/g, 'e')
            .replace(/[ìíîï]/g, 'i')
            .replace(/[òóôõö]/g, 'o')
            .replace(/[ùúûü]/g, 'u')
            .replace(/[ç]/g, 'c')
            .replace(/[^a-z0-9\s-]/g, '')
            .replace(/\s+/g, '-')
            .replace(/-+/g, '-')
            .trim('-');

        // Limiter la longueur et ajouter un suffixe si nécessaire
        slug = slug.substring(0, 50);
        
        // Si le slug est vide ou trop court, utiliser un fallback
        if (slug.length < 3) {
            slug = `article-${index + 1}`;
        }

        return slug;
    }

    // Fonction createReadMoreLink supprimée - ne créer aucun nouveau bouton

    makeCardClickable(card, articleId) {
        // Éviter de rendre la carte cliquable si elle a déjà des liens internes
        const existingLinks = card.querySelectorAll('a');
        if (existingLinks.length <= 1) {
            card.style.cursor = 'pointer';
            card.addEventListener('click', (e) => {
                // Éviter la propagation si on clique sur un lien
                if (e.target.tagName === 'A' || e.target.closest('a')) {
                    return;
                }
                
                window.location.href = `article-template.html?id=${articleId}`;
            });

            // Ajouter un attribut pour l'accessibilité
            card.setAttribute('role', 'button');
            card.setAttribute('tabindex', '0');
            
            // Support clavier
            card.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    window.location.href = `article-template.html?id=${articleId}`;
                }
            });
        }
    }

    observeActualitesChanges() {
        if (!this.actualitesContainer) return;

        // Observer les changements dans le conteneur des actualités
        const observer = new MutationObserver((mutations) => {
            let hasNewCards = false;
            
            mutations.forEach((mutation) => {
                if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
                    mutation.addedNodes.forEach((node) => {
                        if (node.nodeType === Node.ELEMENT_NODE && 
                            (node.classList.contains('actualite-mini-card') || 
                             node.classList.contains('news-card') ||
                             node.classList.contains('actualite-card'))) {
                            hasNewCards = true;
                        }
                    });
                }
            });

            if (hasNewCards) {
                console.log('📰 Blog Integration: Nouvelles cartes détectées, mise à jour...');
                setTimeout(() => this.processActualitesCards(), 500);
            }
        });

        observer.observe(this.actualitesContainer, {
            childList: true,
            subtree: true
        });
    }

    // Méthode pour mettre à jour manuellement les liens
    updateAllLinks() {
        this.processActualitesCards();
    }

    // Méthode pour obtenir l'URL d'un article
    static getArticleUrl(articleId) {
        return `article-template.html?id=${articleId}`;
    }

    // Méthode pour créer un lien d'article
    static createArticleLink(articleId, text = 'Lire l\'article', className = 'article-link') {
        const link = document.createElement('a');
        link.href = BlogIntegration.getArticleUrl(articleId);
        link.textContent = text;
        link.className = className;
        return link;
    }
}

// Styles CSS discrets pour les liens d'articles
const blogIntegrationStyles = `
    .btn-read-more {
        transition: color 0.3s ease;
    }
`;

// Injecter les styles
const styleSheet = document.createElement('style');
styleSheet.textContent = blogIntegrationStyles;
document.head.appendChild(styleSheet);

// Initialisation automatique
window.BlogIntegration = BlogIntegration;

// Créer l'instance
document.addEventListener('DOMContentLoaded', () => {
    window.blogIntegration = new BlogIntegration();
    console.log('✅ Blog Integration initialisé');
});

// Méthode globale pour forcer la mise à jour
window.updateBlogLinks = function() {
    if (window.blogIntegration) {
        window.blogIntegration.updateAllLinks();
    }
};

// Export pour utilisation dans d'autres scripts
if (typeof module !== 'undefined' && module.exports) {
    module.exports = BlogIntegration;
}
