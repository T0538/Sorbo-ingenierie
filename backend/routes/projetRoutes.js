const express = require('express');
const router = express.Router();
const { 
  getProjets, 
  getProjetById, 
  getProjetBySlug,
  createProjet, 
  updateProjet, 
  deleteProjet
} = require('../controllers/projetController');
const { protect, restrict } = require('../middleware/authMiddleware');

// Routes publiques
router.get('/', getProjets);
router.get('/slug/:slug', getProjetBySlug);
router.get('/:id', getProjetById);

// Routes protégées (admin uniquement)
router.post('/', protect, restrict(['admin']), createProjet);
router.put('/:id', protect, restrict(['admin']), updateProjet);
router.delete('/:id', protect, restrict(['admin']), deleteProjet);

module.exports = router; 