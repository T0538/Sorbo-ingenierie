const Emploi = require('../models/Emploi');
const { validationResult } = require('express-validator');
const path = require('path');
const fs = require('fs');
const multer = require('multer');

// @desc    Récupérer toutes les offres d'emploi actives
// @route   GET /api/emplois
// @access  Public
exports.getEmplois = async (req, res) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const startIndex = (page - 1) * limit;
    
    // Filtres
    const filter = { statut: 'active' };
    
    if (req.query.type) {
      filter.type = req.query.type;
    }
    
    if (req.query.departement) {
      filter.departement = req.query.departement;
    }
    
    if (req.query.experience) {
      filter.experience = req.query.experience;
    }
    
    if (req.query.localisation) {
      filter.localisation = { $regex: req.query.localisation, $options: 'i' };
    }
    
    if (req.query.search) {
      filter.$or = [
        { titre: { $regex: req.query.search, $options: 'i' } },
        { description: { $regex: req.query.search, $options: 'i' } }
      ];
    }
    
    // Tri
    let sort = { createdAt: -1 };
    if (req.query.sort) {
      switch (req.query.sort) {
        case 'recent':
          sort = { createdAt: -1 };
          break;
        case 'ancien':
          sort = { createdAt: 1 };
          break;
        case 'deadline':
          sort = { dateLimite: 1 };
          break;
      }
    }
    
    const total = await Emploi.countDocuments(filter);
    const emplois = await Emploi.find(filter)
      .select('-candidatures') // Exclure les candidatures pour les requêtes publiques
      .sort(sort)
      .skip(startIndex)
      .limit(limit);
    
    res.status(200).json({
      success: true,
      count: emplois.length,
      total,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        perPage: limit
      },
      data: emplois
    });
  } catch (error) {
    console.error('Erreur lors de la récupération des offres d\'emploi:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération des offres d\'emploi',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// @desc    Récupérer une offre d'emploi par son ID
// @route   GET /api/emplois/:id
// @access  Public
exports.getEmploiById = async (req, res) => {
  try {
    const emploi = await Emploi.findById(req.params.id)
      .select('-candidatures.notes'); // Ne pas montrer les notes internes
    
    if (!emploi) {
      return res.status(404).json({
        success: false,
        message: 'Offre d\'emploi non trouvée'
      });
    }
    
    res.status(200).json({
      success: true,
      data: emploi
    });
  } catch (error) {
    console.error('Erreur lors de la récupération de l\'offre d\'emploi:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération de l\'offre d\'emploi',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// @desc    Créer une nouvelle offre d'emploi
// @route   POST /api/emplois
// @access  Private (Admin)
exports.createEmploi = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, errors: errors.array() });
  }

  try {
    const newEmploi = await Emploi.create(req.body);
    
    res.status(201).json({
      success: true,
      data: newEmploi
    });
  } catch (error) {
    console.error('Erreur lors de la création de l\'offre d\'emploi:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la création de l\'offre d\'emploi',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// @desc    Mettre à jour une offre d'emploi
// @route   PUT /api/emplois/:id
// @access  Private (Admin)
exports.updateEmploi = async (req, res) => {
  try {
    let emploi = await Emploi.findById(req.params.id);
    
    if (!emploi) {
      return res.status(404).json({
        success: false,
        message: 'Offre d\'emploi non trouvée'
      });
    }
    
    emploi = await Emploi.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    
    res.status(200).json({
      success: true,
      data: emploi
    });
  } catch (error) {
    console.error('Erreur lors de la mise à jour de l\'offre d\'emploi:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la mise à jour de l\'offre d\'emploi',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// @desc    Supprimer une offre d'emploi
// @route   DELETE /api/emplois/:id
// @access  Private (Admin)
exports.deleteEmploi = async (req, res) => {
  try {
    const emploi = await Emploi.findById(req.params.id);
    
    if (!emploi) {
      return res.status(404).json({
        success: false,
        message: 'Offre d\'emploi non trouvée'
      });
    }
    
    // Supprimer les fichiers CV et lettres de motivation liés
    if (emploi.candidatures && emploi.candidatures.length > 0) {
      for (const candidature of emploi.candidatures) {
        if (candidature.cv) {
          const cvPath = path.join(__dirname, '..', candidature.cv);
          if (fs.existsSync(cvPath)) {
            fs.unlinkSync(cvPath);
          }
        }
        
        if (candidature.lettreMotive) {
          const lettrePath = path.join(__dirname, '..', candidature.lettreMotive);
          if (fs.existsSync(lettrePath)) {
            fs.unlinkSync(lettrePath);
          }
        }
      }
    }
    
    await emploi.remove();
    
    res.status(200).json({
      success: true,
      message: 'Offre d\'emploi supprimée avec succès'
    });
  } catch (error) {
    console.error('Erreur lors de la suppression de l\'offre d\'emploi:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la suppression de l\'offre d\'emploi',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// @desc    Ajouter une candidature à une offre d'emploi
// @route   POST /api/emplois/:id/candidatures
// @access  Public
exports.addCandidature = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, errors: errors.array() });
  }

  try {
    const emploi = await Emploi.findById(req.params.id);
    
    if (!emploi) {
      return res.status(404).json({
        success: false,
        message: 'Offre d\'emploi non trouvée'
      });
    }
    
    if (emploi.statut !== 'active') {
      return res.status(400).json({
        success: false,
        message: 'Cette offre d\'emploi n\'est plus active'
      });
    }
    
    // Créer la candidature
    const candidature = {
      nom: req.body.nom,
      email: req.body.email,
      telephone: req.body.telephone,
      datePostulation: Date.now(),
      statut: 'reçue'
    };
    
    // Gérer les fichiers
    if (req.files) {
      // Gérer le CV
      if (req.files.cv) {
        const uploadDir = path.join(__dirname, '../uploads/cv');
        if (!fs.existsSync(uploadDir)) {
          fs.mkdirSync(uploadDir, { recursive: true });
        }
        
        const fileName = `${Date.now()}-${req.files.cv.name}`;
        const filePath = path.join(uploadDir, fileName);
        
        await req.files.cv.mv(filePath);
        candidature.cv = `/uploads/cv/${fileName}`;
      }
      
      // Gérer la lettre de motivation
      if (req.files.lettreMotive) {
        const uploadDir = path.join(__dirname, '../uploads/lettres');
        if (!fs.existsSync(uploadDir)) {
          fs.mkdirSync(uploadDir, { recursive: true });
        }
        
        const fileName = `${Date.now()}-${req.files.lettreMotive.name}`;
        const filePath = path.join(uploadDir, fileName);
        
        await req.files.lettreMotive.mv(filePath);
        candidature.lettreMotive = `/uploads/lettres/${fileName}`;
      }
    }
    
    // Ajouter la candidature à l'offre d'emploi
    emploi.candidatures.push(candidature);
    await emploi.save();
    
    res.status(201).json({
      success: true,
      message: 'Candidature envoyée avec succès',
      data: {
        id: emploi.candidatures[emploi.candidatures.length - 1]._id,
        datePostulation: candidature.datePostulation
      }
    });
  } catch (error) {
    console.error('Erreur lors de l\'ajout de la candidature:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de l\'ajout de la candidature',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// @desc    Récupérer toutes les candidatures d'une offre d'emploi
// @route   GET /api/emplois/:id/candidatures
// @access  Private (Admin)
exports.getCandidatures = async (req, res) => {
  try {
    const emploi = await Emploi.findById(req.params.id)
      .select('titre candidatures');
    
    if (!emploi) {
      return res.status(404).json({
        success: false,
        message: 'Offre d\'emploi non trouvée'
      });
    }
    
    res.status(200).json({
      success: true,
      count: emploi.candidatures.length,
      data: {
        offre: {
          id: emploi._id,
          titre: emploi.titre
        },
        candidatures: emploi.candidatures
      }
    });
  } catch (error) {
    console.error('Erreur lors de la récupération des candidatures:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération des candidatures',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// @desc    Mettre à jour le statut d'une candidature
// @route   PATCH /api/emplois/:id/candidatures/:candidatureId
// @access  Private (Admin)
exports.updateCandidatureStatus = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, errors: errors.array() });
  }

  try {
    const { statut, notes } = req.body;
    
    const emploi = await Emploi.findById(req.params.id);
    
    if (!emploi) {
      return res.status(404).json({
        success: false,
        message: 'Offre d\'emploi non trouvée'
      });
    }
    
    // Trouver la candidature
    const candidature = emploi.candidatures.id(req.params.candidatureId);
    
    if (!candidature) {
      return res.status(404).json({
        success: false,
        message: 'Candidature non trouvée'
      });
    }
    
    // Mettre à jour le statut et les notes
    if (statut) {
      candidature.statut = statut;
    }
    
    if (notes) {
      candidature.notes = notes;
    }
    
    await emploi.save();
    
    res.status(200).json({
      success: true,
      data: candidature
    });
  } catch (error) {
    console.error('Erreur lors de la mise à jour du statut de la candidature:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la mise à jour du statut de la candidature',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
}; 