const express = require('express');
const router = express.Router();
const { 
  getLogiciels, 
  getLogicielById, 
  getLogicielBySlug,
  createLogiciel, 
  updateLogiciel, 
  deleteLogiciel,
  addVersion,
  addTestimonial,
  getDownloadLinks
} = require('../controllers/logicielController');
const { protect } = require('../middleware/authMiddleware');

// Routes publiques
router.get('/', getLogiciels);
router.get('/slug/:slug', getLogicielBySlug);
router.get('/:id', getLogicielById);
router.get('/:id/download', getDownloadLinks);

// Routes protégées pour l'administration
router.post('/', protect, createLogiciel);
router.put('/:id', protect, updateLogiciel);
router.delete('/:id', protect, deleteLogiciel);
router.post('/:id/versions', protect, addVersion);

// Route protégée pour ajouter un témoignage (accessible aux utilisateurs connectés)
router.post('/:id/testimonials', protect, addTestimonial);

module.exports = router; 