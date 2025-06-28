const express = require('express');
const router = express.Router();
const settingsManagerController = require('../../controllers/admin/settingsManager.controller');
const { authMiddleware, restrictTo } = require('../../middleware/authMiddleware');

// All settings manager routes require authentication and admin role
router.use(authMiddleware);
router.use(restrictTo('admin'));

// Settings management routes
router.get('/', settingsManagerController.getAllSettings);
router.patch('/', settingsManagerController.updateSettings);
router.get('/group/:group', settingsManagerController.getSettingGroup);
router.get('/system-info', settingsManagerController.getSystemInfo);
router.post('/clear-cache', settingsManagerController.clearCache);
router.post('/maintenance', settingsManagerController.runMaintenance);

module.exports = router;