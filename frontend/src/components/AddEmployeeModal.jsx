import React, { useState } from 'react';
import api from '../api/axiosClient';
import { UserPlus } from 'lucide-react';

const AddEmployeeModal = ({ isOpen, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: 'password123',
    role: 'employee',
    department: 'Engineering',
    designation: '',
    phone: '',
    salary: '75000',
    skills: 'React, Node.js'
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError('');
      await api.post('/employees', formData);
      onSuccess();
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create employee.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1060 }}>
      <div className="modal-dialog modal-dialog-centered modal-lg">
        <div className="modal-content border-0 shadow-lg rounded-4 overflow-hidden">
          <div className="modal-header bg-light py-3">
            <div className="d-flex align-items-center gap-2">
              <div className="p-2 bg-success-subtle text-success rounded-3">
                <UserPlus size={18} />
              </div>
              <h5 className="modal-title fw-bold fs-6 mb-0">Onboard New Team Member</h5>
            </div>
            <button type="button" className="btn-close" onClick={onClose} aria-label="Close"></button>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="modal-body p-4">
              {error && <div className="alert alert-danger py-2 small mb-3">{error}</div>}

              <div className="row g-3">
                <div className="col-md-6">
                  <label className="form-label small fw-bold text-secondary">Full Name</label>
                  <input
                    type="text"
                    required
                    name="name"
                    placeholder="e.g. Liam Anderson"
                    className="form-control rounded-3"
                    value={formData.name}
                    onChange={handleChange}
                  />
                </div>

                <div className="col-md-6">
                  <label className="form-label small fw-bold text-secondary">Work Email</label>
                  <input
                    type="email"
                    required
                    name="email"
                    placeholder="e.g. liam.anderson@staffsync.com"
                    className="form-control rounded-3"
                    value={formData.email}
                    onChange={handleChange}
                  />
                </div>

                <div className="col-md-4">
                  <label className="form-label small fw-bold text-secondary">Role</label>
                  <select
                    name="role"
                    className="form-select rounded-3"
                    value={formData.role}
                    onChange={handleChange}
                  >
                    <option value="employee">Staff Employee</option>
                    <option value="manager">Team Manager</option>
                    <option value="hr">HR Administrator</option>
                  </select>
                </div>

                <div className="col-md-4">
                  <label className="form-label small fw-bold text-secondary">Department</label>
                  <select
                    name="department"
                    className="form-select rounded-3"
                    value={formData.department}
                    onChange={handleChange}
                  >
                    <option value="Engineering">Engineering</option>
                    <option value="Human Resources">Human Resources</option>
                    <option value="Marketing">Marketing</option>
                    <option value="Product">Product & Design</option>
                    <option value="Sales">Sales & Ops</option>
                  </select>
                </div>

                <div className="col-md-4">
                  <label className="form-label small fw-bold text-secondary">Designation</label>
                  <input
                    type="text"
                    name="designation"
                    placeholder="e.g. Fullstack Engineer"
                    className="form-control rounded-3"
                    value={formData.designation}
                    onChange={handleChange}
                  />
                </div>

                <div className="col-md-6">
                  <label className="form-label small fw-bold text-secondary">Annual Salary (USD)</label>
                  <input
                    type="number"
                    name="salary"
                    className="form-control rounded-3"
                    value={formData.salary}
                    onChange={handleChange}
                  />
                </div>

                <div className="col-md-6">
                  <label className="form-label small fw-bold text-secondary">Contact Phone</label>
                  <input
                    type="text"
                    name="phone"
                    placeholder="+1 (555) 000-0000"
                    className="form-control rounded-3"
                    value={formData.phone}
                    onChange={handleChange}
                  />
                </div>

                <div className="col-12">
                  <label className="form-label small fw-bold text-secondary">Skills & Tags (comma separated)</label>
                  <input
                    type="text"
                    name="skills"
                    placeholder="React, Node.js, Express, UI/UX"
                    className="form-control rounded-3"
                    value={formData.skills}
                    onChange={handleChange}
                  />
                </div>
              </div>
            </div>

            <div className="modal-footer bg-light py-2 px-4">
              <button type="button" className="btn btn-outline-secondary rounded-pill px-3" onClick={onClose}>
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="btn btn-success rounded-pill px-4 fw-bold"
              >
                {loading ? 'Creating...' : 'Save & Onboard'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddEmployeeModal;
