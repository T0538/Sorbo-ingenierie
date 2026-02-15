/**
 * Moteur de Blog Professionnel pour Sorbo-Ingénierie
 * Gestion des articles, recommandations et fonctionnalités sociales
 */

class BlogEngine {
    constructor() {
        this.articles = [];
        this.currentArticle = null;
        this.baseUrl = window.location.origin;
        this.init();
    }

    async init() {
        // Charger les articles depuis le fichier JSON
        await this.loadArticles();
        
        // Initialiser les fonctionnalités
        this.initializeEventListeners();
        
        console.log('📰 Blog Engine initialisé avec', this.articles.length, 'articles');
    }

    async loadArticles() {
        try {
            // Utiliser les données d'actualités existantes si disponibles
            if (window.actualitesData && window.actualitesData.length > 0) {
                this.articles = window.actualitesData.map((article, index) => ({
                    ...article,
                    id: article.id || `article-${index + 1}`,
                    content: this.expandArticleContent(article),
                    tags: this.generateTags(article),
                    author: {
                        name: 'Équipe Sorbo-Ingénierie',
                        title: 'Experts en ingénierie',
                        bio: 'Notre équipe d\'experts passionnés partage régulièrement des insights et analyses sur les dernières innovations en génie civil et ingénierie.',
                        avatar: 'images/alexis koffi.jpeg'
                    },
                    readingTime: this.calculateReadingTime(article.description || '')
                }));
            } else {
                // Données de fallback
                this.articles = await this.getFallbackArticles();
            }
        } catch (error) {
            console.error('Erreur lors du chargement des articles:', error);
            this.articles = await this.getFallbackArticles();
        }
    }

    expandArticleContent(article) {
        // Générer un contenu d'article complet basé sur la description
        const baseContent = article.description || '';
        
        return `
            <h2>Introduction</h2>
            <p>${baseContent}</p>
            
            <h2>Contexte et enjeux</h2>
            <p>Dans le domaine de l'ingénierie civile, chaque projet représente un défi unique qui nécessite une expertise technique approfondie et une approche méthodologique rigoureuse. Chez Sorbo-Ingénierie, nous mettons notre savoir-faire au service de projets d'envergure qui façonnent l'infrastructure de demain.</p>
            
            <blockquote>
                "L'excellence en ingénierie ne se mesure pas seulement à la qualité technique, mais aussi à la capacité d'innovation et d'adaptation aux défis contemporains."
            </blockquote>
            
            <h2>Notre approche méthodologique</h2>
            <p>Notre équipe d'experts développe des solutions sur mesure en s'appuyant sur :</p>
            <ul>
                <li>Une analyse approfondie des besoins spécifiques</li>
                <li>L'utilisation de technologies de pointe</li>
                <li>Un suivi rigoureux de toutes les phases du projet</li>
                <li>Une collaboration étroite avec nos partenaires</li>
            </ul>
            
            <h3>Innovation et durabilité</h3>
            <p>Nous intégrons systématiquement les principes de développement durable dans nos réalisations, en privilégiant des solutions innovantes qui respectent l'environnement tout en optimisant les performances techniques.</p>
            
            <h2>Impact et perspectives</h2>
            <p>Ce type de projet illustre parfaitement notre engagement envers l'excellence et notre capacité à relever les défis les plus complexes du génie civil moderne. Les retombées positives se mesurent non seulement en termes de performance technique, mais aussi d'impact socio-économique pour les communautés concernées.</p>
            
            <h3>Conclusion</h3>
            <p>Chez Sorbo-Ingénierie, nous continuons d'innover et de repousser les limites de l'ingénierie pour créer des infrastructures durables et performantes qui répondent aux besoins actuels et futurs de nos clients.</p>
        `;
    }

