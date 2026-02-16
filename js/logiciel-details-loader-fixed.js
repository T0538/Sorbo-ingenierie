(() => {
  const root = document.getElementById('logiciel-details-root');
  if (!root) {
    return;
  }

  // --- DONNÉES DE SECOURS (FALLBACK) ---
  // Ces données sont utilisées si le chargement des fichiers JSON échoue (ex: en local sans serveur)
  const FALLBACK_DETAILS = {
    "oh-route-v1": {
      "sousTitre": "Logiciel pour l'assainissement et le drainage routier",
      "sections": [
        {
          "title": "Introduction",
          "icon": "fa-info-circle",
          "content": "<p>OH-Route v1.1 est un outil spécialisé pour les études hydrologiques et hydrauliques en génie routier. Développé pour répondre aux défis des infrastructures routières africaines, il s’adresse aux bureaux d’études, ingénieurs et techniciens, offrant une interface complète, intuitive et performante.</p><p>OH-Route v1 s’appuie sur une architecture modulaire avec deux parties complémentaires :</p><ul><li>Un module hydrologie pour l’analyse des apports en eau</li><li>Un module hydraulique pour le dimensionnement des ouvrages d’évacuation</li></ul><p>Cette organisation assure une continuité logique et une cohérence technique entre les phases du projet.</p>"
        },
        {
          "title": "Module hydrologie pour l’estimation des débits projets",
          "icon": "fa-water",
          "content": "<p>Ce module permet d’estimer les débits projets à partir de plusieurs bassins versants en utilisant des méthodes éprouvées et adaptées localement (Rationnelle, Caquot, ORSTOM, etc.). Il propose une saisie optimisée des données et un traitement des caractéristiques des bassins, permettant à l’utilisateur de se concentrer sur l’analyse technique et la prise de décision.</p><p>Le logiciel permet également de combiner ou regrouper plusieurs bassins/sous-bassins selon des principes hydrologiques clairs et fiables, permettant une modélisation rigoureuse de configurations complexes tout en réduisant significativement le temps d’étude.</p>"
        },
        {
          "title": "Module hydraulique pour le dimensionnement optimal des ouvrages",
          "icon": "fa-cogs",
          "content": "<p>Ce module prend en charge le dimensionnement hydraulique des ouvrages de drainage (ponceaux, dalots, canaux à ciel ouvert, fossés, etc.) une fois les débits déterminés. Il dispose d’un mode de calcul automatisé pour identifier rapidement les sections optimales en fonction des contraintes hydrauliques et des conditions d’exploitation attendues.</p><p>Cette capacité à générer rapidement des solutions adaptées constitue un atout majeur, notamment dans les phases d’avant-projet ou d’analyse de variantes techniques.</p>"
        },
        {
          "title": "Notes de calculs détaillées",
          "icon": "fa-file-alt",
          "content": "<p>OH-Route produit également une note de calcul synthétique et structurée, présentant clairement les hypothèses, résultats et conclusions de l’étude. Cette sortie est immédiatement utilisable dans les dossiers techniques et facilite la communication avec les maîtres d’ouvrage ou services compétents.</p>"
        }
      ],
      "images": [
        { "src": "images/Capture 1.png", "alt": "Interface OH-Route" },
        { "src": "images/Capture 2.png", "alt": "Module hydrologie" },
        { "src": "images/Capture 3.png", "alt": "Module hydraulique" }
      ],
      "downloadFile": "OH-Route v1.1.rar",
      "downloadLabel": "Télécharger OH-Route v1.1.rar (27 MB)",
      "ctaTitle": "Prêt à utiliser OH-Route v1.1 ?",
      "ctaText": "Téléchargez ce logiciel professionnel pour l'assainissement et le drainage routier"
    },
    "str-chaussee-v1": {
      "sousTitre": "Logiciel pour la conception et le dimensionnement des structures de chaussées",
      "sections": [
        {
          "title": "Introduction",
          "icon": "fa-info-circle",
          "content": "<p>Le logiciel Str-Chaussée v1.1 est un outil innovant dédié au dimensionnement des structures de chaussées routières neuves et aux solutions de renforcement, en s’appuyant sur la méthode rationnelle française ainsi que sur plusieurs guides techniques en vigueur. Il permet de calculer de manière précise les épaisseurs optimales des différentes couches de chaussée, en tenant compte des caractéristiques des matériaux, du trafic prévu, des conditions climatiques et des propriétés du sol support.</p><p>Conçu pour les ingénieurs, techniciens et bureaux d’études en génie civil, Str-Chaussée offre un environnement interactif et convivial, permettant de réaliser des études fiables et rapides, tout en générant automatiquement des notes de calculs détaillées ou synthétiques.</p>"
        },
        {
          "title": "Principales fonctionnalités",
          "icon": "fa-list-ul",
          "content": "<p>Str-Chaussée offre un large éventail de fonctionnalités :</p><ul><li>Gestion des données de trafic et de sol support ;</li><li>Sélection et caractérisation des matériaux (non traités, traités aux liants hydrauliques ou hydrocarbonés) ;</li><li>Calcul des contraintes et déformations dans les différentes couches de chaussée ;</li><li>Prédimensionnement des structures à l’aide de catalogues et guides techniques (Côte d’Ivoire, Sénégal, CEBTP, etc.) ;</li><li>Calcul et vérification automatique des structures ;</li><li>Génération automatique de notes de calcul détaillées et synthétiques.</li></ul>"
        },
        {
          "title": "Modes de calcul disponibles",
          "icon": "fa-calculator",
          "content": "<p>Str-Chaussée propose deux modes de calcul adaptés à tous les besoins :</p><ul><li><strong>Dimensionnement standard :</strong> ce mode permet de réaliser un dimensionnement classique, en laissant à l’utilisateur le soin de choisir la structure à vérifier et de définir les couches à analyser.</li><li><strong>Dimensionnement automatique :</strong> ce mode effectue, à partir des matériaux sélectionnés et des plages d’épaisseurs définies, des itérations automatiques afin de proposer des structures conformes, en intégrant l’ensemble des vérifications nécessaires.</li></ul>"
        },
        {
          "title": "Environnement de travail",
          "icon": "fa-desktop",
          "content": "<p>Str-Chaussée est conçu pour fonctionner sur un ordinateur Windows, avec une interface graphique intuitive. Il facilite la saisie interactive des données, la gestion des projets, et la production automatique de documents de synthèse, présentant clairement les hypothèses, résultats et conclusions de l’étude.</p><p>Cette sortie est immédiatement utilisable dans les dossiers techniques et facilite la communication avec les maîtres d’ouvrage ou services compétents.</p>"
        }
      ],
      "images": [],
      "downloadFile": "Str-Chaussée v1.rar",
      "downloadLabel": "Télécharger Str-Chaussée v1.1 (33 MB)",
      "ctaTitle": "Prêt à utiliser Str-Chaussée v1.1 ?",
      "ctaText": "Téléchargez ce logiciel pour la conception des structures de chaussées"
    }
  };

  const FALLBACK_LIST = [
    {
      "nom": "OH-Route v1",
      "description": "Logiciel pour la conception et le dimensionnement des ouvrages d'assainissement et de drainage routier.",
      "categorie": "Eau et Assainissement",
      "logo": "images/image1.png",
      "headerImage": "images/drainageroute.png",
      "disponible": true,
      "version": "1.0",
      "prix": 0
    },
    {
      "nom": "Str-Chaussée v1",
      "description": "Logiciel pour la conception et le dimensionnement des structures de chaussées",
      "categorie": "Infrastructures et transport",
      "logo": "images/geopavetotal.jpg.jpeg",
      "headerImage": "images/Image PDG Str-Chaussée.png",
      "disponible": true,
      "version": "1.0",
      "prix": 0
    }
  ];

  const params = new URLSearchParams(window.location.search);
  const idParam = params.get('id') || '';
  const nomParam = params.get('nom') || '';

  const normalize = (value) =>
    value
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');

  const matchesOhRoute = (value) => normalize(value).includes('oh-route');
  const matchesStrChaussee = (value) => normalize(value).includes('str-chaussee');

  const fetchJson = async (url) => {
    const response = await fetch(url, { cache: 'no-store' });
    if (!response.ok) {
      throw new Error(`Erreur chargement ${url}`);
    }
    return response.json();
  };

  const toHtml = (text) => (text && text.includes('<') ? text : `<p>${text}</p>`);

  const resolveKey = (detailsData) => {
    const candidates = [idParam, nomParam].filter(Boolean);
    for (const candidate of candidates) {
      const raw = candidate.toLowerCase();
      if (detailsData[raw]) {
        return raw;
      }
      const normalized = normalize(candidate);
      if (detailsData[normalized]) {
        return normalized;
      }
    }
    if (candidates.some(matchesOhRoute) && detailsData['oh-route-v1']) {
      return 'oh-route-v1';
    }
    if (candidates.some(matchesStrChaussee) && detailsData['str-chaussee-v1']) {
      return 'str-chaussee-v1';
    }
    return null;
  };

  const findBaseInfo = (list) => {
    if (!Array.isArray(list)) {
      return null;
    }
    const candidates = [nomParam, idParam].filter(Boolean);
    const normalizedCandidates = candidates.map(normalize);
    return (
      list.find((item) => normalizedCandidates.includes(normalize(item.nom || ''))) ||
      list.find((item) => candidates.some((c) => matchesOhRoute(c)) && matchesOhRoute(item.nom || '')) ||
      list.find((item) => candidates.some((c) => matchesStrChaussee(c)) && matchesStrChaussee(item.nom || '')) ||
      null
    );
  };

  const renderError = (message) => {
    root.innerHTML = `
      <div class="error">
        <i class="fas fa-exclamation-triangle"></i>
        <h3>Erreur de chargement</h3>
        <p>${message}</p>
      </div>
    `;
  };

  const bindImageModal = () => {
    const modal = document.getElementById('imageModal');
    const modalImage = document.getElementById('modalImage');
    const modalCaption = document.getElementById('modalCaption');
    const modalClose = document.getElementById('modalClose');

    if (!modal || !modalImage || !modalCaption || !modalClose) {
      return;
    }

    const openModal = (img) => {
      modalImage.src = img.src;
      modalCaption.textContent = img.alt || '';
      modal.classList.add('active');
      document.body.style.overflow = 'hidden';
    };

    root.querySelectorAll('.image-item').forEach((item) => {
      item.addEventListener('click', () => {
        const img = item.querySelector('img');
        if (img) {
          openModal(img);
        }
      });
      item.addEventListener('keydown', (event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          item.click();
        }
      });
    });

    const closeModal = () => {
      modal.classList.remove('active');
      document.body.style.overflow = '';
    };

    modalClose.addEventListener('click', closeModal);
    modal.addEventListener('click', (event) => {
      if (event.target === modal) {
        closeModal();
      }
    });
    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape' && modal.classList.contains('active')) {
        closeModal();
      }
    });
  };

  const bindDownload = () => {
    const button = root.querySelector('.btn-download-detail');
    if (!button) {
      return;
    }
    button.addEventListener('click', (event) => {
      event.preventDefault();
      const file = button.getAttribute('data-download');
      if (!file) {
        return;
      }
      const link = document.createElement('a');
      link.href = `downloads/${file}`;
      link.download = file;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    });
  };

  const renderDetails = (details, baseInfo, key) => {
    const fallbackNames = {
      'oh-route-v1': 'OH-Route v1.1',
      'str-chaussee-v1': 'Str-Chaussée v1.1'
    };

    const displayName = baseInfo?.nom || nomParam || fallbackNames[key] || 'Logiciel';
    const sousTitre = details?.sousTitre || '';
    const descriptionText = baseInfo?.description || '';
    const sections = Array.isArray(details?.sections) ? details.sections : [];
    const hasIntroFromDetails =
      !descriptionText && sections.length && (sections[0].title || '').toLowerCase() === 'introduction';
    const descriptionHtml = descriptionText
      ? toHtml(descriptionText)
      : hasIntroFromDetails
        ? sections[0].content || ''
        : '';
    const remainingSections =
      descriptionText || hasIntroFromDetails ? sections.slice(1) : sections;

    const headerImage = baseInfo?.headerImage || '';
    const logo = baseInfo?.logo || baseInfo?.image || '';

    const sectionHtml = remainingSections
      .map(
        (section) => `
          <div class="logiciel-section">
            <h3 class="section-title"><i class="fas ${section.icon || 'fa-circle'}"></i>${section.title || ''}</h3>
            <div class="logiciel-description">${section.content || ''}</div>
          </div>
        `
      )
      .join('');

    const metaItems = [];
    if (baseInfo?.version) {
      metaItems.push({ label: 'Version', value: baseInfo.version });
    }
    if (baseInfo?.categorie) {
      metaItems.push({ label: 'Catégorie', value: baseInfo.categorie });
    }
    if (typeof baseInfo?.prix !== 'undefined') {
      metaItems.push({
        label: 'Prix',
        value: Number(baseInfo.prix) === 0 ? 'Sur devis' : `${baseInfo.prix} FCFA`
      });
    }

    const metaHtml = metaItems.length
      ? `
        <div class="logiciel-meta">
          ${metaItems
            .map(
              (item) => `
                <div class="meta-item">
                  <div class="meta-icon"><i class="fas fa-tag"></i></div>
                  <div class="meta-label">${item.label}</div>
                  <div class="meta-value">${item.value}</div>
                </div>
              `
            )
            .join('')}
        </div>
      `
      : '';

    const images = Array.isArray(details?.images) ? details.images : [];
    const imagesHtml = images.length
      ? `
        <div class="image-gallery">
          <h3 class="section-title"><i class="fas fa-images"></i>Captures d'écran</h3>
          <div class="image-grid">
            ${images
              .map(
                (img) => `
                  <div class="image-item" tabindex="0">
                    <img src="${img.src}" alt="${img.alt || displayName}">
                    <div class="image-overlay"><i class="fas fa-search-plus"></i></div>
                  </div>
                `
              )
              .join('')}
          </div>
        </div>
      `
      : '';

    const downloadFile = details?.downloadFile || '';
    const downloadLabel = details?.downloadLabel || 'Télécharger';
    const ctaTitle = details?.ctaTitle || 'Prêt à utiliser ce logiciel ?';
    const ctaText = details?.ctaText || '';

    const actionsHtml = downloadFile
      ? `
        <div class="logiciel-actions">
          <h3>${ctaTitle}</h3>
          <p>${ctaText}</p>
          <div class="action-buttons">
            <a href="#" class="btn-action btn-download-detail" data-download="${downloadFile}">
              <i class="fas fa-download"></i>
              ${downloadLabel}
            </a>
            <a href="nos-logiciels.html" class="btn-action secondary">
              <i class="fas fa-arrow-left"></i>
              Retour à la liste
            </a>
          </div>
        </div>
      `
      : '';

    const headerStyle = headerImage
      ? `style="background-image: linear-gradient(135deg, rgba(209,0,0,0.85) 0%, rgba(179,0,0,0.85) 100%), url('${headerImage}'); background-size: cover; background-position: center;"`
      : '';

    root.innerHTML = `
      <div class="logiciel-header" ${headerStyle}>
        <div class="logiciel-header-content">
          <div class="logiciel-logo">
            ${logo ? `<img src="${logo}" alt="Logo ${displayName}">` : ''}
          </div>
          <div class="logiciel-title-section">
            <h2>${displayName}</h2>
            <p class="logiciel-subtitle">${sousTitre}</p>
          </div>
        </div>
      </div>
      <div class="logiciel-body">
        ${
          descriptionHtml
            ? `
              <div class="logiciel-section">
                <h3 class="section-title"><i class="fas fa-info-circle"></i>Description</h3>
                <div class="logiciel-description">${descriptionHtml}</div>
              </div>
            `
            : ''
        }
        ${sectionHtml}
        ${metaHtml}
        ${imagesHtml}
        ${actionsHtml}
      </div>
    `;

    document.title = `Détails du Logiciel | ${displayName}`;
    bindImageModal();
    bindDownload();
  };

  const loadDetails = async () => {
    let detailsData, baseList;
    try {
      // Tentative de chargement via fetch (fonctionne sur serveur)
      [detailsData, baseList] = await Promise.all([
        fetchJson('data/logiciel-details.json'),
        fetchJson('GESTION_LOGICIELS.json')
      ]);
    } catch (error) {
      console.warn('Erreur de chargement (fetch), utilisation des données de secours (fallback):', error);
      // Utilisation des données de secours si fetch échoue (ex: local file://)
      detailsData = FALLBACK_DETAILS;
      baseList = FALLBACK_LIST;
    }

    const key = resolveKey(detailsData);
    if (!key || !detailsData[key]) {
      // Si aucune clé trouvée, on affiche quand même quelque chose si on a l'info de base
      const baseInfo = findBaseInfo(baseList);
      if (baseInfo) {
          // Si on a l'info de base mais pas les détails, on affiche une page générique
          renderDetails({}, baseInfo, key || 'unknown');
          return;
      }
      renderError('Aucun détail trouvé pour ce logiciel. Vérifiez l\'URL.');
      return;
    }

    const baseInfo = findBaseInfo(baseList);
    renderDetails(detailsData[key], baseInfo, key);
  };

  loadDetails();
})();
