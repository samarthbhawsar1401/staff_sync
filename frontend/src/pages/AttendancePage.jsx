import React, { useState, useEffect } from 'react';
import api from '../api/axiosClient';
import { useAuth } from '../context/AuthContext';
import ClockInOutWidget from '../components/ClockInOutWidget';
import { Clock, Calendar, CheckCircle2, AlertCircle, Filter, Download } from 'lucide-react';

const AttendancePage = () => {
  const { user } = useAuth();
  const role = user?.role || 'employee';

  const [activeTab, setActiveTab] = useState('my'); // 'my' or 'company'
  const [myRecords, setMyRecords] = useState([]);
  const [companyRecords, setCompanyRecords] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [statusFilter, setStatusFilter] = useState('All');
  const [loading, setLoading] = useState(true);

  const fetchAttendance = async () => {
    try {
      setLoading(true);
      if (activeTab === 'my') {
        const res = await api.get('/attendance/my');
        setMyRecords(res.data);
      } else {
        const endpoint = role === 'manager' ? `/attendance/team?date=${selectedDate}` : `/attendance/all?date=${selectedDate}`;
        const res = await api.get(endpoint);
        setCompanyRecords(res.data.records || res.data);
      }
    } catch (err) {
      console.error('Error fetching attendance:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAttendance();
  }, [activeTab, selectedDate]);

  const filteredCompanyRecords = companyRecords.filter(r =>
    statusFilter === 'All' ? true : r.status === statusFilter
  );

  return (
    <div className="container-fluid p-3 p-md-4">
      {/* Top Header */}
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 mb-4">
        <div>
          <h3 className="fw-bolder mb-1 text-dark">Time & Attendance Management</h3>
          <p className="text-secondary small mb-0">
            Real-time daily clocking, shift audits, and company-wide attendance tracking.
          </p>
        </div>

        {/* Tab switch for Managers & HR */}
        {(role === 'hr' || role === 'manager') && (
          <div className="btn-group bg-white p-1 rounded-pill border shadow-sm">
            <button
              onClick={() => setActiveTab('my')}
              className={`btn btn-sm rounded-pill px-3 border-0 ${activeTab === 'my' ? 'bg-primary text-white fw-bold' : 'text-secondary'}`}
            >
              My Shifts
            </button>
            <button
              onClick={() => setActiveTab('company')}
              className={`btn btn-sm rounded-pill px-3 border-0 ${activeTab === 'company' ? 'bg-primary text-white fw-bold' : 'text-secondary'}`}
            >
              {role === 'hr' ? 'All Organization Check-ins' : 'My Team Check-ins'}
            </button>
          </div>
        )}
      </div>

      {/* VIEW: MY ATTENDANCE */}
      {activeTab === 'my' && (
        <div className="row g-4">
          <div className="col-lg-5">
            <ClockInOutWidget onStatusChange={fetchAttendance} />
          </div>

          <div className="col-lg-7">
            <div className="card border-0 shadow-sm rounded-4 overflow-hidden h-100">
              <div className="card-header bg-white py-3 border-bottom d-flex align-items-center justify-content-between">
                <div className="d-flex align-items-center gap-2">
                  <Clock size={18} className="text-primary" />
                  <h6 className="fw-bold mb-0">My Attendance History</h6>
                </div>
                <span className="badge bg-light text-muted border">{myRecords.length} shifts recorded</span>
              </div>

              <div className="card-body p-0">
                <div className="table-responsive">
                  <table className="table align-middle mb-0 small">
                    <thead className="table-light">
                      <tr>
                        <th>Date</th>
                        <th>Clock In</th>
                        <th>Clock Out</th>
                        <th>Total Hours</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {myRecords.length === 0 ? (
                        <tr>
                          <td colSpan="5" className="text-center py-4 text-muted">
                            No attendance logs found. Clock in to begin recording today!
                          </td>
                        </tr>
                      ) : (
                        myRecords.map(rec => (
                          <tr key={rec._id}>
                            <td className="fw-semibold">{rec.date}</td>
                            <td>{rec.clockIn ? new Date(rec.clockIn).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '--'}</td>
                            <td>{rec.clockOut ? new Date(rec.clockOut).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'In Progress'}</td>
                            <td className="fw-bold">{rec.totalHours ? `${rec.totalHours} hrs` : '--'}</td>
                            <td>
                              <span className={`badge bg-${rec.status === 'Present' ? 'success' : rec.status === 'Late' ? 'warning' : 'secondary'}-subtle text-${rec.status === 'Present' ? 'success' : rec.status === 'Late' ? 'warning' : 'secondary'} rounded-pill`}>
                                {rec.status}
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

      {/* VIEW: COMPANY / TEAM ATTENDANCE */}
      {activeTab === 'company' && (
        <div className="card border-0 shadow-sm rounded-4 overflow-hidden">
          {/* Filters Bar */}
          <div className="card-header bg-white py-3 border-bottom">
            <div className="row g-2 align-items-center">
              <div className="col-md-4">
                <div className="input-group input-group-sm">
                  <span className="input-group-text bg-light">Select Date:</span>
                  <input
                    type="date"
                    className="form-control"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                  />
                </div>
              </div>

              <div className="col-md-4">
                <div className="input-group input-group-sm">
                  <span className="input-group-text bg-light">Status:</span>
                  <select
                    className="form-select"
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                  >
                    <option value="All">All Statuses</option>
                    <option value="Present">Present</option>
                    <option value="Late">Late</option>
                    <option value="Half-day">Half-day</option>
                  </select>
                </div>
              </div>

              <div className="col-md-4 text-md-end">
                <span className="badge bg-light text-dark border p-2">
                  Showing <strong>{filteredCompanyRecords.length}</strong> check-in entries
                </span>
              </div>
            </div>
          </div>

          <div className="card-body p-0">
            <div className="table-responsive">
              <table className="table align-middle mb-0 small">
                <thead className="table-light">
                  <tr>
                    <th>Employee</th>
                    <th>Department</th>
                    <th>Clock In</th>
                    <th>Clock Out</th>
                    <th>Hours Worked</th>
                    <th>Status</th>
                    <th>Notes</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredCompanyRecords.length === 0 ? (
                    <tr>
                      <td colSpan="7" className="text-center py-5 text-muted">
                        No attendance records found for {selectedDate}.
                      </td>
                    </tr>
                  ) : (
                    filteredCompanyRecords.map(rec => (
                      <tr key={rec._id}>
                        <td>
                          <div className="d-flex align-items-center gap-2">
                            <img
                              src={rec.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${rec.employeeName}`}
                              alt=""
                              className="rounded-circle"
                              style={{ width: 28, height: 28 }}
                            />
                            <span className="fw-bold">{rec.employeeName}</span>
                          </div>
                        </td>
                        <td><span className="badge bg-light text-muted border">{rec.department}</span></td>
                        <td>{rec.clockIn ? new Date(rec.clockIn).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '--'}</td>
                        <td>{rec.clockOut ? new Date(rec.clockOut).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : <span className="text-primary fw-medium">Active Shift</span>}</td>
                        <td className="fw-bold">{rec.totalHours ? `${rec.totalHours} hrs` : '--'}</td>
                        <td>
                          <span className={`badge bg-${rec.status === 'Present' ? 'success' : rec.status === 'Late' ? 'warning' : 'secondary'}-subtle text-${rec.status === 'Present' ? 'success' : rec.status === 'Late' ? 'warning' : 'secondary'} rounded-pill`}>
                            {rec.status}
                          </span>
                        </td>
                        <td className="text-muted">{rec.notes || '-'}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AttendancePage;
