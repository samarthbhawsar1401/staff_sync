const Training = require('../models/Training');
const User = require('../models/User');
const Notification = require('../models/Notification');

// GET /api/trainings
exports.getAllTrainings = async (req, res) => {
  try {
    const trainings = await Training.find({});
    const allUsers = await User.find({});

    // Augment enrolled employee details
    const enriched = trainings.map(t => {
      const enrolledDetails = (t.enrolledEmployees || []).map(empId => {
        const u = allUsers.find(x => x._id === empId);
        return u ? { _id: u._id, name: u.name, email: u.email, department: u.department, avatar: u.avatar } : { _id: empId, name: 'Employee' };
      });

      return {
        ...t,
        enrolledDetails,
        isEnrolled: (t.enrolledEmployees || []).includes(req.user.id)
      };
    });

    enriched.sort((a, b) => new Date(a.startDate) - new Date(b.startDate));
    res.json(enriched);
  } catch (err) {
    console.error('Error fetching trainings:', err);
    res.status(500).json({ message: 'Failed to fetch training programs.' });
  }
};

// POST /api/trainings (HR or Manager)
exports.createTraining = async (req, res) => {
  try {
    const { title, description, instructor, department, durationHours, startDate, endDate, maxCapacity } = req.body;
    if (!title || !description || !instructor || !startDate || !endDate) {
      return res.status(400).json({ message: 'Title, description, instructor, and dates are required.' });
    }

    const training = await Training.create({
      title: title.trim(),
      description: description.trim(),
      instructor: instructor.trim(),
      department: department || 'All',
      durationHours: Number(durationHours) || 8,
      startDate,
      endDate,
      maxCapacity: Number(maxCapacity) || 25,
      enrolledEmployees: [],
      status: 'Upcoming'
    });

    res.status(201).json({
      message: 'Training program scheduled successfully.',
      training
    });
  } catch (err) {
    console.error('Error creating training:', err);
    res.status(500).json({ message: 'Failed to create training program.' });
  }
};

// PUT /api/trainings/:id (HR or Manager)
exports.updateTraining = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, instructor, department, durationHours, startDate, endDate, maxCapacity, status } = req.body;

    const existing = await Training.findById(id);
    if (!existing) {
      return res.status(404).json({ message: 'Training program not found.' });
    }

    const updated = await Training.findByIdAndUpdate(id, {
      title: title || existing.title,
      description: description || existing.description,
      instructor: instructor || existing.instructor,
      department: department || existing.department,
      durationHours: durationHours ? Number(durationHours) : existing.durationHours,
      startDate: startDate || existing.startDate,
      endDate: endDate || existing.endDate,
      maxCapacity: maxCapacity ? Number(maxCapacity) : existing.maxCapacity,
      status: status || existing.status
    });

    res.json({
      message: 'Training program updated successfully.',
      training: updated
    });
  } catch (err) {
    res.status(500).json({ message: 'Failed to update training program.' });
  }
};

// DELETE /api/trainings/:id (HR or Manager)
exports.deleteTraining = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Training.findByIdAndDelete(id);
    if (!deleted) {
      return res.status(404).json({ message: 'Training not found.' });
    }
    res.json({ message: 'Training program deleted successfully.' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete training program.' });
  }
};

// POST /api/trainings/:id/enroll (Self-enroll)
exports.enrollTraining = async (req, res) => {
  try {
    const { id } = req.params;
    const training = await Training.findById(id);
    if (!training) {
      return res.status(404).json({ message: 'Training program not found.' });
    }

    const enrolled = training.enrolledEmployees || [];
    if (enrolled.includes(req.user.id)) {
      return res.status(400).json({ message: 'You are already enrolled in this training.' });
    }

    if (enrolled.length >= (training.maxCapacity || 25)) {
      return res.status(400).json({ message: 'This training cohort has reached maximum capacity.' });
    }

    const updated = await Training.findByIdAndUpdate(id, {
      $push: { enrolledEmployees: req.user.id }
    });

    await Notification.create({
      userId: req.user.id,
      title: 'Training Enrollment Confirmed',
      message: `You are confirmed for "${training.title}" starting on ${training.startDate}.`,
      type: 'training'
    });

    res.json({
      message: `Successfully enrolled in ${training.title}!`,
      training: updated
    });
  } catch (err) {
    console.error('Error enrolling training:', err);
    res.status(500).json({ message: 'Failed to enroll in training.' });
  }
};

// POST /api/trainings/:id/assign (Manager/HR assign employee)
exports.assignTraining = async (req, res) => {
  try {
    const { id } = req.params;
    const { employeeId } = req.body;

    if (!employeeId) {
      return res.status(400).json({ message: 'Target employeeId is required.' });
    }

    const training = await Training.findById(id);
    if (!training) {
      return res.status(404).json({ message: 'Training not found.' });
    }

    const emp = await User.findById(employeeId);
    if (!emp) {
      return res.status(404).json({ message: 'Target employee not found.' });
    }

    const enrolled = training.enrolledEmployees || [];
    if (enrolled.includes(employeeId)) {
      return res.status(400).json({ message: `${emp.name} is already enrolled in this training.` });
    }

    const updated = await Training.findByIdAndUpdate(id, {
      $push: { enrolledEmployees: employeeId }
    });

    await Notification.create({
      userId: employeeId,
      title: 'New Training Assigned',
      message: `${req.user.name} assigned you to the training program "${training.title}" (${training.startDate} - ${training.endDate}).`,
      type: 'training'
    });

    res.json({
      message: `${emp.name} has been enrolled in ${training.title}.`,
      training: updated
    });
  } catch (err) {
    console.error('Error assigning training:', err);
    res.status(500).json({ message: 'Failed to assign employee to training.' });
  }
};
