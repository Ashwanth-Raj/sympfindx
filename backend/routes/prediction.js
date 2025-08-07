const express = require('express');
const { 
  createPrediction, 
  getPredictionHistory, 
  getPrediction 
} = require('../controllers/predictionController');
const { protect } = require('../middleware/auth');
const upload = require('../middleware/upload');

const router = express.Router();

// All routes are protected
router.use(protect);

router.post('/analyze', upload.single('image'), createPrediction);
router.get('/history', getPredictionHistory);
router.get('/:id', getPrediction);

module.exports = router;
