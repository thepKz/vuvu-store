const express = require('express');
const router = express.Router();
const productController = require('../controllers/product.controller');
const { authMiddleware, restrictTo } = require('../middleware/authMiddleware');
const { uploadProductImage } = require('../config/cloudinary.config');

// Public routes
router.get('/', productController.getAllProducts);
router.get('/featured', productController.getFeaturedProducts);
router.get('/new', productController.getNewProducts);
router.get('/sale', productController.getSaleProducts);
router.get('/:id', productController.getProductById);
router.get('/:id/related', productController.getRelatedProducts);
router.get('/:id/variants', productController.getProductVariants);
router.post('/search', productController.searchProducts);

// Protected routes - Admin only
router.use(authMiddleware);
router.use(restrictTo('admin'));

router.post('/', uploadProductImage.single('image'), productController.createProduct);
router.patch('/:id', uploadProductImage.single('image'), productController.updateProduct);
router.delete('/:id', productController.deleteProduct);

// Variant routes
router.post('/:id/variants', uploadProductImage.single('image'), productController.createProductVariant);
router.patch('/:id/variants/:variantId', uploadProductImage.single('image'), productController.updateProductVariant);
router.delete('/:id/variants/:variantId', productController.deleteProductVariant);

module.exports = router;