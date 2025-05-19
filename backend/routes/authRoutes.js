const express = require('express');
const router = express.Router();
const { check } = require('express-validator');
const authController = require('../controllers/authController');
const { protect, restrict } = require('../middleware/authMiddleware');

// @route   POST /api/auth/register
// @desc    Inscription utilisateur
// @access  Public
router.post(
  '/register',
  [
    check('name', 'Le nom est requis').notEmpty(),
    check('email', 'Veuillez inclure un email valide').isEmail(),
    check('password', 'Le mot de passe doit contenir au moins 6 caractères').isLength({ min: 6 })
  ],
  authController.register
);

// @route   POST /api/auth/login
// @desc    Connexion utilisateur
// @access  Public
router.post(
  '/login',
  [
    check('email', 'Veuillez inclure un email valide').isEmail(),
    check('password', 'Le mot de passe est requis').exists()
  ],
  authController.login
);

// @route   GET /api/auth/me
// @desc    Obtenir l'utilisateur actuel
// @access  Private
router.get('/me', protect, authController.getMe);

// @route   PUT /api/auth/updatedetails
// @desc    Mettre à jour les informations utilisateur
// @access  Private
router.put(
  '/updatedetails',
  [
    protect,
    check('name', 'Le nom est requis').notEmpty(),
    check('email', 'Veuillez inclure un email valide').isEmail()
  ],
  authController.updateDetails
);

// @route   PUT /api/auth/updatepassword
// @desc    Mettre à jour le mot de passe
// @access  Private
router.put(
  '/updatepassword',
  [
    protect,
    check('currentPassword', 'Le mot de passe actuel est requis').notEmpty(),
    check('newPassword', 'Le nouveau mot de passe doit contenir au moins 6 caractères').isLength({ min: 6 })
  ],
  authController.updatePassword
);

// @route   POST /api/auth/forgotpassword
// @desc    Demande de réinitialisation du mot de passe
// @access  Public
router.post(
  '/forgotpassword',
  [
    check('email', 'Veuillez inclure un email valide').isEmail()
  ],
  authController.forgotPassword
);

// @route   PUT /api/auth/resetpassword/:resettoken
// @desc    Réinitialiser le mot de passe
// @access  Public
router.put(
  '/resetpassword/:resettoken',
  [
    check('password', 'Le mot de passe doit contenir au moins 6 caractères').isLength({ min: 6 })
  ],
  authController.resetPassword
);

module.exports = router; 