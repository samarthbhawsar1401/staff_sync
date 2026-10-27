import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../api/axiosClient';
import ClockInOutWidget from '../components/ClockInOutWidget';
import StatCard from '../components/StatCard';
import LeaveApplicationModal from '../components/LeaveApplicationModal';
import AddEmployeeModal from '../components/AddEmployeeModal';
import CreateAnnouncementModal from '../components/CreateAnnouncementModal';
import CreateTrainingModal from '../components/CreateTrainingModal';
import {
  Users,
  CheckCircle2,
  Clock,
  CalendarDays,
  GraduationCap,
  Megaphone,
  BarChart3,
  Plus,
  ArrowUpRight,
  AlertTriangle,
  UserCheck,
  ShieldCheck,
  Calendar,
  Check,
  X
} from 'lucide-react';
import { Link } from 'react-router-dom';

const DashboardPage = () => {
  const { user } = useAuth();
  const role = user?.role || 'employee';

  const [stats, setStats] = useState(null);
  const [teamMembers, setTeamMembers] = useState([]);
  const [teamLeaves, setTeamLeaves] = useState([]);
  const [teamAttendance, setTeamAttendance] = useState([]);
  const [myLeaves, setMyLeaves] = useState([]);
  const [leaveBalances, setLeaveBalances] = useState([]);
  const [announcements, setAnnouncements] = useState([]);
  const [trainings, setTrainings] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modals state
  const [isLeaveModalOpen, setIsLeaveModalOpen] = useState(false);
  const [isAddEmpModalOpen, setIsAddEmpModalOpen] = useState(false);
  const [isAnnounceModalOpen, setIsAnnounceModalOpen] = useState(false);
  const [isTrainingModalOpen, setIsTrainingModalOpen] = useState(false);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);

      // Common announcements & trainings
      const [annRes, trnRes] = await Promise.all([
        api.get('/announcements'),
        api.get('/trainings')
      ]);
      setAnnouncements(annRes.data.slice(0, 3));
      setTrainings(trnRes.data.slice(0, 3));

      if (role === 'hr') {
        const statsRes = await api.get('/analytics/dashboard');
        setStats(statsRes.data);
      } else if (role === 'manager') {
        const [teamRes, lvsRes, attRes] = await Promise.all([
          api.get('/employees/team'),
          api.get('/leaves/team'),
          api.get('/attendance/team')
        ]);
        setTeamMembers(teamRes.data);
        setTeamLeaves(lvsRes.data);
        setTeamAttendance(attRes.data.records || []);
      } else {
        // Employee
        const [myLvsRes, balRes] = await Promise.all([
          api.get('/leaves/my'),
          api.get('/leaves/balances')
        ]);
        setMyLeaves(myLvsRes.data.slice(0, 4));
        setLeaveBalances(balRes.data);
      }
    } catch (err) {
      console.error('Error fetching dashboard info:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, [role]);

  // Manager Approve / Reject Leave
  const handleReviewLeave = async (leaveId, status) => {
    const comment = window.prompt(`Add a note for this ${status.toLowerCase()} decision (optional):`, `Decision: ${status}`);
    try {
      await api.put(`/leaves/${leaveId}/status`, {
        status,
        reviewComments: comment || undefined
      });
      fetchDashboardData();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update leave.');
    }
  };

  return (
    <div className="container-fluid p-3 p-md-4">
      {/* Top Welcome Header */}
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 mb-4">
        <div>
          <h3 className="fw-bolder mb-1 text-dark">
            Welcome back, {user?.name}! 👋
          </h3>
          <p className="text-secondary small mb-0">
            {role === 'hr' && 'Organization Overview & Human Resources Administration.'}
            {role === 'manager' && `Team Performance & Attendance for the ${user?.department} Department.`}
            {role === 'employee' && `Here is your self-service HR hub and daily activity summary.`}
          </p>
        </div>

        {/* Quick Action Buttons according to role */}
        <div className="d-flex flex-wrap gap-2">
          {role === 'hr' && (
            <>
              <button
                onClick={() => setIsAddEmpModalOpen(true)}
                className="btn btn-primary rounded-pill btn-sm px-3 fw-bold d-flex align-items-center gap-1 shadow-sm"
              >
                <Plus size={16} /> Onboard Staff
              </button>
              <button
                onClick={() => setIsAnnounceModalOpen(true)}
                className="btn btn-outline-danger rounded-pill btn-sm px-3 fw-bold d-flex align-items-center gap-1"
              >
                <Megaphone size={16} /> Broadcast Notice
              </button>
              <button
                onClick={() => setIsTrainingModalOpen(true)}
                className="btn btn-outline-info rounded-pill btn-sm px-3 fw-bold d-flex align-items-center gap-1 text-dark"
              >
                <GraduationCap size={16} /> Add Training
              </button>
            </>
          )}

          {role === 'manager' && (
            <>
              <button
                onClick={() => setIsTrainingModalOpen(true)}
                className="btn btn-outline-primary rounded-pill btn-sm px-3 fw-bold d-flex align-items-center gap-1"
              >
                <GraduationCap size={16} /> Schedule Team Training
              </button>
              <Link to="/attendance" className="btn btn-primary rounded-pill btn-sm px-3 fw-bold d-flex align-items-center gap-1 shadow-sm">
                <Clock size={16} /> Team Attendance
              </Link>
            </>
          )}

          {role === 'employee' && (
            <button
              onClick={() => setIsLeaveModalOpen(true)}
              className="btn btn-primary rounded-pill btn-sm px-3 fw-bold d-flex align-items-center gap-1 shadow-sm"
            >
              <CalendarDays size={16} /> Request Time Off
            </button>
          )}
        </div>
      </div>

      {/* =========================================================================
          VIEW 1: HR DASHBOARD
      ========================================================================= */}
      {role === 'hr' && (
        <>
          {/* Top Metric Cards */}
          <div className="row g-3 mb-4">
            <div className="col-sm-6 col-xl-3">
              <StatCard
                title="Total Headcount"
                value={stats?.summary?.totalStaff || 0}
                icon={Users}
                color="primary"
                subtext={`${stats?.summary?.totalEmployees || 0} Staff | ${stats?.summary?.totalManagers || 0} Managers`}
              />
            </div>
            <div className="col-sm-6 col-xl-3">
              <StatCard
                title="Attendance Rate Today"
                value={`${stats?.summary?.attendanceRate || 0}%`}
                icon={CheckCircle2}
                color="success"
                subtext={`${stats?.summary?.checkedInToday || 0} / ${stats?.summary?.activeStaffCount || 0} checked in`}
              />
            </div>
            <div className="col-sm-6 col-xl-3">
              <StatCard
                title="Pending Leaves"
                value={stats?.summary?.pendingLeaves || 0}
                icon={CalendarDays}
                color="warning"
                subtext={`${stats?.summary?.approvedLeaves || 0} approved this quarter`}
              />
            </div>
            <div className="col-sm-6 col-xl-3">
              <StatCard
                title="Active Trainings"
                value={stats?.summary?.totalTrainings || 0}
                icon={GraduationCap}
                color="info"
                subtext={`${stats?.summary?.totalAnnouncements || 0} active notices`}
              />
            </div>
          </div>

          <div className="row g-4 mb-4">
            {/* Department Headcount Breakdown */}
            <div className="col-lg-7">
              <div className="card border-0 shadow-sm rounded-4 h-100">
                <div className="card-header bg-white py-3 border-bottom d-flex align-items-center justify-content-between">
                  <div className="d-flex align-items-center gap-2">
                    <BarChart3 size={18} className="text-primary" />
                    <h6 className="fw-bold mb-0">Departmental Distribution</h6>
                  </div>
                  <Link to="/employees" className="btn btn-link btn-sm text-decoration-none">
                    View Directory
                  </Link>
                </div>
                <div className="card-body p-4">
                  {stats?.departments?.map(dept => {
                    const total = stats?.summary?.totalStaff || 1;
                    const pct = Math.round((dept.count / total) * 100);
                    return (
                      <div key={dept.name} className="mb-3">
                        <div className="d-flex justify-content-between small fw-bold mb-1">
                          <span>{dept.name}</span>
                          <span className="text-muted">{dept.count} members ({pct}%)</span>
                        </div>
                        <div className="progress" style={{ height: '8px' }}>
                          <div
                            className="progress-bar bg-primary rounded-pill"
                            role="progressbar"
                            style={{ width: `${pct}%` }}
                            aria-valuenow={pct}
                            aria-valuemin="0"
                            aria-valuemax="100"
                          ></div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Recent Activities & Audit Trail */}
            <div className="col-lg-5">
              <div className="card border-0 shadow-sm rounded-4 h-100">
                <div className="card-header bg-white py-3 border-bottom">
                  <h6 className="fw-bold mb-0">Recent Operational Events</h6>
                </div>
                <div className="card-body p-0">
                  <div className="list-group list-group-flush">
                    {stats?.recentActivities?.length === 0 ? (
                      <div className="p-4 text-center text-muted small">No recent activity recorded.</div>
                    ) : (
                      stats?.recentActivities?.map((act, idx) => (
                        <div key={idx} className="list-group-item p-3 border-bottom">
                          <div className="d-flex align-items-center justify-content-between">
                            <span className="small fw-semibold text-dark">{act.title}</span>
                            <span className={`badge bg-${act.badge}-subtle text-${act.badge} rounded-pill`}>
                              {act.type}
                            </span>
                          </div>
                          <small className="text-muted d-block mt-1" style={{ fontSize: '11px' }}>
                            {new Date(act.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </small>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {/* =========================================================================
          VIEW 2: MANAGER DASHBOARD
      ========================================================================= */}
      {role === 'manager' && (
        <>
          <div className="row g-3 mb-4">
            <div className="col-sm-6 col-xl-3">
              <StatCard
                title="Direct Reports"
                value={teamMembers.length}
                icon={Users}
                color="primary"
                subtext={`Department: ${user?.department}`}
              />
            </div>
            <div className="col-sm-6 col-xl-3">
              <StatCard
                title="Present Today"
                value={teamAttendance.length}
                icon={CheckCircle2}
                color="success"
                subtext={`${teamAttendance.filter(a => a.status === 'Present').length} on time, ${teamAttendance.filter(a => a.status === 'Late').length} late`}
              />
            </div>
            <div className="col-sm-6 col-xl-3">
              <StatCard
                title="Pending Leaves"
                value={teamLeaves.filter(l => l.status === 'Pending').length}
                icon={CalendarDays}
                color="warning"
                subtext="Requires your sign-off"
              />
            </div>
            <div className="col-sm-6 col-xl-3">
              <StatCard
                title="Available Trainings"
                value={trainings.length}
                icon={GraduationCap}
                color="info"
                subtext="Upskilling cohorts"
              />
            </div>
          </div>

          <div className="row g-4 mb-4">
            {/* Team Leave Approvals */}
            <div className="col-lg-7">
              <div className="card border-0 shadow-sm rounded-4 h-100">
                <div className="card-header bg-white py-3 border-bottom d-flex align-items-center justify-content-between">
                  <div className="d-flex align-items-center gap-2">
                    <CalendarDays size={18} className="text-warning" />
                    <h6 className="fw-bold mb-0">Team Leave Requests ({teamLeaves.filter(l => l.status === 'Pending').length} Pending)</h6>
                  </div>
                  <Link to="/leaves" className="btn btn-link btn-sm text-decoration-none">
                    View All
                  </Link>
                </div>
                <div className="card-body p-0">
                  <div className="table-responsive">
                    <table className="table align-middle mb-0">
                      <thead className="table-light small">
                        <tr>
                          <th>Employee</th>
                          <th>Type</th>
                          <th>Dates</th>
                          <th>Status</th>
                          <th className="text-end">Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {teamLeaves.length === 0 ? (
                          <tr>
                            <td colSpan="5" className="text-center py-4 text-muted small">
                              No leave applications found for your team.
                            </td>
                          </tr>
                        ) : (
                          teamLeaves.slice(0, 5).map(leave => (
                            <tr key={leave._id}>
                              <td>
                                <div className="d-flex align-items-center gap-2">
                                  <img
                                    src={leave.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${leave.employeeName}`}
                                    alt=""
                                    className="rounded-circle"
                                    style={{ width: 28, height: 28 }}
                                  />
                                  <div>
                                    <span className="fw-semibold small d-block">{leave.employeeName}</span>
                                    <small className="text-muted" style={{ fontSize: '11px' }}>{leave.department}</small>
                                  </div>
                                </div>
                              </td>
                              <td><span className="badge bg-light text-dark border">{leave.leaveType}</span></td>
                              <td className="small">
                                {leave.startDate} to {leave.endDate}
                                <span className="text-muted d-block" style={{ fontSize: '10px' }}>({leave.totalDays} days)</span>
                              </td>
                              <td>
                                <span className={`badge bg-${leave.status === 'Approved' ? 'success' : leave.status === 'Rejected' ? 'danger' : 'warning'}-subtle text-${leave.status === 'Approved' ? 'success' : leave.status === 'Rejected' ? 'danger' : 'warning'}`}>
                                  {leave.status}
                                </span>
                              </td>
                              <td className="text-end">
                                {leave.status === 'Pending' ? (
                                  <div className="d-inline-flex gap-1">
                                    <button
                                      onClick={() => handleReviewLeave(leave._id, 'Approved')}
                                      className="btn btn-sm btn-success p-1 px-2 rounded-pill"
                                      title="Approve"
                                    >
                                      <Check size={14} /> Approve
                                    </button>
                                    <button
                                      onClick={() => handleReviewLeave(leave._id, 'Rejected')}
                                      className="btn btn-sm btn-outline-danger p-1 px-2 rounded-pill"
                                      title="Reject"
                                    >
                                      <X size={14} />
                                    </button>
                                  </div>
                                ) : (
                                  <small className="text-muted">{leave.status}</small>
                                )}
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>

            {/* Team Presence Tracker */}
            <div className="col-lg-5">
              <div className="card border-0 shadow-sm rounded-4 h-100">
                <div className="card-header bg-white py-3 border-bottom">
                  <h6 className="fw-bold mb-0">Today's Team Check-ins</h6>
                </div>
                <div className="card-body p-0">
                  <div className="list-group list-group-flush">
                    {teamAttendance.length === 0 ? (
                      <div className="p-4 text-center text-muted small">No team members clocked in yet today.</div>
                    ) : (
                      teamAttendance.map(att => (
                        <div key={att._id} className="list-group-item p-3 border-bottom d-flex align-items-center justify-content-between">
                          <div className="d-flex align-items-center gap-2">
                            <img
                              src={att.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${att.employeeName}`}
                              alt=""
                              className="rounded-circle"
                              style={{ width: 32, height: 32 }}
                            />
                            <div>
                              <span className="small fw-bold d-block">{att.employeeName}</span>
                              <small className="text-muted">Clocked in: {new Date(att.clockIn).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</small>
                            </div>
                          </div>
                          <span className={`badge bg-${att.status === 'Present' ? 'success' : 'warning'}-subtle text-${att.status === 'Present' ? 'success' : 'warning'} rounded-pill`}>
                            {att.status}
                          </span>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {/* =========================================================================
          VIEW 3: EMPLOYEE DASHBOARD
      ========================================================================= */}
      {role === 'employee' && (
        <div className="row g-4 mb-4">
          {/* Left Column: Live Clock-in Stopwatch Widget & Leave Balances */}
          <div className="col-lg-5">
            <ClockInOutWidget onStatusChange={fetchDashboardData} />

            {/* Leave Balances Card */}
            <div className="card border-0 shadow-sm rounded-4 mt-4">
              <div className="card-header bg-white py-3 border-bottom d-flex align-items-center justify-content-between">
                <div className="d-flex align-items-center gap-2">
                  <CalendarDays size={18} className="text-primary" />
                  <h6 className="fw-bold mb-0">Leave Balances</h6>
                </div>
                <button
                  onClick={() => setIsLeaveModalOpen(true)}
                  className="btn btn-outline-primary btn-sm rounded-pill fw-medium"
                >
                  Apply Leave
                </button>
              </div>
              <div className="card-body p-3">
                <div className="row g-2">
                  {leaveBalances.slice(0, 3).map(bal => (
                    <div key={bal.type} className="col-4">
                      <div className="p-3 bg-light rounded-3 text-center border">
                        <small className="text-muted d-block text-truncate fw-semibold">{bal.type}</small>
                        <h4 className="fw-bolder mb-0 text-dark mt-1">{bal.remaining}</h4>
                        <small className="text-muted" style={{ fontSize: '10px' }}>of {bal.total} left</small>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Recent Leave History & Announcements */}
          <div className="col-lg-7">
            {/* Announcements Card */}
            <div className="card border-0 shadow-sm rounded-4 mb-4">
              <div className="card-header bg-white py-3 border-bottom d-flex align-items-center justify-content-between">
                <div className="d-flex align-items-center gap-2">
                  <Megaphone size={18} className="text-danger" />
                  <h6 className="fw-bold mb-0">Company Notice Board</h6>
                </div>
                <Link to="/announcements" className="btn btn-link btn-sm text-decoration-none">
                  All Notices
                </Link>
              </div>
              <div className="card-body p-3">
                {announcements.length === 0 ? (
                  <p className="text-muted small mb-0 text-center py-2">No active announcements.</p>
                ) : (
                  announcements.map(ann => (
                    <div key={ann._id} className="p-3 bg-light rounded-3 mb-2 border">
                      <div className="d-flex align-items-center justify-content-between mb-1">
                        <span className="fw-bold small text-dark">{ann.title}</span>
                        <span className={`badge bg-${ann.priority === 'Urgent' ? 'danger' : ann.priority === 'High' ? 'warning' : 'primary'}-subtle text-${ann.priority === 'Urgent' ? 'danger' : ann.priority === 'High' ? 'warning' : 'primary'} rounded-pill`}>
                          {ann.priority}
                        </span>
                      </div>
                      <p className="small text-secondary mb-1 text-truncate-2" style={{ fontSize: '12px' }}>
                        {ann.content}
                      </p>
                      <small className="text-muted" style={{ fontSize: '11px' }}>
                        Posted by {ann.authorName} • {new Date(ann.createdAt).toLocaleDateString()}
                      </small>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* My Recent Leaves */}
            <div className="card border-0 shadow-sm rounded-4">
              <div className="card-header bg-white py-3 border-bottom d-flex align-items-center justify-content-between">
                <h6 className="fw-bold mb-0">My Leave Applications</h6>
                <Link to="/leaves" className="btn btn-link btn-sm text-decoration-none">
                  History
                </Link>
              </div>
              <div className="card-body p-0">
                <div className="table-responsive">
                  <table className="table align-middle mb-0 small">
                    <thead className="table-light">
                      <tr>
                        <th>Type</th>
                        <th>Period</th>
                        <th>Days</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {myLeaves.length === 0 ? (
                        <tr>
                          <td colSpan="4" className="text-center py-4 text-muted">
                            You have not submitted any leave requests yet.
                          </td>
                        </tr>
                      ) : (
                        myLeaves.map(l => (
                          <tr key={l._id}>
                            <td className="fw-bold">{l.leaveType}</td>
                            <td>{l.startDate} to {l.endDate}</td>
                            <td>{l.totalDays}</td>
                            <td>
                              <span className={`badge bg-${l.status === 'Approved' ? 'success' : l.status === 'Rejected' ? 'danger' : 'warning'}-subtle text-${l.status === 'Approved' ? 'success' : l.status === 'Rejected' ? 'danger' : 'warning'}`}>
                                {l.status}
                              </span>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modals */}
      <LeaveApplicationModal
        isOpen={isLeaveModalOpen}
        onClose={() => setIsLeaveModalOpen(false)}
        onSuccess={fetchDashboardData}
      />
      <AddEmployeeModal
        isOpen={isAddEmpModalOpen}
        onClose={() => setIsAddEmpModalOpen(false)}
        onSuccess={fetchDashboardData}
      />
      <CreateAnnouncementModal
        isOpen={isAnnounceModalOpen}
        onClose={() => setIsAnnounceModalOpen(false)}
        onSuccess={fetchDashboardData}
      />
      <CreateTrainingModal
        isOpen={isTrainingModalOpen}
        onClose={() => setIsTrainingModalOpen(false)}
        onSuccess={fetchDashboardData}
      />
    </div>
  );
};

export default DashboardPage;
