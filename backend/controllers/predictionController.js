const Prediction = require('../models/Prediction');
const { PythonShell } = require('python-shell');
const cloudinary = require('../config/cloudinary');
const path = require('path');

// Process image and symptoms for prediction
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

    // Upload image to Cloudinary
    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: 'sympfindx/eye-images',
      resource_type: 'image'
    });

    // Prepare data for ML models
    const mlData = {
      imagePath: result.secure_url,
      symptoms: symptoms,
      userId: userId
    };

    // Run CNN image classification
    const cnnResults = await runImageClassification(result.secure_url);
    
    // Run text classification on symptoms
    const textResults = await runSymptomClassification(symptoms);

    // Combine results and calculate confidence
    const combinedResult = combineResults(cnnResults, textResults);

    // Determine specialist routing
    const specialistRouting = determineSpecialistRouting(combinedResult);

    // Save prediction to database
    const prediction = await Prediction.create({
      userId,
      imageUrl: result.secure_url,
      symptoms,
      predictions: {
        cnnResults,
        textResults,
        combinedResult
      },
      specialistRouting
    });

    res.status(201).json({
      success: true,
      message: 'Prediction completed successfully',
      data: {
        predictionId: prediction._id,
        results: combinedResult,
        specialistRouting,
        imageUrl: result.secure_url
      }
    });

  } catch (error) {
    console.error('Prediction error:', error);
    res.status(500).json({
      success: false,
      message: 'Error processing prediction',
      error: error.message
    });
  }
};

// Run CNN image classification
async function runImageClassification(imageUrl) {
  return new Promise((resolve, reject) => {
    const options = {
      mode: 'json',
      pythonPath: process.env.PYTHON_PATH,
      scriptPath: path.join(__dirname, '../ml_models/'),
      args: [imageUrl]
    };

    PythonShell.run('image_classifier.py', options, (err, results) => {
      if (err) {
        console.error('CNN classification error:', err);
        reject(err);
      } else {
        resolve(results[0]);
      }
    });
  });
}

// Run symptom text classification
async function runSymptomClassification(symptoms) {
  return new Promise((resolve, reject) => {
    const options = {
      mode: 'json',
      pythonPath: process.env.PYTHON_PATH,
      scriptPath: path.join(__dirname, '../ml_models/'),
      args: [symptoms]
    };

    PythonShell.run('text_classifier.py', options, (err, results) => {
      if (err) {
        console.error('Text classification error:', err);
        reject(err);
      } else {
        resolve(results[0]);
      }
    });
  });
}

// Combine CNN and text results
function combineResults(cnnResults, textResults) {
  // Weighted combination: 70% CNN, 30% text
  const combinedScores = {};
  
  // Process CNN results (70% weight)
  cnnResults.forEach(result => {
    combinedScores[result.disease] = (combinedScores[result.disease] || 0) + (result.confidence * 0.7);
  });

  // Process text results (30% weight)
  textResults.forEach(result => {
    combinedScores[result.disease] = (combinedScores[result.disease] || 0) + (result.confidence * 0.3);
  });

  // Find highest scoring disease
  let maxScore = 0;
  let predictedDisease = 'unknown';
  
  Object.entries(combinedScores).forEach(([disease, score]) => {
    if (score > maxScore) {
      maxScore = score;
      predictedDisease = disease;
    }
  });

  // Determine risk level
  let riskLevel = 'low';
  if (maxScore > 0.8) riskLevel = 'critical';
  else if (maxScore > 0.6) riskLevel = 'high';
  else if (maxScore > 0.4) riskLevel = 'medium';

  return {
    predictedDisease,
    overallConfidence: maxScore,
    riskLevel,
    detailedScores: combinedScores
  };
}

// Determine specialist routing
function determineSpecialistRouting(combinedResult) {
  const { predictedDisease, riskLevel, overallConfidence } = combinedResult;
  
  // High confidence and high risk = immediate specialist referral
  if (overallConfidence > 0.7 && ['high', 'critical'].includes(riskLevel)) {
    return {
      recommended: true,
      urgency: riskLevel === 'critical' ? 'emergency' : 'urgent',
      specialistType: getSpecialistType(predictedDisease)
    };
  }
  
  // Medium confidence = routine referral
  if (overallConfidence > 0.5) {
    return {
      recommended: true,
      urgency: 'routine',
      specialistType: getSpecialistType(predictedDisease)
    };
  }

  // Low confidence = monitoring recommended
  return {
    recommended: false,
    urgency: 'routine',
    specialistType: 'general-ophthalmologist'
  };
}

// Get appropriate specialist type
function getSpecialistType(disease) {
  const specialistMap = {
    'diabetic_retinopathy': 'retina-specialist',
    'glaucoma': 'glaucoma-specialist',
    'conjunctivitis': 'general-ophthalmologist',
    'stye': 'general-ophthalmologist',
    'chalazion': 'oculoplastic-surgeon',
    'blepharitis': 'general-ophthalmologist'
  };
  
  return specialistMap[disease] || 'general-ophthalmologist';
}

// Get user's prediction history
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
