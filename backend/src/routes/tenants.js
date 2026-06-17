const express = require('express');
const TenantController = require('../controllers/tenantController');
const authMiddleware = require('../middleware/auth');
const roleMiddleware = require('../middleware/role');

const router = express.Router();

// Admin only routes
router.get('/', authMiddleware, roleMiddleware(['admin']), TenantController.getAllTenants);
router.post('/', authMiddleware, roleMiddleware(['admin']), TenantController.createTenant);
router.get('/:id', authMiddleware, TenantController.getTenant);
router.patch('/:id/subscription', authMiddleware, roleMiddleware(['admin']), TenantController.updateSubscriptionTier);
router.patch('/:id/status', authMiddleware, roleMiddleware(['admin']), TenantController.toggleStatus);

module.exports = router;
