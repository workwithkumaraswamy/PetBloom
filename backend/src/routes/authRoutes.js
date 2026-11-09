const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { authenticate } = require('../middleware/auth');

router.post('/register', authController.register);
router.post('/login', authController.login);
router.get('/me', authenticate, authController.getMe);
router.put('/profile', authenticate, authController.updateProfile);
router.post('/change-password', authenticate, authController.changePassword);
router.post('/forgot-password', authController.forgotPassword);
router.post('/reset-password', authController.resetPassword);

// User Addresses
router.get('/addresses', authenticate, authController.getAddresses);
router.post('/addresses', authenticate, authController.addAddress);
router.put('/addresses/:id', authenticate, authController.updateAddress);
router.delete('/addresses/:id', authenticate, authController.deleteAddress);

module.exports = router;
