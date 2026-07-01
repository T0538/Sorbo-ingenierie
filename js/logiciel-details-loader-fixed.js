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
          "content": "<p>OH-Route v1.2 est un outil spécialisé pour les études hydrologiques et hydrauliques en génie routier. Développé pour répondre aux défis des infrastructures routières africaines, il s’adresse aux bureaux d’études, ingénieurs et techniciens, offrant une interface complète, intuitive et performante.</p><p>OH-Route v1 s’appuie sur une architecture modulaire avec deux parties complémentaires :</p><ul><li>Un module hydrologie pour l’analyse des apports en eau</li><li>Un module hydraulique pour le dimensionnement des ouvrages d’évacuation</li></ul><p>Cette organisation assure une continuité logique et une cohérence technique entre les phases du projet.</p>"
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
      "downloadLabel": "Télécharger OH-Route v1.2.rar (27 MB)",
      "ctaTitle": "Prêt à utiliser OH-Route v1.2 ?",
      "ctaText": "Téléchargez ce logiciel professionnel pour l'assainissement et le drainage routier"
    },
    "str-chaussee-v1": {
      "sousTitre": "Logiciel de dimensionnement et de diagnostic des structures de chaussées",
      "sections": [
        {
          "title": "Présentation",
          "icon": "fa-info-circle",
          "content": "<p>STR-Chaussée est une solution logicielle développée par Sorbo-Ingénierie pour le dimensionnement des structures de chaussées neuves, l'étude des solutions de renforcement et le diagnostic des chaussées existantes.</p><p>Conçu pour répondre aux réalités des pays africains, le logiciel s'appuie sur une approche conforme à la méthode rationnelle française et intègre les principaux référentiels techniques nationaux et internationaux.</p>"
        },
        {
          "title": "Référentiels techniques intégrés",
          "icon": "fa-book",
          "content": "<ul><li>Norme NF P 98-086 (mai 2019)</li><li>Catalogue de dimensionnement des chaussées de Côte d'Ivoire (avril 2024)</li><li>Catalogue de dimensionnement des chaussées du Sénégal (juin 2015)</li><li>Guide pour le renforcement des chaussées IDDRIM-CEREMA (mai 2016)</li><li>Autres guides et référentiels techniques applicables</li></ul>"
        },
        {
          "title": "Module « Chaussées Routières »",
          "icon": "fa-road",
          "content": "<p>Ce module est dédié à la conception et au dimensionnement des structures de chaussées neuves et des solutions de renforcement. Il propose deux modes de calcul complémentaires.</p><h4>Dimensionnement standard</h4><p>Ce mode permet de réaliser les études de manière classique tout en conservant un contrôle total sur les choix techniques. L'utilisateur définit la structure à analyser, sélectionne les matériaux et paramètre librement les différentes couches de chaussée pour une approche maîtrisée et conforme aux pratiques d'ingénierie.</p><p>Le module intègre également :</p><ul><li>Des fiches de structures types pour le prédimensionnement</li><li>Une bibliothèque de matériaux</li><li>Un assistant de conception guidée permettant de proposer des configurations optimisées en fonction du trafic, des matériaux disponibles et des référentiels techniques en vigueur</li></ul><p>Cette approche permet de sécuriser les choix de conception, de réduire les incertitudes et d'optimiser les coûts de réalisation.</p>"
        },
        {
          "title": "Dimensionnement automatique",
          "icon": "fa-cogs",
          "content": "<p>Le mode automatique repose sur un moteur de recherche intelligent de solutions. À partir des matériaux sélectionnés et des plages d'épaisseurs définies, STR-Chaussée explore automatiquement différentes combinaisons de structures et propose des solutions optimisées et conformes aux exigences mécaniques et réglementaires.</p><p>Cette fonctionnalité permet de réduire considérablement le temps d'étude tout en garantissant des conceptions fiables et économiquement pertinentes.</p>"
        },
        {
          "title": "Analyse de l'agressivité du trafic",
          "icon": "fa-truck",
          "content": "<p>Le module « Chaussées Routières » intègre également un outil d'analyse du trafic permettant de convertir les flux de poids lourds en trafic équivalent en nombre d'essieux et d'évaluer :</p><ul><li>L'agressivité par essieu</li><li>La détection des essieux en surcharge</li><li>La répartition des charges</li><li>La dispersion des charges par essieu et par poids lourd</li></ul><p>Ces analyses constituent une aide précieuse pour une meilleure prise en compte de l'impact réel du trafic sur le comportement des chaussées.</p>"
        },
        {
          "title": "Module « Diagnostic des Chaussées »",
          "icon": "fa-search",
          "content": "<p>Le second module est consacré au diagnostic des chaussées existantes. Il permet l'analyse et le traitement des données de déflexion afin d'identifier les zones homogènes optimales nécessaires à la caractérisation des performances résiduelles des structures de chaussées.</p><p>Le module offre notamment les fonctionnalités suivantes :</p><ul><li>Traitement statistique des données de déflexion</li><li>Détermination automatique des déflexions caractéristiques</li><li>Identification et délimitation des zones homogènes</li><li>Évaluation de l'état structurel des chaussées existantes</li><li>Assistance au diagnostic et à la définition des solutions de renforcement adaptées</li></ul><p>Grâce à son approche intégrée, STR-Chaussée constitue un outil complet d'aide à la décision pour les ingénieurs, bureaux d'études, administrations routières et entreprises de travaux publics, en offrant des solutions performantes et adaptées aux réalités des infrastructures routières africaines.</p>"
        }
      ],
      "images": [
        { "src": "images/Cap1.png", "alt": "Interface STR-Chaussée" },
        { "src": "images/Cap4.png", "alt": "Chaussée routière" },
        { "src": "images/Cap5.png", "alt": "Hypothèse de calculs" }
      ],
      "downloadFile": "STR-Chaussée v2.1.rar",
      "downloadLabel": "Télécharger STR-Chaussée v2.1 (33 MB)",
      "ctaTitle": "Prêt à utiliser STR-Chaussée v2.1 ?",
      "ctaText": "Téléchargez cette solution complète de dimensionnement et diagnostic de chaussées"
    }
  };

  const FALLBACK_LIST = [
    {
      "nom": "OH-Route v1.2",
      "description": "Logiciel pour la conception et le dimensionnement des ouvrages d'assainissement et de drainage routier.",
      "categorie": "Eau et Assainissement",
      "logo": "images/image1.png",
      "headerImage": "images/drainageroute.png",
      "disponible": true,
      "version": "1.0",
      "prix": 0
    },
    {
      "nom": "STR-Chaussée v2.1",
      "description": "Logiciel de dimensionnement et de diagnostic des structures de chaussées",
      "categorie": "Infrastructures et transport",
      "logo": "images/geopavetotal.jpg.jpg",
      "headerImage": "images/Image PDG Str-Chaussée (2).png",
      "disponible": true,
      "version": "2.1",
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
      'oh-route-v1': 'OH-Route v1.2',
      'str-chaussee-v1': 'Str-Chaussée v2.1'
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
