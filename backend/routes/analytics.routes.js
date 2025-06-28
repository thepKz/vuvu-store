const express = require('express');
const router = express.Router();
const analyticsController = require('../controllers/analytics.controller');
const { authMiddleware, restrictTo } = require('../middleware/authMiddleware');

// All analytics routes require authentication
router.use(authMiddleware);

// Public analytics - accessible to all authenticated users
router.get('/products/popular', analyticsController.getMostViewedProducts);

// Admin analytics - restricted to admin users
router.use(restrictTo('admin'));

router.get('/dashboard', analyticsController.getDashboardStats);
router.get('/products/views', analyticsController.getProductViewStats);
router.get('/users/activity', analyticsController.getUserActivityStats);
router.get('/sales', analyticsController.getSalesStats);

module.exports = router;