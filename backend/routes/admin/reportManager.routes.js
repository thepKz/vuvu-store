const express = require('express');
const router = express.Router();
const reportManagerController = require('../../controllers/admin/reportManager.controller');
const { authMiddleware, restrictTo } = require('../../middleware/authMiddleware');

// All report manager routes require authentication and admin role
router.use(authMiddleware);
router.use(restrictTo('admin'));

// Report routes
router.get('/sales', reportManagerController.getSalesReport);
router.get('/products', reportManagerController.getProductReport);
router.get('/customers', reportManagerController.getCustomerReport);
router.get('/inventory', reportManagerController.getInventoryReport);

module.exports = router;