import React, { useState } from 'react';
import api from '../api/axiosClient';
import { Calendar, X, Send } from 'lucide-react';

const LeaveApplicationModal = ({ isOpen, onClose, onSuccess }) => {
  const [leaveType, setLeaveType] = useState('Annual');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [reason, setReason] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!startDate || !endDate || !reason.trim()) {
      setError('Please provide start date, end date, and reason.');
      return;
    }

    try {
      setLoading(true);
      setError('');
      await api.post('/leaves', {
        leaveType,
        startDate,
        endDate,
        reason: reason.trim()
      });
      onSuccess();
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit leave application.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1060 }}>
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content border-0 shadow-lg rounded-4 overflow-hidden">
          <div className="modal-header bg-light py-3">
            <div className="d-flex align-items-center gap-2">
              <div className="p-2 bg-primary-subtle text-primary rounded-3">
                <Calendar size={18} />
              </div>
              <h5 className="modal-title fw-bold fs-6 mb-0">Apply for Time Off</h5>
            </div>
            <button type="button" className="btn-close" onClick={onClose} aria-label="Close"></button>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="modal-body p-4">
              {error && (
                <div className="alert alert-danger py-2 small mb-3">
                  {error}
                </div>
              )}

              <div className="mb-3">
                <label className="form-label small fw-bold text-secondary">Leave Category</label>
                <select
                  className="form-select rounded-3"
                  value={leaveType}
                  onChange={(e) => setLeaveType(e.target.value)}
                >
                  <option value="Annual">Annual Leave (Vacation)</option>
                  <option value="Sick">Sick Leave</option>
                  <option value="Casual">Casual Leave</option>
                  <option value="Maternity/Paternity">Maternity / Paternity Leave</option>
                  <option value="Unpaid">Unpaid Leave</option>
                </select>
              </div>

              <div className="row g-3 mb-3">
                <div className="col-6">
                  <label className="form-label small fw-bold text-secondary">Start Date</label>
                  <input
                    type="date"
                    required
                    className="form-control rounded-3"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                  />
                </div>
                <div className="col-6">
                  <label className="form-label small fw-bold text-secondary">End Date</label>
                  <input
                    type="date"
                    required
                    className="form-control rounded-3"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                  />
                </div>
              </div>

              <div className="mb-3">
                <label className="form-label small fw-bold text-secondary">Reason / Details</label>
                <textarea
                  className="form-control rounded-3"
                  rows={3}
                  placeholder="Provide context for your manager..."
                  required
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                ></textarea>
              </div>
            </div>

            <div className="modal-footer bg-light py-2 px-4">
              <button type="button" className="btn btn-outline-secondary rounded-pill px-3" onClick={onClose}>
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="btn btn-primary rounded-pill px-4 fw-bold d-flex align-items-center gap-2"
              >
                <Send size={16} />
                {loading ? 'Submitting...' : 'Submit Request'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LeaveApplicationModal;
