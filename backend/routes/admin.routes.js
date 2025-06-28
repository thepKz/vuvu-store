const express = require('express');
const router = express.Router();
const adminController = require('../controllers/admin.controller');
const { restrictTo } = require('../middleware/authMiddleware');

// All admin routes require admin role
router.use(restrictTo('admin'));

// Dashboard
router.get('/dashboard', adminController.getDashboardStats);

// Bulk operations
router.post('/products/bulk-create', adminController.bulkCreateProducts);
router.patch('/products/bulk-update', adminController.bulkUpdateProducts);
router.delete('/products/bulk-delete', adminController.bulkDeleteProducts);

// Export data
router.get('/export/products', adminController.exportProducts);
router.get('/export/orders', adminController.exportOrders);
router.get('/export/users', adminController.exportUsers);

// Import data
router.post('/import/products', adminController.importProducts);

// System settings
router.get('/settings', adminController.getSettings);
router.patch('/settings', adminController.updateSettings);

module.exports = router;