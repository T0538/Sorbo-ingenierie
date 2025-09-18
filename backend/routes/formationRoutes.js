const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const { protect, admin } = require('../middleware/authMiddleware');
const Formation = require('../models/Formation');

// @route   GET /api/formations
// @desc    Récupérer toutes les formations
// @access  Public
router.get('/', async (req, res) => {
  try {
    const formations = await Formation.find();
    res.json(formations);
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

// @route   GET /api/formations/:id
// @desc    Récupérer une formation par son ID
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const formation = await Formation.findById(req.params.id);
    if (!formation) return res.status(404).json({ message: 'Non trouvée' });
    res.json(formation);
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

// @route   POST /api/formations
// @desc    Créer une nouvelle formation
// @access  Private (Admin)
router.post('/', [protect, admin], async (req, res) => {
  try {
    const formation = new Formation(req.body);
    await formation.save();
    res.status(201).json(formation);
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

// @route   PUT /api/formations/:id
// @desc    Mettre à jour une formation
// @access  Private (Admin)
router.put('/:id', [protect, admin], async (req, res) => {
  try {
    const formation = await Formation.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!formation) return res.status(404).json({ message: 'Non trouvée' });
    res.json(formation);
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

// @route   DELETE /api/formations/:id
// @desc    Supprimer une formation
// @access  Private (Admin)
router.delete('/:id', [protect, admin], async (req, res) => {
  try {
    const formation = await Formation.findByIdAndRemove(req.params.id);
    if (!formation) return res.status(404).json({ message: 'Non trouvée' });
    res.json({ message: 'Formation supprimée' });
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

// @route   POST /api/formations/:id/testimonials
// @desc    Ajouter un témoignage à une formation
// @access  Private
router.post('/:id/testimonials', protect, async (req, res) => {
  try {
    const formation = await Formation.findById(req.params.id);
    if (!formation) return res.status(404).json({ message: 'Non trouvée' });
    
    formation.testimonials.push(req.body);
    await formation.save();
    res.status(201).json(formation);
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

// @route   POST /api/formations/:id/inscription
// @desc    S'inscrire à une formation
// @access  Public (pour test, normalement Protected)
router.post('/:id/inscription', async (req, res) => {
  try {
    const formation = await Formation.findById(req.params.id);
    if (!formation) return res.status(404).json({ message: 'Non trouvée' });
    
    if (!formation.inscriptions) formation.inscriptions = [];
    formation.inscriptions.push(req.body);
    
    await formation.save();
    res.status(201).json({ message: 'Inscription réussie' });
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

module.exports = router; 