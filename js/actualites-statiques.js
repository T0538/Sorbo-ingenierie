/**
 * Système d'actualités statiques pour remplacer temporairement l'API MongoDB
 * Ce script peut être facilement converti pour utiliser MongoDB quand l'API sera prête
 */

class ActualitesStatiques {
  constructor() {
    this.actualites = [
      {
        id: 'formation-autocad-2025',
        title: 'Nouvelle formation AutoCAD 2025 disponible',
        titre: 'Nouvelle formation AutoCAD 2025 disponible',
        slug: 'formation-autocad-2025',
        resume: 'Découvrez les nouvelles fonctionnalités d\'AutoCAD 2025 dans notre formation mise à jour. Inscription ouverte.',
        content: 'Sorbo-Ingénierie est fier d\'annoncer le lancement de sa nouvelle formation AutoCAD 2025. Cette formation intègre toutes les dernières fonctionnalités du logiciel, notamment les nouveaux outils de modélisation 3D, l\'intelligence artificielle intégrée et les améliorations d\'interface.',
        datePublication: '2024-12-20T10:00:00.000Z',
        date: '2024-12-20T10:00:00.000Z',
        auteur: 'Alexis KOFFI',
        categorie: 'Formation',
        tags: ['AutoCAD', 'Formation', '2025', 'CAO'],
        image: '/images/actualites/autocad-2025.jpg',
        imageAlt: 'Formation AutoCAD 2025',
        publié: true,
        featured: true
      },
      {
        id: 'prix-excellence-2024',
        title: 'Sorbo-Ingénierie remporte le prix d\'excellence 2024',
        titre: 'Sorbo-Ingénierie remporte le prix d\'excellence 2024',
        slug: 'prix-excellence-2024',
        resume: 'Notre entreprise a été récompensée pour ses innovations dans le domaine de l\'ingénierie civile en Afrique de l\'Ouest.',
        content: 'C\'est avec une immense fierté que Sorbo-Ingénierie annonce avoir remporté le Prix d\'Excellence 2024 de l\'Association des Ingénieurs d\'Afrique de l\'Ouest. Cette distinction reconnaît notre engagement constant envers l\'innovation et la qualité dans nos projets d\'ingénierie.',
        datePublication: '2024-12-18T14:30:00.000Z',
        date: '2024-12-18T14:30:00.000Z',
        auteur: 'Direction Générale',
        categorie: 'Entreprise',
        tags: ['Prix', 'Excellence', 'Innovation', 'Reconnaissance'],
        image: '/images/actualites/prix-excellence.jpg',
        imageAlt: 'Prix d\'excellence 2024',
        publié: true,
        featured: true
      },
      {
        id: 'oh-route-v1-1',
        title: 'Nouveau logiciel de calcul de structures OH-Route v1.1',
        titre: 'Nouveau logiciel de calcul de structures OH-Route v1.1',
        slug: 'oh-route-v1-1',
        resume: 'Lancement de la version 1.1 de notre logiciel OH-Route avec de nouvelles fonctionnalités de calcul hydraulique avancé.',
        content: 'Sorbo-Ingénierie présente OH-Route v1.1, la nouvelle version de notre logiciel spécialisé dans le calcul hydraulique et la conception d\'ouvrages routiers. Cette mise à jour majeure apporte de nombreuses améliorations demandées par nos utilisateurs.',
        datePublication: '2024-12-15T09:15:00.000Z',
        date: '2024-12-15T09:15:00.000Z',
        auteur: 'Équipe Développement',
        categorie: 'Logiciels',
        tags: ['OH-Route', 'Logiciel', 'Hydraulique', 'v1.1'],
        image: '/images/actualites/oh-route-v1-1.jpg',
        imageAlt: 'OH-Route v1.1',
        publié: true,
        featured: false
      },
      {
        id: 'projet-grand-bassam',
        title: 'Nouveau projet de lotissement à Grand-Bassam',
        titre: 'Nouveau projet de lotissement à Grand-Bassam',
        slug: 'projet-grand-bassam',
        resume: 'Sorbo-Ingénierie lance les études topographiques d\'un projet de lotissement de 200 ha à Grand-Bassam.',
        content: 'Sorbo-Ingénierie a été sélectionnée pour réaliser les études topographiques et d\'aménagement d\'un important projet de lotissement à Grand-Bassam. Ce projet de 200 hectares représente un défi technique majeur et contribuera au développement urbain de la région.',
        datePublication: '2024-12-12T16:45:00.000Z',
        date: '2024-12-12T16:45:00.000Z',
        auteur: 'Service Projets',
        categorie: 'Projets',
        tags: ['Lotissement', 'Grand-Bassam', 'Topographie', 'Aménagement'],
        image: '/images/actualites/grand-bassam.jpg',
        imageAlt: 'Projet Grand-Bassam',
        publié: true,
        featured: false
      },
      {
        id: 'recrutement-2024',
        title: 'Recrutement : Ingénieurs et Topographes',
        titre: 'Recrutement : Ingénieurs et Topographes',
        slug: 'recrutement-2024',
        resume: 'Sorbo-Ingénierie recrute des ingénieurs génie civil et des topographes pour renforcer ses équipes en 2025.',
        content: 'Dans le cadre de son expansion, Sorbo-Ingénierie recrute plusieurs profils pour renforcer ses équipes techniques. Nous recherchons des professionnels motivés et compétents pour contribuer à nos projets d\'envergure.',
        datePublication: '2024-12-10T11:20:00.000Z',
        date: '2024-12-10T11:20:00.000Z',
        auteur: 'Ressources Humaines',
        categorie: 'Emploi',
        tags: ['Recrutement', 'Emploi', 'Ingénieur', 'Topographe'],
        image: '/images/actualites/recrutement-2024.jpg',
        imageAlt: 'Recrutement 2024',
        publié: true,
        featured: false
      }
    ];
  }

