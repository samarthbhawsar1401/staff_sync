const express = require('express');
const router = express.Router();
const analyticsController = require('../controllers/analyticsController');
const { authMiddleware, requireRole } = require('../middleware/auth');

router.use(authMiddleware);

// HR and Managers can view dashboards and analytics
router.get('/dashboard', requireRole('hr', 'manager'), analyticsController.getDashboardStats);

module.exports = router;
