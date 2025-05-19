const Formation = require('../models/Formation');
const { validationResult } = require('express-validator');

// @desc    Récupérer toutes les formations
// @route   GET /api/formations
// @access  Public
exports.getFormations = async (req, res) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const startIndex = (page - 1) * limit;
    
    // Filtres
    const filter = { active: true };
    
    if (req.query.category) {
      filter.category = req.query.category;
    }
    
    if (req.query.type) {
      filter.type = req.query.type;
    }
    
    if (req.query.search) {
      filter.$or = [
        { title: { $regex: req.query.search, $options: 'i' } },
        { description: { $regex: req.query.search, $options: 'i' } }
      ];
    }
    
    // Tri
    let sort = { createdAt: -1 };
    if (req.query.sort) {
      switch (req.query.sort) {
        case 'price_asc':
          sort = { price: 1 };
          break;
        case 'price_desc':
          sort = { price: -1 };
          break;
        case 'rating':
          sort = { 'rating.average': -1 };
          break;
      }
    }
    
    const total = await Formation.countDocuments(filter);
    const formations = await Formation.find(filter)
      .sort(sort)
      .skip(startIndex)
      .limit(limit);
    
    res.status(200).json({
      success: true,
      count: formations.length,
      total,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        perPage: limit
      },
      data: formations
    });
  } catch (error) {
    console.error('Erreur lors de la récupération des formations:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération des formations',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// @desc    Récupérer une formation par son ID
// @route   GET /api/formations/:id
// @access  Public
exports.getFormationById = async (req, res) => {
  try {
    const formation = await Formation.findById(req.params.id);
    
    if (!formation) {
      return res.status(404).json({
        success: false,
        message: 'Formation non trouvée'
      });
    }
    
    res.status(200).json({
      success: true,
      data: formation
    });
  } catch (error) {
    console.error('Erreur lors de la récupération de la formation:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération de la formation',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// @desc    Créer une nouvelle formation
// @route   POST /api/formations
// @access  Private (Admin)
exports.createFormation = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      errors: errors.array()
    });
  }

  try {
    const newFormation = await Formation.create(req.body);
    
    res.status(201).json({
      success: true,
      data: newFormation
    });
  } catch (error) {
    console.error('Erreur lors de la création de la formation:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la création de la formation',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// @desc    Mettre à jour une formation
// @route   PUT /api/formations/:id
// @access  Private (Admin)
exports.updateFormation = async (req, res) => {
  try {
    let formation = await Formation.findById(req.params.id);
    
    if (!formation) {
      return res.status(404).json({
        success: false,
        message: 'Formation non trouvée'
      });
    }
    
    formation = await Formation.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    
    res.status(200).json({
      success: true,
      data: formation
    });
  } catch (error) {
    console.error('Erreur lors de la mise à jour de la formation:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la mise à jour de la formation',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// @desc    Supprimer une formation
// @route   DELETE /api/formations/:id
// @access  Private (Admin)
exports.deleteFormation = async (req, res) => {
  try {
    const formation = await Formation.findById(req.params.id);
    
    if (!formation) {
      return res.status(404).json({
        success: false,
        message: 'Formation non trouvée'
      });
    }
    
    await Formation.findByIdAndDelete(req.params.id);
    
    res.status(200).json({
      success: true,
      message: 'Formation supprimée avec succès'
    });
  } catch (error) {
    console.error('Erreur lors de la suppression de la formation:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la suppression de la formation',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// @desc    Ajouter un témoignage à une formation
// @route   POST /api/formations/:id/testimonials
// @access  Private
exports.addTestimonial = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      errors: errors.array()
    });
  }

  try {
    const formation = await Formation.findById(req.params.id);
    
    if (!formation) {
      return res.status(404).json({
        success: false,
        message: 'Formation non trouvée'
      });
    }
    
    const testimonial = {
      name: req.body.name,
      company: req.body.company,
      position: req.body.position,
      comment: req.body.comment,
      rating: req.body.rating,
      date: Date.now()
    };
    
    formation.testimonials.push(testimonial);
    
    // Recalculer la note moyenne
    if (formation.testimonials.length > 0) {
      const totalRating = formation.testimonials.reduce((sum, item) => sum + item.rating, 0);
      formation.rating = {
        average: totalRating / formation.testimonials.length,
        count: formation.testimonials.length
      };
    }
    
    await formation.save();
    
    res.status(200).json({
      success: true,
      data: formation
    });
  } catch (error) {
    console.error('Erreur lors de l\'ajout du témoignage:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de l\'ajout du témoignage',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// @desc    Inscrire un utilisateur à une formation
// @route   POST /api/formations/:id/inscription
// @access  Private
exports.inscriptionFormation = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      errors: errors.array()
    });
  }

  try {
    const formation = await Formation.findById(req.params.id);
    
    if (!formation) {
      return res.status(404).json({
        success: false,
        message: 'Formation non trouvée'
      });
    }
    
    // Créer l'inscription
    const inscription = {
      nom: req.body.nom,
      prenom: req.body.prenom,
      email: req.body.email,
      telephone: req.body.telephone,
      entreprise: req.body.entreprise || '',
      fonction: req.body.fonction || '',
      date: new Date()
    };
    
    // Ajouter l'inscription à la formation
    if (!formation.inscriptions) {
      formation.inscriptions = [];
    }
    
    formation.inscriptions.push(inscription);
    await formation.save();
    
    // Envoyer un email de confirmation (si configurer)
    // TODO: Implémenter l'envoi d'email
    
    res.status(200).json({
      success: true,
      message: 'Inscription réussie',
      data: inscription
    });
  } catch (error) {
    console.error('Erreur lors de l\'inscription:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de l\'inscription',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
}; 