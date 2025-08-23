const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const adminConfig = require('../admin-config');

// Schéma pour les utilisateurs administrateurs
const adminUserSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        minlength: 3,
        maxlength: 50
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
        match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Email invalide']
    },
    password: {
        type: String,
        required: true,
        minlength: 8
    },
    role: {
        type: String,
        enum: ['super-admin', 'admin', 'editor', 'viewer'],
        default: 'admin'
    },
    firstName: {
        type: String,
        trim: true,
        maxlength: 50
    },
    lastName: {
        type: String,
        trim: true,
        maxlength: 50
    },
    isActive: {
        type: Boolean,
        default: true
    },
    lastLogin: {
        type: Date,
        default: null
    },
    loginAttempts: {
        type: Number,
        default: 0
    },
    lockUntil: {
        type: Date,
        default: null
    },
    passwordChangedAt: {
        type: Date,
        default: Date.now
    },
    passwordResetToken: String,
    passwordResetExpires: Date,
    twoFactorSecret: String,
    twoFactorEnabled: {
        type: Boolean,
        default: false
    },
    preferences: {
        theme: {
            type: String,
            enum: ['light', 'dark'],
            default: 'light'
        },
        language: {
            type: String,
            enum: ['fr', 'en'],
            default: 'fr'
        },
        notifications: {
            email: { type: Boolean, default: true },
            dashboard: { type: Boolean, default: true }
        }
    }
}, {
    timestamps: true,
    collection: adminConfig.collections.users
});

// Index pour optimiser les recherches
adminUserSchema.index({ username: 1, email: 1 });
adminUserSchema.index({ role: 1, isActive: 1 });

// Méthodes virtuelles
adminUserSchema.virtual('fullName').get(function() {
    return `${this.firstName || ''} ${this.lastName || ''}`.trim();
});

adminUserSchema.virtual('isLocked').get(function() {
    return !!(this.lockUntil && this.lockUntil > Date.now());
});

// Méthodes d'instance
adminUserSchema.methods.comparePassword = async function(candidatePassword) {
    try {
        return await bcrypt.compare(candidatePassword, this.password);
    } catch (error) {
        throw new Error('Erreur lors de la comparaison des mots de passe');
    }
};

adminUserSchema.methods.hashPassword = async function(password) {
    try {
        const salt = await bcrypt.genSalt(adminConfig.security.bcryptRounds);
        return await bcrypt.hash(password, salt);
    } catch (error) {
        throw new Error('Erreur lors du hachage du mot de passe');
    }
};

adminUserSchema.methods.incrementLoginAttempts = function() {
    // Si le compte est déjà verrouillé et que le verrouillage a expiré
    if (this.lockUntil && this.lockUntil < Date.now()) {
        return this.updateOne({
            $unset: { lockUntil: 1 },
            $set: { loginAttempts: 1 }
        });
    }
    
    const updates = { $inc: { loginAttempts: 1 } };
    
    // Verrouiller le compte si le nombre de tentatives est dépassé
    if (this.loginAttempts + 1 >= adminConfig.security.maxLoginAttempts && !this.isLocked) {
        updates.$set = { lockUntil: Date.now() + adminConfig.security.lockoutDuration };
    }
    
    return this.updateOne(updates);
};

adminUserSchema.methods.resetLoginAttempts = function() {
    return this.updateOne({
        $unset: { loginAttempts: 1, lockUntil: 1 },
        $set: { lastLogin: new Date() }
    });
};

adminUserSchema.methods.hasPermission = function(permission) {
    const userPermissions = adminConfig.permissions[this.role] || [];
    return userPermissions.includes(permission);
};

// Middleware pre-save pour hasher le mot de passe
adminUserSchema.pre('save', async function(next) {
    // Ne hasher le mot de passe que s'il a été modifié
    if (!this.isModified('password')) return next();
    
    try {
        this.password = await this.hashPassword(this.password);
        this.passwordChangedAt = Date.now() - 1000; // -1 seconde pour éviter les problèmes de timing
        next();
    } catch (error) {
        next(error);
    }
});

// Méthodes statiques
adminUserSchema.statics.findByUsername = function(username) {
    return this.findOne({ username: username, isActive: true });
};

adminUserSchema.statics.findByEmail = function(email) {
    return this.findOne({ email: email, isActive: true });
};

adminUserSchema.statics.createDefaultAdmin = async function() {
    try {
        const existingAdmin = await this.findOne({ role: 'super-admin' });
        if (existingAdmin) {
            console.log('✅ Administrateur par défaut déjà existant');
            return existingAdmin;
        }
        
        const defaultPassword = 'AdminSorbo2024!'; // À changer après la première connexion
        const admin = new this({
            username: adminConfig.defaultAdmin.username,
            email: adminConfig.defaultAdmin.email,
            password: defaultPassword,
            role: adminConfig.defaultAdmin.role,
            firstName: 'Administrateur',
            lastName: 'Sorbo',
            isActive: true
        });
        
        await admin.save();
        console.log('✅ Administrateur par défaut créé avec succès');
        console.log(`🔑 Identifiants de connexion :`);
        console.log(`   Username: ${admin.username}`);
        console.log(`   Password: ${defaultPassword}`);
        console.log(`⚠️  IMPORTANT: Changez ce mot de passe après la première connexion !`);
        
        return admin;
    } catch (error) {
        console.error('❌ Erreur lors de la création de l\'administrateur par défaut:', error);
        throw error;
    }
};

const AdminUser = mongoose.model('AdminUser', adminUserSchema);

module.exports = AdminUser;


