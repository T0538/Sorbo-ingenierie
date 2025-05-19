const mongoose = require('mongoose');

const LogicielSchema = new mongoose.Schema({
  nom: {
    type: String,
    required: true,
    trim: true
  },
  slug: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  categorie: {
    type: String,
    required: true,
    enum: ['structure', 'hydraulique', 'geotechnique', 'autre']
  },
  description: {
    type: String,
    required: true
  },
  fonctionnalites: [String],
  avantages: [String],
  versions: [
    {
      numero: String,
      datePublication: Date,
      nouveautes: [String],
      corrections: [String],
      lienTelechargement: String
    }
  ],
  images: [
    {
      url: String,
      alt: String,
      ordre: Number
    }
  ],
  videos: [
    {
      url: String,
      titre: String,
      description: String
    }
  ],
  systemes: [{
    type: String,
    enum: ['windows', 'mac', 'linux']
  }],
  configuration: {
    minimale: {
      processeur: String,
      memoire: String,
      stockage: String,
      graphique: String,
      os: [String]
    },
    recommandee: {
      processeur: String,
      memoire: String,
      stockage: String,
      graphique: String,
      os: [String]
    }
  },
  licences: [
    {
      type: {
        type: String,
        enum: ['individuelle', 'entreprise', 'educative', 'essai']
      },
      duree: String,
      prix: Number,
      devise: {
        type: String,
        default: 'FCFA'
      },
      caracteristiques: [String]
    }
  ],
  faq: [
    {
      question: String,
      reponse: String
    }
  ],
  testimonials: [
    {
      nom: String,
      entreprise: String,
      poste: String,
      commentaire: String,
      note: {
        type: Number,
        min: 1,
        max: 5
      },
      date: {
        type: Date,
        default: Date.now
      }
    }
  ],
  documentation: {
    manuelUtilisateur: String,
    guideDemarrage: String,
    tutoriels: [
      {
        titre: String,
        description: String,
        lien: String
      }
    ]
  },
  support: {
    email: String,
    telephone: String,
    formulaire: String,
    heures: String
  },
  active: {
    type: Boolean,
    default: true
  },
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

// Créer le slug automatiquement à partir du nom
LogicielSchema.pre('save', function(next) {
  if (!this.isModified('nom')) return next();
  this.slug = this.nom.toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
  next();
});

module.exports = mongoose.model('Logiciel', LogicielSchema); 