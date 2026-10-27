const express = require('express');
const router = express.Router();
const attendanceController = require('../controllers/attendanceController');
const { authMiddleware, requireRole } = require('../middleware/auth');

router.use(authMiddleware);

// Employee attendance actions
router.get('/today', attendanceController.getTodayStatus);
router.post('/clock-in', attendanceController.clockIn);
router.post('/clock-out', attendanceController.clockOut);
router.get('/my', attendanceController.getMyAttendance);

// Manager team attendance
router.get('/team', requireRole('manager', 'hr'), attendanceController.getTeamAttendance);

// HR company-wide attendance
router.get('/all', requireRole('hr'), attendanceController.getAllAttendance);

module.exports = router;
