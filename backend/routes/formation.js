const express = require('express');
const router = express.Router();
const formationController = require('../controllers/formationController');

// GET /api/formations
router.get('/', formationController.getFormations);

// Vous avez déjà d'autres méthodes dans le controller si besoin plus tard

module.exports = router;