  // Récupérer les actualités récentes (pour la page d'accueil)
  getLatestActualites(limit = 3) {
    return this.actualites
      .filter(actualite => actualite.publié)
      .sort((a, b) => new Date(b.datePublication) - new Date(a.datePublication))
      .slice(0, limit);
  }

  // Récupérer toutes les actualités (pour la page actualités)
  getAllActualites() {
    return this.actualites
      .filter(actualite => actualite.publié)
      .sort((a, b) => new Date(b.datePublication) - new Date(a.datePublication));
  }

  // Récupérer une actualité par son slug
  getActualiteBySlug(slug) {
    return this.actualites.find(actualite => actualite.slug === slug && actualite.publié);
  }

  // Récupérer les actualités en vedette
  getFeaturedActualites() {
    return this.actualites
      .filter(actualite => actualite.publié && actualite.featured)
      .sort((a, b) => new Date(b.datePublication) - new Date(a.datePublication));
  }

  // Formater la date pour l'affichage
  formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }

  // Afficher les actualités récentes sur la page d'accueil
  displayLatestActualites() {
    const container = document.getElementById('latest-actualites');
    if (!container) {
      console.error('❌ Conteneur latest-actualites non trouvé');
      return;
    }

    const actualites = this.getLatestActualites(3);
    console.log(`📰 ${actualites.length} actualités récentes chargées`);

    if (actualites.length === 0) {
      container.innerHTML = '<p class="no-data">Aucune actualité récente.</p>';
      return;
    }

    container.innerHTML = actualites.map(actualite => `
      <div class="news-card" data-aos="fade-up" data-aos-delay="100">
        <div class="news-image">
          <img src="${actualite.image || '/images/actualites/default.jpg'}" alt="${actualite.imageAlt || actualite.title}" loading="lazy">
        </div>
        <div class="news-content">
          <span class="date">${this.formatDate(actualite.datePublication)}</span>
          <h3>${actualite.title}</h3>
          <p>${actualite.resume}</p>
          <a href="/actualites.html#${actualite.slug}" class="text-btn">Lire la suite</a>
        </div>
      </div>
    `).join('');
  }

  // Afficher toutes les actualités sur la page actualités
  displayAllActualites() {
    const container = document.getElementById('actualites-container');
    if (!container) {
      console.error('❌ Conteneur actualites-container non trouvé');
      return;
    }

    const actualites = this.getAllActualites();
    console.log(`📰 ${actualites.length} actualités chargées pour la page actualités`);

    if (actualites.length === 0) {
      container.innerHTML = '<p class="no-data">Aucune actualité disponible.</p>';
      return;
    }

    container.innerHTML = actualites.map(actualite => `
      <article class="actualite-card" data-aos="fade-up">
        <div class="actualite-image">
          <img src="${actualite.image || '/images/actualites/default.jpg'}" alt="${actualite.imageAlt || actualite.title}" loading="lazy">
        </div>
        <div class="actualite-content">
          <div class="actualite-meta">
            <span class="actualite-date">${this.formatDate(actualite.datePublication)}</span>
            <span class="actualite-categorie">${actualite.categorie}</span>
          </div>
          <h2 class="actualite-title">${actualite.title}</h2>
          <p class="actualite-resume">${actualite.resume}</p>
          <div class="actualite-tags">
            ${actualite.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
          </div>
          <a href="#${actualite.slug}" class="actualite-lien">Lire l'article complet</a>
        </div>
      </article>
    `).join('');
  }
}

// Instance globale
const actualitesManager = new ActualitesStatiques();

// Auto-chargement selon la page
document.addEventListener('DOMContentLoaded', function() {
  // Page d'accueil
  if (document.getElementById('latest-actualites')) {
    console.log('🏠 Chargement des actualités pour la page d\'accueil');
    actualitesManager.displayLatestActualites();
  }
  
  // Page actualités
  if (document.getElementById('actualites-container')) {
    console.log('📰 Chargement des actualités pour la page actualités');
    actualitesManager.displayAllActualites();
  }
});
