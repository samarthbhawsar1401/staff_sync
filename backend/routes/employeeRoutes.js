const express = require('express');
const router = express.Router();
const employeeController = require('../controllers/employeeController');
const { authMiddleware, requireRole } = require('../middleware/auth');

router.use(authMiddleware);

// Team members (Manager & HR)
router.get('/team', requireRole('manager', 'hr'), employeeController.getTeamMembers);

// All employees (All authenticated roles can view directory, but HR has full list control)
router.get('/', employeeController.getAllEmployees);
router.get('/:id', employeeController.getEmployeeById);

// Create employee (HR only)
router.post('/', requireRole('hr'), employeeController.createEmployee);

// Update employee (HR or Manager)
router.put('/:id', requireRole('hr', 'manager'), employeeController.updateEmployee);

// Delete employee (HR only)
router.delete('/:id', requireRole('hr'), employeeController.deleteEmployee);

module.exports = router;
