const User = require('../models/User');
const Attendance = require('../models/Attendance');
const Leave = require('../models/Leave');
const Training = require('../models/Training');
const Announcement = require('../models/Announcement');

// GET /api/analytics/dashboard
exports.getDashboardStats = async (req, res) => {
  try {
    const today = new Date().toISOString().split('T')[0];

    const allUsers = await User.find({});
    const allAttendanceToday = await Attendance.find({ date: today });
    const allLeaves = await Leave.find({});
    const allTrainings = await Training.find({});
    const allAnnouncements = await Announcement.find({});

    const totalEmployees = allUsers.filter(u => u.role === 'employee').length;
    const totalManagers = allUsers.filter(u => u.role === 'manager').length;
    const totalHR = allUsers.filter(u => u.role === 'hr').length;

    // Attendance stats today
    const presentToday = allAttendanceToday.filter(a => a.status === 'Present').length;
    const lateToday = allAttendanceToday.filter(a => a.status === 'Late').length;
    const halfDayToday = allAttendanceToday.filter(a => a.status === 'Half-day').length;
    const activeStaffCount = allUsers.filter(u => u.status === 'active').length;
    const checkedInCount = allAttendanceToday.length;
    const attendanceRate = activeStaffCount > 0 ? Math.round((checkedInCount / activeStaffCount) * 100) : 0;

    // Leave stats
    const pendingLeaves = allLeaves.filter(l => l.status === 'Pending').length;
    const approvedLeaves = allLeaves.filter(l => l.status === 'Approved').length;
    const rejectedLeaves = allLeaves.filter(l => l.status === 'Rejected').length;

    // Department breakdown
    const departmentCounts = {};
    allUsers.forEach(u => {
      const dept = u.department || 'General';
      departmentCounts[dept] = (departmentCounts[dept] || 0) + 1;
    });

    const departmentList = Object.entries(departmentCounts).map(([name, count]) => ({
      name,
      count
    }));

    // Leave type breakdown
    const leaveTypeCounts = {};
    allLeaves.forEach(l => {
      leaveTypeCounts[l.leaveType] = (leaveTypeCounts[l.leaveType] || 0) + 1;
    });

    // Recent activity feed
    const activities = [
      ...allAttendanceToday.map(a => {
        const u = allUsers.find(x => x._id === a.userId);
        return {
          type: 'attendance',
          title: `${u ? u.name : 'Employee'} clocked in`,
          time: a.clockIn,
          badge: a.status === 'Late' ? 'warning' : 'success'
        };
      }),
      ...allLeaves.slice(0, 5).map(l => {
        const u = allUsers.find(x => x._id === l.userId);
        return {
          type: 'leave',
          title: `${u ? u.name : 'Employee'} requested ${l.leaveType} leave`,
          time: l.appliedAt || l.createdAt,
          badge: l.status === 'Approved' ? 'success' : l.status === 'Rejected' ? 'danger' : 'info'
        };
      })
    ].sort((a, b) => new Date(b.time) - new Date(a.time)).slice(0, 8);

    res.json({
      summary: {
        totalStaff: allUsers.length,
        totalEmployees,
        totalManagers,
        totalHR,
        activeStaffCount,
        checkedInToday: checkedInCount,
        presentToday,
        lateToday,
        halfDayToday,
        attendanceRate,
        pendingLeaves,
        approvedLeaves,
        rejectedLeaves,
        totalTrainings: allTrainings.length,
        totalAnnouncements: allAnnouncements.length
      },
      departments: departmentList,
      leaveTypeCounts,
      recentActivities: activities
    });
  } catch (err) {
    console.error('Error fetching analytics:', err);
    res.status(500).json({ message: 'Failed to generate analytics dashboard.' });
  }
};
