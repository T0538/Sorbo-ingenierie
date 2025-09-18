const mongoose = require('mongoose');

const ProjetSchema = new mongoose.Schema({
  titre: {
    type: String,
    required: true,
    trim: true
  },
  slug: {
    type: String,
    unique: true
  },
  categorie: {
    type: String,
    required: true,
    enum: ['batiment', 'genie-civil', 'hydraulique', 'route', 'environnement', 'autre']
  },
  client: {
    nom: String,
    type: {
      type: String,
      enum: ['public', 'prive', 'mixte']
    },
    pays: String,
    ville: String
  },
  description: {
    type: String,
    required: true
  },
  prestations: [{
    type: String,
    enum: ['etude', 'conception', 'suivi', 'expertise', 'autre']
  }],
  localisation: {
    pays: String,
    ville: String,
    coordonnees: {
      lat: Number,
      lng: Number
    }
  },
  dateDebut: Date,
  dateFin: Date, // Peut être null si en cours
  statut: {
    type: String,
    enum: ['en_cours', 'termine', 'en_pause', 'annule'],
    default: 'en_cours'
  },
  images: [String], // URLs des images
  budget: {
    type: String,
    enum: ['moins-5m', '5m-20m', '20m-50m', '50m-100m', 'plus-100m', 'confidentiel']
  },
  defis: [String],
  solutions: [String],
  resultats: [String],
  technologies: [String],
  equipe: [{
    role: String,
    nombre: Number
  }],
  testimonials: [{
    nom: String,
    role: String,
    commentaire: String
  }],
  featured: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Middleware pour générer un slug avant l'enregistrement
ProjetSchema.pre('save', function(next) {
  if (!this.isModified('titre')) return next();
  
  // Convertir le titre en slug
  this.slug = this.titre
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
    
  next();
});

module.exports = mongoose.model('Projet', ProjetSchema); 