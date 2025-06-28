const express = require('express');
const router = express.Router();
const productManagerController = require('../../controllers/admin/productManager.controller');
const { authMiddleware, restrictTo } = require('../../middleware/authMiddleware');
const { uploadProductImage } = require('../../config/cloudinary.config');

// All product manager routes require authentication and admin role
router.use(authMiddleware);
router.use(restrictTo('admin'));

// Product management routes
router.get('/', productManagerController.getAllProducts);
router.post('/', uploadProductImage.single('image'), productManagerController.createProduct);
router.get('/:id', productManagerController.getProductById);
router.patch('/:id', uploadProductImage.single('image'), productManagerController.updateProduct);
router.delete('/:id', productManagerController.deleteProduct);

// Product variants management
router.get('/:id/variants', productManagerController.getProductVariants);
router.post('/:id/variants', uploadProductImage.single('image'), productManagerController.createProductVariant);
router.patch('/:id/variants/:variantId', uploadProductImage.single('image'), productManagerController.updateProductVariant);
router.delete('/:id/variants/:variantId', productManagerController.deleteProductVariant);

// Bulk operations
router.patch('/stock/bulk-update', productManagerController.bulkUpdateStock);

// Analytics
router.get('/:id/views', productManagerController.getProductViewStats);

module.exports = router;