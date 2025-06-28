const express = require('express');
const router = express.Router();
const mediaController = require('../controllers/media.controller');
const { authMiddleware, restrictTo } = require('../middleware/authMiddleware');
const { 
  uploadProductImage, 
  uploadCategoryImage, 
  uploadCollectionImage 
} = require('../config/cloudinary.config');

// Get upload signature for direct frontend uploads
router.post('/signature', authMiddleware, restrictTo('admin'), mediaController.getUploadSignature);

// Upload routes
router.post(
  '/upload/product', 
  authMiddleware, 
  restrictTo('admin'), 
  uploadProductImage.single('image'), 
  mediaController.uploadImage
);

router.post(
  '/upload/category', 
  authMiddleware, 
  restrictTo('admin'), 
  uploadCategoryImage.single('image'), 
  mediaController.uploadImage
);

router.post(
  '/upload/collection', 
  authMiddleware, 
  restrictTo('admin'), 
  uploadCollectionImage.single('image'), 
  mediaController.uploadImage
);

// Media library management
router.get(
  '/library', 
  authMiddleware, 
  restrictTo('admin'), 
  mediaController.getMediaLibrary
);

router.post(
  '/folder', 
  authMiddleware, 
  restrictTo('admin'), 
  mediaController.createMediaFolder
);

router.delete(
  '/:publicId', 
  authMiddleware, 
  restrictTo('admin'), 
  mediaController.deleteImage
);

// Track media usage
router.post(
  '/track', 
  authMiddleware, 
  restrictTo('admin'), 
  mediaController.trackMediaUsage
);

module.exports = router;