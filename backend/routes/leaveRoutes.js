const express = require('express');
const router = express.Router();
const leaveController = require('../controllers/leaveController');
const { authMiddleware, requireRole } = require('../middleware/auth');

router.use(authMiddleware);

// Employee leave endpoints
router.get('/my', leaveController.getMyLeaves);
router.post('/', leaveController.applyLeave);
router.get('/balances', leaveController.getLeaveBalances);

// Manager review endpoint
router.get('/team', requireRole('manager', 'hr'), leaveController.getTeamLeaves);

// HR full leave view
router.get('/all', requireRole('hr'), leaveController.getAllLeaves);

// Approve / Reject (Manager & HR)
router.put('/:id/status', requireRole('manager', 'hr'), leaveController.updateLeaveStatus);

module.exports = router;
