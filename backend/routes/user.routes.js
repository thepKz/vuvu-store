const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');
const { authMiddleware, restrictTo } = require('../middleware/authMiddleware');

// User profile routes - accessible to the user themselves
router.get('/profile', userController.getProfile);
router.patch('/profile', userController.updateProfile);
router.get('/orders', userController.getUserOrders);
router.get('/view-history', userController.getViewHistory);
router.get('/favorites', userController.getFavorites);
router.post('/favorites/:productId', userController.addFavorite);
router.delete('/favorites/:productId', userController.removeFavorite);

// Admin routes - restricted to admin users
router.use(restrictTo('admin'));

router.get('/', userController.getAllUsers);
router.get('/:id', userController.getUserById);
router.patch('/:id', userController.updateUser);
router.delete('/:id', userController.deleteUser);

module.exports = router;