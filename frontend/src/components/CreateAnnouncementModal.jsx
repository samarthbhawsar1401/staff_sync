import React, { useState } from 'react';
import api from '../api/axiosClient';
import { Megaphone } from 'lucide-react';

const CreateAnnouncementModal = ({ isOpen, onClose, onSuccess }) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [priority, setPriority] = useState('Normal');
  const [department, setDepartment] = useState('All');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) {
      setError('Title and content are required.');
      return;
    }

    try {
      setLoading(true);
      setError('');
      await api.post('/announcements', {
        title: title.trim(),
        content: content.trim(),
        priority,
        department
      });
      onSuccess();
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to publish announcement.');
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
              <div className="p-2 bg-danger-subtle text-danger rounded-3">
                <Megaphone size={18} />
              </div>
              <h5 className="modal-title fw-bold fs-6 mb-0">Broadcast Announcement</h5>
            </div>
            <button type="button" className="btn-close" onClick={onClose} aria-label="Close"></button>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="modal-body p-4">
              {error && <div className="alert alert-danger py-2 small mb-3">{error}</div>}

              <div className="mb-3">
                <label className="form-label small fw-bold text-secondary">Subject / Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Q4 Townhall & Benefits Update"
                  className="form-control rounded-3"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>

              <div className="row g-3 mb-3">
                <div className="col-6">
                  <label className="form-label small fw-bold text-secondary">Priority Level</label>
                  <select
                    className="form-select rounded-3"
                    value={priority}
                    onChange={(e) => setPriority(e.target.value)}
                  >
                    <option value="Normal">Normal</option>
                    <option value="High">High</option>
                    <option value="Urgent">⚠️ Urgent Alert</option>
                  </select>
                </div>

                <div className="col-6">
                  <label className="form-label small fw-bold text-secondary">Target Audience</label>
                  <select
                    className="form-select rounded-3"
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                  >
                    <option value="All">All Departments</option>
                    <option value="Engineering">Engineering Only</option>
                    <option value="Marketing">Marketing Only</option>
                    <option value="Human Resources">HR Only</option>
                  </select>
                </div>
              </div>

              <div className="mb-3">
                <label className="form-label small fw-bold text-secondary">Announcement Message</label>
                <textarea
                  className="form-control rounded-3"
                  rows={4}
                  required
                  placeholder="Write full announcement details..."
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
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
                className="btn btn-danger rounded-pill px-4 fw-bold"
              >
                {loading ? 'Publishing...' : 'Publish Announcement'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateAnnouncementModal;