    generateTags(article) {
        const tagCategories = {
            'Formation': ['formation', 'apprentissage', 'compétences', 'certification'],
            'Ingénierie': ['génie civil', 'infrastructure', 'construction', 'technique'],
            'Projets': ['réalisation', 'projet', 'travaux', 'développement'],
            'Innovation': ['technologie', 'innovation', 'modernisation', 'digital'],
            'Entreprise': ['actualité', 'sorbo-ingénierie', 'équipe', 'expertise']
        };

        const category = article.category || 'Entreprise';
        const baseTags = tagCategories[category] || tagCategories['Entreprise'];
        
        // Ajouter des tags spécifiques basés sur le contenu
        const contentTags = [];
        const content = (article.title + ' ' + article.description).toLowerCase();
        
        if (content.includes('autocad')) contentTags.push('AutoCAD');
        if (content.includes('topographie')) contentTags.push('topographie');
        if (content.includes('formation')) contentTags.push('formation professionnelle');
        if (content.includes('logiciel')) contentTags.push('logiciels');
        if (content.includes('infrastructure')) contentTags.push('infrastructures');
        
        return [...baseTags.slice(0, 3), ...contentTags.slice(0, 2)];
    }

    calculateReadingTime(content) {
        const wordsPerMinute = 200;
        const wordCount = content.split(' ').length;
        const minutes = Math.ceil(wordCount / wordsPerMinute);
        return `${minutes} min de lecture`;
    }

    async getFallbackArticles() {
        return [
            {
                id: 'article-1',
                title: 'Nouvelle formation AutoCAD 2025 : Maîtrisez les dernières innovations',
                subtitle: 'Découvrez notre programme de formation complet sur AutoCAD 2025 avec les dernières fonctionnalités et techniques avancées.',
                description: 'Notre équipe de formateurs experts vous accompagne dans la maîtrise d\'AutoCAD 2025...',
                category: 'Formation',
                date: '2024-12-15',
                image: 'images/formationcova.jpg',
                author: {
                    name: 'Équipe Formation Sorbo-Ingénierie',
                    title: 'Formateurs certifiés AutoCAD',
                    bio: 'Nos formateurs certifiés possèdent une expertise approfondie des logiciels de CAO et une expérience pratique en ingénierie.',
                    avatar: 'images/team-formation.jpg'
                },
                tags: ['AutoCAD', 'formation', 'CAO', 'design', 'ingénierie'],
                readingTime: '6 min de lecture',
                content: this.getFullArticleContent('autocad')
            },
            {
                id: 'article-2',
                title: 'Projet d\'infrastructure majeur : Route Dabakala-Satama-Sokoro',
                subtitle: 'Retour sur notre participation au projet d\'aménagement et de bitumage de cette route stratégique.',
                description: 'Découvrez les défis techniques et les solutions innovantes mises en œuvre pour ce projet d\'envergure...',
                category: 'Projets',
                date: '2024-12-10',
                image: 'images/route.jpg',
                author: {
                    name: 'Équipe Projet Sorbo-Ingénierie',
                    title: 'Ingénieurs spécialisés en infrastructures',
                    bio: 'Notre équipe projet combine expertise technique et gestion de projet pour la réalisation d\'infrastructures complexes.',
                    avatar: 'images/team-projet.jpg'
                },
                tags: ['infrastructure', 'route', 'bitumage', 'génie civil', 'transport'],
                readingTime: '8 min de lecture',
                content: this.getFullArticleContent('infrastructure')
            }
        ];
    }

