const mongoose = require('mongoose');

const publicationSchema = new mongoose.Schema({
  titre: {
    type: String,
    required: [true, 'Le titre est requis'],
    trim: true,
    maxlength: 200
  },
  description: {
    type: String,
    required: [true, 'La description est requise'],
    trim: true
  },
  fichier: {
    type: String,
    required: [true, 'Le fichier est requis']
  },
  typeFichier: {
    type: String,
    enum: ['pdf', 'doc', 'docx', 'xls', 'xlsx', 'zip', 'rar', 'autre'],
    default: 'autre'
  },
  categorie: {
    type: String,
    enum: ['rapport', 'brochure', 'formation', 'logiciel', 'autre'],
    default: 'autre'
  },
  taille: {
    type: String,
    default: '0 KB'
  },
  telechargements: {
    type: Number,
    default: 0
  },
  statut: {
    type: String,
    enum: ['brouillon', 'publie', 'archive'],
    default: 'publie'
  },
  datePublication: {
    type: Date,
    default: Date.now
  },
  dateModification: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Mettre à jour la date de modification avant sauvegarde
publicationSchema.pre('save', function(next) {
  this.dateModification = Date.now();
  next();
});

module.exports = mongoose.model('Publication', publicationSchema);
