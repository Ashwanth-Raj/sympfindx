const Prediction = require('../models/Prediction');
const cloudinary = require('../config/cloudinary');
const { PythonShell } = require('python-shell');
const path = require('path');

// Create prediction
exports.createPrediction = async (req, res) => {
  try {
    const { symptoms } = req.body;
    const userId = req.user.id;

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'Please upload an eye image'
      });
    }

    // Upload to Cloudinary
    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: 'sympfindx/eye-images'
    });

    // Run ML analysis (mock for now)
    const mockPrediction = {
      cnnResults: [
        { disease: 'conjunctivitis', confidence: 0.85, probability: 85 },
        { disease: 'normal', confidence: 0.12, probability: 12 },
        { disease: 'stye', confidence: 0.03, probability: 3 }
      ],
      textResults: [
        { disease: 'conjunctivitis', confidence: 0.78, relevanceScore: 78 }
      ],
      combinedResult: {
        predictedDisease: 'conjunctivitis',
        overallConfidence: 0.82,
        riskLevel: 'medium'
      }
    };

    // Determine specialist routing
    const specialistRouting = {
      recommended: mockPrediction.combinedResult.overallConfidence > 0.7,
      urgency: 'routine',
      specialistType: 'general-ophthalmologist'
    };

    // Save prediction
    const prediction = await Prediction.create({
      userId,
      imageUrl: result.secure_url,
      symptoms,
      predictions: mockPrediction,
      specialistRouting
    });

    res.status(201).json({
      success: true,
      message: 'Prediction completed successfully',
      data: {
        predictionId: prediction._id,
        results: mockPrediction.combinedResult,
        specialistRouting,
        imageUrl: result.secure_url
      }
    });

  } catch (error) {
    console.error('Prediction error:', error);
    res.status(500).json({
      success: false,
      message: 'Error processing prediction'
    });
  }
};

// Get prediction history
exports.getPredictionHistory = async (req, res) => {
  try {
    const predictions = await Prediction.find({ userId: req.user.id })
      .sort({ createdAt: -1 })
      .limit(10);

    res.status(200).json({
      success: true,
      count: predictions.length,
      data: predictions
    });
  } catch (error) {
    console.error('Get history error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching prediction history'
    });
  }
};

// Get single prediction
exports.getPrediction = async (req, res) => {
  try {
    const prediction = await Prediction.findById(req.params.id);

    if (!prediction) {
      return res.status(404).json({
        success: false,
        message: 'Prediction not found'
      });
    }

    // Check ownership
    if (prediction.userId.toString() !== req.user.id && req.user.role !== 'specialist') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to access this prediction'
      });
    }

    res.status(200).json({
      success: true,
      data: prediction
    });
  } catch (error) {
    console.error('Get prediction error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching prediction'
    });
  }
};
