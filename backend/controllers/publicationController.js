const Publication = require('../models/Publication');

// @desc    Récupérer les publications publiées (avec limite optionnelle)
// @route   GET /api/publications
// @access  Public
exports.getPublications = async (req, res) => {
  try {
    const limitParam = parseInt(req.query.limit, 10);
    const limit = Number.isFinite(limitParam) ? Math.min(Math.max(limitParam, 1), 100) : 50;
    const categorie = req.query.categorie;

    let query = { statut: 'publie' };
    if (categorie) {
      query.categorie = categorie;
    }

    const publications = await Publication.find(query)
      .sort({ datePublication: -1, createdAt: -1 })
      .limit(limit)
      .lean();

    return res.status(200).json({ success: true, data: publications });
  } catch (error) {
    console.error('Erreur lors du chargement des publications:', error);
    return res.status(200).json({ success: true, data: [], error: error.message });
  }
};

// @desc    Récupérer une publication par ID
// @route   GET /api/publications/:id
// @access  Public
exports.getPublicationById = async (req, res) => {
  try {
    const { id } = req.params;
    const publication = await Publication.findById(id);
    if (!publication) {
      return res.status(404).json({ success: false, message: 'Publication introuvable' });
    }
    return res.status(200).json({ success: true, data: publication });
  } catch (error) {
    console.error("Erreur lors du chargement de la publication:", error);
    return res.status(500).json({ success: false, message: 'Erreur serveur' });
  }
};

// @desc    Incrémenter le compteur de téléchargements
// @route   PUT /api/publications/:id/telecharger
// @access  Public
exports.incrementTelechargements = async (req, res) => {
  try {
    const { id } = req.params;
    const publication = await Publication.findByIdAndUpdate(
      id,
      { $inc: { telechargements: 1 } },
      { new: true }
    );
    if (!publication) {
      return res.status(404).json({ success: false, message: 'Publication introuvable' });
    }
    return res.status(200).json({ success: true, data: publication });
  } catch (error) {
    console.error("Erreur lors de l'incrémentation des téléchargements:", error);
    return res.status(500).json({ success: false, message: 'Erreur serveur' });
  }
};

// @desc    Créer une nouvelle publication
// @route   POST /api/publications
// @access  Private (Admin)
exports.createPublication = async (req, res) => {
  try {
    const payload = { ...req.body };
    delete payload._id;
    delete payload.id;

    const publication = new Publication(payload);
    await publication.save();

    return res.status(201).json({ success: true, data: publication });
  } catch (error) {
    console.error("Erreur lors de la création de la publication:", error);
    return res.status(500).json({ success: false, message: 'Erreur serveur' });
  }
};

// @desc    Mettre à jour une publication
// @route   PUT /api/publications/:id
// @access  Private (Admin)
exports.updatePublication = async (req, res) => {
  try {
    const { id } = req.params;
    const payload = { ...req.body };
    delete payload._id;
    delete payload.id;

    const publication = await Publication.findByIdAndUpdate(id, payload, {
      new: true,
      runValidators: true,
    });

    if (!publication) {
      return res.status(404).json({ success: false, message: 'Publication introuvable' });
    }

    return res.status(200).json({ success: true, data: publication });
  } catch (error) {
    console.error("Erreur lors de la mise à jour de la publication:", error);
    return res.status(500).json({ success: false, message: 'Erreur serveur' });
  }
};

// @desc    Supprimer une publication
// @route   DELETE /api/publications/:id
// @access  Private (Admin)
exports.deletePublication = async (req, res) => {
  try {
    const { id } = req.params;
    const publication = await Publication.findByIdAndDelete(id);

    if (!publication) {
      return res.status(404).json({ success: false, message: 'Publication introuvable' });
    }

    return res.status(200).json({ success: true, message: 'Publication supprimée avec succès' });
  } catch (error) {
    console.error("Erreur lors de la suppression de la publication:", error);
    return res.status(500).json({ success: false, message: 'Erreur serveur' });
  }
};
