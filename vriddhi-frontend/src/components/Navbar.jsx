import React, { useState, useEffect, useContext, useRef } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import api from '../utils/api';
import './Navbar.css';

export default function Navbar({ selectedCount = 0 }) {
  const { isAuthenticated, user, logout } = useContext(AuthContext);
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    let active = true;
    const fetchNotifications = async () => {
      try {
        const response = await api.get('/notifications');
        if (response.data.success && active) {
          setNotifications(response.data.data);
        }
      } catch (err) {
        console.error('Failed to load notifications:', err);
      }
    };
    fetchNotifications();
    return () => { active = false; };
  }, []);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowNotifications(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleNavClick = () => {
    setIsOpen(false);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="navbar-container container">
        <Link to="/" className="nav-logo-wrapper" onClick={handleNavClick}>
          <div className="logo-circle">V</div>
          <div className="logo-text">
            <span className="logo-title">VRIDDHI</span>
            <span className="logo-subtitle">Pathology Laboratory</span>
          </div>
        </Link>

        {/* Hamburger Icon */}
        <button className={`nav-toggle ${isOpen ? 'open' : ''}`} onClick={() => setIsOpen(!isOpen)} aria-label="Toggle Navigation">
          <span></span>
          <span></span>
          <span></span>
        </button>

        {/* Nav Links */}
        <div className={`nav-menu-wrapper ${isOpen ? 'open' : ''}`}>
          <ul className="nav-menu">
            <li><NavLink to="/" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'} onClick={handleNavClick}>Home</NavLink></li>
            <li><NavLink to="/tests" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'} onClick={handleNavClick}>Tests</NavLink></li>
            <li><NavLink to="/packages" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'} onClick={handleNavClick}>Health Packages</NavLink></li>
            <li><NavLink to="/about" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'} onClick={handleNavClick}>About Us</NavLink></li>
            <li><NavLink to="/contact" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'} onClick={handleNavClick}>Contact</NavLink></li>
            
            {isAuthenticated ? (
              <>
                {user?.role === 'admin' ? (
                  <li><NavLink to="/admin" className={({ isActive }) => isActive ? 'nav-link active admin-link' : 'nav-link admin-link'} onClick={handleNavClick}>Admin Panel</NavLink></li>
                ) : (
                  <li><NavLink to="/dashboard" className={({ isActive }) => isActive ? 'nav-link active admin-link' : 'nav-link admin-link'} onClick={handleNavClick}>My Dashboard</NavLink></li>
                )}
                <li><button className="nav-link logout-btn" onClick={handleLogout}>Logout</button></li>
              </>
            ) : (
              <li><Link to="/login" className="nav-link admin-login-btn" onClick={handleNavClick}>Login / Sign Up</Link></li>
            )}
          </ul>
        </div>

        {/* Right Actions */}
        <div className="nav-actions">
          {/* Notification Icon */}
          <div className="nav-notification-wrapper" ref={dropdownRef}>
            <button className="notification-bell" onClick={() => setShowNotifications(!showNotifications)} aria-label="Notifications">
              🔔
              {notifications.length > 0 && (
                <span className="notification-badge">{notifications.length}</span>
              )}
            </button>
            {showNotifications && (
              <div className="notification-dropdown">
                <h4 className="notif-header">Offers & Announcements</h4>
                {notifications.length === 0 ? (
                  <p className="notif-empty">No active announcements</p>
                ) : (
                  <ul className="notif-list">
                    {notifications.map((n) => (
                      <li key={n._id} className="notif-item">
                        <p className="notif-title">{n.title}</p>
                        <p className="notif-message">{n.message}</p>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            )}
          </div>

          {/* Cart / Book Button */}
          <Link to="/book" className="nav-cart-btn btn btn-gold btn-sm">
            Book Booking
            {selectedCount > 0 && (
              <span className="cart-badge">{selectedCount}</span>
            )}
          </Link>
        </div>
      </div>
    </nav>
  );
}
