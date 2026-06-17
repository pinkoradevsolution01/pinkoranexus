const express = require('express');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

// Subscription management routes
router.get('/', authMiddleware, (req, res) => {
  res.json({ message: 'Get subscriptions' });
});

router.post('/', authMiddleware, (req, res) => {
  res.json({ message: 'Create subscription' });
});

module.exports = router;
