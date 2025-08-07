const mongoose = require('mongoose');

const actualiteSchema = new mongoose.Schema({
  titre: {
    type: String,
    required: [true, 'Le titre est requis'],
    trim: true,
    maxlength: 200
  },
  contenu: {
    type: String,
    required: [true, 'Le contenu est requis'],
    trim: true
  },
  resume: {
    type: String,
    required: [true, 'Le résumé est requis'],
    trim: true,
    maxlength: 300
  },
  image: {
    type: String,
    default: '/images/actualites/default.jpg'
  },
  categorie: {
    type: String,
    enum: ['ingenierie', 'formation', 'technologie', 'entreprise', 'autre'],
    default: 'autre'
  },
  tags: [{
    type: String,
    trim: true
  }],
  auteur: {
    type: String,
    default: 'Sorbo Ingénierie'
  },
  statut: {
    type: String,
    enum: ['brouillon', 'publie', 'archive'],
    default: 'brouillon'
  },
  datePublication: {
    type: Date,
    default: Date.now
  },
  dateModification: {
    type: Date,
    default: Date.now
  },
  vues: {
    type: Number,
    default: 0
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
actualiteSchema.pre('save', function(next) {
  if (this.isModified('titre')) {
    this.slug = this.titre
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim('-');
  }
  this.dateModification = Date.now();
  next();
});

module.exports = mongoose.model('Actualite', actualiteSchema);


