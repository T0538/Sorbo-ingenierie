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
          "content": "<p>OH-Route v1 est un outil specialise pour les etudes hydrologiques et hydrauliques en genie routier. Developpe pour repondre aux defis des infrastructures routieres africaines.</p><p>OH-Route v1 s'appuie sur une architecture modulaire : un module hydrologie et un module hydraulique.</p>"
        },
        {
          "title": "Module hydrologie",
          "icon": "fa-water",
          "content": "<p>Ce module permet d'estimer les debits projets a partir de plusieurs bassins versants (Rationnelle, Caquot, ORSTOM, etc.).</p>"
        },
        {
          "title": "Module hydraulique",
          "icon": "fa-cogs",
          "content": "<p>Dimensionnement hydraulique des ouvrages de drainage : ponceaux, dalots, canaux, fosses.</p>"
        },
        {
          "title": "Notes de calculs",
          "icon": "fa-file-alt",
          "content": "<p>OH-Route produit une note de calcul synthetique utilisable dans les dossiers techniques.</p>"
        }
      ],
      "images": [
        { "src": "images/Capture 1.png", "alt": "Interface OH-Route" },
        { "src": "images/Capture 2.png", "alt": "Module hydrologie" },
        { "src": "images/Capture 3.png", "alt": "Module hydraulique" }
      ],
      "downloadFile": "OH-Route v1.1.rar",
      "downloadLabel": "Telecharger OH-Route v1.1.rar (27 MB)",
      "ctaTitle": "Pret a utiliser OH-Route v1 ?",
      "ctaText": "Telechargez ce logiciel professionnel pour l'assainissement et le drainage routier"
    },
    "str-chaussee-v1": {
      "sousTitre": "Logiciel pour la conception et le dimensionnement des structures de chaussees",
      "sections": [
        {
          "title": "Introduction",
          "icon": "fa-info-circle",
          "content": "<p>Str-Chaussee v1 est un logiciel dedie a la conception et au dimensionnement des structures de chaussees. Il s'adresse aux bureaux d'etudes et ingenieurs en genie civil.</p>"
        },
        {
          "title": "Fonctionnalites principales",
          "icon": "fa-cogs",
          "content": "<p>Dimensionnement des chaussees en fonction du trafic, des materiaux et des contraintes techniques.</p>"
        }
      ],
      "images": [],
      "downloadFile": "Str-Chaussee v1.rar",
      "downloadLabel": "Telecharger Str-Chaussee v1",
      "ctaTitle": "Pret a utiliser Str-Chaussee v1 ?",
      "ctaText": "Telechargez ce logiciel pour la conception des structures de chaussees"
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
      "categorie": "Infrastructures et Transports",
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
      'oh-route-v1': 'OH-Route v1',
      'str-chaussee-v1': 'Str-Chaussée v1'
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
        value: Number(baseInfo.prix) === 0 ? 'Gratuit' : `${baseInfo.prix} FCFA`
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
