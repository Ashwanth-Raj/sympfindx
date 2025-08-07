const express = require('express');
const {
  getPendingCases,
  reviewCase,
  getReviewedCases,
  getStats
} = require('../controllers/specialistController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

// All routes require authentication and specialist role
router.use(protect);
router.use(authorize('specialist', 'admin'));

router.get('/pending-cases', getPendingCases);
router.post('/review-case', reviewCase);
router.get('/reviewed-cases', getReviewedCases);
router.get('/stats', getStats);

module.exports = router;
