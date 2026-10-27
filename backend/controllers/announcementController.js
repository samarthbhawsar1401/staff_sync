const Announcement = require('../models/Announcement');
const Notification = require('../models/Notification');
const User = require('../models/User');

// GET /api/announcements
exports.getAnnouncements = async (req, res) => {
  try {
    const announcements = await Announcement.find({});
    // Department filtering: show 'All' and employee's department
    let filtered = announcements;
    if (req.user && req.user.department && req.user.role === 'employee') {
      filtered = announcements.filter(a => a.department === 'All' || a.department === req.user.department);
    }
    filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    res.json(filtered);
  } catch (err) {
    console.error('Error fetching announcements:', err);
    res.status(500).json({ message: 'Failed to fetch announcements.' });
  }
};

// POST /api/announcements (HR only)
exports.createAnnouncement = async (req, res) => {
  try {
    const { title, content, priority, department } = req.body;
    if (!title || !content) {
      return res.status(400).json({ message: 'Title and content are required.' });
    }

    const item = await Announcement.create({
      title: title.trim(),
      content: content.trim(),
      priority: priority || 'Normal',
      department: department || 'All',
      authorId: req.user.id,
      authorName: req.user.name,
      createdAt: new Date().toISOString()
    });

    // Notify users
    const allUsers = await User.find({});
    const targetUsers = allUsers.filter(u => u._id !== req.user.id && (department === 'All' || u.department === department));

    for (const u of targetUsers.slice(0, 10)) {
      await Notification.create({
        userId: u._id,
        title: `Announcement: ${title}`,
        message: `${priority === 'Urgent' ? '⚠️ URGENT: ' : ''}${title} - posted by ${req.user.name}`,
        type: 'announcement'
      });
    }

    res.status(201).json({
      message: 'Announcement published successfully.',
      announcement: item
    });
  } catch (err) {
    console.error('Error creating announcement:', err);
    res.status(500).json({ message: 'Failed to create announcement.' });
  }
};

// PUT /api/announcements/:id (HR only)
exports.updateAnnouncement = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, content, priority, department } = req.body;

    const existing = await Announcement.findById(id);
    if (!existing) {
      return res.status(404).json({ message: 'Announcement not found.' });
    }

    const updated = await Announcement.findByIdAndUpdate(id, {
      title: title ? title.trim() : existing.title,
      content: content ? content.trim() : existing.content,
      priority: priority || existing.priority,
      department: department || existing.department
    });

    res.json({
      message: 'Announcement updated successfully.',
      announcement: updated
    });
  } catch (err) {
    res.status(500).json({ message: 'Failed to update announcement.' });
  }
};

// DELETE /api/announcements/:id (HR only)
exports.deleteAnnouncement = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Announcement.findByIdAndDelete(id);
    if (!deleted) {
      return res.status(404).json({ message: 'Announcement not found.' });
    }
    res.json({ message: 'Announcement deleted successfully.' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete announcement.' });
  }
};
