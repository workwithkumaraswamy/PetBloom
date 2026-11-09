const express = require('express');
const router = express.Router();
const reviewController = require('../controllers/reviewController');
const { optionalAuth } = require('../middleware/auth');

router.get('/product/:productId', reviewController.getProductReviews);
router.post('/', optionalAuth, reviewController.createReview);

module.exports = router;
