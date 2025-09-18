const mongoose = require('mongoose');

const ContactSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    trim: true,
    lowercase: true
  },
  phone: {
    type: String,
    trim: true
  },
  subject: {
    type: String,
    required: true,
    enum: ['ingenierie', 'formation', 'logiciel', 'carriere', 'autre']
  },
  message: {
    type: String,
    required: true
  },
  // Champs pour les projets d'ingénierie
  projectType: {
    type: String,
    enum: ['etude', 'conception', 'suivi', 'expertise', 'autre-ing', '']
  },
  projectDescription: String,
  projectLocation: String,
  projectBudget: {
    type: String,
    enum: ['moins-5m', '5m-20m', '20m-50m', '50m-100m', 'plus-100m', '']
  },
  projectDeadline: Date,
  
  // Champs pour les demandes de formation
  formationType: {
    type: String,
    enum: ['covadis', 'autocad', 'robot', 'revit', 'genie-civil', 'hydraulique', 'autre-form', '']
  },
  formationParticipants: Number,
  formationStart: Date,
  formationDuration: {
    type: String,
    enum: ['1-jour', '2-3-jours', '1-semaine', '2-semaines', 'personnalise', '']
  },
  formationLocation: {
    type: String,
    enum: ['nos-locaux', 'votre-site', 'distance', '']
  },
  
  // Champs pour les demandes de logiciels
  softwareName: {
    type: String,
    enum: ['sorbo-struct', 'sorbo-hydro', 'sorbo-geotech', 'autre-soft', '']
  },
  softwareLicense: {
    type: String,
    enum: ['individuelle', 'entreprise', 'educative', 'essai', '']
  },
  softwareUsers: Number,
  softwareServices: [{
    type: String,
    enum: ['installation', 'formation', 'support', 'personnalisation']
  }],
  softwareOS: {
    type: String,
    enum: ['windows', 'mac', 'linux', '']
  },
  
  // Champs pour les demandes de carrière
  careerPosition: String,
  careerExperience: {
    type: String,
    enum: ['debutant', 'junior', 'confirme', 'senior', '']
  },
  careerCV: String, // Chemin vers le fichier CV
  careerAvailability: Date,
  
  status: {
    type: String,
    enum: ['nouveau', 'en_traitement', 'traite'],
    default: 'nouveau'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Contact', ContactSchema); 