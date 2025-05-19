const Logiciel = require('../models/Logiciel');
const mongoose = require('mongoose');

// @desc    Obtenir tous les logiciels
// @route   GET /api/logiciels
// @access  Public
exports.getLogiciels = async (req, res) => {
  try {
    const { categorie, featured, limit = 10, page = 1 } = req.query;
    
    const query = {};
    
    if (categorie) query.categorie = categorie;
    if (featured === 'true') query.featured = true;
    
    const logiciels = await Logiciel.find(query)
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .skip((parseInt(page) - 1) * parseInt(limit));
      
    const total = await Logiciel.countDocuments(query);
    
    res.status(200).json({
      success: true,
      count: logiciels.length,
      total,
      totalPages: Math.ceil(total / parseInt(limit)),
      currentPage: parseInt(page),
      data: logiciels
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération des logiciels',
      error: error.message
    });
  }
};

// @desc    Obtenir un logiciel par son ID
// @route   GET /api/logiciels/:id
// @access  Public
exports.getLogicielById = async (req, res) => {
  try {
    const logiciel = await Logiciel.findById(req.params.id);
    
    if (!logiciel) {
      return res.status(404).json({
        success: false,
        message: 'Logiciel non trouvé'
      });
    }
    
    res.status(200).json({
      success: true,
      data: logiciel
    });
  } catch (error) {
    console.error(error);
    if (error.kind === 'ObjectId') {
      return res.status(404).json({
        success: false,
        message: 'Logiciel non trouvé'
      });
    }
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération du logiciel',
      error: error.message
    });
  }
};

// @desc    Obtenir un logiciel par son slug
// @route   GET /api/logiciels/slug/:slug
// @access  Public
exports.getLogicielBySlug = async (req, res) => {
  try {
    const logiciel = await Logiciel.findOne({ slug: req.params.slug });
    
    if (!logiciel) {
      return res.status(404).json({
        success: false,
        message: 'Logiciel non trouvé'
      });
    }
    
    res.status(200).json({
      success: true,
      data: logiciel
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération du logiciel',
      error: error.message
    });
  }
};

// @desc    Créer un nouveau logiciel
// @route   POST /api/logiciels
// @access  Private/Admin
exports.createLogiciel = async (req, res) => {
  try {
    const logiciel = new Logiciel(req.body);
    await logiciel.save();
    
    res.status(201).json({
      success: true,
      message: 'Logiciel créé avec succès',
      data: logiciel
    });
  } catch (error) {
    console.error(error);
    res.status(400).json({
      success: false,
      message: 'Erreur lors de la création du logiciel',
      error: error.message
    });
  }
};

// @desc    Mettre à jour un logiciel
// @route   PUT /api/logiciels/:id
// @access  Private/Admin
exports.updateLogiciel = async (req, res) => {
  try {
    const logiciel = await Logiciel.findByIdAndUpdate(
      req.params.id, 
      req.body, 
      { new: true, runValidators: true }
    );
    
    if (!logiciel) {
      return res.status(404).json({
        success: false,
        message: 'Logiciel non trouvé'
      });
    }
    
    res.status(200).json({
      success: true,
      message: 'Logiciel mis à jour avec succès',
      data: logiciel
    });
  } catch (error) {
    console.error(error);
    if (error.kind === 'ObjectId') {
      return res.status(404).json({
        success: false,
        message: 'Logiciel non trouvé'
      });
    }
    res.status(400).json({
      success: false,
      message: 'Erreur lors de la mise à jour du logiciel',
      error: error.message
    });
  }
};

// @desc    Supprimer un logiciel
// @route   DELETE /api/logiciels/:id
// @access  Private/Admin
exports.deleteLogiciel = async (req, res) => {
  try {
    const logiciel = await Logiciel.findByIdAndDelete(req.params.id);
    
    if (!logiciel) {
      return res.status(404).json({
        success: false,
        message: 'Logiciel non trouvé'
      });
    }
    
    res.status(200).json({
      success: true,
      message: 'Logiciel supprimé avec succès'
    });
  } catch (error) {
    console.error(error);
    if (error.kind === 'ObjectId') {
      return res.status(404).json({
        success: false,
        message: 'Logiciel non trouvé'
      });
    }
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la suppression du logiciel',
      error: error.message
    });
  }
};

// @desc    Ajouter une version à un logiciel
// @route   POST /api/logiciels/:id/versions
// @access  Private/Admin
exports.addVersion = async (req, res) => {
  try {
    const logiciel = await Logiciel.findById(req.params.id);
    
    if (!logiciel) {
      return res.status(404).json({
        success: false,
        message: 'Logiciel non trouvé'
      });
    }
    
    logiciel.versions.push(req.body);
    await logiciel.save();
    
    res.status(200).json({
      success: true,
      message: 'Version ajoutée avec succès',
      data: logiciel
    });
  } catch (error) {
    console.error(error);
    res.status(400).json({
      success: false,
      message: 'Erreur lors de l\'ajout de la version',
      error: error.message
    });
  }
};

// @desc    Ajouter un témoignage à un logiciel
// @route   POST /api/logiciels/:id/testimonials
// @access  Private
exports.addTestimonial = async (req, res) => {
  try {
    const logiciel = await Logiciel.findById(req.params.id);
    
    if (!logiciel) {
      return res.status(404).json({
        success: false,
        message: 'Logiciel non trouvé'
      });
    }
    
    logiciel.testimonials.push(req.body);
    await logiciel.save();
    
    res.status(200).json({
      success: true,
      message: 'Témoignage ajouté avec succès',
      data: logiciel
    });
  } catch (error) {
    console.error(error);
    res.status(400).json({
      success: false,
      message: 'Erreur lors de l\'ajout du témoignage',
      error: error.message
    });
  }
}; 