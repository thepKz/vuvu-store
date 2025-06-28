const express = require('express');
const router = express.Router();
const userManagerController = require('../../controllers/admin/userManager.controller');
const { authMiddleware, restrictTo } = require('../../middleware/authMiddleware');

// All user manager routes require authentication and admin role
router.use(authMiddleware);
router.use(restrictTo('admin'));

// User management routes
router.get('/', userManagerController.getAllUsers);
router.post('/', userManagerController.createUser);
router.get('/stats', userManagerController.getUserStats);
router.get('/export', userManagerController.exportUsers);
router.get('/:id', userManagerController.getUserById);
router.patch('/:id', userManagerController.updateUser);
router.patch('/:id/reset-password', userManagerController.resetUserPassword);
router.patch('/:id/anonymize', userManagerController.anonymizeUser);
router.delete('/:id', userManagerController.deleteUser);

module.exports = router;