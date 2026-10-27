const Notification = require('../models/Notification');

// GET /api/notifications
exports.getMyNotifications = async (req, res) => {
  try {
    const list = await Notification.find({ userId: req.user.id });
    list.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    res.json(list);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch notifications.' });
  }
};

// PUT /api/notifications/:id/read
exports.markAsRead = async (req, res) => {
  try {
    const { id } = req.params;
    const updated = await Notification.findByIdAndUpdate(id, { read: true });
    res.json({ message: 'Marked as read.', notification: updated });
  } catch (err) {
    res.status(500).json({ message: 'Failed to update notification.' });
  }
};

// PUT /api/notifications/read-all
exports.markAllAsRead = async (req, res) => {
  try {
    const list = await Notification.find({ userId: req.user.id, read: false });
    for (const item of list) {
      await Notification.findByIdAndUpdate(item._id, { read: true });
    }
    res.json({ message: 'All notifications marked as read.' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to mark all notifications as read.' });
  }
};
