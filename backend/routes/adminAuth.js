const express = require('express');
const jwt = require('jsonwebtoken');
const AdminUser = require('../models/AdminUser');
const adminConfig = require('../admin-config');
const { 
    authenticateToken, 
    requirePermission, 
    validateLoginData, 
    loginRateLimit,
    logAdminAction 
} = require('../middleware/adminAuth');

const router = express.Router();

// Route de connexion
router.post('/login', 
    loginRateLimit,
    validateLoginData,
    async (req, res) => {
        try {
            const { username, password } = req.body;
            
            // Rechercher l'utilisateur
            const user = await AdminUser.findByUsername(username);
            
            if (!user) {
                return res.status(401).json({
                    success: false,
                    message: 'Identifiants invalides',
                    code: 'INVALID_CREDENTIALS'
                });
            }
            
            // Vérifier si le compte est verrouillé
            if (user.isLocked) {
                const remainingTime = Math.ceil((user.lockUntil - Date.now()) / 1000 / 60);
                return res.status(423).json({
                    success: false,
                    message: `Compte temporairement verrouillé. Réessayez dans ${remainingTime} minutes.`,
                    code: 'ACCOUNT_LOCKED',
                    lockUntil: user.lockUntil,
                    remainingMinutes: remainingTime
                });
            }
            
            // Vérifier le mot de passe
            const isPasswordValid = await user.comparePassword(password);
            
            if (!isPasswordValid) {
                // Incrémenter le compteur de tentatives
                await user.incrementLoginAttempts();
                
                const remainingAttempts = adminConfig.security.maxLoginAttempts - user.loginAttempts - 1;
                
                if (remainingAttempts <= 0) {
                    return res.status(423).json({
                        success: false,
                        message: 'Compte verrouillé suite à trop de tentatives échouées',
                        code: 'ACCOUNT_LOCKED',
                        lockUntil: user.lockUntil
                    });
                }
                
                return res.status(401).json({
                    success: false,
                    message: `Mot de passe incorrect. ${remainingAttempts} tentatives restantes.`,
                    code: 'INVALID_PASSWORD',
                    remainingAttempts
                });
            }
            
            // Réinitialiser les tentatives de connexion
            await user.resetLoginAttempts();
            
            // Générer le token JWT
            const token = jwt.sign(
                { 
                    userId: user._id, 
                    username: user.username, 
                    role: user.role 
                },
                adminConfig.security.jwtSecret,
                { expiresIn: adminConfig.security.jwtExpiresIn }
            );
            
            // Informations de l'utilisateur (sans le mot de passe)
            const userInfo = {
                id: user._id,
                username: user.username,
                email: user.email,
                role: user.role,
                firstName: user.firstName,
                lastName: user.lastName,
                fullName: user.fullName,
                preferences: user.preferences,
                lastLogin: user.lastLogin,
                createdAt: user.createdAt
            };
            
            res.json({
                success: true,
                message: 'Connexion réussie',
                data: {
                    user: userInfo,
                    token: token,
                    expiresIn: adminConfig.security.jwtExpiresIn
                }
            });
            
        } catch (error) {
            console.error('Erreur lors de la connexion:', error);
            res.status(500).json({
                success: false,
                message: 'Erreur interne du serveur',
                code: 'INTERNAL_ERROR'
            });
        }
    }
);

// Route de déconnexion
router.post('/logout', 
    authenticateToken,
    logAdminAction('Déconnexion'),
    (req, res) => {
        // En production, on pourrait ajouter le token à une liste noire
        res.json({
            success: true,
            message: 'Déconnexion réussie'
        });
    }
);

// Route de vérification du token
router.get('/verify', 
    authenticateToken,
    (req, res) => {
        res.json({
            success: true,
            message: 'Token valide',
            data: {
                user: {
                    id: req.user._id,
                    username: req.user.username,
                    email: req.user.email,
                    role: req.user.role,
                    firstName: req.user.firstName,
                    lastName: req.user.lastName,
                    fullName: req.user.fullName,
                    preferences: req.user.preferences,
                    lastLogin: req.user.lastLogin,
                    createdAt: req.user.createdAt
                }
            }
        });
    }
);

// Route de changement de mot de passe
router.post('/change-password',
    authenticateToken,
    logAdminAction('Changement de mot de passe'),
    async (req, res) => {
        try {
            const { currentPassword, newPassword } = req.body;
            
            if (!currentPassword || !newPassword) {
                return res.status(400).json({
                    success: false,
                    message: 'Ancien et nouveau mot de passe requis',
                    code: 'MISSING_PASSWORDS'
                });
            }
            
            if (newPassword.length < 8) {
                return res.status(400).json({
                    success: false,
                    message: 'Le nouveau mot de passe doit contenir au moins 8 caractères',
                    code: 'PASSWORD_TOO_SHORT'
                });
            }
            
            // Vérifier l'ancien mot de passe
            const user = await AdminUser.findById(req.user.id);
            const isCurrentPasswordValid = await user.comparePassword(currentPassword);
            
            if (!isCurrentPasswordValid) {
                return res.status(401).json({
                    success: false,
                    message: 'Ancien mot de passe incorrect',
                    code: 'INVALID_CURRENT_PASSWORD'
                });
            }
            
            // Mettre à jour le mot de passe
            user.password = newPassword;
            await user.save();
            
            res.json({
                success: true,
                message: 'Mot de passe modifié avec succès'
            });
            
        } catch (error) {
            console.error('Erreur lors du changement de mot de passe:', error);
            res.status(500).json({
                success: false,
                message: 'Erreur interne du serveur',
                code: 'INTERNAL_ERROR'
            });
        }
    }
);

