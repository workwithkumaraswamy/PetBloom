const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const { optionalAuth, authenticate } = require('../middleware/auth');

router.post('/create', optionalAuth, orderController.createOrder);
router.get('/my-orders', authenticate, orderController.getMyOrders);
router.get('/:id', optionalAuth, orderController.getOrderById);
router.post('/cancel/:id', authenticate, orderController.cancelOrder);

module.exports = router;
