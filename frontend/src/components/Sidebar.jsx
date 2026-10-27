import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  LayoutDashboard,
  Users,
  Clock,
  CalendarDays,
  Megaphone,
  GraduationCap,
  BarChart3,
  UserCheck,
  Shield,
  HelpCircle,
  FolderTree
} from 'lucide-react';

const Sidebar = ({ isOpen, onClose }) => {
  const { user } = useAuth();
  const role = user?.role || 'employee';

  const navItemClass = ({ isActive }) =>
    `d-flex align-items-center gap-3 px-3 py-2 rounded-3 text-decoration-none transition ${
      isActive
        ? 'bg-primary text-white fw-bold shadow-sm'
        : 'text-secondary hover-bg fw-medium'
    }`;

  return (
    <aside
      className={`sidebar-wrapper bg-white border-end d-flex flex-column justify-content-between p-3 ${
        isOpen ? 'open' : ''
      }`}
      style={{ width: '250px', minHeight: 'calc(100vh - 60px)' }}
    >
      <div>
        {/* Core Navigation */}
        <div className="text-uppercase text-muted fw-bold small px-3 mb-2" style={{ fontSize: '11px', letterSpacing: '0.8px' }}>
          Menu
        </div>
        <nav className="nav flex-column gap-1 mb-4">
          <NavLink to="/dashboard" className={navItemClass} onClick={onClose}>
            <LayoutDashboard size={18} />
            <span>Dashboard</span>
          </NavLink>

          <NavLink to="/attendance" className={navItemClass} onClick={onClose}>
            <Clock size={18} />
            <span>Attendance</span>
          </NavLink>

          <NavLink to="/leaves" className={navItemClass} onClick={onClose}>
            <CalendarDays size={18} />
            <span>Leave Requests</span>
          </NavLink>

          <NavLink to="/trainings" className={navItemClass} onClick={onClose}>
            <GraduationCap size={18} />
            <span>Training & Skills</span>
          </NavLink>

          <NavLink to="/announcements" className={navItemClass} onClick={onClose}>
            <Megaphone size={18} />
            <span>Announcements</span>
          </NavLink>
        </nav>

        {/* Management & Admin Section */}
        {(role === 'hr' || role === 'manager') && (
          <>
            <div className="text-uppercase text-muted fw-bold small px-3 mb-2" style={{ fontSize: '11px', letterSpacing: '0.8px' }}>
              {role === 'hr' ? 'HR Administration' : 'Team Management'}
            </div>
            <nav className="nav flex-column gap-1 mb-4">
              <NavLink to="/employees" className={navItemClass} onClick={onClose}>
                <Users size={18} />
                <span>{role === 'hr' ? 'Employee Directory' : 'My Team'}</span>
              </NavLink>

              <NavLink to="/analytics" className={navItemClass} onClick={onClose}>
                <BarChart3 size={18} />
                <span>Reports & Analytics</span>
              </NavLink>
            </nav>
          </>
        )}
      </div>

      {/* Role info card at bottom */}
      <div className="p-3 bg-light rounded-3 border">
        <div className="d-flex align-items-center gap-2 mb-1">
          <Shield size={16} className="text-primary" />
          <span className="small fw-bold text-dark">StaffSync Role</span>
        </div>
        <p className="small text-muted mb-0 text-capitalize" style={{ fontSize: '12px' }}>
          Logged in as <strong>{user?.name?.split(' ')[0]}</strong> ({role.toUpperCase()}) in {user?.department}.
        </p>
      </div>
    </aside>
  );
};

export default Sidebar;
