const Prediction = require('../models/Prediction');
const User = require('../models/User');

// Get pending cases for specialist review
exports.getPendingCases = async (req, res) => {
  try {
    const pendingCases = await Prediction.find({
      status: 'pending',
      'specialistRouting.recommended': true
    })
    .populate('userId', 'name email')
    .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: pendingCases.length,
      data: pendingCases
    });
  } catch (error) {
    console.error('Get pending cases error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching pending cases'
    });
  }
};

// Review a case
exports.reviewCase = async (req, res) => {
  try {
    const { predictionId, diagnosis, reviewNotes, recommendation } = req.body;

    const prediction = await Prediction.findByIdAndUpdate(
      predictionId,
      {
        status: 'reviewed',
        'specialistRouting.routedTo': req.user.id,
        'specialistRouting.routedAt': new Date(),
        specialistReview: {
          reviewedBy: req.user.id,
          finalDiagnosis: diagnosis,
          clinicalNotes: reviewNotes,
          treatmentRecommendation: recommendation,
          reviewedAt: new Date()
        }
      },
      { new: true }
    );

    if (!prediction) {
      return res.status(404).json({
        success: false,
        message: 'Prediction not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Case reviewed successfully',
      data: prediction
    });
  } catch (error) {
    console.error('Review case error:', error);
    res.status(500).json({
      success: false,
      message: 'Error reviewing case'
    });
  }
};

// Get reviewed cases
exports.getReviewedCases = async (req, res) => {
  try {
    const reviewedCases = await Prediction.find({
      'specialistReview.reviewedBy': req.user.id
    })
    .populate('userId', 'name email')
    .sort({ 'specialistReview.reviewedAt': -1 })
    .limit(20);

    res.status(200).json({
      success: true,
      count: reviewedCases.length,
      data: reviewedCases
    });
  } catch (error) {
    console.error('Get reviewed cases error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching reviewed cases'
    });
  }
};

// Get specialist stats
exports.getStats = async (req, res) => {
  try {
    const totalReviewed = await Prediction.countDocuments({
      'specialistReview.reviewedBy': req.user.id
    });

    const pendingCount = await Prediction.countDocuments({
      status: 'pending',
      'specialistRouting.recommended': true
    });

    res.status(200).json({
      success: true,
      data: {
        totalReviewed,
        pendingCount,
        averageResponseTime: '2.3h',
        accuracyRate: '94%'
      }
    });
  } catch (error) {
    console.error('Get stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching statistics'
    });
  }
};
