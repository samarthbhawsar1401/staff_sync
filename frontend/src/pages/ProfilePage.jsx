import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import {
  User,
  Mail,
  Phone,
  MapPin,
  Briefcase,
  Calendar,
  Shield,
  Save,
  CheckCircle,
  HeartPulse,
  Tag
} from 'lucide-react';

const ProfilePage = () => {
  const { user, updateProfileData } = useAuth();
  const [formData, setFormData] = useState({
    phone: '',
    address: '',
    emergencyContact: { name: '', relation: '', phone: '' },
    skills: '',
    avatar: ''
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (user) {
      setFormData({
        phone: user.phone || '',
        address: user.address || '',
        emergencyContact: user.emergencyContact || { name: '', relation: '', phone: '' },
        skills: Array.isArray(user.skills) ? user.skills.join(', ') : '',
        avatar: user.avatar || ''
      });
    }
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setMessage('');
      const skillsArray = formData.skills.split(',').map(s => s.trim()).filter(Boolean);
      await updateProfileData({
        phone: formData.phone,
        address: formData.address,
        emergencyContact: formData.emergencyContact,
        skills: skillsArray,
        avatar: formData.avatar
      });
      setMessage('Profile updated successfully!');
    } catch (err) {
      setMessage('Failed to update profile.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container-fluid p-3 p-md-4" style={{ maxWidth: '1000px' }}>
      <div className="mb-4">
        <h3 className="fw-bolder mb-1 text-dark">My Profile & Account Details</h3>
        <p className="text-secondary small mb-0">
          Manage your personal information, emergency contacts, and professional skills.
        </p>
      </div>

      {message && (
        <div className={`alert ${message.includes('success') ? 'alert-success' : 'alert-danger'} py-2 small mb-4 d-flex align-items-center gap-2`}>
          <CheckCircle size={16} /> {message}
        </div>
      )}

      <div className="row g-4">
        {/* Left Column: Profile Card */}
        <div className="col-md-4">
          <div className="card border-0 shadow-sm rounded-4 text-center p-4 bg-white">
            <div className="position-relative d-inline-block mx-auto mb-3">
              <img
                src={user?.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.name}`}
                alt={user?.name}
                className="rounded-circle border shadow-sm"
                style={{ width: 100, height: 100, objectFit: 'cover' }}
              />
            </div>
            <h5 className="fw-bold mb-1 text-dark">{user?.name}</h5>
            <p className="small text-primary fw-semibold mb-2">{user?.designation}</p>
            <span className="badge bg-light text-secondary border px-3 py-2 rounded-pill mb-3">
              {user?.department}
            </span>

            <div className="border-top pt-3 text-start small text-secondary d-flex flex-column gap-2">
              <div className="d-flex align-items-center gap-2">
                <Mail size={15} className="text-muted" />
                <span className="text-truncate">{user?.email}</span>
              </div>
              <div className="d-flex align-items-center gap-2">
                <Shield size={15} className="text-muted" />
                <span className="text-capitalize">Role: {user?.role}</span>
              </div>
              <div className="d-flex align-items-center gap-2">
                <Calendar size={15} className="text-muted" />
                <span>Joined: {user?.joinedDate}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Editable Profile Fields */}
        <div className="col-md-8">
          <div className="card border-0 shadow-sm rounded-4 p-4 bg-white">
            <h6 className="fw-bold text-dark mb-3">Personal & Contact Information</h6>

            <form onSubmit={handleSubmit}>
              <div className="row g-3 mb-4">
                <div className="col-md-6">
                  <label className="form-label small fw-bold text-secondary">Contact Phone</label>
                  <input
                    type="text"
                    className="form-control rounded-3"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="+1 (555) 000-0000"
                  />
                </div>

                <div className="col-md-6">
                  <label className="form-label small fw-bold text-secondary">Avatar URL</label>
                  <input
                    type="url"
                    className="form-control rounded-3"
                    value={formData.avatar}
                    onChange={(e) => setFormData({ ...formData, avatar: e.target.value })}
                    placeholder="https://..."
                  />
                </div>

                <div className="col-12">
                  <label className="form-label small fw-bold text-secondary">Residential Address</label>
                  <input
                    type="text"
                    className="form-control rounded-3"
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    placeholder="Street, City, State, ZIP"
                  />
                </div>

                <div className="col-12">
                  <label className="form-label small fw-bold text-secondary">Skills & Expertise (comma separated)</label>
                  <input
                    type="text"
                    className="form-control rounded-3"
                    value={formData.skills}
                    onChange={(e) => setFormData({ ...formData, skills: e.target.value })}
                    placeholder="React, Node.js, Leadership, UI Design"
                  />
                </div>
              </div>

              <h6 className="fw-bold text-dark mb-3 d-flex align-items-center gap-2">
                <HeartPulse size={18} className="text-danger" /> Emergency Contact
              </h6>

              <div className="row g-3 mb-4 bg-light p-3 rounded-4 border">
                <div className="col-md-4">
                  <label className="form-label small fw-bold text-secondary">Contact Name</label>
                  <input
                    type="text"
                    className="form-control rounded-3"
                    value={formData.emergencyContact.name}
                    onChange={(e) => setFormData({
                      ...formData,
                      emergencyContact: { ...formData.emergencyContact, name: e.target.value }
                    })}
                    placeholder="Contact Name"
                  />
                </div>

                <div className="col-md-4">
                  <label className="form-label small fw-bold text-secondary">Relationship</label>
                  <input
                    type="text"
                    className="form-control rounded-3"
                    value={formData.emergencyContact.relation}
                    onChange={(e) => setFormData({
                      ...formData,
                      emergencyContact: { ...formData.emergencyContact, relation: e.target.value }
                    })}
                    placeholder="Spouse / Parent / Sibling"
                  />
                </div>

                <div className="col-md-4">
                  <label className="form-label small fw-bold text-secondary">Emergency Phone</label>
                  <input
                    type="text"
                    className="form-control rounded-3"
                    value={formData.emergencyContact.phone}
                    onChange={(e) => setFormData({
                      ...formData,
                      emergencyContact: { ...formData.emergencyContact, phone: e.target.value }
                    })}
                    placeholder="+1 (555) 999-9999"
                  />
                </div>
              </div>

              <div className="text-end">
                <button
                  type="submit"
                  disabled={loading}
                  className="btn btn-primary rounded-pill px-4 fw-bold d-inline-flex align-items-center gap-2 shadow-sm"
                >
                  <Save size={16} />
                  {loading ? 'Saving...' : 'Save Profile Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
