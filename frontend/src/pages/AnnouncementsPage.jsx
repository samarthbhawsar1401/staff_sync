import React, { useState, useEffect } from 'react';
import api from '../api/axiosClient';
import { useAuth } from '../context/AuthContext';
import CreateAnnouncementModal from '../components/CreateAnnouncementModal';
import { Megaphone, Plus, Trash2, AlertTriangle, Calendar, User, Tag } from 'lucide-react';

const AnnouncementsPage = () => {
  const { user } = useAuth();
  const role = user?.role || 'employee';

  const [announcements, setAnnouncements] = useState([]);
  const [priorityFilter, setPriorityFilter] = useState('All');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchAnnouncements = async () => {
    try {
      setLoading(true);
      const res = await api.get('/announcements');
      setAnnouncements(res.data);
    } catch (err) {
      console.error('Error fetching announcements:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  const handleDelete = async (id, title) => {
    if (window.confirm(`Delete notice: "${title}"?`)) {
      try {
        await api.delete(`/announcements/${id}`);
        fetchAnnouncements();
      } catch (err) {
        alert(err.response?.data?.message || 'Failed to delete notice.');
      }
    }
  };

  const filtered = announcements.filter(a =>
    priorityFilter === 'All' ? true : a.priority === priorityFilter
  );

  return (
    <div className="container-fluid p-3 p-md-4">
      {/* Top Header */}
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 mb-4">
        <div>
          <h3 className="fw-bolder mb-1 text-dark">Company Announcements & News</h3>
          <p className="text-secondary small mb-0">
            Official broadcasts, executive notices, policy releases, and company updates.
          </p>
        </div>

        <div className="d-flex align-items-center gap-2">
          {/* Priority filter pills */}
          <div className="btn-group bg-white p-1 rounded-pill border shadow-sm">
            {['All', 'Urgent', 'High', 'Normal'].map(p => (
              <button
                key={p}
                onClick={() => setPriorityFilter(p)}
                className={`btn btn-sm rounded-pill px-3 border-0 ${priorityFilter === p ? 'bg-primary text-white fw-bold' : 'text-secondary'}`}
              >
                {p === 'Urgent' ? '⚠️ Urgent' : p}
              </button>
            ))}
          </div>

          {role === 'hr' && (
            <button
              onClick={() => setIsModalOpen(true)}
              className="btn btn-danger rounded-pill px-3 fw-bold d-flex align-items-center gap-2 shadow-sm"
            >
              <Plus size={16} /> Broadcast Notice
            </button>
          )}
        </div>
      </div>

      {/* Grid of Announcements */}
      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status"></div>
          <p className="text-muted small mt-2">Loading announcements feed...</p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-5 bg-white rounded-4 border p-5">
          <Megaphone size={36} className="text-muted mb-2" />
          <h5 className="fw-bold text-dark">No announcements found</h5>
          <p className="text-secondary small">Check back later for organizational broadcasts.</p>
        </div>
      ) : (
        <div className="row g-4">
          {filtered.map(item => (
            <div key={item._id} className="col-lg-6">
              <div className="card border-0 shadow-sm rounded-4 h-100 overflow-hidden hover-shadow transition">
                {/* Priority banner strip */}
                <div
                  className={`py-1 px-4 small fw-bold text-uppercase d-flex align-items-center justify-content-between ${
                    item.priority === 'Urgent'
                      ? 'bg-danger text-white'
                      : item.priority === 'High'
                      ? 'bg-warning text-dark'
                      : 'bg-primary text-white'
                  }`}
                  style={{ fontSize: '11px', letterSpacing: '0.6px' }}
                >
                  <span>{item.priority === 'Urgent' && '⚠️ '}Priority: {item.priority}</span>
                  <span>Target: {item.department}</span>
                </div>

                <div className="card-body p-4">
                  <h5 className="fw-bold text-dark mb-2">{item.title}</h5>
                  <p className="text-secondary small mb-4" style={{ lineHeight: 1.6, whiteSpace: 'pre-line' }}>
                    {item.content}
                  </p>

                  <div className="d-flex align-items-center justify-content-between border-top pt-3 small text-muted">
                    <div className="d-flex align-items-center gap-2">
                      <User size={14} />
                      <span>{item.authorName}</span>
                    </div>
                    <div className="d-flex align-items-center gap-2">
                      <Calendar size={14} />
                      <span>{new Date(item.createdAt).toLocaleDateString()}</span>
                      {role === 'hr' && (
                        <button
                          onClick={() => handleDelete(item._id, item.title)}
                          className="btn btn-link text-danger p-0 ms-2"
                          title="Delete Notice"
                        >
                          <Trash2 size={16} />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      <CreateAnnouncementModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={fetchAnnouncements}
      />
    </div>
  );
};

export default AnnouncementsPage;
