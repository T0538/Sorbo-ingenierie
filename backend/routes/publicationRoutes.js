const express = require('express');
const router = express.Router();

const { 
  getPublications, 
  getPublicationById, 
  createPublication, 
  updatePublication, 
  deletePublication,
  incrementTelechargements
} = require('../controllers/publicationController');
const { protect } = require('../middleware/authMiddleware');

// GET /api/publications?limit=10&categorie=rapport
router.get('/', getPublications);

// GET /api/publications/:id
router.get('/:id', getPublicationById);

// PUT /api/publications/:id/telecharger
router.put('/:id/telecharger', incrementTelechargements);

// POST /api/publications
router.post('/', protect, createPublication);

// PUT /api/publications/:id
router.put('/:id', protect, updatePublication);

// DELETE /api/publications/:id
router.delete('/:id', protect, deletePublication);

module.exports = router;
