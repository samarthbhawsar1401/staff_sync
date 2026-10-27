import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Briefcase, Lock, Mail, ArrowRight, ShieldCheck, Users } from 'lucide-react';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { login, loginAsRole } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError('');
      await login(email, password);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please check credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickDemo = async (role) => {
    try {
      setLoading(true);
      setError('');
      await loginAsRole(role);
      navigate('/dashboard');
    } catch (err) {
      setError('Demo login failed. Make sure the backend server is running.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-vh-100 bg-light d-flex align-items-center justify-content-center p-3">
      <div className="card border-0 shadow-lg rounded-4 overflow-hidden" style={{ maxWidth: '460px', width: '100%' }}>
        <div className="p-4 p-md-5">
          {/* Logo & Header */}
          <div className="text-center mb-4">
            <Link to="/" className="d-inline-flex align-items-center gap-2 text-decoration-none text-primary fw-bold fs-4 mb-2">
              <span className="p-2 rounded-3 bg-primary text-white d-flex align-items-center justify-content-center shadow-sm">
                <Briefcase size={22} />
              </span>
              <span className="text-dark">Staff<span className="text-primary">Sync</span></span>
            </Link>
            <h5 className="fw-bold text-dark mb-1">Welcome back</h5>
            <p className="text-secondary small mb-0">Sign in to your organization account</p>
          </div>

          {/* Quick Demo Switchers */}
          <div className="bg-light p-3 rounded-4 mb-4 border">
            <div className="small fw-bold text-secondary mb-2 text-center">
              ⚡ Instant 1-Click Demo Login:
            </div>
            <div className="d-flex flex-column gap-2">
              <button
                type="button"
                onClick={() => handleQuickDemo('hr')}
                disabled={loading}
                className="btn btn-outline-danger btn-sm rounded-pill fw-bold d-flex align-items-center justify-content-between px-3"
              >
                <span>👑 HR Admin (Sarah Jenkins)</span>
                <small className="badge bg-danger text-white">Full Access</small>
              </button>
              <button
                type="button"
                onClick={() => handleQuickDemo('manager')}
                disabled={loading}
                className="btn btn-outline-warning btn-sm rounded-pill fw-bold d-flex align-items-center justify-content-between px-3 text-dark"
              >
                <span>👔 Team Lead (Marcus Vance)</span>
                <small className="badge bg-warning text-dark">Manager</small>
              </button>
              <button
                type="button"
                onClick={() => handleQuickDemo('employee')}
                disabled={loading}
                className="btn btn-outline-primary btn-sm rounded-pill fw-bold d-flex align-items-center justify-content-between px-3"
              >
                <span>💻 Employee (Alex Rivera)</span>
                <small className="badge bg-primary text-white">Self-Service</small>
              </button>
            </div>
          </div>

          {error && (
            <div className="alert alert-danger py-2 small mb-3">
              {error}
            </div>
          )}

          {/* Credentials Form */}
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label small fw-bold text-secondary">Email Address</label>
              <div className="input-group">
                <span className="input-group-text bg-white border-end-0">
                  <Mail size={16} className="text-muted" />
                </span>
                <input
                  type="email"
                  required
                  placeholder="name@staffsync.com"
                  className="form-control border-start-0 ps-0"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            <div className="mb-3">
              <div className="d-flex justify-content-between">
                <label className="form-label small fw-bold text-secondary">Password</label>
              </div>
              <div className="input-group">
                <span className="input-group-text bg-white border-end-0">
                  <Lock size={16} className="text-muted" />
                </span>
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  className="form-control border-start-0 ps-0"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary w-100 rounded-pill py-2 fw-bold shadow-sm d-flex align-items-center justify-content-center gap-2 mb-3"
            >
              {loading ? (
                <div className="spinner-border spinner-border-sm" role="status"></div>
              ) : (
                <>
                  Sign In <ArrowRight size={16} />
                </>
              )}
            </button>
          </form>

          <div className="text-center small text-muted">
            Don't have an account yet?{' '}
            <Link to="/register" className="text-primary fw-bold text-decoration-none">
              Register here
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
