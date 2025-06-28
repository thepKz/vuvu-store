const express = require('express');
const router = express.Router();
const { authMiddleware, restrictTo } = require('../middleware/authMiddleware');

// Import admin sub-routes
const productManagerRoutes = require('./admin/productManager.routes');
const orderManagerRoutes = require('./admin/orderManager.routes');
const userManagerRoutes = require('./admin/userManager.routes');
const settingsManagerRoutes = require('./admin/settingsManager.routes');
const analyticsManagerRoutes = require('./admin/analyticsManager.routes');
const mediaManagerRoutes = require('./admin/mediaManager.routes');
const reportManagerRoutes = require('./admin/reportManager.routes');
const dashboardRoutes = require('./dashboard.routes');

// All admin routes require authentication and admin role
router.use(authMiddleware);
router.use(restrictTo('admin'));

// Mount admin sub-routes
router.use('/products', productManagerRoutes);
router.use('/orders', orderManagerRoutes);
router.use('/users', userManagerRoutes);
router.use('/settings', settingsManagerRoutes);
router.use('/analytics', analyticsManagerRoutes);
router.use('/media', mediaManagerRoutes);
router.use('/reports', reportManagerRoutes);
router.use('/dashboard', dashboardRoutes);

module.exports = router;