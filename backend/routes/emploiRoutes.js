const express = require('express');
const router = express.Router();
const { check } = require('express-validator');
const { protect, restrict } = require('../middleware/authMiddleware');
const emploiController = require('../controllers/emploiController');
const fileUpload = require('express-fileupload');

// Configuration pour l'upload de fichiers
const uploadMiddleware = fileUpload({
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB max
  createParentPath: true,
  abortOnLimit: true,
  responseOnLimit: 'La taille du fichier dépasse la limite autorisée (10MB).',
  limitHandler: (req, res, next) => {
    return res.status(413).json({
      success: false,
      message: 'La taille du fichier dépasse la limite autorisée (10MB).'
    });
  },
  useTempFiles: false,
  safeFileNames: true,
  preserveExtension: true
});

// @route   GET /api/emplois
// @desc    Récupérer toutes les offres d'emploi actives
// @access  Public
router.get('/', emploiController.getEmplois);

// @route   GET /api/emplois/:id
// @desc    Récupérer une offre d'emploi par son ID
// @access  Public
router.get('/:id', emploiController.getEmploiById);

// @route   POST /api/emplois
// @desc    Créer une nouvelle offre d'emploi
// @access  Private (Admin)
router.post(
  '/',
  [
    protect,
    restrict(['admin']),
    check('titre', 'Le titre est requis').notEmpty(),
    check('type', 'Le type est requis').isIn(['cdi', 'cdd', 'stage', 'alternance', 'freelance']),
    check('departement', 'Le département est requis').isIn(['ingenierie', 'developpement', 'commercial', 'administratif', 'rh', 'autre']),
    check('localisation', 'La localisation est requise').notEmpty(),
    check('description', 'La description est requise').notEmpty(),
    check('experience', 'L\'expérience est requise').isIn(['debutant', 'junior', 'confirme', 'senior'])
  ],
  emploiController.createEmploi
);

// @route   PUT /api/emplois/:id
// @desc    Mettre à jour une offre d'emploi
// @access  Private (Admin)
router.put(
  '/:id',
  [
    protect,
    restrict(['admin'])
  ],
  emploiController.updateEmploi
);

// @route   DELETE /api/emplois/:id
// @desc    Supprimer une offre d'emploi
// @access  Private (Admin)
router.delete(
  '/:id',
  [
    protect,
    restrict(['admin'])
  ],
  emploiController.deleteEmploi
);

// @route   POST /api/emplois/:id/candidatures
// @desc    Ajouter une candidature à une offre d'emploi
// @access  Public
router.post(
  '/:id/candidatures',
  [
    uploadMiddleware,
    check('nom', 'Le nom est requis').notEmpty(),
    check('email', 'Veuillez fournir un email valide').isEmail(),
    check('telephone', 'Le téléphone est requis').notEmpty()
  ],
  emploiController.addCandidature
);

// @route   GET /api/emplois/:id/candidatures
// @desc    Récupérer toutes les candidatures d'une offre d'emploi
// @access  Private (Admin)
router.get(
  '/:id/candidatures',
  [
    protect,
    restrict(['admin'])
  ],
  emploiController.getCandidatures
);

// @route   PATCH /api/emplois/:id/candidatures/:candidatureId
// @desc    Mettre à jour le statut d'une candidature
// @access  Private (Admin)
router.patch(
  '/:id/candidatures/:candidatureId',
  [
    protect,
    restrict(['admin']),
    check('statut', 'Le statut est invalide').optional().isIn(['reçue', 'en_cours', 'entretien', 'acceptee', 'refusee'])
  ],
  emploiController.updateCandidatureStatus
);

module.exports = router; 