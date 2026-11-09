const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/paymentController');

router.post('/razorpay/create-order', paymentController.createRazorpayOrder);
router.post('/razorpay/verify', paymentController.verifyRazorpayPayment);
router.post('/cod/confirm', paymentController.confirmCOD);

module.exports = router;
