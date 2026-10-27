const Leave = require('../models/Leave');
const User = require('../models/User');
const Notification = require('../models/Notification');

// Calculate days between 2 YYYY-MM-DD dates
const calculateDays = (start, end) => {
  const d1 = new Date(start);
  const d2 = new Date(end);
  const diffTime = Math.abs(d2 - d1);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
  return diffDays > 0 ? diffDays : 1;
};

// GET /api/leaves/my
exports.getMyLeaves = async (req, res) => {
  try {
    const leaves = await Leave.find({ userId: req.user.id });
    leaves.sort((a, b) => new Date(b.appliedAt || b.createdAt) - new Date(a.appliedAt || a.createdAt));
    res.json(leaves);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch personal leave requests.' });
  }
};

// GET /api/leaves/team (Manager)
exports.getTeamLeaves = async (req, res) => {
  try {
    const allUsers = await User.find({});
    const teamUserIds = allUsers
      .filter(u => (u.managerId === req.user.id || (u.department === req.user.department && u.role === 'employee')))
      .map(u => u._id);

    const allLeaves = await Leave.find({});
    const teamLeaves = allLeaves.filter(l => teamUserIds.includes(l.userId));

    const enriched = teamLeaves.map(leave => {
      const u = allUsers.find(x => x._id === leave.userId);
      return {
        ...leave,
        employeeName: u ? u.name : 'Unknown',
        employeeEmail: u ? u.email : '',
        department: u ? u.department : '',
        avatar: u ? u.avatar : ''
      };
    });

    enriched.sort((a, b) => new Date(b.appliedAt || b.createdAt) - new Date(a.appliedAt || a.createdAt));
    res.json(enriched);
  } catch (err) {
    console.error('Error fetching team leaves:', err);
    res.status(500).json({ message: 'Failed to fetch team leaves.' });
  }
};

// GET /api/leaves/all (HR)
exports.getAllLeaves = async (req, res) => {
  try {
    const { status, leaveType } = req.query;
    const query = {};
    if (status && status !== 'All') query.status = status;
    if (leaveType && leaveType !== 'All') query.leaveType = leaveType;

    const leaves = await Leave.find(query);
    const allUsers = await User.find({});

    const enriched = leaves.map(leave => {
      const u = allUsers.find(x => x._id === leave.userId);
      return {
        ...leave,
        employeeName: u ? u.name : 'Unknown',
        employeeEmail: u ? u.email : '',
        department: u ? u.department : '',
        designation: u ? u.designation : '',
        avatar: u ? u.avatar : ''
      };
    });

    enriched.sort((a, b) => new Date(b.appliedAt || b.createdAt) - new Date(a.appliedAt || a.createdAt));
    res.json(enriched);
  } catch (err) {
    console.error('Error fetching all leaves:', err);
    res.status(500).json({ message: 'Failed to fetch leaves.' });
  }
};

// POST /api/leaves
exports.applyLeave = async (req, res) => {
  try {
    const { leaveType, startDate, endDate, reason } = req.body;
    if (!leaveType || !startDate || !endDate || !reason) {
      return res.status(400).json({ message: 'All leave fields (type, start, end, reason) are required.' });
    }

    if (new Date(endDate) < new Date(startDate)) {
      return res.status(400).json({ message: 'End date cannot be prior to start date.' });
    }

    const totalDays = calculateDays(startDate, endDate);

    const newLeave = await Leave.create({
      userId: req.user.id,
      leaveType,
      startDate,
      endDate,
      totalDays,
      reason: reason.trim(),
      status: 'Pending',
      appliedAt: new Date().toISOString(),
      reviewedBy: null,
      reviewComments: ''
    });

    // Notify Manager or HR
    const user = await User.findById(req.user.id);
    const targetRecipientId = user && user.managerId ? user.managerId : 'usr_hr_01';

    await Notification.create({
      userId: targetRecipientId,
      title: 'New Leave Request Submitted',
      message: `${req.user.name} applied for ${totalDays} day(s) of ${leaveType} leave (${startDate} to ${endDate}).`,
      type: 'leave'
    });

    res.status(201).json({
      message: 'Leave application submitted successfully.',
      leave: newLeave
    });
  } catch (err) {
    console.error('Error applying for leave:', err);
    res.status(500).json({ message: 'Failed to submit leave application.' });
  }
};

// PUT /api/leaves/:id/status (Manager or HR)
exports.updateLeaveStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, reviewComments } = req.body;

    if (!['Approved', 'Rejected'].includes(status)) {
      return res.status(400).json({ message: "Status must be 'Approved' or 'Rejected'." });
    }

    const leave = await Leave.findById(id);
    if (!leave) {
      return res.status(404).json({ message: 'Leave request not found.' });
    }

    const updated = await Leave.findByIdAndUpdate(id, {
      status,
      reviewedBy: req.user.id,
      reviewComments: reviewComments || `Request marked as ${status} by ${req.user.name}.`
    });

    // Notify employee of decision
    await Notification.create({
      userId: leave.userId,
      title: `Leave Request ${status}`,
      message: `Your ${leave.leaveType} leave request for ${leave.startDate} to ${leave.endDate} was ${status.toLowerCase()} by ${req.user.name}.${reviewComments ? ' Note: ' + reviewComments : ''}`,
      type: 'leave'
    });

    res.json({
      message: `Leave request successfully ${status.toLowerCase()}.`,
      leave: updated
    });
  } catch (err) {
    console.error('Error updating leave status:', err);
    res.status(500).json({ message: 'Failed to update leave request.' });
  }
};

// GET /api/leaves/balances
exports.getLeaveBalances = async (req, res) => {
  try {
    const userId = req.query.userId || req.user.id;
    const userLeaves = await Leave.find({ userId, status: 'Approved' });

    const totalAllocations = {
      Annual: 15,
      Sick: 10,
      Casual: 7,
      'Maternity/Paternity': 90,
      Unpaid: 30
    };

    const used = {
      Annual: 0,
      Sick: 0,
      Casual: 0,
      'Maternity/Paternity': 0,
      Unpaid: 0
    };

    userLeaves.forEach(l => {
      if (used[l.leaveType] !== undefined) {
        used[l.leaveType] += Number(l.totalDays || 0);
      }
    });

    const balances = Object.keys(totalAllocations).map(type => ({
      type,
      total: totalAllocations[type],
      used: used[type],
      remaining: Math.max(0, totalAllocations[type] - used[type])
    }));

    res.json(balances);
  } catch (err) {
    console.error('Error calculating balances:', err);
    res.status(500).json({ message: 'Failed to calculate leave balances.' });
  }
};
