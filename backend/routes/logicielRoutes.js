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
const { protect, restrict } = require('../middleware/authMiddleware');

// Routes publiques
router.get('/', getLogiciels);
router.get('/slug/:slug', getLogicielBySlug);
router.get('/:id', getLogicielById);
router.get('/:id/download', getDownloadLinks);

// Routes protégées (admin uniquement)
router.post('/', protect, restrict(['admin']), createLogiciel);
router.put('/:id', protect, restrict(['admin']), updateLogiciel);
router.delete('/:id', protect, restrict(['admin']), deleteLogiciel);
router.post('/:id/versions', protect, restrict(['admin']), addVersion);

// Route protégée (utilisateur authentifié)
router.post('/:id/testimonials', protect, addTestimonial);

module.exports = router; 