// Route de récupération du profil utilisateur
router.get('/profile',
    authenticateToken,
    (req, res) => {
        res.json({
            success: true,
            data: {
                user: {
                    id: req.user._id,
                    username: req.user.username,
                    email: req.user.email,
                    role: req.user.role,
                    firstName: req.user.firstName,
                    lastName: req.user.lastName,
                    fullName: req.user.fullName,
                    preferences: req.user.preferences,
                    lastLogin: req.user.lastLogin,
                    createdAt: req.user.createdAt,
                    updatedAt: req.user.updatedAt
                }
            }
        });
    }
);

// Route de mise à jour du profil
router.put('/profile',
    authenticateToken,
    logAdminAction('Mise à jour du profil'),
    async (req, res) => {
        try {
            const { firstName, lastName, preferences } = req.body;
            
            const updateData = {};
            if (firstName !== undefined) updateData.firstName = firstName;
            if (lastName !== undefined) updateData.lastName = lastName;
            if (preferences !== undefined) updateData.preferences = preferences;
            
            const user = await AdminUser.findByIdAndUpdate(
                req.user.id,
                updateData,
                { new: true, runValidators: true }
            ).select('-password');
            
            res.json({
                success: true,
                message: 'Profil mis à jour avec succès',
                data: { user }
            });
            
        } catch (error) {
            console.error('Erreur lors de la mise à jour du profil:', error);
            res.status(500).json({
                success: false,
                message: 'Erreur interne du serveur',
                code: 'INTERNAL_ERROR'
            });
        }
    }
);

// Route de création d'un nouvel administrateur (super-admin uniquement)
router.post('/create-user',
    authenticateToken,
    requirePermission('manage-users'),
    logAdminAction('Création d\'un nouvel utilisateur'),
    async (req, res) => {
        try {
            const { username, email, password, role, firstName, lastName } = req.body;
            
            // Vérifier que l'utilisateur actuel est super-admin
            if (req.user.role !== 'super-admin') {
                return res.status(403).json({
                    success: false,
                    message: 'Seuls les super-administrateurs peuvent créer de nouveaux utilisateurs',
                    code: 'INSUFFICIENT_PERMISSIONS'
                });
            }
            
            // Vérifier que le rôle n'est pas supérieur à celui de l'utilisateur actuel
            if (role === 'super-admin' && req.user.role !== 'super-admin') {
                return res.status(403).json({
                    success: false,
                    message: 'Vous ne pouvez pas créer un super-administrateur',
                    code: 'INSUFFICIENT_PERMISSIONS'
                });
            }
            
            // Créer le nouvel utilisateur
            const newUser = new AdminUser({
                username,
                email,
                password,
                role: role || 'admin',
                firstName,
                lastName
            });
            
            await newUser.save();
            
            // Retourner l'utilisateur créé (sans le mot de passe)
            const userInfo = {
                id: newUser._id,
                username: newUser.username,
                email: newUser.email,
                role: newUser.role,
                firstName: newUser.firstName,
                lastName: newUser.lastName,
                fullName: newUser.fullName,
                isActive: newUser.isActive,
                createdAt: newUser.createdAt
            };
            
            res.status(201).json({
                success: true,
                message: 'Utilisateur créé avec succès',
                data: { user: userInfo }
            });
            
        } catch (error) {
            if (error.code === 11000) {
                // Erreur de duplication (username ou email déjà existant)
                const field = Object.keys(error.keyPattern)[0];
                return res.status(400).json({
                    success: false,
                    message: `${field === 'username' ? 'Nom d\'utilisateur' : 'Email'} déjà utilisé`,
                    code: 'DUPLICATE_FIELD',
                    field
                });
            }
            
            console.error('Erreur lors de la création de l\'utilisateur:', error);
            res.status(500).json({
                success: false,
                message: 'Erreur interne du serveur',
                code: 'INTERNAL_ERROR'
            });
        }
    }
);

// Route de récupération de la liste des utilisateurs (super-admin uniquement)
router.get('/users',
    authenticateToken,
    requirePermission('manage-users'),
    async (req, res) => {
        try {
            const users = await AdminUser.find({})
                .select('-password')
                .sort({ createdAt: -1 });
            
            res.json({
                success: true,
                data: { users }
            });
            
        } catch (error) {
            console.error('Erreur lors de la récupération des utilisateurs:', error);
            res.status(500).json({
                success: false,
                message: 'Erreur interne du serveur',
                code: 'INTERNAL_ERROR'
            });
        }
    }
);

module.exports = router;


