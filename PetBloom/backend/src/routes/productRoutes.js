const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');

router.get('/', productController.getProducts);
router.get('/bestsellers', productController.getBestsellers);
router.get('/emergency-kits', productController.getEmergencyKits);
router.get('/slug/:slug', productController.getProductBySlug);
router.get('/:id', productController.getProductById);

module.exports = router;
