const express = require('express');
const router = express.Router();
const { check } = require('express-validator');
const multer = require('multer');
const contactController = require('../controllers/contactController');

// Configuration de multer pour l'upload de fichiers
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024 // 5 MB
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    if (!allowedTypes.includes(file.mimetype)) {
      return cb(new Error('Format de fichier non supporté. Veuillez fournir un fichier PDF ou DOC/DOCX.'), false);
    }
    cb(null, true);
  }
});

// Middleware pour la validation
const validateContact = [
  check('name', 'Le nom est requis').notEmpty().trim(),
  check('email', 'Veuillez fournir un email valide').isEmail(),
  check('subject', 'Le sujet est requis').isIn(['ingenierie', 'formation', 'logiciel', 'carriere', 'autre']),
  check('message', 'Le message est requis').notEmpty()
];

// @route   POST /api/contact
// @desc    Créer un nouveau contact
// @access  Public
router.post(
  '/',
  (req, res, next) => {
    // Ajouter middleware d'upload de fichier seulement pour les demandes de carrière
    if (req.body.subject === 'carriere') {
      upload.single('career-cv')(req, res, (err) => {
        if (err instanceof multer.MulterError) {
          return res.status(400).json({ 
            success: false, 
            message: 'Erreur d\'upload', 
            error: err.message 
          });
        } else if (err) {
          return res.status(400).json({ 
            success: false, 
            message: err.message 
          });
        }
        next();
      });
    } else {
      next();
    }
  },
  validateContact,
  contactController.createContact
);

// @route   GET /api/contact
// @desc    Récupérer tous les contacts
// @access  Private
router.get('/', contactController.getContacts);

// @route   GET /api/contact/:id
// @desc    Récupérer un contact par son ID
// @access  Private
router.get('/:id', contactController.getContactById);

// @route   PATCH /api/contact/:id/status
// @desc    Mettre à jour le statut d'un contact
// @access  Private
router.patch(
  '/:id/status',
  [check('status', 'Le statut est requis').isIn(['nouveau', 'en_traitement', 'traite'])],
  contactController.updateContactStatus
);

// @route   DELETE /api/contact/:id
// @desc    Supprimer un contact
// @access  Private
router.delete('/:id', contactController.deleteContact);

module.exports = router; 