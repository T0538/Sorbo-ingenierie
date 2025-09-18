const express = require('express');
const router = express.Router();

const { getActualites, getActualiteBySlug, createActualite, updateActualite, deleteActualite } = require('../controllers/actualiteController');
const { protect } = require('../middleware/authMiddleware');

// GET /api/actualites?limit=3
router.get('/', getActualites);

// GET /api/actualites/:slug
router.get('/:slug', getActualiteBySlug);

// POST /api/actualites
router.post('/', protect, createActualite);

// PUT /api/actualites/:id
router.put('/:id', protect, updateActualite);

// DELETE /api/actualites/:id
router.delete('/:id', protect, deleteActualite);


module.exports = router;


