const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { authenticate, requireAdmin } = require('../middleware/auth');

router.use(authenticate, requireAdmin);

// Dashboard
router.get('/stats', adminController.getStats);

// Products
router.get('/products', adminController.getAdminProducts);
router.post('/products', adminController.createProduct);
router.put('/products/:id', adminController.updateProduct);
router.delete('/products/:id', adminController.deleteProduct);

// Orders
router.get('/orders', adminController.getAdminOrders);
router.put('/orders/:id/status', adminController.updateOrderStatus);

// Customers
router.get('/customers', adminController.getCustomers);

// Coupons
router.get('/coupons', adminController.getAdminCoupons);
router.post('/coupons', adminController.createCoupon);
router.delete('/coupons/:id', adminController.deleteCoupon);

// Contact messages & subscribers
router.get('/contact-messages', adminController.getContactMessages);
router.put('/contact-messages/:id/read', adminController.markMessageRead);
router.get('/newsletter-subscribers', adminController.getNewsletterSubscribers);

module.exports = router;
