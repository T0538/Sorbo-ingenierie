const mongoose = require('mongoose');

const logicielSchema = new mongoose.Schema({
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
    enum: ['autocad', 'covadis', 'robot', 'revit', 'civil3d', 'sketchup', 'autre'],
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

module.exports = mongoose.model('Logiciel', logicielSchema); 