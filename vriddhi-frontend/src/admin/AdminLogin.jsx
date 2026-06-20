import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import './AdminLogin.css';

export default function AdminLogin() {
  const { login, isAuthenticated } = useContext(AuthContext);
  const navigate = useNavigate();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // If already authenticated, redirect to admin dashboard immediately
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/admin');
    }
  }, [isAuthenticated, navigate]);

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    if (!username.trim() || !password.trim()) {
      setError('Please enter both username and password.');
      return;
    }

    setLoading(true);
    setError('');

    const res = await login(username, password);
    setLoading(false);

    if (res.success) {
      navigate('/admin');
    } else {
      setError(res.message || 'Invalid username or password.');
    }
  };

  return (
    <div className="admin-login-page container section">
      <div className="login-card card">
        <div className="login-header">
          <img src="/logo.jpeg" alt="Vriddhi Logo" className="logo-badge" style={{ objectFit: 'cover' }} />
          <h2>Vriddhi Lab Portal</h2>
          <p>Please enter administrative credentials to access the management systems.</p>
        </div>

        {error && <div className="login-error-alert">{error}</div>}

        <form onSubmit={handleLoginSubmit}>
          <div className="form-group">
            <label className="form-label" htmlFor="username">Username</label>
            <input
              type="text"
              id="username"
              className="form-input"
              placeholder="e.g. admin"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              disabled={loading}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              className="form-input"
              placeholder="••••••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
              required
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary login-submit-btn"
            disabled={loading}
          >
            {loading ? 'Authenticating...' : 'Access Admin Dashboard ➡️'}
          </button>
        </form>
      </div>
    </div>
  );
}
