const express = require('express');
const router = express.Router();
const collectionController = require('../controllers/collection.controller');
const { authMiddleware, restrictTo } = require('../middleware/authMiddleware');
const { uploadCollectionImage } = require('../config/cloudinary.config');

// Public routes
router.get('/', collectionController.getAllCollections);
router.get('/:id', collectionController.getCollectionById);
router.get('/:id/products', collectionController.getCollectionProducts);

// Protected routes - Admin only
router.use(authMiddleware);
router.use(restrictTo('admin'));

router.post('/', uploadCollectionImage.single('image'), collectionController.createCollection);
router.patch('/:id', uploadCollectionImage.single('image'), collectionController.updateCollection);
router.delete('/:id', collectionController.deleteCollection);

// Product-collection relationship management
router.post('/:id/products', collectionController.addProductToCollection);
router.delete('/:id/products/:productId', collectionController.removeProductFromCollection);

module.exports = router;