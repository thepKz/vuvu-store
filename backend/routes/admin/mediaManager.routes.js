const express = require('express');
const router = express.Router();
const mediaManagerController = require('../../controllers/admin/mediaManager.controller');
const { authMiddleware, restrictTo } = require('../../middleware/authMiddleware');
const { 
  uploadProductImage, 
  uploadCategoryImage, 
  uploadCollectionImage 
} = require('../../config/cloudinary.config');

// All media manager routes require authentication and admin role
router.use(authMiddleware);
router.use(restrictTo('admin'));

// Media library management
router.get('/', mediaManagerController.getMediaLibrary);
router.get('/stats', mediaManagerController.getMediaStats);
router.get('/usage/:publicId', mediaManagerController.getMediaUsage);
router.post('/folder', mediaManagerController.createMediaFolder);
router.delete('/:publicId', mediaManagerController.deleteMedia);

// Media tracking
router.post('/track', mediaManagerController.trackMediaUsage);

// Upload signature for direct uploads
router.post('/signature', mediaManagerController.getUploadSignature);

// Upload routes
router.post(
  '/upload/product', 
  uploadProductImage.single('image'), 
  (req, res) => {
    res.status(200).json({
      status: 'success',
      data: {
        url: req.file.path,
        publicId: req.file.filename,
        format: req.file.format,
        width: req.file.width,
        height: req.file.height
      }
    });
  }
);

router.post(
  '/upload/category', 
  uploadCategoryImage.single('image'), 
  (req, res) => {
    res.status(200).json({
      status: 'success',
      data: {
        url: req.file.path,
        publicId: req.file.filename,
        format: req.file.format,
        width: req.file.width,
        height: req.file.height
      }
    });
  }
);

router.post(
  '/upload/collection', 
  uploadCollectionImage.single('image'), 
  (req, res) => {
    res.status(200).json({
      status: 'success',
      data: {
        url: req.file.path,
        publicId: req.file.filename,
        format: req.file.format,
        width: req.file.width,
        height: req.file.height
      }
    });
  }
);

module.exports = router;