import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useNotifications } from '../context/NotificationContext';
import {
  Bell,
  User,
  LogOut,
  Briefcase,
  ShieldCheck,
  Users,
  CheckCircle2,
  Calendar,
  AlertTriangle,
  Menu
} from 'lucide-react';

const Navbar = ({ onToggleSidebar }) => {
  const { user, logout, loginAsRole } = useAuth();
  const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotifications();
  const [showNotifs, setShowNotifs] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleQuickSwitch = async (role) => {
    try {
      await loginAsRole(role);
      navigate('/dashboard');
    } catch (e) {
      console.error('Quick switch failed:', e);
    }
  };

  const getRoleBadge = (role) => {
    switch (role) {
      case 'hr':
        return <span className="badge bg-danger-subtle text-danger border border-danger-subtle px-2 py-1"><ShieldCheck size={14} className="me-1 inline" /> HR Personnel</span>;
      case 'manager':
        return <span className="badge bg-warning-subtle text-warning-emphasis border border-warning-subtle px-2 py-1"><Users size={14} className="me-1 inline" /> Team Manager</span>;
      case 'employee':
      default:
        return <span className="badge bg-primary-subtle text-primary border border-primary-subtle px-2 py-1"><Briefcase size={14} className="me-1 inline" /> Staff Employee</span>;
    }
  };

  return (
    <header className="navbar navbar-expand bg-white border-bottom sticky-top px-3 py-2 shadow-sm">
      <div className="container-fluid d-flex align-items-center justify-content-between">
        
        {/* Left Side: Brand & Sidebar Toggle */}
        <div className="d-flex align-items-center gap-2">
          {onToggleSidebar && (
            <button
              className="btn btn-outline-secondary btn-sm d-md-none"
              onClick={onToggleSidebar}
              aria-label="Toggle Navigation"
            >
              <Menu size={18} />
            </button>
          )}
          <Link to="/dashboard" className="navbar-brand d-flex align-items-center gap-2 text-decoration-none fw-bold fs-5 text-primary mb-0">
            <span className="p-1 rounded-3 bg-primary text-white d-flex align-items-center justify-content-center shadow-sm" style={{ width: 34, height: 34 }}>
              <Briefcase size={20} />
            </span>
            <span className="text-dark fw-bolder">Staff<span className="text-primary">Sync</span></span>
          </Link>
          <span className="badge bg-light text-muted border d-none d-lg-inline-block ms-1">v2.0 HRM</span>
        </div>

        {/* Center: Persona Quick Switcher for seamless testing */}
        <div className="d-none d-md-flex align-items-center bg-light p-1 rounded-pill border">
          <small className="text-muted px-2 fw-semibold">Quick Switch:</small>
          <button
            onClick={() => handleQuickSwitch('hr')}
            className={`btn btn-sm rounded-pill px-3 py-0 border-0 ${user?.role === 'hr' ? 'bg-danger text-white fw-bold shadow-sm' : 'text-secondary hover-bg'}`}
          >
            👑 HR Admin
          </button>
          <button
            onClick={() => handleQuickSwitch('manager')}
            className={`btn btn-sm rounded-pill px-3 py-0 border-0 ${user?.role === 'manager' ? 'bg-warning text-dark fw-bold shadow-sm' : 'text-secondary hover-bg'}`}
          >
            👔 Manager
          </button>
          <button
            onClick={() => handleQuickSwitch('employee')}
            className={`btn btn-sm rounded-pill px-3 py-0 border-0 ${user?.role === 'employee' ? 'bg-primary text-white fw-bold shadow-sm' : 'text-secondary hover-bg'}`}
          >
            💻 Employee
          </button>
        </div>

        {/* Right Side: Role Badge, Notifications & Profile */}
        <div className="d-flex align-items-center gap-3">
          
          <div className="d-none d-sm-block">
            {getRoleBadge(user?.role)}
          </div>

          {/* Notifications Dropdown */}
          <div className="position-relative">
            <button
              className="btn btn-light rounded-circle position-relative p-2 border"
              onClick={() => setShowNotifs(!showNotifs)}
              title="Notifications"
            >
              <Bell size={18} className="text-secondary" />
              {unreadCount > 0 && (
                <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                  {unreadCount}
                </span>
              )}
            </button>

            {showNotifs && (
              <div
                className="dropdown-menu dropdown-menu-end show position-absolute end-0 shadow-lg border p-0 mt-2"
                style={{ width: '320px', zIndex: 1050 }}
              >
                <div className="p-3 border-bottom d-flex align-items-center justify-content-between bg-light">
                  <h6 className="mb-0 fw-bold">Notifications ({unreadCount} new)</h6>
                  {unreadCount > 0 && (
                    <button
                      className="btn btn-link btn-sm p-0 text-decoration-none text-primary"
                      onClick={markAllAsRead}
                    >
                      Mark all read
                    </button>
                  )}
                </div>
                <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
                  {notifications.length === 0 ? (
                    <div className="p-4 text-center text-muted small">
                      <CheckCircle2 size={24} className="mb-1 text-success d-block mx-auto" />
                      No notifications yet. You're all caught up!
                    </div>
                  ) : (
                    notifications.map(notif => (
                      <div
                        key={notif._id}
                        onClick={() => markAsRead(notif._id)}
                        className={`p-3 border-bottom cursor-pointer hover-bg transition ${notif.read ? 'bg-white opacity-75' : 'bg-light fw-medium'}`}
                        style={{ cursor: 'pointer' }}
                      >
                        <div className="d-flex align-items-start gap-2">
                          <div className="mt-1">
                            {notif.type === 'leave' ? (
                              <Calendar size={14} className="text-warning" />
                            ) : notif.type === 'announcement' ? (
                              <AlertTriangle size={14} className="text-danger" />
                            ) : (
                              <Bell size={14} className="text-primary" />
                            )}
                          </div>
                          <div className="flex-grow-1">
                            <div className="d-flex justify-content-between align-items-center">
                              <small className="fw-bold">{notif.title}</small>
                              {!notif.read && <span className="badge bg-primary" style={{ fontSize: '8px' }}>NEW</span>}
                            </div>
                            <p className="small mb-1 text-secondary text-truncate-2" style={{ fontSize: '12px' }}>
                              {notif.message}
                            </p>
                            <small className="text-muted" style={{ fontSize: '10px' }}>
                              {new Date(notif.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </small>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          {/* User Profile dropdown */}
          <div className="position-relative">
            <button
              className="btn btn-light d-flex align-items-center gap-2 p-1 pe-2 rounded-pill border"
              onClick={() => setShowProfileMenu(!showProfileMenu)}
            >
              <img
                src={user?.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.name || 'User'}`}
                alt={user?.name}
                className="rounded-circle object-fit-cover"
                style={{ width: 32, height: 32 }}
              />
              <span className="small fw-bold d-none d-md-inline-block text-dark">
                {user?.name?.split(' ')[0]}
              </span>
            </button>

            {showProfileMenu && (
              <div
                className="dropdown-menu dropdown-menu-end show position-absolute end-0 shadow-lg border p-2 mt-2"
                style={{ width: '220px', zIndex: 1050 }}
              >
                <div className="px-3 py-2 border-bottom mb-2">
                  <div className="fw-bold text-dark text-truncate">{user?.name}</div>
                  <small className="text-muted d-block text-truncate">{user?.email}</small>
                  <small className="badge bg-secondary-subtle text-secondary mt-1">{user?.department}</small>
                </div>
                <Link
                  to="/profile"
                  className="dropdown-item d-flex align-items-center gap-2 py-2 rounded"
                  onClick={() => setShowProfileMenu(false)}
                >
                  <User size={16} /> My Profile
                </Link>
                <hr className="dropdown-divider my-1" />
                <button
                  className="dropdown-item d-flex align-items-center gap-2 py-2 rounded text-danger"
                  onClick={handleLogout}
                >
                  <LogOut size={16} /> Sign Out
                </button>
              </div>
            )}
          </div>

        </div>

      </div>
    </header>
  );
};

export default Navbar;
