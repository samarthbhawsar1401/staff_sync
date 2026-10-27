import React, { useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import ProtectedRoute from './components/ProtectedRoute';

// Pages
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import EmployeesPage from './pages/EmployeesPage';
import AttendancePage from './pages/AttendancePage';
import LeavesPage from './pages/LeavesPage';
import AnnouncementsPage from './pages/AnnouncementsPage';
import TrainingsPage from './pages/TrainingsPage';
import AnalyticsPage from './pages/AnalyticsPage';
import ProfilePage from './pages/ProfilePage';

// Main App Layout Wrapper for Protected Pages
const AppLayout = ({ children, allowedRoles }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <ProtectedRoute allowedRoles={allowedRoles}>
      <div className="d-flex flex-column min-vh-100 bg-light">
        <Navbar onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
        <div className="d-flex flex-grow-1 position-relative">
          <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
          <main className="flex-grow-1 overflow-auto p-2 p-md-3">
            {children}
          </main>
        </div>
      </div>
    </ProtectedRoute>
  );
};

const App = () => {
  const { isAuthenticated } = useAuth();

  return (
    <Routes>
      {/* Public Pages */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={isAuthenticated ? <Navigate to="/dashboard" /> : <LoginPage />} />
      <Route path="/register" element={isAuthenticated ? <Navigate to="/dashboard" /> : <RegisterPage />} />

      {/* Protected HRM Portal Pages */}
      <Route
        path="/dashboard"
        element={
          <AppLayout>
            <DashboardPage />
          </AppLayout>
        }
      />

      <Route
        path="/employees"
        element={
          <AppLayout allowedRoles={['hr', 'manager']}>
            <EmployeesPage />
          </AppLayout>
        }
      />

      <Route
        path="/attendance"
        element={
          <AppLayout>
            <AttendancePage />
          </AppLayout>
        }
      />

      <Route
        path="/leaves"
        element={
          <AppLayout>
            <LeavesPage />
          </AppLayout>
        }
      />

      <Route
        path="/announcements"
        element={
          <AppLayout>
            <AnnouncementsPage />
          </AppLayout>
        }
      />

      <Route
        path="/trainings"
        element={
          <AppLayout>
            <TrainingsPage />
          </AppLayout>
        }
      />

      <Route
        path="/analytics"
        element={
          <AppLayout allowedRoles={['hr', 'manager']}>
            <AnalyticsPage />
          </AppLayout>
        }
      />

      <Route
        path="/profile"
        element={
          <AppLayout>
            <ProfilePage />
          </AppLayout>
        }
      />

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default App;
