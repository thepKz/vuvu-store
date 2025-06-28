const express = require('express');
const router = express.Router();
const analyticsManagerController = require('../../controllers/admin/analyticsManager.controller');
const { authMiddleware, restrictTo } = require('../../middleware/authMiddleware');

// All analytics manager routes require authentication and admin role
router.use(authMiddleware);
router.use(restrictTo('admin'));

// Analytics routes
router.get('/product-views', analyticsManagerController.getProductViewAnalytics);
router.get('/user-activity', analyticsManagerController.getUserActivityAnalytics);
router.get('/searches', analyticsManagerController.getSearchAnalytics);
router.get('/conversions', analyticsManagerController.getConversionAnalytics);
router.get('/real-time', analyticsManagerController.getRealTimeAnalytics);

module.exports = router;