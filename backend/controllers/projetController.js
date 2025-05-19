const Projet = require('../models/Projet');
const { validationResult } = require('express-validator');
const path = require('path');
const fs = require('fs');

// @desc    Récupérer tous les projets
// @route   GET /api/projets
// @access  Public
exports.getProjets = async (req, res) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const startIndex = (page - 1) * limit;
    
    // Filtres
    const filter = {};
    
    if (req.query.categorie) {
      filter.categorie = req.query.categorie;
    }
    
    if (req.query.statut) {
      filter.statut = req.query.statut;
    }
    
    if (req.query.featured === 'true') {
      filter.featured = true;
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
          sort = { dateDebut: -1 };
          break;
        case 'ancien':
          sort = { dateDebut: 1 };
          break;
        case 'featured':
          sort = { featured: -1, createdAt: -1 };
          break;
      }
    }
    
    const total = await Projet.countDocuments(filter);
    const projets = await Projet.find(filter)
      .sort(sort)
      .skip(startIndex)
      .limit(limit);
    
    res.status(200).json({
      success: true,
      count: projets.length,
      total,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        perPage: limit
      },
      data: projets
    });
  } catch (error) {
    console.error('Erreur lors de la récupération des projets:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération des projets',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// @desc    Récupérer un projet par son slug
// @route   GET /api/projets/slug/:slug
// @access  Public
exports.getProjetBySlug = async (req, res) => {
  try {
    const projet = await Projet.findOne({ slug: req.params.slug });
    
    if (!projet) {
      return res.status(404).json({
        success: false,
        message: 'Projet non trouvé'
      });
    }
    
    res.status(200).json({
      success: true,
      data: projet
    });
  } catch (error) {
    console.error('Erreur lors de la récupération du projet:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération du projet',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// @desc    Récupérer un projet par son ID
// @route   GET /api/projets/:id
// @access  Public
exports.getProjetById = async (req, res) => {
  try {
    const projet = await Projet.findById(req.params.id);
    
    if (!projet) {
      return res.status(404).json({
        success: false,
        message: 'Projet non trouvé'
      });
    }
    
    res.status(200).json({
      success: true,
      data: projet
    });
  } catch (error) {
    console.error('Erreur lors de la récupération du projet:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération du projet',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// @desc    Créer un nouveau projet
// @route   POST /api/projets
// @access  Private (Admin)
exports.createProjet = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, errors: errors.array() });
  }

  try {
    // Traiter les images si présentes
    const images = [];
    
    if (req.files && req.files.images) {
      const imageFiles = Array.isArray(req.files.images) ? req.files.images : [req.files.images];
      
      // Créer le dossier uploads/projets s'il n'existe pas
      const uploadDir = path.join(__dirname, '../uploads/projets');
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
      }
      
      // Traiter chaque image
      for (const file of imageFiles) {
        const fileName = `${Date.now()}-${file.name}`;
        const filePath = path.join(uploadDir, fileName);
        
        // Déplacer l'image vers le dossier d'uploads
        await file.mv(filePath);
        
        // Ajouter le chemin à la liste des images
        images.push(`/uploads/projets/${fileName}`);
      }
    }
    
    // Créer le projet avec les images
    const projetData = {
      ...req.body,
      images: images.length > 0 ? images : req.body.images
    };
    
    const projet = await Projet.create(projetData);
    
    res.status(201).json({
      success: true,
      data: projet
    });
  } catch (error) {
    console.error('Erreur lors de la création du projet:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la création du projet',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// @desc    Mettre à jour un projet
// @route   PUT /api/projets/:id
// @access  Private (Admin)
exports.updateProjet = async (req, res) => {
  try {
    let projet = await Projet.findById(req.params.id);
    
    if (!projet) {
      return res.status(404).json({
        success: false,
        message: 'Projet non trouvé'
      });
    }
    
    // Traiter les nouvelles images si présentes
    if (req.files && req.files.images) {
      const imageFiles = Array.isArray(req.files.images) ? req.files.images : [req.files.images];
      
      // Créer le dossier uploads/projets s'il n'existe pas
      const uploadDir = path.join(__dirname, '../uploads/projets');
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
      }
      
      // Traiter chaque nouvelle image
      const newImages = [];
      for (const file of imageFiles) {
        const fileName = `${Date.now()}-${file.name}`;
        const filePath = path.join(uploadDir, fileName);
        
        // Déplacer l'image vers le dossier d'uploads
        await file.mv(filePath);
        
        // Ajouter le chemin à la liste des nouvelles images
        newImages.push(`/uploads/projets/${fileName}`);
      }
      
      // Fusionner avec les images existantes ou remplacer selon la demande
      if (req.body.replaceImages === 'true') {
        // Supprimer les anciennes images si demandé
        for (const imgPath of projet.images) {
          const fullPath = path.join(__dirname, '..', imgPath);
          if (fs.existsSync(fullPath)) {
            fs.unlinkSync(fullPath);
          }
        }
        req.body.images = newImages;
      } else {
        // Fusionner avec les images existantes
        req.body.images = [...projet.images, ...newImages];
      }
    }
    
    // Mise à jour du projet
    projet = await Projet.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    
    res.status(200).json({
      success: true,
      data: projet
    });
  } catch (error) {
    console.error('Erreur lors de la mise à jour du projet:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la mise à jour du projet',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// @desc    Supprimer un projet
// @route   DELETE /api/projets/:id
// @access  Private (Admin)
exports.deleteProjet = async (req, res) => {
  try {
    const projet = await Projet.findById(req.params.id);
    
    if (!projet) {
      return res.status(404).json({
        success: false,
        message: 'Projet non trouvé'
      });
    }
    
    // Supprimer les images du projet
    for (const imgPath of projet.images) {
      const fullPath = path.join(__dirname, '..', imgPath);
      if (fs.existsSync(fullPath)) {
        fs.unlinkSync(fullPath);
      }
    }
    
    await projet.remove();
    
    res.status(200).json({
      success: true,
      message: 'Projet supprimé avec succès'
    });
  } catch (error) {
    console.error('Erreur lors de la suppression du projet:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la suppression du projet',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// @desc    Ajouter un témoignage au projet
// @route   POST /api/projets/:id/testimonials
// @access  Private (Admin)
exports.addTestimonial = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, errors: errors.array() });
  }

  try {
    const projet = await Projet.findById(req.params.id);
    
    if (!projet) {
      return res.status(404).json({
        success: false,
        message: 'Projet non trouvé'
      });
    }
    
    const testimonial = {
      nom: req.body.nom,
      role: req.body.role,
      commentaire: req.body.commentaire
    };
    
    projet.testimonials.push(testimonial);
    await projet.save();
    
    res.status(201).json({
      success: true,
      data: projet
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