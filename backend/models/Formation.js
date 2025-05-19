const mongoose = require('mongoose');

const FormationSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  category: {
    type: String,
    required: true,
    enum: ['logiciel', 'technique', 'methodologie', 'certification']
  },
  type: {
    type: String,
    required: true,
    enum: ['covadis', 'autocad', 'robot', 'revit', 'genie-civil', 'hydraulique', 'autre']
  },
  description: {
    type: String,
    required: true
  },
  objectives: [String],
  prerequisites: [String],
  duration: {
    type: Number, // Durée en jours
    required: true,
    min: 1
  },
  price: {
    type: Number, // Prix en FCFA
    required: true,
    min: 0
  },
  discount: {
    type: Number, // Pourcentage de réduction
    default: 0,
    min: 0,
    max: 100
  },
  locations: [{
    type: String,
    enum: ['nos-locaux', 'client', 'distance']
  }],
  image: {
    type: String // URL de l'image
  },
  syllabus: [
    {
      title: String,
      content: [String]
    }
  ],
  upcomingSessions: [
    {
      startDate: Date,
      endDate: Date,
      location: {
        type: String,
        enum: ['nos-locaux', 'client', 'distance']
      },
      availableSeats: {
        type: Number,
        min: 0
      },
      status: {
        type: String,
        enum: ['planifiee', 'confirmee', 'terminee', 'annulee'],
        default: 'planifiee'
      }
    }
  ],
  rating: {
    average: {
      type: Number,
      default: 0,
      min: 0,
      max: 5
    },
    count: {
      type: Number,
      default: 0,
      min: 0
    }
  },
  testimonials: [
    {
      name: String,
      company: String,
      position: String,
      comment: String,
      rating: {
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

module.exports = mongoose.model('Formation', FormationSchema); 