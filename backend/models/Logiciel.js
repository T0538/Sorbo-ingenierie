const mongoose = require('mongoose');

// Utilitaire simple pour générer un slug à partir d'un nom
function toSlug(value) {
  if (!value) return undefined;
  return value
    .toString()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '');
}

const logicielSchema = new mongoose.Schema({
  slug: {
    type: String,
    unique: true,
    index: true,
    trim: true,
    lowercase: true
  },
  nom: {
    type: String,
    required: [true, 'Le nom du logiciel est requis'],
    trim: true
  },
  description: {
    type: String,
    required: [true, 'La description est requise'],
    trim: true
  },
  version: {
    type: String,
    default: '1.0'
  },
  categorie: {
    type: String,
    // enum: ['autocad', 'covadis', 'robot', 'revit', 'civil3d', 'sketchup', 'autre'], // Validation assouplie
    required: [true, 'La catégorie est requise']
  },
  prix: {
    type: Number,
    default: 0
  },
  devise: {
    type: String,
    default: 'FCFA'
  },
  image: {
    type: String,
    default: '/images/logiciels/default.jpg'
  },
  logo: {
    type: String,
    default: 'images/image1.png'
  },
  headerImage: {
    type: String,
    default: 'images/drainageroute.png'
  },
  lienTelechargement: {
    type: String,
    trim: true
  },
  lienDemo: {
    type: String,
    trim: true
  },
  fonctionnalites: [{
    type: String,
    trim: true
  }],
  specifications: {
    systeme: String,
    ram: String,
    espace: String,
    processeur: String
  },
  disponible: {
    type: Boolean,
    default: true
  },
  populaire: {
    type: Boolean,
    default: false
  },
  note: {
    type: Number,
    min: 0,
    max: 5,
    default: 0
  },
  nombreTelechargements: {
    type: Number,
    default: 0
  },
  dateAjout: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Générer le slug automatiquement si absent
logicielSchema.pre('save', function(next) {
  if (!this.slug && this.nom) {
    this.slug = toSlug(this.nom);
  }
  next();
});

logicielSchema.pre('findOneAndUpdate', function(next) {
  const update = this.getUpdate() || {};
  if (!update.slug && update.nom) {
    update.slug = toSlug(update.nom);
    this.setUpdate(update);
  }
  next();
});

module.exports = mongoose.model('Logiciel', logicielSchema); 