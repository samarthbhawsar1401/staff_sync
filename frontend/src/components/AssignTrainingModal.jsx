import React, { useState } from 'react';
import api from '../api/axiosClient';
import { UserCheck } from 'lucide-react';

const AssignTrainingModal = ({ isOpen, onClose, training, teamMembers, onSuccess }) => {
  const [selectedEmpId, setSelectedEmpId] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen || !training) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedEmpId) {
      setError('Please select an employee to assign.');
      return;
    }

    try {
      setLoading(true);
      setError('');
      await api.post(`/trainings/${training._id}/assign`, { employeeId: selectedEmpId });
      onSuccess();
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to assign employee to training.');
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
                <UserCheck size={18} />
              </div>
              <h5 className="modal-title fw-bold fs-6 mb-0">Assign Team Member</h5>
            </div>
            <button type="button" className="btn-close" onClick={onClose} aria-label="Close"></button>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="modal-body p-4">
              {error && <div className="alert alert-danger py-2 small mb-3">{error}</div>}

              <div className="bg-light p-3 rounded-3 mb-3">
                <span className="small text-muted d-block">Training Program:</span>
                <strong className="text-dark">{training.title}</strong>
                <div className="small text-secondary mt-1">
                  📅 {training.startDate} - {training.endDate} ({training.durationHours} hrs)
                </div>
              </div>

              <div className="mb-3">
                <label className="form-label small fw-bold text-secondary">Select Employee</label>
                <select
                  className="form-select rounded-3"
                  required
                  value={selectedEmpId}
                  onChange={(e) => setSelectedEmpId(e.target.value)}
                >
                  <option value="">-- Choose team member --</option>
                  {teamMembers.map(emp => (
                    <option
                      key={emp._id}
                      value={emp._id}
                      disabled={training.enrolledEmployees?.includes(emp._id)}
                    >
                      {emp.name} ({emp.designation}) {training.enrolledEmployees?.includes(emp._id) ? '- (Already Enrolled)' : ''}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="modal-footer bg-light py-2 px-4">
              <button type="button" className="btn btn-outline-secondary rounded-pill px-3" onClick={onClose}>
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="btn btn-primary rounded-pill px-4 fw-bold"
              >
                {loading ? 'Assigning...' : 'Confirm Assignment'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AssignTrainingModal;
