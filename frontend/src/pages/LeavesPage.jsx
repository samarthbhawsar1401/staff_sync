import React, { useState, useEffect } from 'react';
import api from '../api/axiosClient';
import { useAuth } from '../context/AuthContext';
import LeaveApplicationModal from '../components/LeaveApplicationModal';
import {
  CalendarDays,
  Plus,
  CheckCircle2,
  XCircle,
  Clock,
  Check,
  X,
  Filter
} from 'lucide-react';

const LeavesPage = () => {
  const { user } = useAuth();
  const role = user?.role || 'employee';

  const [activeTab, setActiveTab] = useState('my'); // 'my' or 'review'
  const [myLeaves, setMyLeaves] = useState([]);
  const [reviewLeaves, setReviewLeaves] = useState([]);
  const [leaveBalances, setLeaveBalances] = useState([]);
  const [statusFilter, setStatusFilter] = useState('All');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchLeavesData = async () => {
    try {
      setLoading(true);
      const [balRes, myRes] = await Promise.all([
        api.get('/leaves/balances'),
        api.get('/leaves/my')
      ]);
      setLeaveBalances(balRes.data);
      setMyLeaves(myRes.data);

      if (role === 'hr' || role === 'manager') {
        const endpoint = role === 'hr' ? '/leaves/all' : '/leaves/team';
        const reviewRes = await api.get(endpoint);
        setReviewLeaves(reviewRes.data);
      }
    } catch (err) {
      console.error('Error fetching leaves:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeavesData();
  }, [role]);

  const handleReviewAction = async (leaveId, status) => {
    const comment = window.prompt(`Provide an optional note for this ${status.toLowerCase()} action:`, `Approved.`);
    try {
      await api.put(`/leaves/${leaveId}/status`, {
        status,
        reviewComments: comment || undefined
      });
      fetchLeavesData();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update leave.');
    }
  };

  const filteredReviewLeaves = reviewLeaves.filter(l =>
    statusFilter === 'All' ? true : l.status === statusFilter
  );

  return (
    <div className="container-fluid p-3 p-md-4">
      {/* Top Header */}
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 mb-4">
        <div>
          <h3 className="fw-bolder mb-1 text-dark">Leave & Absence Management</h3>
          <p className="text-secondary small mb-0">
            Submit time off, track balance allocations, and approve team requests.
          </p>
        </div>

        <div className="d-flex align-items-center gap-2">
          {(role === 'hr' || role === 'manager') && (
            <div className="btn-group bg-white p-1 rounded-pill border shadow-sm me-2">
              <button
                onClick={() => setActiveTab('my')}
                className={`btn btn-sm rounded-pill px-3 border-0 ${activeTab === 'my' ? 'bg-primary text-white fw-bold' : 'text-secondary'}`}
              >
                My Leaves
              </button>
              <button
                onClick={() => setActiveTab('review')}
                className={`btn btn-sm rounded-pill px-3 border-0 ${activeTab === 'review' ? 'bg-primary text-white fw-bold' : 'text-secondary'}`}
              >
                {role === 'hr' ? 'All Organization Requests' : 'Team Leave Requests'}
              </button>
            </div>
          )}

          <button
            onClick={() => setIsModalOpen(true)}
            className="btn btn-primary rounded-pill px-3 fw-bold d-flex align-items-center gap-2 shadow-sm"
          >
            <Plus size={16} /> Request Leave
          </button>
        </div>
      </div>

      {/* Leave Balances Carousel / Cards */}
      <div className="row g-3 mb-4">
        {leaveBalances.map(bal => {
          const pct = Math.round((bal.used / (bal.total || 1)) * 100);
          return (
            <div key={bal.type} className="col-sm-6 col-lg">
              <div className="card border-0 shadow-sm rounded-4 h-100 p-3 bg-white">
                <span className="small fw-bold text-secondary text-uppercase" style={{ fontSize: '11px' }}>
                  {bal.type}
                </span>
                <div className="d-flex align-items-baseline gap-2 my-2">
                  <h3 className="fw-bolder mb-0 text-dark">{bal.remaining}</h3>
                  <small className="text-muted">/ {bal.total} days remaining</small>
                </div>
                <div className="progress" style={{ height: '6px' }}>
                  <div
                    className={`progress-bar rounded-pill bg-${pct > 80 ? 'danger' : pct > 50 ? 'warning' : 'primary'}`}
                    role="progressbar"
                    style={{ width: `${pct}%` }}
                  ></div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* TAB 1: MY LEAVE REQUESTS */}
      {activeTab === 'my' && (
        <div className="card border-0 shadow-sm rounded-4 overflow-hidden">
          <div className="card-header bg-white py-3 border-bottom d-flex align-items-center justify-content-between">
            <h6 className="fw-bold mb-0">My Leave Application History</h6>
            <span className="badge bg-light text-muted border">{myLeaves.length} applications</span>
          </div>

          <div className="card-body p-0">
            <div className="table-responsive">
              <table className="table align-middle mb-0 small">
                <thead className="table-light">
                  <tr>
                    <th>Type</th>
                    <th>Date Span</th>
                    <th>Duration</th>
                    <th>Reason</th>
                    <th>Status</th>
                    <th>Manager Feedback</th>
                  </tr>
                </thead>
                <tbody>
                  {myLeaves.length === 0 ? (
                    <tr>
                      <td colSpan="6" className="text-center py-5 text-muted">
                        No leave applications yet. Click "Request Leave" above to apply.
                      </td>
                    </tr>
                  ) : (
                    myLeaves.map(leave => (
                      <tr key={leave._id}>
                        <td className="fw-bold">{leave.leaveType}</td>
                        <td>{leave.startDate} to {leave.endDate}</td>
                        <td>{leave.totalDays} day(s)</td>
                        <td className="text-muted text-truncate" style={{ maxWidth: 200 }}>
                          {leave.reason}
                        </td>
                        <td>
                          <span className={`badge bg-${leave.status === 'Approved' ? 'success' : leave.status === 'Rejected' ? 'danger' : 'warning'}-subtle text-${leave.status === 'Approved' ? 'success' : leave.status === 'Rejected' ? 'danger' : 'warning'} rounded-pill`}>
                            {leave.status}
                          </span>
                        </td>
                        <td className="small text-secondary">
                          {leave.reviewComments || <span className="text-muted italic">Awaiting review</span>}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: REVIEW / APPROVAL QUEUE */}
      {activeTab === 'review' && (
        <div className="card border-0 shadow-sm rounded-4 overflow-hidden">
          <div className="card-header bg-white py-3 border-bottom d-flex align-items-center justify-content-between">
            <div className="d-flex align-items-center gap-3">
              <h6 className="fw-bold mb-0">
                {role === 'hr' ? 'All Organization Leave Requests' : 'Team Approval Queue'}
              </h6>
              <div className="d-flex align-items-center gap-1">
                {['All', 'Pending', 'Approved', 'Rejected'].map(st => (
                  <button
                    key={st}
                    onClick={() => setStatusFilter(st)}
                    className={`btn btn-sm rounded-pill px-2 py-0 border-0 ${statusFilter === st ? 'bg-primary text-white fw-bold' : 'btn-light text-secondary'}`}
                    style={{ fontSize: '11px' }}
                  >
                    {st}
                  </button>
                ))}
              </div>
            </div>
            <span className="badge bg-light text-muted border">{filteredReviewLeaves.length} items</span>
          </div>

          <div className="card-body p-0">
            <div className="table-responsive">
              <table className="table align-middle mb-0 small">
                <thead className="table-light">
                  <tr>
                    <th>Employee</th>
                    <th>Department</th>
                    <th>Type</th>
                    <th>Dates</th>
                    <th>Duration</th>
                    <th>Reason</th>
                    <th>Status</th>
                    <th className="text-end">Review Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredReviewLeaves.length === 0 ? (
                    <tr>
                      <td colSpan="8" className="text-center py-5 text-muted">
                        No leave requests found for this filter.
                      </td>
                    </tr>
                  ) : (
                    filteredReviewLeaves.map(leave => (
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
                              <span className="fw-bold d-block">{leave.employeeName}</span>
                              <small className="text-muted" style={{ fontSize: '10px' }}>{leave.employeeEmail}</small>
                            </div>
                          </div>
                        </td>
                        <td><span className="badge bg-light text-muted border">{leave.department}</span></td>
                        <td className="fw-semibold">{leave.leaveType}</td>
                        <td>{leave.startDate} to {leave.endDate}</td>
                        <td>{leave.totalDays} day(s)</td>
                        <td className="text-muted text-truncate" style={{ maxWidth: 180 }}>{leave.reason}</td>
                        <td>
                          <span className={`badge bg-${leave.status === 'Approved' ? 'success' : leave.status === 'Rejected' ? 'danger' : 'warning'}-subtle text-${leave.status === 'Approved' ? 'success' : leave.status === 'Rejected' ? 'danger' : 'warning'} rounded-pill`}>
                            {leave.status}
                          </span>
                        </td>
                        <td className="text-end">
                          {leave.status === 'Pending' ? (
                            <div className="d-inline-flex gap-1">
                              <button
                                onClick={() => handleReviewAction(leave._id, 'Approved')}
                                className="btn btn-sm btn-success rounded-pill px-2 py-1 d-flex align-items-center gap-1"
                              >
                                <Check size={14} /> Approve
                              </button>
                              <button
                                onClick={() => handleReviewAction(leave._id, 'Rejected')}
                                className="btn btn-sm btn-outline-danger rounded-pill px-2 py-1 d-flex align-items-center gap-1"
                              >
                                <X size={14} /> Reject
                              </button>
                            </div>
                          ) : (
                            <div className="text-muted small">
                              Reviewed ({leave.status})
                            </div>
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
      )}

      {/* Leave Application Modal */}
      <LeaveApplicationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={fetchLeavesData}
      />
    </div>
  );
};

export default LeavesPage;
