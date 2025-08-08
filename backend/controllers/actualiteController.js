const Actualite = require('../models/Actualite');

// @desc    Récupérer les actualités publiées (avec limite optionnelle)
// @route   GET /api/actualites
// @access  Public
exports.getActualites = async (req, res) => {
  try {
    const limit = Math.min(parseInt(req.query.limit, 10) || 50, 100);

    const actualites = await Actualite.find({ statut: 'publie' })
      .sort({ datePublication: -1, createdAt: -1 })
      .limit(limit);

    return res.status(200).json({ success: true, data: actualites });
  } catch (error) {
    console.error('Erreur lors du chargement des actualités:', error);
    return res.status(500).json({ success: false, message: 'Erreur serveur' });
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
    console.error('Erreur lors du chargement de l\'actualité:', error);
    return res.status(500).json({ success: false, message: 'Erreur serveur' });
  }
};

const Actualite = require('../models/Actualite');

// GET /api/actualites
// Récupère les actualités publiées, optionnellement limitées
exports.getActualites = async (req, res) => {
  try {
    const limit = req.query.limit ? parseInt(req.query.limit, 10) : undefined;

    const query = Actualite.find({ statut: 'publie' })
      .sort({ datePublication: -1 });

    if (!Number.isNaN(limit) && limit > 0) {
      query.limit(limit);
    }

    const actualites = await query.exec();

    return res.status(200).json({ success: true, data: actualites });
  } catch (error) {
    console.error('Erreur lors de la récupération des actualités:', error);
    return res.status(500).json({ success: false, message: 'Erreur serveur' });
  }
};

// POST /api/actualites
// Crée une nouvelle actualité
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
    console.error('Erreur lors de la création de l\'actualité:', error);
    return res.status(500).json({ success: false, message: 'Erreur serveur' });
  }
};


