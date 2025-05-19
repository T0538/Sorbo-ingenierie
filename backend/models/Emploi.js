const mongoose = require('mongoose');

const EmploiSchema = new mongoose.Schema({
  titre: {
    type: String,
    required: true,
    trim: true
  },
  type: {
    type: String,
    required: true,
    enum: ['cdi', 'cdd', 'stage', 'alternance', 'freelance']
  },
  departement: {
    type: String,
    required: true,
    enum: ['ingenierie', 'developpement', 'commercial', 'administratif', 'rh', 'autre']
  },
  localisation: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  responsabilites: [String],
  competences: {
    requises: [String],
    souhaitees: [String]
  },
  experience: {
    type: String,
    required: true,
    enum: ['debutant', 'junior', 'confirme', 'senior']
  },
  formation: String,
  salaire: {
    min: Number,
    max: Number,
    negociable: {
      type: Boolean,
      default: true
    }
  },
  avantages: [String],
  dateDebut: {
    type: Date,
    default: Date.now
  },
  dateLimite: Date,
  processRecrutement: [String],
  statut: {
    type: String,
    enum: ['active', 'pourvue', 'cloturee'],
    default: 'active'
  },
  featured: {
    type: Boolean,
    default: false
  },
  candidatures: [
    {
      nom: String,
      email: String,
      telephone: String,
      cv: String, // URL du fichier CV
      lettreMotive: String, // URL du fichier lettre de motivation
      datePostulation: {
        type: Date,
        default: Date.now
      },
      statut: {
        type: String,
        enum: ['reçue', 'en_cours', 'entretien', 'acceptee', 'refusee'],
        default: 'reçue'
      },
      notes: String
    }
  ],
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Emploi', EmploiSchema); 