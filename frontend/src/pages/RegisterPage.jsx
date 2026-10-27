import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Briefcase, User, Mail, Lock, Building, Phone } from 'lucide-react';

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'employee',
    department: 'Engineering',
    designation: 'Software Associate',
    phone: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError('');
      await register(formData);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-vh-100 bg-light d-flex align-items-center justify-content-center p-3">
      <div className="card border-0 shadow-lg rounded-4 overflow-hidden" style={{ maxWidth: '520px', width: '100%' }}>
        <div className="p-4 p-md-5">
          <div className="text-center mb-4">
            <Link to="/" className="d-inline-flex align-items-center gap-2 text-decoration-none text-primary fw-bold fs-4 mb-2">
              <span className="p-2 rounded-3 bg-primary text-white d-flex align-items-center justify-content-center shadow-sm">
                <Briefcase size={22} />
              </span>
              <span className="text-dark">Staff<span className="text-primary">Sync</span></span>
            </Link>
            <h5 className="fw-bold text-dark mb-1">Create an Account</h5>
            <p className="text-secondary small mb-0">Join your organization workspace</p>
          </div>

          {error && <div className="alert alert-danger py-2 small mb-3">{error}</div>}

          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label small fw-bold text-secondary">Full Name</label>
              <div className="input-group">
                <span className="input-group-text bg-white border-end-0">
                  <User size={16} className="text-muted" />
                </span>
                <input
                  type="text"
                  required
                  name="name"
                  placeholder="e.g. Jordan Hayes"
                  className="form-control border-start-0 ps-0"
                  value={formData.name}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="mb-3">
              <label className="form-label small fw-bold text-secondary">Email Address</label>
              <div className="input-group">
                <span className="input-group-text bg-white border-end-0">
                  <Mail size={16} className="text-muted" />
                </span>
                <input
                  type="email"
                  required
                  name="email"
                  placeholder="name@company.com"
                  className="form-control border-start-0 ps-0"
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="row g-2 mb-3">
              <div className="col-md-6">
                <label className="form-label small fw-bold text-secondary">Role</label>
                <select
                  name="role"
                  className="form-select"
                  value={formData.role}
                  onChange={handleChange}
                >
                  <option value="employee">Staff Employee</option>
                  <option value="manager">Team Manager</option>
                  <option value="hr">HR Personnel</option>
                </select>
              </div>

              <div className="col-md-6">
                <label className="form-label small fw-bold text-secondary">Department</label>
                <select
                  name="department"
                  className="form-select"
                  value={formData.department}
                  onChange={handleChange}
                >
                  <option value="Engineering">Engineering</option>
                  <option value="Human Resources">Human Resources</option>
                  <option value="Marketing">Marketing</option>
                  <option value="Product">Product</option>
                  <option value="Finance">Finance</option>
                </select>
              </div>
            </div>

            <div className="mb-3">
              <label className="form-label small fw-bold text-secondary">Password</label>
              <div className="input-group">
                <span className="input-group-text bg-white border-end-0">
                  <Lock size={16} className="text-muted" />
                </span>
                <input
                  type="password"
                  required
                  name="password"
                  placeholder="Minimum 6 characters"
                  className="form-control border-start-0 ps-0"
                  value={formData.password}
                  onChange={handleChange}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary w-100 rounded-pill py-2 fw-bold shadow-sm mb-3"
            >
              {loading ? 'Creating Account...' : 'Register & Enter Workspace'}
            </button>
          </form>

          <div className="text-center small text-muted">
            Already registered?{' '}
            <Link to="/login" className="text-primary fw-bold text-decoration-none">
              Sign in
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
