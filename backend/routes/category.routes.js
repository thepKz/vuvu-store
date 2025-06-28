const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/category.controller');
const { authMiddleware, restrictTo } = require('../middleware/authMiddleware');
const { uploadCategoryImage } = require('../config/cloudinary.config');

// Public routes
router.get('/', categoryController.getAllCategories);
router.get('/:id', categoryController.getCategoryById);
router.get('/:id/products', categoryController.getCategoryProducts);

// Protected routes - Admin only
router.use(authMiddleware);
router.use(restrictTo('admin'));

router.post('/', uploadCategoryImage.single('image'), categoryController.createCategory);
router.patch('/:id', uploadCategoryImage.single('image'), categoryController.updateCategory);
router.delete('/:id', categoryController.deleteCategory);

module.exports = router;