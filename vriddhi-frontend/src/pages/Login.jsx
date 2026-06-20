import React, { useState, useContext, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import './Login.css';

export default function Login() {
  const { login, register, isAuthenticated, user } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  const [activeTab, setActiveTab] = useState('login'); // 'login' or 'register'
  
  // Login State
  const [loginUsername, setLoginUsername] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginLoading, setLoginLoading] = useState(false);
  const [loginError, setLoginError] = useState('');

  // Register State
  const [registerData, setRegisterData] = useState({
    name: '',
    phone: '',
    email: '',
    password: '',
    confirmPassword: '',
    age: '',
    gender: '',
    address: '',
    pincode: ''
  });
  const [registerLoading, setRegisterLoading] = useState(false);
  const [registerError, setRegisterError] = useState('');

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated && user) {
      const from = location.state?.from?.pathname || (user.role === 'admin' ? '/admin' : '/dashboard');
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, user, navigate, location]);

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    if (!loginUsername.trim() || !loginPassword.trim()) {
      setLoginError('Please enter both phone/username and password.');
      return;
    }

    setLoginLoading(true);
    setLoginError('');

    const res = await login(loginUsername.trim(), loginPassword);
    setLoginLoading(false);

    if (res.success) {
      if (res.role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/dashboard');
      }
    } else {
      setLoginError(res.message || 'Invalid username or password.');
    }
  };

  const handleRegisterInputChange = (e) => {
    const { name, value } = e.target;
    setRegisterData(prev => ({ ...prev, [name]: value }));
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    const { name, phone, password, confirmPassword, age, gender, address, pincode } = registerData;

    // Validation
    if (!name.trim() || !phone.trim() || !password || !confirmPassword) {
      setRegisterError('Name, phone, and password fields are required.');
      return;
    }

    if (!/^\d{10}$/.test(phone)) {
      setRegisterError('Please enter a valid 10-digit phone number.');
      return;
    }

    if (password.length < 6) {
      setRegisterError('Password must be at least 6 characters long.');
      return;
    }

    if (password !== confirmPassword) {
      setRegisterError('Passwords do not match.');
      return;
    }

    if (pincode && !/^\d{6}$/.test(pincode)) {
      setRegisterError('Please enter a valid 6-digit PIN code.');
      return;
    }

    setRegisterLoading(true);
    setRegisterError('');

    const payload = {
      ...registerData,
      phone: phone.trim(),
      age: age ? parseInt(age) : undefined
    };

    const res = await register(payload);
    setRegisterLoading(false);

    if (res.success) {
      navigate('/dashboard');
    } else {
      setRegisterError(res.message || 'Registration failed. Please try again.');
    }
  };

  return (
    <div className="login-page container section">
      <div className="auth-card card">
        <div className="auth-header">
          <div className="logo-badge">V</div>
          <h2>Vriddhi Pathology Lab</h2>
          <p>Access your medical accounts, diagnostic records, and book home collections.</p>
        </div>

        {/* Tab Headers */}
        <div className="auth-tabs">
          <button
            className={`auth-tab-btn ${activeTab === 'login' ? 'active' : ''}`}
            onClick={() => { setActiveTab('login'); setLoginError(''); }}
          >
            Sign In
          </button>
          <button
            className={`auth-tab-btn ${activeTab === 'register' ? 'active' : ''}`}
            onClick={() => { setActiveTab('register'); setRegisterError(''); }}
          >
            Create Account
          </button>
        </div>

        {/* Tab Content: Login */}
        {activeTab === 'login' && (
          <div className="tab-content">
            {loginError && <div className="auth-error-alert">{loginError}</div>}
            
            <form onSubmit={handleLoginSubmit}>
              <div className="form-group">
                <label className="form-label" htmlFor="loginUsername">Phone Number / Admin Username</label>
                <input
                  type="text"
                  id="loginUsername"
                  className="form-input"
                  placeholder="e.g. 9876543210 or admin"
                  value={loginUsername}
                  onChange={(e) => setLoginUsername(e.target.value)}
                  disabled={loginLoading}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="loginPassword">Password</label>
                <input
                  type="password"
                  id="loginPassword"
                  className="form-input"
                  placeholder="••••••••••••"
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  disabled={loginLoading}
                  required
                />
              </div>

              <button
                type="submit"
                className="btn btn-primary auth-submit-btn"
                disabled={loginLoading}
              >
                {loginLoading ? 'Authenticating...' : 'Sign In ➡️'}
              </button>
            </form>
          </div>
        )}

        {/* Tab Content: Register */}
        {activeTab === 'register' && (
          <div className="tab-content">
            {registerError && <div className="auth-error-alert">{registerError}</div>}
            
            <form onSubmit={handleRegisterSubmit} className="register-grid-form">
              <div className="form-group span-2">
                <label className="form-label">Full Name *</label>
                <input
                  type="text"
                  name="name"
                  className="form-input"
                  placeholder="e.g. John Doe"
                  value={registerData.name}
                  onChange={handleRegisterInputChange}
                  disabled={registerLoading}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Phone Number (10 Digits) *</label>
                <input
                  type="tel"
                  name="phone"
                  className="form-input"
                  placeholder="e.g. 9026578856"
                  value={registerData.phone}
                  onChange={handleRegisterInputChange}
                  disabled={registerLoading}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Email Address (Optional)</label>
                <input
                  type="email"
                  name="email"
                  className="form-input"
                  placeholder="name@example.com"
                  value={registerData.email}
                  onChange={handleRegisterInputChange}
                  disabled={registerLoading}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Password *</label>
                <input
                  type="password"
                  name="password"
                  className="form-input"
                  placeholder="At least 6 chars"
                  value={registerData.password}
                  onChange={handleRegisterInputChange}
                  disabled={registerLoading}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Confirm Password *</label>
                <input
                  type="password"
                  name="confirmPassword"
                  className="form-input"
                  placeholder="Re-type password"
                  value={registerData.confirmPassword}
                  onChange={handleRegisterInputChange}
                  disabled={registerLoading}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Age (Optional)</label>
                <input
                  type="number"
                  name="age"
                  className="form-input"
                  placeholder="e.g. 35"
                  value={registerData.age}
                  onChange={handleRegisterInputChange}
                  disabled={registerLoading}
                  min="1"
                  max="120"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Gender (Optional)</label>
                <select
                  name="gender"
                  className="form-input"
                  value={registerData.gender}
                  onChange={handleRegisterInputChange}
                  disabled={registerLoading}
                >
                  <option value="">Select Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div className="form-group span-2">
                <label className="form-label">Home Address (Optional)</label>
                <input
                  type="text"
                  name="address"
                  className="form-input"
                  placeholder="House No, Street name, Locality"
                  value={registerData.address}
                  onChange={handleRegisterInputChange}
                  disabled={registerLoading}
                />
              </div>

              <div className="form-group span-2">
                <label className="form-label">Pincode (Optional)</label>
                <input
                  type="text"
                  name="pincode"
                  className="form-input"
                  placeholder="6-digit PIN code, e.g. 232104"
                  value={registerData.pincode}
                  onChange={handleRegisterInputChange}
                  disabled={registerLoading}
                />
              </div>

              <button
                type="submit"
                className="btn btn-primary auth-submit-btn span-2"
                disabled={registerLoading}
              >
                {registerLoading ? 'Creating Account...' : 'Register & Log In ➡️'}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
