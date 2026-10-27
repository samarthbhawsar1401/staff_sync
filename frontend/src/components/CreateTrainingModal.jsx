import React, { useState } from 'react';
import api from '../api/axiosClient';
import { GraduationCap } from 'lucide-react';

const CreateTrainingModal = ({ isOpen, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    instructor: '',
    department: 'Engineering',
    durationHours: 8,
    startDate: '',
    endDate: '',
    maxCapacity: 25
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
      await api.post('/trainings', formData);
      onSuccess();
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create training.');
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
              <div className="p-2 bg-info-subtle text-info rounded-3">
                <GraduationCap size={18} />
              </div>
              <h5 className="modal-title fw-bold fs-6 mb-0">Create Training / Upskilling Program</h5>
            </div>
            <button type="button" className="btn-close" onClick={onClose} aria-label="Close"></button>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="modal-body p-4">
              {error && <div className="alert alert-danger py-2 small mb-3">{error}</div>}

              <div className="row g-3">
                <div className="col-12">
                  <label className="form-label small fw-bold text-secondary">Program Title</label>
                  <input
                    type="text"
                    required
                    name="title"
                    placeholder="e.g. Advanced Docker & Kubernetes for Production"
                    className="form-control rounded-3"
                    value={formData.title}
                    onChange={handleChange}
                  />
                </div>

                <div className="col-12">
                  <label className="form-label small fw-bold text-secondary">Syllabus / Description</label>
                  <textarea
                    rows={3}
                    required
                    name="description"
                    placeholder="Key objectives, modules, and skills covered..."
                    className="form-control rounded-3"
                    value={formData.description}
                    onChange={handleChange}
                  ></textarea>
                </div>

                <div className="col-md-6">
                  <label className="form-label small fw-bold text-secondary">Instructor / Speaker</label>
                  <input
                    type="text"
                    required
                    name="instructor"
                    placeholder="e.g. Dr. Alex Mercer (Principal Architect)"
                    className="form-control rounded-3"
                    value={formData.instructor}
                    onChange={handleChange}
                  />
                </div>

                <div className="col-md-6">
                  <label className="form-label small fw-bold text-secondary">Department Focus</label>
                  <select
                    name="department"
                    className="form-select rounded-3"
                    value={formData.department}
                    onChange={handleChange}
                  >
                    <option value="All">All Departments</option>
                    <option value="Engineering">Engineering</option>
                    <option value="Management">Management & Leadership</option>
                    <option value="Marketing">Marketing</option>
                  </select>
                </div>

                <div className="col-md-3">
                  <label className="form-label small fw-bold text-secondary">Duration (Hours)</label>
                  <input
                    type="number"
                    name="durationHours"
                    className="form-control rounded-3"
                    value={formData.durationHours}
                    onChange={handleChange}
                  />
                </div>

                <div className="col-md-3">
                  <label className="form-label small fw-bold text-secondary">Capacity (Seats)</label>
                  <input
                    type="number"
                    name="maxCapacity"
                    className="form-control rounded-3"
                    value={formData.maxCapacity}
                    onChange={handleChange}
                  />
                </div>

                <div className="col-md-3">
                  <label className="form-label small fw-bold text-secondary">Start Date</label>
                  <input
                    type="date"
                    required
                    name="startDate"
                    className="form-control rounded-3"
                    value={formData.startDate}
                    onChange={handleChange}
                  />
                </div>

                <div className="col-md-3">
                  <label className="form-label small fw-bold text-secondary">End Date</label>
                  <input
                    type="date"
                    required
                    name="endDate"
                    className="form-control rounded-3"
                    value={formData.endDate}
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
                className="btn btn-info rounded-pill px-4 fw-bold text-white"
              >
                {loading ? 'Creating...' : 'Publish Training'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateTrainingModal;