    getFullArticleContent(type) {
        const contents = {
            autocad: `
                <h2>AutoCAD 2025 : Les nouveautés révolutionnaires</h2>
                <p>La nouvelle version d'AutoCAD 2025 apporte des innovations majeures qui transforment la façon dont nous concevons et développons nos projets d'ingénierie. Chez Sorbo-Ingénierie, nous avons développé un programme de formation complet pour maîtriser ces nouvelles fonctionnalités.</p>
                
                <h3>Intelligence artificielle intégrée</h3>
                <p>L'IA d'AutoCAD 2025 révolutionne la conception en proposant des suggestions intelligentes, l'optimisation automatique des tracés et la détection d'erreurs en temps réel.</p>
                
                <h3>Collaboration cloud avancée</h3>
                <p>Les nouvelles fonctionnalités cloud permettent une collaboration en temps réel entre équipes dispersées géographiquement, avec synchronisation automatique et historique des modifications.</p>
                
                <blockquote>
                    "AutoCAD 2025 représente un bond en avant significatif pour notre profession. C'est pourquoi nous avons adapté nos formations pour intégrer ces innovations dès maintenant."
                </blockquote>
                
                <h2>Programme de formation Sorbo-Ingénierie</h2>
                <p>Notre programme de formation s'articule autour de modules pratiques et théoriques :</p>
                
                <ul>
                    <li><strong>Module 1 :</strong> Prise en main de l'interface nouvelle génération</li>
                    <li><strong>Module 2 :</strong> Maîtrise des outils d'IA intégrés</li>
                    <li><strong>Module 3 :</strong> Collaboration cloud et gestion de projets</li>
                    <li><strong>Module 4 :</strong> Optimisation des workflows</li>
                    <li><strong>Module 5 :</strong> Cas pratiques sectoriels</li>
                </ul>
                
                <h3>Certification et suivi</h3>
                <p>À l'issue de la formation, les participants reçoivent une certification Sorbo-Ingénierie reconnue par l'industrie, ainsi qu'un suivi personnalisé durant 6 mois.</p>
                
                <h2>Inscription et modalités</h2>
                <p>Les formations débutent en janvier 2025 avec des sessions inter-entreprises et intra-entreprises. Places limitées pour garantir un accompagnement personnalisé de qualité.</p>
            `,
            infrastructure: `
                <h2>Un projet d'envergure nationale</h2>
                <p>Le projet d'aménagement et de bitumage de la route Dabakala-Satama-Sokoro représente un investissement stratégique majeur pour le développement économique de la région. Sorbo-Ingénierie a été sollicitée pour le suivi et contrôle topographique de ces travaux d'infrastructure.</p>
                
                <h3>Défis techniques relevés</h3>
                <p>Ce projet présentait plusieurs défis techniques majeurs :</p>
                <ul>
                    <li>Terrain accidenté avec variations d'altitude importantes</li>
                    <li>Zones de passage d'eau nécessitant des ouvrages d'art</li>
                    <li>Respect strict des normes environnementales</li>
                    <li>Coordination avec les communautés locales</li>
                </ul>
                
                <blockquote>
                    "La précision topographique est cruciale pour la durabilité d'une infrastructure routière. Chaque point de mesure compte pour garantir la qualité finale."
                </blockquote>
                
                <h2>Méthodologie Sorbo-Ingénierie</h2>
                <p>Notre approche méthodologique s'est articulée autour de plusieurs phases :</p>
                
                <h3>Phase 1 : Études préliminaires</h3>
                <p>Analyse topographique complète du tracé avec utilisation de drones et stations totales haute précision pour cartographier l'ensemble du parcours.</p>
                
                <h3>Phase 2 : Suivi des travaux</h3>
                <p>Contrôle quotidien de l'avancement avec vérifications des cotes, pentes et alignements selon les plans d'exécution approuvés.</p>
                
                <h3>Phase 3 : Contrôle qualité</h3>
                <p>Validation finale des ouvrages avec mesures de précision et certification de conformité aux normes en vigueur.</p>
                
                <h2>Technologies utilisées</h2>
                <p>Pour ce projet, nous avons mobilisé nos équipements les plus performants :</p>
                <ul>
                    <li>Stations totales robotisées Leica</li>
                    <li>GPS RTK haute précision</li>
                    <li>Drones de cartographie avec capteurs LiDAR</li>
                    <li>Logiciels de traitement Covadis et AutoCAD Civil 3D</li>
                </ul>
                
                <h3>Impact socio-économique</h3>
                <p>Cette infrastructure améliore considérablement la connectivité de la région, facilitant les échanges commerciaux et l'accès aux services publics pour les populations locales.</p>
                
                <h2>Perspectives et enseignements</h2>
                <p>Ce projet confirme notre expertise dans le domaine des grandes infrastructures et notre capacité à intervenir sur des projets complexes en respectant les délais et exigences de qualité les plus strictes.</p>
            `
        };
        
        return contents[type] || contents.autocad;
    }

