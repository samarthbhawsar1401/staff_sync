const express = require('express');
const router = express.Router();
const announcementController = require('../controllers/announcementController');
const { authMiddleware, requireRole } = require('../middleware/auth');

router.use(authMiddleware);

// All users can view announcements
router.get('/', announcementController.getAnnouncements);

// Only HR can create, update, delete
router.post('/', requireRole('hr'), announcementController.createAnnouncement);
router.put('/:id', requireRole('hr'), announcementController.updateAnnouncement);
router.delete('/:id', requireRole('hr'), announcementController.deleteAnnouncement);

module.exports = router;
