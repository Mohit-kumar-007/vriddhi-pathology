import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../utils/api';
import LoadingSpinner from '../components/LoadingSpinner';
import './AdminDashboard.css';

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Password change states
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [passwordForm, setPasswordForm] = useState({ currentPassword: '', newPassword: '' });
  const [pwdError, setPwdError] = useState('');
  const [pwdSuccess, setPwdSuccess] = useState('');
  const [pwdLoading, setPwdLoading] = useState(false);

  useEffect(() => {
    let active = true;
    const fetchStats = async () => {
      try {
        const response = await api.get('/bookings/dashboard/stats');
        if (response.data.success && active) {
          setStats(response.data.data);
        }
      } catch (err) {
        console.error('Failed to load dashboard stats:', err);
        setError('Unauthorized or database error. Please log in again.');
      } finally {
        if (active) setLoading(false);
      }
    };
    fetchStats();
    return () => { active = false; };
  }, []);

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    if (!passwordForm.currentPassword || !passwordForm.newPassword) {
      setPwdError('Please fill in all password fields.');
      return;
    }
    setPwdLoading(true);
    setPwdError('');
    setPwdSuccess('');
    try {
      const res = await api.post('/auth/change-password', passwordForm);
      if (res.data.success) {
        setPwdSuccess('Password updated successfully!');
        setPasswordForm({ currentPassword: '', newPassword: '' });
        setTimeout(() => setShowPasswordModal(false), 2000);
      } else {
        setPwdError(res.data.message || 'Failed to change password.');
      }
    } catch (err) {
      setPwdError(err.response?.data?.message || 'Error occurred.');
    } finally {
      setPwdLoading(false);
    }
  };

  if (loading) return <LoadingSpinner fullPage />;
  if (error) {
    return (
      <div className="container section text-center">
        <div className="card admin-error-card">
          <h2>Access Denied</h2>
          <p>{error}</p>
          <Link to="/admin/login" className="btn btn-primary mt-20">Go to Login</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-dashboard-page container section">
      <div className="dashboard-header">
        <div>
          <h1 className="page-title">Admin Management Portal</h1>
          <p className="page-subtitle">Welcome back! Oversee patient bookings, catalogs, settings, and discount rates.</p>
        </div>
        <button 
          onClick={() => setShowPasswordModal(true)} 
          className="btn btn-outline btn-sm change-pwd-btn"
        >
          🔒 Change Password
        </button>
      </div>

      {/* Stats Cards Grid */}
      <div className="grid grid-4 stats-grid">
        <div className="card stat-card">
          <span className="stat-icon">📅</span>
          <span className="stat-value">{stats?.todayCount || 0}</span>
          <span className="stat-lbl">Today's Bookings</span>
        </div>
        <div className="card stat-card">
          <span className="stat-icon">📊</span>
          <span className="stat-value">{stats?.monthCount || 0}</span>
          <span className="stat-lbl">This Month's Total</span>
        </div>
        <div className="card stat-card warning-stat">
          <span className="stat-icon">⌛</span>
          <span className="stat-value">{stats?.pendingCount || 0}</span>
          <span className="stat-lbl">Pending Collection</span>
        </div>
        <div className="card stat-card">
          <span className="stat-icon">🧪</span>
          <span className="stat-value">{stats?.testCount || 0}</span>
          <span className="stat-lbl">Active Tests Catalogs</span>
        </div>
      </div>

      {/* Admin Modules Navigation */}
      <h2 className="sub-section-title">Control Modules</h2>
      <div className="grid grid-2 modules-grid">
        <Link to="/admin/bookings" className="card module-card">
          <div className="module-info">
            <span className="module-icon">📋</span>
            <h3>Bookings Manager</h3>
            <p>Review booking files, edit patient statuses, export CSV lists, and follow up collections.</p>
          </div>
          <span className="arrow">➡️</span>
        </Link>
        <Link to="/admin/tests" className="card module-card">
          <div className="module-info">
            <span className="module-icon">🧪</span>
            <h3>Test Directory Editor</h3>
            <p>Search, add, modify prices or descriptions, and toggle visibility for all 112+ laboratory tests.</p>
          </div>
          <span className="arrow">➡️</span>
        </Link>
        <Link to="/admin/packages" className="card module-card">
          <div className="module-info">
            <span className="module-icon">📦</span>
            <h3>Health Package Manager</h3>
            <p>Configure family package prices, target genders, include test links, and badge tags.</p>
          </div>
          <span className="arrow">➡️</span>
        </Link>
        <Link to="/admin/offers" className="card module-card">
          <div className="module-info">
            <span className="module-icon">⚙️</span>
            <h3>Settings & Dynamic Offers</h3>
            <p>Set dynamic discount rates, senior citizen benefits, write scrolling announcement text, and notifications.</p>
          </div>
          <span className="arrow">➡️</span>
        </Link>
      </div>

      {/* Password Modal */}
      {showPasswordModal && (
        <div className="modal-overlay">
          <div className="modal-content card">
            <button className="close-modal-btn" onClick={() => setShowPasswordModal(false)}>✕</button>
            <h2>Change Admin Password</h2>
            <p className="modal-desc">Secure your portal with a new password.</p>
            
            {pwdError && <div className="error-alert">{pwdError}</div>}
            {pwdSuccess && <div className="success-alert">{pwdSuccess}</div>}

            <form onSubmit={handlePasswordChange}>
              <div className="form-group">
                <label className="form-label">Current Password</label>
                <input
                  type="password"
                  className="form-input"
                  value={passwordForm.currentPassword}
                  onChange={(e) => setPasswordForm(prev => ({ ...prev, currentPassword: e.target.value }))}
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label">New Password</label>
                <input
                  type="password"
                  className="form-input"
                  value={passwordForm.newPassword}
                  onChange={(e) => setPasswordForm(prev => ({ ...prev, newPassword: e.target.value }))}
                  required
                />
              </div>
              <button 
                type="submit" 
                className="btn btn-primary w-full"
                disabled={pwdLoading}
              >
                {pwdLoading ? 'Updating...' : 'Update Password'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
