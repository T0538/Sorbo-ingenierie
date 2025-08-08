const express = require('express');
const router = express.Router();

const { getActualites, getActualiteBySlug } = require('../controllers/actualiteController');

// GET /api/actualites?limit=3
router.get('/', getActualites);

// GET /api/actualites/:slug
router.get('/:slug', getActualiteBySlug);

module.exports = router;


