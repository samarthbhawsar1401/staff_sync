import React, { useState, useEffect } from 'react';
import api from '../api/axiosClient';
import { useAuth } from '../context/AuthContext';
import CreateTrainingModal from '../components/CreateTrainingModal';
import AssignTrainingModal from '../components/AssignTrainingModal';
import {
  GraduationCap,
  Plus,
  Calendar,
  Clock,
  Users,
  CheckCircle2,
  UserCheck,
  Award,
  Sparkles,
  Trash2
} from 'lucide-react';

const TrainingsPage = () => {
  const { user } = useAuth();
  const role = user?.role || 'employee';

  const [trainings, setTrainings] = useState([]);
  const [teamMembers, setTeamMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [assigningTraining, setAssigningTraining] = useState(null);

  const fetchTrainings = async () => {
    try {
      setLoading(true);
      const [trnRes, teamRes] = await Promise.all([
        api.get('/trainings'),
        role === 'manager' || role === 'hr' ? api.get('/employees') : Promise.resolve({ data: [] })
      ]);
      setTrainings(trnRes.data);
      setTeamMembers(teamRes.data);
    } catch (err) {
      console.error('Error fetching training programs:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTrainings();
  }, [role]);

  const handleEnroll = async (id, title) => {
    try {
      await api.post(`/trainings/${id}/enroll`);
      alert(`🎉 Congratulations! You have successfully enrolled in: "${title}".`);
      fetchTrainings();
    } catch (err) {
      alert(err.response?.data?.message || 'Enrollment failed.');
    }
  };

  const handleDelete = async (id, title) => {
    if (window.confirm(`Delete training program "${title}"?`)) {
      try {
        await api.delete(`/trainings/${id}`);
        fetchTrainings();
      } catch (err) {
        alert(err.response?.data?.message || 'Failed to delete program.');
      }
    }
  };

  return (
    <div className="container-fluid p-3 p-md-4">
      {/* Top Header */}
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 mb-4">
        <div>
          <h3 className="fw-bolder mb-1 text-dark">Training & Talent Upskilling</h3>
          <p className="text-secondary small mb-0">
            Enterprise workshops, certification cohorts, and modern skills development programs.
          </p>
        </div>

        {(role === 'hr' || role === 'manager') && (
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="btn btn-primary rounded-pill px-3 fw-bold d-flex align-items-center gap-2 shadow-sm"
          >
            <Plus size={16} /> Schedule Training Cohort
          </button>
        )}
      </div>

      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status"></div>
          <p className="text-muted small mt-2">Loading training cohorts...</p>
        </div>
      ) : trainings.length === 0 ? (
        <div className="text-center py-5 bg-white rounded-4 border p-5">
          <GraduationCap size={36} className="text-muted mb-2" />
          <h5 className="fw-bold text-dark">No active training cohorts</h5>
          <p className="text-secondary small">New learning opportunities will appear here soon.</p>
        </div>
      ) : (
        <div className="row g-4">
          {trainings.map(t => {
            const enrolledCount = t.enrolledEmployees?.length || 0;
            const capacity = t.maxCapacity || 25;
            const pct = Math.round((enrolledCount / capacity) * 100);

            return (
              <div key={t._id} className="col-lg-6 col-xl-4">
                <div className="card border-0 shadow-sm rounded-4 h-100 overflow-hidden hover-shadow transition d-flex flex-column justify-content-between">
                  <div className="card-body p-4">
                    <div className="d-flex align-items-center justify-content-between mb-3">
                      <span className="badge bg-primary-subtle text-primary border border-primary-subtle rounded-pill">
                        {t.department}
                      </span>
                      <span className={`badge bg-${t.status === 'Completed' ? 'secondary' : t.status === 'Ongoing' ? 'success' : 'info'}-subtle text-${t.status === 'Completed' ? 'secondary' : t.status === 'Ongoing' ? 'success' : 'info'} rounded-pill`}>
                        {t.status}
                      </span>
                    </div>

                    <h5 className="fw-bold text-dark mb-2">{t.title}</h5>
                    <p className="text-secondary small mb-3 text-truncate-3" style={{ lineHeight: 1.5 }}>
                      {t.description}
                    </p>

                    <div className="bg-light p-3 rounded-3 small mb-3">
                      <div className="d-flex align-items-center gap-2 mb-1">
                        <Award size={15} className="text-primary" />
                        <span><strong>Instructor:</strong> {t.instructor}</span>
                      </div>
                      <div className="d-flex align-items-center gap-2 mb-1">
                        <Clock size={15} className="text-muted" />
                        <span>{t.durationHours} hours total</span>
                      </div>
                      <div className="d-flex align-items-center gap-2">
                        <Calendar size={15} className="text-muted" />
                        <span>{t.startDate} to {t.endDate}</span>
                      </div>
                    </div>

                    {/* Capacity Progress Bar */}
                    <div className="mb-2">
                      <div className="d-flex justify-content-between small text-muted mb-1">
                        <span>Cohort Capacity</span>
                        <strong>{enrolledCount} / {capacity} Enrolled</strong>
                      </div>
                      <div className="progress" style={{ height: '6px' }}>
                        <div
                          className={`progress-bar rounded-pill bg-${pct >= 100 ? 'danger' : 'success'}`}
                          role="progressbar"
                          style={{ width: `${pct}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>

                  {/* Card Action Footer */}
                  <div className="card-footer bg-white border-top p-3 d-flex align-items-center justify-content-between">
                    <div>
                      {role === 'hr' && (
                        <button
                          onClick={() => handleDelete(t._id, t.title)}
                          className="btn btn-outline-danger btn-sm rounded-pill p-1 px-2"
                          title="Delete"
                        >
                          <Trash2 size={14} />
                        </button>
                      )}
                    </div>

                    <div className="d-flex gap-2">
                      {(role === 'manager' || role === 'hr') && (
                        <button
                          onClick={() => setAssigningTraining(t)}
                          className="btn btn-outline-primary btn-sm rounded-pill px-3 fw-bold"
                        >
                          Assign Staff
                        </button>
                      )}

                      {t.isEnrolled ? (
                        <span className="badge bg-success-subtle text-success border border-success-subtle px-3 py-2 rounded-pill d-flex align-items-center gap-1">
                          <CheckCircle2 size={14} /> Enrolled
                        </span>
                      ) : (
                        <button
                          onClick={() => handleEnroll(t._id, t.title)}
                          disabled={enrolledCount >= capacity}
                          className="btn btn-primary btn-sm rounded-pill px-3 fw-bold"
                        >
                          {enrolledCount >= capacity ? 'Full Cohort' : 'Self-Enroll'}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modals */}
      <CreateTrainingModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSuccess={fetchTrainings}
      />

      <AssignTrainingModal
        isOpen={!!assigningTraining}
        training={assigningTraining}
        teamMembers={teamMembers}
        onClose={() => setAssigningTraining(null)}
        onSuccess={fetchTrainings}
      />
    </div>
  );
};

export default TrainingsPage;
