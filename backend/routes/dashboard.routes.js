const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/dashboard.controller');
const { authMiddleware, restrictTo } = require('../middleware/authMiddleware');

// All dashboard routes require authentication and admin role
router.use(authMiddleware);
router.use(restrictTo('admin'));

// Dashboard statistics
router.get('/stats', dashboardController.getDashboardStats);

// Sales overview
router.get('/sales', dashboardController.getSalesOverview);

// Customer insights
router.get('/customers', dashboardController.getCustomerInsights);

// Inventory status
router.get('/inventory', dashboardController.getInventoryStatus);

// Analytics overview
router.get('/analytics', dashboardController.getAnalyticsOverview);

module.exports = router;