    loadArticle(articleId) {
        let article = this.articles.find(a => a.id === articleId);
        
        // Si pas trouvé par ID exact, essayer par slug ou titre
        if (!article) {
            article = this.articles.find(a => 
                a.slug === articleId || 
                a.titre === articleId ||
                a.title === articleId ||
                this.generateSlugFromTitle(a.title || a.titre) === articleId
            );
        }
        
        // Si toujours pas trouvé, créer un article générique
        if (!article) {
            console.warn('Article non trouvé:', articleId, 'Création d\'un article générique...');
            article = this.createGenericArticle(articleId);
        }

        this.currentArticle = article;
        this.renderArticle(article);
        this.generateTableOfContents();
        this.setupSocialSharing();
        this.loadRecommendations();
        this.setupNavigation();
        
        // Mettre à jour les méta-tags pour le SEO
        this.updateMetaTags(article);
        
        console.log('📖 Article chargé:', article.title);
    }

    generateSlugFromTitle(title) {
        if (!title) return 'article-sans-titre';
        
        return title.toLowerCase()
            .replace(/[àáâãäå]/g, 'a')
            .replace(/[èéêë]/g, 'e')
            .replace(/[ìíîï]/g, 'i')
            .replace(/[òóôõö]/g, 'o')
            .replace(/[ùúûü]/g, 'u')
            .replace(/[ç]/g, 'c')
            .replace(/[^a-z0-9\s-]/g, '')
            .replace(/\s+/g, '-')
            .replace(/-+/g, '-')
            .trim('-')
            .substring(0, 50);
    }

    createGenericArticle(articleId) {
        // Créer un article générique basé sur l'ID
        const title = articleId.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
        
        return {
            id: articleId,
            title: title,
            subtitle: 'Article d\'actualité de Sorbo-Ingénierie',
            description: 'Découvrez les dernières actualités et innovations de Sorbo-Ingénierie dans le domaine de l\'ingénierie civile.',
            category: 'Actualité',
            date: new Date().toISOString().split('T')[0],
            image: 'images/default-article.jpg',
            author: {
                name: 'Équipe Sorbo-Ingénierie',
                title: 'Experts en ingénierie',
                bio: 'Notre équipe d\'experts partage régulièrement des insights sur l\'ingénierie.',
                avatar: 'images/alexis koffi.jpeg'
            },
            tags: ['actualité', 'sorbo-ingénierie', 'ingénierie'],
            readingTime: '3 min de lecture',
            content: this.createGenericContent(title)
        };
    }

    createGenericContent(title) {
        return `
            <h2>À propos de ${title}</h2>
            <p>Chez Sorbo-Ingénierie, nous nous engageons à vous tenir informés des dernières évolutions et innovations dans le domaine de l'ingénierie civile.</p>
            
            <h3>Notre expertise</h3>
            <p>Avec plus de 15 ans d'expérience, Sorbo-Ingénierie s'impose comme un acteur majeur de l'ingénierie en Côte d'Ivoire et en Afrique de l'Ouest. Nous mettons notre expertise au service de projets d'envergure dans les domaines suivants :</p>
            
            <ul>
                <li>Études d'ingénierie et de faisabilité</li>
                <li>Topographie et cartographie</li>
                <li>Formation professionnelle</li>
                <li>Développement de logiciels spécialisés</li>
            </ul>
            
            <blockquote>
                "L'excellence en ingénierie se construit sur la rigueur technique, l'innovation continue et l'engagement envers nos clients."
            </blockquote>
            
            <h3>Innovation et développement</h3>
            <p>Nous investissons continuellement dans les nouvelles technologies et méthodologies pour offrir des solutions toujours plus performantes et adaptées aux défis contemporains de l'ingénierie.</p>
            
            <h3>Contact et information</h3>
            <p>Pour plus d'informations sur nos services ou pour discuter de votre projet, n'hésitez pas à nous contacter :</p>
            <ul>
                <li><strong>Téléphone :</strong> (+225) 01 50 12 30 50</li>
                <li><strong>Email :</strong> contact@sorbo.ingenierie.ci</li>
                <li><strong>Adresse :</strong> Abidjan, Yopougon Ancien Bel-Air cité SOPIM</li>
            </ul>
        `;
    }

