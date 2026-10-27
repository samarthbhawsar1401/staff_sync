const Attendance = require('../models/Attendance');
const User = require('../models/User');

const getTodayDateStr = () => new Date().toISOString().split('T')[0];

// GET /api/attendance/today
exports.getTodayStatus = async (req, res) => {
  try {
    const today = getTodayDateStr();
    const record = await Attendance.findOne({
      userId: req.user.id,
      date: today
    });

    res.json({
      record: record || null,
      isClockedIn: !!(record && record.clockIn && !record.clockOut),
      isClockedOut: !!(record && record.clockOut)
    });
  } catch (err) {
    console.error('Error getting today attendance:', err);
    res.status(500).json({ message: 'Failed to fetch attendance status.' });
  }
};

// POST /api/attendance/clock-in
exports.clockIn = async (req, res) => {
  try {
    const today = getTodayDateStr();
    const existing = await Attendance.findOne({
      userId: req.user.id,
      date: today
    });

    if (existing) {
      return res.status(400).json({ message: 'You have already clocked in for today.', record: existing });
    }

    const now = new Date();
    const nowIso = now.toISOString();

    // Determine status (Late if clocked in after 09:15 AM local/server time)
    const hours = now.getHours();
    const minutes = now.getMinutes();
    let status = 'Present';
    if (hours > 9 || (hours === 9 && minutes > 15)) {
      status = 'Late';
    }

    const record = await Attendance.create({
      userId: req.user.id,
      date: today,
      clockIn: nowIso,
      clockOut: null,
      totalHours: 0,
      status,
      notes: req.body.notes || 'Normal daily check-in'
    });

    res.status(201).json({
      message: `Clock-in recorded successfully at ${now.toLocaleTimeString()}. Status: ${status}.`,
      record
    });
  } catch (err) {
    console.error('Clock in error:', err);
    res.status(500).json({ message: 'Failed to record clock-in.' });
  }
};

// POST /api/attendance/clock-out
exports.clockOut = async (req, res) => {
  try {
    const today = getTodayDateStr();
    const record = await Attendance.findOne({
      userId: req.user.id,
      date: today
    });

    if (!record) {
      return res.status(400).json({ message: 'No active clock-in found for today. Please clock in first.' });
    }

    if (record.clockOut) {
      return res.status(400).json({ message: 'You have already clocked out for today.' });
    }

    const now = new Date();
    const clockInTime = new Date(record.clockIn);
    const diffMs = now - clockInTime;
    const diffHours = parseFloat((diffMs / (1000 * 60 * 60)).toFixed(2));

    let finalStatus = record.status;
    if (diffHours < 4 && finalStatus !== 'Absent') {
      finalStatus = 'Half-day';
    }

    const updated = await Attendance.findByIdAndUpdate(record._id, {
      clockOut: now.toISOString(),
      totalHours: diffHours,
      status: finalStatus,
      notes: req.body.notes ? `${record.notes} | ${req.body.notes}` : record.notes
    });

    res.json({
      message: `Clock-out recorded at ${now.toLocaleTimeString()}. Total hours: ${diffHours} hrs.`,
      record: updated
    });
  } catch (err) {
    console.error('Clock out error:', err);
    res.status(500).json({ message: 'Failed to record clock-out.' });
  }
};

// GET /api/attendance/my
exports.getMyAttendance = async (req, res) => {
  try {
    const records = await Attendance.find({ userId: req.user.id });
    records.sort((a, b) => new Date(b.date) - new Date(a.date));
    res.json(records);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch attendance history.' });
  }
};

// GET /api/attendance/team (Manager)
exports.getTeamAttendance = async (req, res) => {
  try {
    const allUsers = await User.find({});
    const teamUserIds = allUsers
      .filter(u => (u.managerId === req.user.id || (u.department === req.user.department && u.role === 'employee')))
      .map(u => u._id);

    const { date } = req.query;
    const targetDate = date || getTodayDateStr();

    const records = await Attendance.find({ date: targetDate });
    const teamRecords = records.filter(r => teamUserIds.includes(r.userId));

    // Augment with employee names
    const enriched = teamRecords.map(rec => {
      const u = allUsers.find(x => x._id === rec.userId);
      return {
        ...rec,
        employeeName: u ? u.name : 'Unknown',
        department: u ? u.department : '',
        avatar: u ? u.avatar : ''
      };
    });

    res.json({ date: targetDate, records: enriched });
  } catch (err) {
    console.error('Error fetching team attendance:', err);
    res.status(500).json({ message: 'Failed to fetch team attendance.' });
  }
};

// GET /api/attendance/all (HR)
exports.getAllAttendance = async (req, res) => {
  try {
    const { date, status, department } = req.query;
    const query = {};
    if (date) query.date = date;
    if (status && status !== 'All') query.status = status;

    const records = await Attendance.find(query);
    const allUsers = await User.find({});

    let enriched = records.map(rec => {
      const u = allUsers.find(x => x._id === rec.userId);
      return {
        ...rec,
        employeeName: u ? u.name : 'Unknown',
        department: u ? u.department : '',
        designation: u ? u.designation : '',
        avatar: u ? u.avatar : ''
      };
    });

    if (department && department !== 'All') {
      enriched = enriched.filter(r => r.department === department);
    }

    enriched.sort((a, b) => new Date(b.date) - new Date(a.date));
    res.json(enriched);
  } catch (err) {
    console.error('Error fetching company attendance:', err);
    res.status(500).json({ message: 'Failed to fetch attendance.' });
  }
};
