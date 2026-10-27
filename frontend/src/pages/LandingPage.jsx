import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  Briefcase,
  ShieldCheck,
  Users,
  Clock,
  CalendarCheck,
  GraduationCap,
  BarChart,
  ArrowRight,
  CheckCircle2,
  Sparkles
} from 'lucide-react';

const LandingPage = () => {
  const { loginAsRole, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleDemoLogin = async (role) => {
    try {
      await loginAsRole(role);
      navigate('/dashboard');
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="min-vh-100 bg-white">
      {/* Top Bar */}
      <nav className="navbar navbar-expand-lg bg-white border-bottom py-3 sticky-top">
        <div className="container">
          <Link to="/" className="navbar-brand d-flex align-items-center gap-2 fw-bold fs-4 text-primary">
            <span className="p-2 rounded-3 bg-primary text-white d-flex align-items-center justify-content-center shadow-sm">
              <Briefcase size={22} />
            </span>
            <span className="text-dark">Staff<span className="text-primary">Sync</span></span>
          </Link>
          <div className="d-flex align-items-center gap-2">
            {isAuthenticated ? (
              <Link to="/dashboard" className="btn btn-primary rounded-pill px-4 fw-bold">
                Go to Dashboard <ArrowRight size={16} className="ms-1" />
              </Link>
            ) : (
              <>
                <Link to="/login" className="btn btn-outline-primary rounded-pill px-4 fw-medium">
                  Sign In
                </Link>
                <Link to="/register" className="btn btn-primary rounded-pill px-4 fw-bold shadow-sm">
                  Get Started
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="py-5 bg-gradient-light border-bottom text-center">
        <div className="container py-4">
          <div className="badge bg-primary-subtle text-primary border border-primary-subtle px-3 py-2 rounded-pill mb-3 fw-semibold">
            <Sparkles size={14} className="me-1 inline" /> Modern Human Resource Management Solution
          </div>
          <h1 className="display-4 fw-bolder text-dark mb-3 tracking-tight">
            Streamline People, Performance, and <span className="text-primary">Productivity</span>
          </h1>
          <p className="lead text-secondary mx-auto mb-4" style={{ maxWidth: '720px' }}>
            StaffSync is a next-generation MERN-stack platform empowering organizations with unified attendance tracking, automated leave workflows, collaborative team management, and role-based operational transparency.
          </p>

          {/* Quick Demo Accounts Banner */}
          <div className="card shadow border-0 rounded-4 mx-auto p-4 bg-white" style={{ maxWidth: '850px' }}>
            <h6 className="fw-bold text-dark mb-3">
              🚀 Explore Instant 1-Click Interactive Demo Personas:
            </h6>
            <div className="row g-3">
              <div className="col-md-4">
                <div className="p-3 border rounded-4 text-center h-100 hover-shadow transition">
                  <div className="p-2 bg-danger-subtle text-danger rounded-circle d-inline-flex mb-2">
                    <ShieldCheck size={24} />
                  </div>
                  <h6 className="fw-bold mb-1">HR Personnel</h6>
                  <p className="small text-muted mb-3">Full employee lifecycle, company attendance, leaves, and analytics.</p>
                  <button
                    onClick={() => handleDemoLogin('hr')}
                    className="btn btn-outline-danger btn-sm rounded-pill w-100 fw-bold"
                  >
                    Login as HR Admin
                  </button>
                </div>
              </div>

              <div className="col-md-4">
                <div className="p-3 border rounded-4 text-center h-100 hover-shadow transition">
                  <div className="p-2 bg-warning-subtle text-warning-emphasis rounded-circle d-inline-flex mb-2">
                    <Users size={24} />
                  </div>
                  <h6 className="fw-bold mb-1">Team Manager</h6>
                  <p className="small text-muted mb-3">Review leave requests, monitor team presence, and assign trainings.</p>
                  <button
                    onClick={() => handleDemoLogin('manager')}
                    className="btn btn-outline-warning btn-sm rounded-pill w-100 fw-bold"
                  >
                    Login as Manager
                  </button>
                </div>
              </div>

              <div className="col-md-4">
                <div className="p-3 border rounded-4 text-center h-100 hover-shadow transition">
                  <div className="p-2 bg-primary-subtle text-primary rounded-circle d-inline-flex mb-2">
                    <Briefcase size={24} />
                  </div>
                  <h6 className="fw-bold mb-1">Staff Employee</h6>
                  <p className="small text-muted mb-3">Interactive daily clock-in timer, time off applications, training catalog.</p>
                  <button
                    onClick={() => handleDemoLogin('employee')}
                    className="btn btn-outline-primary btn-sm rounded-pill w-100 fw-bold"
                  >
                    Login as Employee
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Core Capabilities */}
      <section className="py-5 bg-white">
        <div className="container py-4">
          <div className="text-center mb-5">
            <h2 className="fw-bold text-dark">Built for Today’s High-Performance Teams</h2>
            <p className="text-secondary">Every feature crafted to automate repetitive HR workflows and foster transparency.</p>
          </div>

          <div className="row g-4">
            <div className="col-md-4">
              <div className="p-4 border rounded-4 h-100 bg-light-subtle">
                <div className="p-3 bg-primary text-white rounded-3 d-inline-block mb-3">
                  <Clock size={24} />
                </div>
                <h5 className="fw-bold">Precision Attendance Tracking</h5>
                <p className="text-secondary small mb-0">
                  Real-time digital clock-in and clock-out with elapsed shift timer, auto-detection of late arrivals, and historical logs.
                </p>
              </div>
            </div>

            <div className="col-md-4">
              <div className="p-4 border rounded-4 h-100 bg-light-subtle">
                <div className="p-3 bg-success text-white rounded-3 d-inline-block mb-3">
                  <CalendarCheck size={24} />
                </div>
                <h5 className="fw-bold">Intelligent Leave Management</h5>
                <p className="text-secondary small mb-0">
                  Annual, Sick, and Casual leave allocations with automatic balance calculation and a fast two-way manager approval workflow.
                </p>
              </div>
            </div>

            <div className="col-md-4">
              <div className="p-4 border rounded-4 h-100 bg-light-subtle">
                <div className="p-3 bg-info text-white rounded-3 d-inline-block mb-3">
                  <GraduationCap size={24} />
                </div>
                <h5 className="fw-bold">Continuous Training Hub</h5>
                <p className="text-secondary small mb-0">
                  Empower employee growth through structured technical and leadership cohorts with self-enrollment and manager assignments.
                </p>
              </div>
            </div>

            <div className="col-md-4">
              <div className="p-4 border rounded-4 h-100 bg-light-subtle">
                <div className="p-3 bg-warning text-dark rounded-3 d-inline-block mb-3">
                  <Users size={24} />
                </div>
                <h5 className="fw-bold">Multi-Level Role Permissions</h5>
                <p className="text-secondary small mb-0">
                  Strict JWT-based RBAC securing HR administration, team leader oversight, and employee self-service privileges.
                </p>
              </div>
            </div>

            <div className="col-md-4">
              <div className="p-4 border rounded-4 h-100 bg-light-subtle">
                <div className="p-3 bg-danger text-white rounded-3 d-inline-block mb-3">
                  <BarChart size={24} />
                </div>
                <h5 className="fw-bold">Organization Analytics</h5>
                <p className="text-secondary small mb-0">
                  Visual breakdowns of departmental headcount, daily company attendance rates, and leave patterns for executive decisions.
                </p>
              </div>
            </div>

            <div className="col-md-4">
              <div className="p-4 border rounded-4 h-100 bg-light-subtle">
                <div className="p-3 bg-dark text-white rounded-3 d-inline-block mb-3">
                  <ShieldCheck size={24} />
                </div>
                <h5 className="fw-bold">Enterprise Security & Speed</h5>
                <p className="text-secondary small mb-0">
                  Protected API routes, Bcrypt password hashing, and hybrid storage supporting MongoDB and instant zero-config mode.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-4 border-top bg-light text-center">
        <div className="container">
          <p className="mb-0 text-muted small">
            © {new Date().getFullYear()} <strong>StaffSync HRM</strong> - Modern Human Resource Management Solution. Built with MERN Stack & Bootstrap.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
