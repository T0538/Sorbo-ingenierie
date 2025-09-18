const mongoose = require('mongoose');

const emploiSchema = new mongoose.Schema({
  titre: {
    type: String,
    required: [true, 'Le titre du poste est requis'],
    trim: true
  },
  entreprise: {
    type: String,
    required: [true, 'Le nom de l\'entreprise est requis'],
    trim: true
  },
  description: {
    type: String,
    required: [true, 'La description est requise'],
    trim: true
  },
  profil: {
    type: String,
    required: [true, 'Le profil recherché est requis'],
    trim: true
  },
  missions: [{
    type: String,
    trim: true
  }],
  competences: [{
    type: String,
    trim: true
  }],
  formation: {
    type: String,
    required: [true, 'La formation requise est nécessaire'],
    trim: true
  },
  experience: {
    type: String,
    required: [true, 'L\'expérience requise est nécessaire'],
    trim: true
  },
  lieu: {
    ville: {
      type: String,
      required: [true, 'La ville est requise'],
      trim: true
    },
    pays: {
      type: String,
      default: 'Burkina Faso',
      trim: true
    }
  },
  typeContrat: {
    type: String,
    enum: ['cdi', 'cdd', 'stage', 'freelance', 'autre'],
    required: [true, 'Le type de contrat est requis']
  },
  salaire: {
    min: {
      type: Number,
      default: 0
    },
    max: {
      type: Number,
      default: 0
    },
    devise: {
      type: String,
      default: 'FCFA'
    },
    afficher: {
      type: Boolean,
      default: false
    }
  },
  avantages: [{
    type: String,
    trim: true
  }],
  dateLimite: {
    type: Date,
    required: [true, 'La date limite est requise']
  },
  datePublication: {
    type: Date,
    default: Date.now
  },
  statut: {
    type: String,
    enum: ['actif', 'expire', 'archive'],
    default: 'actif'
  },
  urgent: {
    type: Boolean,
    default: false
  },
  nombrePostes: {
    type: Number,
    default: 1
  },
  candidatures: {
    type: Number,
    default: 0
  },
  contact: {
    email: {
      type: String,
      required: [true, 'L\'email de contact est requis'],
      trim: true
    },
    telephone: {
      type: String,
      trim: true
    },
    personne: {
      type: String,
      trim: true
    }
  },
  slug: {
    type: String,
    unique: true,
    required: true
  }
}, {
  timestamps: true
});

// Middleware pour générer le slug
emploiSchema.pre('save', function(next) {
  if (this.isModified('titre')) {
    this.slug = this.titre
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim('-');
  }
  next();
});

module.exports = mongoose.model('Emploi', emploiSchema); 