    renderArticle(article) {
        // Mettre à jour le titre et métadonnées
        document.getElementById('article-title').textContent = article.title;
        document.getElementById('article-subtitle').textContent = article.subtitle || '';
        document.getElementById('article-breadcrumb').textContent = article.title;
        
        // Métadonnées
        document.getElementById('article-category').textContent = article.category || 'Actualité';
        document.getElementById('article-date').textContent = this.formatDate(article.date);
        document.getElementById('article-author').textContent = article.author?.name || 'Équipe Sorbo-Ingénierie';
        document.getElementById('reading-time').textContent = article.readingTime || '5 min de lecture';
        
        // Image principale
        const heroImage = document.getElementById('hero-image');
        heroImage.src = article.image || 'images/default-article.jpg';
        heroImage.alt = article.title;
        
        // Contenu principal
        document.getElementById('main-content').innerHTML = article.content || this.expandArticleContent(article);
        
        // Tags
        this.renderTags(article.tags || []);
        
        // Bio auteur
        this.renderAuthorBio(article.author);
        
        // Mise à jour du titre de la page
        document.title = `${article.title} | Sorbo-Ingénierie`;
    }

    renderTags(tags) {
        const tagsList = document.getElementById('tags-list');
        tagsList.innerHTML = tags.map(tag => 
            `<a href="#" class="tag" onclick="BlogEngine.searchByTag('${tag}')">${tag}</a>`
        ).join('');
    }

    renderAuthorBio(author) {
        if (!author) return;
        
        const authorBio = document.getElementById('author-bio');
        const authorAvatar = document.getElementById('author-avatar');
        const authorName = document.getElementById('author-name');
        const authorTitle = document.getElementById('author-title');
        const authorDescription = document.getElementById('author-description');
        
        if (authorAvatar) authorAvatar.src = author.avatar || 'images/default-avatar.jpg';
        if (authorName) authorName.textContent = author.name || 'Équipe Sorbo-Ingénierie';
        if (authorTitle) authorTitle.textContent = author.title || 'Experts en ingénierie';
        if (authorDescription) authorDescription.textContent = author.bio || 'Notre équipe d\'experts partage régulièrement des insights sur l\'ingénierie.';
    }

