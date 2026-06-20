import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import api from '../utils/api';
import formatPrice from '../utils/formatPrice';
import LoadingSpinner from '../components/LoadingSpinner';
import './UserDashboard.css';

export default function UserDashboard() {
  const { user, logout, updateProfile } = useContext(AuthContext);
  const navigate = useNavigate();

  const [bookings, setBookings] = useState([]);
  const [loadingBookings, setLoadingBookings] = useState(true);
  const [bookingsError, setBookingsError] = useState('');

  // Profile Edit State
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    name: '',
    email: '',
    age: '',
    gender: '',
    address: '',
    pincode: ''
  });
  const [updating, setUpdating] = useState(false);
  const [updateError, setUpdateError] = useState('');
  const [updateSuccess, setUpdateSuccess] = useState('');

  // Sync profile data with user context
  useEffect(() => {
    if (user) {
      setProfileData({
        name: user.name || '',
        email: user.email || '',
        age: user.age || '',
        gender: user.gender || '',
        address: user.address || '',
        pincode: user.pincode || ''
      });
    }
  }, [user]);

  // Fetch user bookings
  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const res = await api.get('/bookings/my-bookings');
        if (res.data.success) {
          setBookings(res.data.data);
        } else {
          setBookingsError('Failed to retrieve bookings.');
        }
      } catch (err) {
        console.error(err);
        setBookingsError('Failed to fetch booked records. Please check connection.');
      } finally {
        setLoadingBookings(false);
      }
    };

    fetchBookings();
  }, []);

  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfileData(prev => ({ ...prev, [name]: value }));
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setUpdating(true);
    setUpdateError('');
    setUpdateSuccess('');

    const res = await updateProfile({
      ...profileData,
      age: profileData.age ? parseInt(profileData.age) : undefined
    });
    setUpdating(false);

    if (res.success) {
      setUpdateSuccess('Profile updated successfully!');
      setIsEditing(false);
      // clear success message after 3 seconds
      setTimeout(() => setUpdateSuccess(''), 3000);
    } else {
      setUpdateError(res.message || 'Failed to update profile.');
    }
  };

  const handleLogoutClick = () => {
    logout();
    navigate('/login');
  };

  // Generate WhatsApp contact link for a booking
  const getWhatsAppContactLink = (booking) => {
    const text = `Hello Vriddhi Lab, I have a booking with ID: ${booking.bookingId} under the name ${booking.patientName}. I'd like to check the status of my tests.`;
    return `https://wa.me/919026578856?text=${encodeURIComponent(text)}`;
  };

  // Format Date beautifully
  const formatDateStr = (dateStr) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateStr).toLocaleDateString('en-US', options);
  };

  return (
    <div className="user-dashboard container section">
      <div className="dashboard-header">
        <div>
          <h1 className="page-title">Welcome, {user?.name || 'Patient'}</h1>
          <p className="page-subtitle">Track your pathology tests, booked sessions, and manage your account details.</p>
        </div>
        <button onClick={handleLogoutClick} className="btn btn-secondary logout-btn-dash">
          Log Out
        </button>
      </div>

      <div className="dashboard-grid">
        {/* Profile Card */}
        <div className="dashboard-col profile-section-card">
          <div className="card">
            <div className="card-header-dash">
              <h3>Personal Details</h3>
              {!isEditing && (
                <button onClick={() => setIsEditing(true)} className="btn btn-gold btn-sm">
                  Edit Details
                </button>
              )}
            </div>

            {updateSuccess && <div className="dash-alert success">{updateSuccess}</div>}
            {updateError && <div className="dash-alert error">{updateError}</div>}

            {isEditing ? (
              <form onSubmit={handleProfileSubmit} className="profile-edit-form">
                <div className="form-group">
                  <label className="form-label">Full Name</label>
                  <input
                    type="text"
                    name="name"
                    className="form-input"
                    value={profileData.name}
                    onChange={handleProfileChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Email Address</label>
                  <input
                    type="email"
                    name="email"
                    className="form-input"
                    value={profileData.email}
                    onChange={handleProfileChange}
                  />
                </div>

                <div className="form-group-row">
                  <div className="form-group">
                    <label className="form-label">Age</label>
                    <input
                      type="number"
                      name="age"
                      className="form-input"
                      value={profileData.age}
                      onChange={handleProfileChange}
                      min="1"
                      max="120"
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Gender</label>
                    <select
                      name="gender"
                      className="form-input"
                      value={profileData.gender}
                      onChange={handleProfileChange}
                    >
                      <option value="">Select</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Home Address</label>
                  <input
                    type="text"
                    name="address"
                    className="form-input"
                    value={profileData.address}
                    onChange={handleProfileChange}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Pincode</label>
                  <input
                    type="text"
                    name="pincode"
                    className="form-input"
                    value={profileData.pincode}
                    onChange={handleProfileChange}
                  />
                </div>

                <div className="edit-actions">
                  <button type="submit" className="btn btn-primary btn-sm" disabled={updating}>
                    {updating ? 'Saving...' : 'Save Changes'}
                  </button>
                  <button
                    type="button"
                    onClick={() => { setIsEditing(false); setUpdateError(''); }}
                    className="btn btn-secondary btn-sm"
                    disabled={updating}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            ) : (
              <div className="profile-details-display">
                <div className="detail-item">
                  <span className="label">Registered Phone:</span>
                  <span className="value">{user?.phone}</span>
                </div>
                <div className="detail-item">
                  <span className="label">Email:</span>
                  <span className="value">{user?.email || <span className="not-provided">Not provided</span>}</span>
                </div>
                <div className="detail-item">
                  <span className="label">Age:</span>
                  <span className="value">{user?.age || <span className="not-provided">Not provided</span>}</span>
                </div>
                <div className="detail-item">
                  <span className="label">Gender:</span>
                  <span className="value">{user?.gender || <span className="not-provided">Not provided</span>}</span>
                </div>
                <div className="detail-item">
                  <span className="label">Address:</span>
                  <span className="value">{user?.address || <span className="not-provided">Not provided</span>}</span>
                </div>
                <div className="detail-item">
                  <span className="label">Pincode:</span>
                  <span className="value">{user?.pincode || <span className="not-provided">Not provided</span>}</span>
                </div>

                <div className="profile-tip">
                  💡 <i>Having these details updated saves you time during checkout! They will be automatically filled for you.</i>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Bookings List Card */}
        <div className="dashboard-col bookings-section">
          <h2 className="section-title">Your Booked Sessions & Tests</h2>
          
          {loadingBookings ? (
            <LoadingSpinner />
          ) : bookingsError ? (
            <div className="dash-alert error">{bookingsError}</div>
          ) : bookings.length === 0 ? (
            <div className="empty-bookings-card card">
              <span className="empty-icon">🔬</span>
              <h3>No bookings found</h3>
              <p>You haven't booked any test sessions yet. Keep your health records organized by booking your diagnostic tests online.</p>
              <button onClick={() => navigate('/tests')} className="btn btn-primary">
                Book Diagnostic Test Now
              </button>
            </div>
          ) : (
            <div className="bookings-list">
              {bookings.map((booking) => (
                <div key={booking._id} className="booking-record-card card">
                  <div className="booking-card-header">
                    <div className="booking-id-wrapper">
                      <span className="booking-label">ID:</span>
                      <span className="booking-id">{booking.bookingId}</span>
                    </div>
                    <span className={`status-badge status-${booking.status}`}>
                      {booking.status.toUpperCase()}
                    </span>
                  </div>

                  <div className="booking-card-body">
                    <div className="booking-meta">
                      <div className="meta-item">
                        <span className="meta-icon">📅</span>
                        <span><b>Date:</b> {formatDateStr(booking.preferredDate)}</span>
                      </div>
                      <div className="meta-item">
                        <span className="meta-icon">🕒</span>
                        <span><b>Slot:</b> {booking.preferredSlot}</span>
                      </div>
                      <div className="meta-item">
                        <span className="meta-icon">👤</span>
                        <span><b>Patient:</b> {booking.patientName} ({booking.age} yrs, {booking.gender})</span>
                      </div>
                    </div>

                    <div className="booking-tests">
                      <span className="tests-label">Selected Tests:</span>
                      <div className="tests-tags">
                        {booking.selectedTests.map((t, idx) => (
                          <span key={idx} className="test-tag">
                            {t.testName} <span className="test-price">({formatPrice(t.offerPrice)})</span>
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="booking-card-footer">
                    <div className="booking-price">
                      Total Paid: <b>{formatPrice(booking.totalAmount)}</b>
                    </div>
                    
                    <div className="booking-actions">
                      <a
                        href={getWhatsAppContactLink(booking)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn btn-gold btn-sm btn-whatsapp"
                      >
                        💬 Contact Lab
                      </a>
                      
                      {booking.status === 'completed' ? (
                        <div className="report-alert-ready">
                          🔬 Report ready! Sent via WhatsApp
                        </div>
                      ) : (
                        <span className="report-status-text">
                          {booking.status === 'cancelled' ? '🚫 Session cancelled' : '⏳ Processing tests...'}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
