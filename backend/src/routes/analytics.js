const express = require('express');
const AnalyticsController = require('../controllers/analyticsController');
const authMiddleware = require('../middleware/auth');
const tenantMiddleware = require('../middleware/tenant');
const roleMiddleware = require('../middleware/role');

const router = express.Router();

// Tenant analytics
router.get('/dashboard', authMiddleware, tenantMiddleware, AnalyticsController.getDashboardStats);

// Admin system metrics
router.get('/system/metrics', authMiddleware, roleMiddleware(['admin']), AnalyticsController.getSystemMetrics);

module.exports = router;