    generateTableOfContents() {
        const headings = document.querySelectorAll('#main-content h2, #main-content h3');
        const tocList = document.getElementById('toc-list');
        
        if (headings.length === 0) {
            document.getElementById('table-of-contents').style.display = 'none';
            return;
        }
        
        tocList.innerHTML = Array.from(headings).map((heading, index) => {
            const id = `heading-${index}`;
            heading.id = id;
            const level = heading.tagName === 'H2' ? '' : 'style="margin-left: 20px; font-size: 0.9rem;"';
            return `<li><a href="#${id}" ${level}>${heading.textContent}</a></li>`;
        }).join('');
        
        // Smooth scroll pour les liens de la table des matières
        tocList.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const target = document.querySelector(link.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
            });
        });
    }

    setupSocialSharing() {
        const url = encodeURIComponent(window.location.href);
        const title = encodeURIComponent(this.currentArticle.title);
        const description = encodeURIComponent(this.currentArticle.subtitle || this.currentArticle.description);
        
        // Facebook
        document.getElementById('share-facebook').href = 
            `https://www.facebook.com/sharer/sharer.php?u=${url}`;
        
        // Twitter
        document.getElementById('share-twitter').href = 
            `https://twitter.com/intent/tweet?url=${url}&text=${title}`;
        
        // LinkedIn
        document.getElementById('share-linkedin').href = 
            `https://www.linkedin.com/sharing/share-offsite/?url=${url}`;
        
        // WhatsApp
        document.getElementById('share-whatsapp').href = 
            `https://wa.me/?text=${title}%20${url}`;
        
        // Email
        document.getElementById('share-email').href = 
            `mailto:?subject=${title}&body=${description}%0A%0A${url}`;
    }

    loadRecommendations() {
        const currentId = this.currentArticle.id;
        const currentCategory = this.currentArticle.category;
        
        // Algorithme de recommandation intelligent
        let recommendations = this.articles.filter(article => article.id !== currentId);
        
        // Prioriser les articles de la même catégorie
        recommendations.sort((a, b) => {
            const aScore = (a.category === currentCategory ? 10 : 0) + Math.random() * 5;
            const bScore = (b.category === currentCategory ? 10 : 0) + Math.random() * 5;
            return bScore - aScore;
        });
        
        // Prendre les 3 meilleurs
        recommendations = recommendations.slice(0, 3);
        
        this.renderRecommendations(recommendations);
    }

    renderRecommendations(recommendations) {
        const grid = document.getElementById('recommendations-grid');
        
        grid.innerHTML = recommendations.map(article => `
            <a href="article-template.html?id=${article.id}" class="recommendation-card">
                <div class="recommendation-image">
                    <img src="${article.image || 'images/default-article.jpg'}" alt="${article.title}" loading="lazy">
                </div>
                <div class="recommendation-content">
                    <span class="recommendation-category">${article.category || 'Actualité'}</span>
                    <h3 class="recommendation-title">${article.title}</h3>
                    <p class="recommendation-excerpt">${this.truncateText(article.description || '', 120)}</p>
                    <div class="recommendation-meta">
                        <span>${this.formatDate(article.date)}</span>
                        <span>${article.readingTime || '5 min'}</span>
                    </div>
                </div>
            </a>
        `).join('');
    }

    setupNavigation() {
        const currentIndex = this.articles.findIndex(a => a.id === this.currentArticle.id);
        
        // Article précédent
        if (currentIndex > 0) {
            const prevArticle = this.articles[currentIndex - 1];
            const prevBtn = document.getElementById('prev-article');
            prevBtn.href = `article-template.html?id=${prevArticle.id}`;
            prevBtn.style.display = 'block';
            document.getElementById('prev-title').textContent = prevArticle.title;
        }
        
        // Article suivant
        if (currentIndex < this.articles.length - 1) {
            const nextArticle = this.articles[currentIndex + 1];
            const nextBtn = document.getElementById('next-article');
            nextBtn.href = `article-template.html?id=${nextArticle.id}`;
            nextBtn.style.display = 'block';
            document.getElementById('next-title').textContent = nextArticle.title;
        }
    }

    updateMetaTags(article) {
        // Mise à jour des méta-tags Open Graph et Twitter
        const metaTags = [
            { property: 'og:title', content: article.title },
            { property: 'og:description', content: article.subtitle || article.description },
            { property: 'og:image', content: this.baseUrl + '/' + (article.image || 'images/default-article.jpg') },
            { property: 'og:url', content: window.location.href },
            { property: 'twitter:title', content: article.title },
            { property: 'twitter:description', content: article.subtitle || article.description },
            { property: 'twitter:image', content: this.baseUrl + '/' + (article.image || 'images/default-article.jpg') },
            { property: 'twitter:url', content: window.location.href },
            { name: 'description', content: article.subtitle || article.description }
        ];
        
        metaTags.forEach(tag => {
            let meta = document.querySelector(`meta[${tag.property ? 'property' : 'name'}="${tag.property || tag.name}"]`);
            if (!meta) {
                meta = document.createElement('meta');
                if (tag.property) meta.setAttribute('property', tag.property);
                if (tag.name) meta.setAttribute('name', tag.name);
                document.head.appendChild(meta);
            }
            meta.setAttribute('content', tag.content);
        });
    }

    // Méthodes utilitaires
    formatDate(dateString) {
        const date = new Date(dateString);
        const options = { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
        };
        return date.toLocaleDateString('fr-FR', options);
    }

    truncateText(text, maxLength) {
        if (text.length <= maxLength) return text;
        return text.substring(0, maxLength).trim() + '...';
    }

    searchByTag(tag) {
        // Rediriger vers la page d'actualités avec filtre par tag
        window.location.href = `actualites.html?tag=${encodeURIComponent(tag)}`;
    }

    initializeEventListeners() {
        // Gestionnaire pour les liens de partage
        document.addEventListener('click', (e) => {
            if (e.target.closest('.share-btn')) {
                e.preventDefault();
                const link = e.target.closest('.share-btn');
                
                // Ouvrir dans une nouvelle fenêtre pour les réseaux sociaux
                if (link.href && !link.href.includes('mailto:')) {
                    window.open(link.href, '_blank', 'width=600,height=400,scrollbars=yes,resizable=yes');
                } else if (link.href.includes('mailto:')) {
                    window.location.href = link.href;
                }
            }
        });
        
        // Effet de progression de lecture
        this.setupReadingProgress();
        
        // Amélioration de l'accessibilité
        this.setupAccessibility();
    }

    setupReadingProgress() {
        // Créer une barre de progression de lecture
        const progressBar = document.createElement('div');
        progressBar.id = 'reading-progress';
        progressBar.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 0%;
            height: 3px;
            background: var(--primary-color);
            z-index: 1000;
            transition: width 0.1s ease;
        `;
        document.body.appendChild(progressBar);
        
        window.addEventListener('scroll', () => {
            const article = document.getElementById('main-content');
            if (!article) return;
            
            const articleTop = article.offsetTop;
            const articleHeight = article.offsetHeight;
            const windowHeight = window.innerHeight;
            const scrollTop = window.pageYOffset;
            
            const progress = Math.min(
                Math.max((scrollTop - articleTop + windowHeight) / articleHeight, 0),
                1
            ) * 100;
            
            progressBar.style.width = progress + '%';
        });
    }

    setupAccessibility() {
        // Améliorer l'accessibilité des liens de navigation
        const navLinks = document.querySelectorAll('.nav-btn');
        navLinks.forEach(link => {
            link.setAttribute('role', 'button');
            link.setAttribute('tabindex', '0');
        });
        
        // Support clavier pour les boutons de partage
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && e.target.classList.contains('share-btn')) {
                e.target.click();
            }
        });
    }

    // API publique
    static async create() {
        const engine = new BlogEngine();
        await engine.init();
        return engine;
    }

    getArticles() {
        return this.articles;
    }

    getArticleById(id) {
        return this.articles.find(a => a.id === id);
    }

    getArticlesByCategory(category) {
        return this.articles.filter(a => a.category === category);
    }
}

// Initialisation globale
window.BlogEngine = null;

// Créer l'instance du moteur de blog
document.addEventListener('DOMContentLoaded', async function() {
    try {
        window.BlogEngine = await BlogEngine.create();
        console.log('✅ Blog Engine prêt');
    } catch (error) {
        console.error('❌ Erreur d\'initialisation du Blog Engine:', error);
    }
});

// Export pour utilisation externe
if (typeof module !== 'undefined' && module.exports) {
    module.exports = BlogEngine;
}
