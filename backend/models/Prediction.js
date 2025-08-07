const mongoose = require('mongoose');

const predictionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  imageUrl: {
    type: String,
    required: true
  },
  symptoms: {
    type: String,
    required: true
  },
  predictions: {
    cnnResults: [{
      disease: String,
      confidence: Number,
      probability: Number
    }],
    textResults: [{
      disease: String,
      confidence: Number,
      relevanceScore: Number
    }],
    combinedResult: {
      predictedDisease: String,
      overallConfidence: Number,
      riskLevel: {
        type: String,
        enum: ['low', 'medium', 'high', 'critical']
      }
    }
  },
  specialistRouting: {
    recommended: Boolean,
    urgency: {
      type: String,
      enum: ['routine', 'urgent', 'emergency']
    },
    specialistType: String,
    routedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }
  },
  status: {
    type: String,
    enum: ['pending', 'in_review', 'reviewed', 'completed'],
    default: 'pending'
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Prediction', predictionSchema);
