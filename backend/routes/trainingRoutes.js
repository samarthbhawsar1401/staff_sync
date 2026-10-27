const express = require('express');
const router = express.Router();
const trainingController = require('../controllers/trainingController');
const { authMiddleware, requireRole } = require('../middleware/auth');

router.use(authMiddleware);

// All users can view training catalog
router.get('/', trainingController.getAllTrainings);

// Self-enrollment (Employee / Any user)
router.post('/:id/enroll', trainingController.enrollTraining);

// Manager / HR actions
router.post('/', requireRole('manager', 'hr'), trainingController.createTraining);
router.put('/:id', requireRole('manager', 'hr'), trainingController.updateTraining);
router.delete('/:id', requireRole('manager', 'hr'), trainingController.deleteTraining);
router.post('/:id/assign', requireRole('manager', 'hr'), trainingController.assignTraining);

module.exports = router;
