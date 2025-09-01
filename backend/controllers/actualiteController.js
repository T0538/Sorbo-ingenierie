const Actualite = require('../models/Actualite');

// @desc    Récupérer les actualités publiées (avec limite optionnelle)
// @route   GET /api/actualites
// @access  Public
exports.getActualites = async (req, res) => {
  try {
    const limitParam = parseInt(req.query.limit, 10);
    const limit = Number.isFinite(limitParam) ? Math.min(Math.max(limitParam, 1), 100) : 50;

    const actualites = await Actualite.find({ statut: 'publie' })
      .sort({ datePublication: -1, createdAt: -1 })
      .limit(limit)
      .lean();

    return res.status(200).json({ success: true, data: actualites });
  } catch (error) {
    console.error('Erreur lors du chargement des actualités:', error);
    // Pour éviter de casser la page en production, renvoyer un tableau vide
    return res.status(200).json({ success: true, data: [], error: error.message });
  }
};

// @desc    Récupérer une actualité par slug
// @route   GET /api/actualites/:slug
// @access  Public
exports.getActualiteBySlug = async (req, res) => {
  try {
    const { slug } = req.params;
    const actualite = await Actualite.findOne({ slug, statut: 'publie' });
    if (!actualite) {
      return res.status(404).json({ success: false, message: 'Actualité introuvable' });
    }
    return res.status(200).json({ success: true, data: actualite });
  } catch (error) {
    console.error("Erreur lors du chargement de l'actualité:", error);
    return res.status(500).json({ success: false, message: 'Erreur serveur' });
  }
};

// @desc    Créer une nouvelle actualité
// @route   POST /api/actualites
// @access  Private (Admin)
exports.createActualite = async (req, res) => {
  try {
    const payload = { ...req.body };
    delete payload._id;
    delete payload.id;
    delete payload.slug;

    const actualite = new Actualite(payload);
    await actualite.save();

    return res.status(201).json({ success: true, data: actualite });
  } catch (error) {
    console.error("Erreur lors de la création de l'actualité:", error);
    return res.status(500).json({ success: false, message: 'Erreur serveur' });
  }
};

// @desc    Mettre à jour une actualité
// @route   PUT /api/actualites/:id
// @access  Private (Admin)
exports.updateActualite = async (req, res) => {
  try {
    const { id } = req.params;
    const payload = { ...req.body };
    delete payload._id;
    delete payload.id;

    const actualite = await Actualite.findByIdAndUpdate(id, payload, {
      new: true,
      runValidators: true,
    });

    if (!actualite) {
      return res.status(404).json({ success: false, message: 'Actualité introuvable' });
    }

    return res.status(200).json({ success: true, data: actualite });
  } catch (error) {
    console.error("Erreur lors de la mise à jour de l'actualité:", error);
    return res.status(500).json({ success: false, message: 'Erreur serveur' });
  }
};

// @desc    Supprimer une actualité
// @route   DELETE /api/actualites/:id
// @access  Private (Admin)
exports.deleteActualite = async (req, res) => {
  try {
    const { id } = req.params;
    const actualite = await Actualite.findByIdAndDelete(id);

    if (!actualite) {
      return res.status(404).json({ success: false, message: 'Actualité introuvable' });
    }

    return res.status(200).json({ success: true, message: 'Actualité supprimée avec succès' });
  } catch (error) {
    console.error("Erreur lors de la suppression de l'actualité:", error);
    return res.status(500).json({ success: false, message: 'Erreur serveur' });
  }
};

