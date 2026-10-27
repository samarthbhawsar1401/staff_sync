import React, { useState, useEffect } from 'react';
import api from '../api/axiosClient';
import StatCard from '../components/StatCard';
import {
  BarChart3,
  Users,
  CheckCircle2,
  CalendarDays,
  GraduationCap,
  PieChart,
  Activity,
  ArrowUpRight,
  TrendingUp,
  Download
} from 'lucide-react';

const AnalyticsPage = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        setLoading(true);
        const res = await api.get('/analytics/dashboard');
        setData(res.data);
      } catch (err) {
        console.error('Error fetching analytics:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, []);

  if (loading) {
    return (
      <div className="container-fluid p-4 text-center py-5">
        <div className="spinner-border text-primary" role="status"></div>
        <p className="text-muted small mt-2">Computing workforce intelligence...</p>
      </div>
    );
  }

  const { summary, departments, leaveTypeCounts, recentActivities } = data || {};

  return (
    <div className="container-fluid p-3 p-md-4">
      {/* Top Header */}
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 mb-4">
        <div>
          <h3 className="fw-bolder mb-1 text-dark">HR Reports & Workforce Analytics</h3>
          <p className="text-secondary small mb-0">
            Real-time organizational telemetry, operational benchmarks, and leave utilization.
          </p>
        </div>

        <button
          onClick={() => window.print()}
          className="btn btn-outline-secondary rounded-pill px-3 btn-sm fw-medium d-flex align-items-center gap-2"
        >
          <Download size={14} /> Export Summary
        </button>
      </div>

      {/* KPI Cards */}
      <div className="row g-3 mb-4">
        <div className="col-sm-6 col-xl-3">
          <StatCard
            title="Total Headcount"
            value={summary?.totalStaff || 0}
            icon={Users}
            color="primary"
            subtext="Active full-time workforce"
          />
        </div>
        <div className="col-sm-6 col-xl-3">
          <StatCard
            title="Today's Presence Rate"
            value={`${summary?.attendanceRate || 0}%`}
            icon={CheckCircle2}
            color="success"
            subtext={`${summary?.checkedInToday || 0} active check-ins`}
          />
        </div>
        <div className="col-sm-6 col-xl-3">
          <StatCard
            title="Pending Approvals"
            value={summary?.pendingLeaves || 0}
            icon={CalendarDays}
            color="warning"
            subtext="Leave requests awaiting action"
          />
        </div>
        <div className="col-sm-6 col-xl-3">
          <StatCard
            title="Active Programs"
            value={summary?.totalTrainings || 0}
            icon={GraduationCap}
            color="info"
            subtext="Continuous upskilling tracks"
          />
        </div>
      </div>

      {/* Analytics Charts & Visual Breakdowns */}
      <div className="row g-4 mb-4">
        {/* Department Headcount Visual */}
        <div className="col-lg-6">
          <div className="card border-0 shadow-sm rounded-4 h-100 p-4 bg-white">
            <div className="d-flex align-items-center justify-content-between mb-4">
              <div className="d-flex align-items-center gap-2">
                <BarChart3 size={20} className="text-primary" />
                <h6 className="fw-bold mb-0">Headcount by Department</h6>
              </div>
              <span className="badge bg-light text-muted border">Active Roster</span>
            </div>

            <div className="d-flex flex-column gap-3">
              {departments?.map(dept => {
                const total = summary?.totalStaff || 1;
                const pct = Math.round((dept.count / total) * 100);
                return (
                  <div key={dept.name}>
                    <div className="d-flex justify-content-between small fw-bold mb-1">
                      <span>{dept.name}</span>
                      <span className="text-secondary">{dept.count} members ({pct}%)</span>
                    </div>
                    <div className="progress" style={{ height: '10px' }}>
                      <div
                        className="progress-bar bg-primary rounded-pill"
                        role="progressbar"
                        style={{ width: `${pct}%` }}
                      ></div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Leave Type Breakdown */}
        <div className="col-lg-6">
          <div className="card border-0 shadow-sm rounded-4 h-100 p-4 bg-white">
            <div className="d-flex align-items-center justify-content-between mb-4">
              <div className="d-flex align-items-center gap-2">
                <PieChart size={20} className="text-warning" />
                <h6 className="fw-bold mb-0">Time Off Distribution by Category</h6>
              </div>
              <span className="badge bg-light text-muted border">Quarter-to-date</span>
            </div>

            <div className="row g-3">
              {leaveTypeCounts && Object.entries(leaveTypeCounts).map(([type, count]) => (
                <div key={type} className="col-6">
                  <div className="p-3 bg-light rounded-4 border text-center">
                    <span className="small text-muted fw-bold d-block text-uppercase" style={{ fontSize: '11px' }}>
                      {type}
                    </span>
                    <h3 className="fw-bolder mb-0 text-dark mt-1">{count}</h3>
                    <small className="text-secondary" style={{ fontSize: '11px' }}>Total Applications</small>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Audit Log / Event Feed */}
      <div className="card border-0 shadow-sm rounded-4 overflow-hidden">
        <div className="card-header bg-white py-3 border-bottom d-flex align-items-center gap-2">
          <Activity size={18} className="text-success" />
          <h6 className="fw-bold mb-0">Live HRM Audit & Activity Log</h6>
        </div>
        <div className="card-body p-0">
          <div className="list-group list-group-flush">
            {recentActivities?.map((act, idx) => (
              <div key={idx} className="list-group-item p-3 border-bottom d-flex align-items-center justify-content-between">
                <div>
                  <span className="fw-bold small text-dark d-block">{act.title}</span>
                  <small className="text-muted">{new Date(act.time).toLocaleString()}</small>
                </div>
                <span className={`badge bg-${act.badge}-subtle text-${act.badge} rounded-pill text-capitalize px-3 py-2`}>
                  {act.type}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsPage;
