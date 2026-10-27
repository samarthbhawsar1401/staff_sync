import React, { useState, useEffect } from 'react';
import api from '../api/axiosClient';
import { Clock, Play, Square, CheckCircle, AlertCircle } from 'lucide-react';

const ClockInOutWidget = ({ onStatusChange }) => {
  const [todayRecord, setTodayRecord] = useState(null);
  const [isClockedIn, setIsClockedIn] = useState(false);
  const [isClockedOut, setIsClockedOut] = useState(false);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [notes, setNotes] = useState('');

  const fetchTodayStatus = async () => {
    try {
      const res = await api.get('/attendance/today');
      setTodayRecord(res.data.record);
      setIsClockedIn(res.data.isClockedIn);
      setIsClockedOut(res.data.isClockedOut);

      if (res.data.record?.clockIn && !res.data.record?.clockOut) {
        const diff = Math.floor((new Date() - new Date(res.data.record.clockIn)) / 1000);
        setElapsedSeconds(diff > 0 ? diff : 0);
      }
    } catch (err) {
      console.error('Error fetching today attendance:', err);
    }
  };

  useEffect(() => {
    fetchTodayStatus();
  }, []);

  // Timer tick while clocked in
  useEffect(() => {
    let timer;
    if (isClockedIn && !isClockedOut) {
      timer = setInterval(() => {
        setElapsedSeconds(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isClockedIn, isClockedOut]);

  const formatTimer = (totalSec) => {
    const hrs = String(Math.floor(totalSec / 3600)).padStart(2, '0');
    const mins = String(Math.floor((totalSec % 3600) / 60)).padStart(2, '0');
    const secs = String(totalSec % 60).padStart(2, '0');
    return `${hrs}:${mins}:${secs}`;
  };

  const handleClockIn = async () => {
    try {
      setLoading(true);
      setMessage('');
      const res = await api.post('/attendance/clock-in', { notes });
      setMessage(res.data.message);
      await fetchTodayStatus();
      if (onStatusChange) onStatusChange();
    } catch (err) {
      setMessage(err.response?.data?.message || 'Clock-in failed.');
    } finally {
      setLoading(false);
    }
  };

  const handleClockOut = async () => {
    try {
      setLoading(true);
      setMessage('');
      const res = await api.post('/attendance/clock-out', { notes });
      setMessage(res.data.message);
      await fetchTodayStatus();
      if (onStatusChange) onStatusChange();
    } catch (err) {
      setMessage(err.response?.data?.message || 'Clock-out failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card shadow-sm border-0 rounded-4 overflow-hidden">
      <div className="card-header bg-white border-bottom py-3 d-flex align-items-center justify-content-between">
        <div className="d-flex align-items-center gap-2">
          <div className="p-2 bg-primary-subtle text-primary rounded-3">
            <Clock size={20} />
          </div>
          <div>
            <h6 className="mb-0 fw-bold">Daily Time Tracker</h6>
            <small className="text-muted">{new Date().toLocaleDateString(undefined, { weekday: 'long', month: 'short', day: 'numeric', year: 'numeric' })}</small>
          </div>
        </div>
        <div>
          {isClockedOut ? (
            <span className="badge bg-secondary-subtle text-secondary border px-3 py-2 rounded-pill">
              Completed Shift
            </span>
          ) : isClockedIn ? (
            <span className="badge bg-success-subtle text-success border px-3 py-2 rounded-pill d-flex align-items-center gap-1">
              <span className="spinner-grow spinner-grow-sm text-success" style={{ width: 8, height: 8 }}></span>
              Working ({todayRecord?.status || 'Present'})
            </span>
          ) : (
            <span className="badge bg-warning-subtle text-warning border px-3 py-2 rounded-pill">
              Not Clocked In
            </span>
          )}
        </div>
      </div>

      <div className="card-body p-4 text-center">
        {/* Stopwatch Display */}
        <div className="mb-3">
          <div className="display-4 fw-bolder font-monospace text-dark tracking-tight">
            {formatTimer(elapsedSeconds)}
          </div>
          <small className="text-muted fw-semibold">HOURS : MINUTES : SECONDS</small>
        </div>

        {/* Timestamps details */}
        {todayRecord && (
          <div className="row g-2 mb-3 bg-light p-2 rounded-3 text-start small">
            <div className="col-6">
              <span className="text-muted d-block">Clocked In:</span>
              <strong>{new Date(todayRecord.clockIn).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</strong>
            </div>
            <div className="col-6">
              <span className="text-muted d-block">Clocked Out:</span>
              <strong>
                {todayRecord.clockOut
                  ? new Date(todayRecord.clockOut).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                  : '--:--'}
              </strong>
            </div>
          </div>
        )}

        {/* Action Controls */}
        <div className="d-flex flex-column gap-2 justify-content-center">
          {!isClockedIn && !isClockedOut && (
            <button
              onClick={handleClockIn}
              disabled={loading}
              className="btn btn-primary btn-lg rounded-pill fw-bold d-flex align-items-center justify-content-center gap-2 shadow-sm py-2"
            >
              <Play size={20} />
              {loading ? 'Recording...' : 'Clock In for Today'}
            </button>
          )}

          {isClockedIn && !isClockedOut && (
            <button
              onClick={handleClockOut}
              disabled={loading}
              className="btn btn-danger btn-lg rounded-pill fw-bold d-flex align-items-center justify-content-center gap-2 shadow-sm py-2"
            >
              <Square size={20} />
              {loading ? 'Ending...' : 'Clock Out (End Shift)'}
            </button>
          )}

          {isClockedOut && (
            <div className="alert alert-success d-flex align-items-center justify-content-center gap-2 mb-0 py-2 small rounded-pill">
              <CheckCircle size={18} />
              Shift ended for today. Total logged: <strong>{todayRecord?.totalHours || 0} hrs</strong>.
            </div>
          )}
        </div>

        {message && (
          <div className="small mt-3 text-muted">
            {message}
          </div>
        )}
      </div>
    </div>
  );
};

export default ClockInOutWidget;
