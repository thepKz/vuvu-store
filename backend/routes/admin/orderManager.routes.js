const express = require('express');
const router = express.Router();
const orderManagerController = require('../../controllers/admin/orderManager.controller');
const { authMiddleware, restrictTo } = require('../../middleware/authMiddleware');

// All order manager routes require authentication and admin role
router.use(authMiddleware);
router.use(restrictTo('admin'));

// Order management routes
router.get('/', orderManagerController.getAllOrders);
router.get('/stats', orderManagerController.getOrderStats);
router.get('/export', orderManagerController.exportOrders);
router.get('/:id', orderManagerController.getOrderById);
router.patch('/:id/status', orderManagerController.updateOrderStatus);
router.post('/:id/notes', orderManagerController.addOrderNote);

module.exports = router;