import React from 'react';
import { Link } from 'react-router-dom';
import './Footer.css';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="footer-container container">
        {/* About Section */}
        <div className="footer-col">
          <div className="footer-logo">
            <span className="logo-title">VRIDDHI</span>
            <span className="logo-subtitle">Pathology Laboratory</span>
          </div>
          <p className="footer-desc">
            Authorized CRL Collection Point. Delivering high-quality, accurate, and reliable pathology and diagnostic services to patients across Chandauli and surrounding areas.
          </p>
          <div className="crl-badge">
            CRL Authorized Collection Point
          </div>
        </div>

        {/* Contact Section */}
        <div className="footer-col">
          <h3 className="footer-heading">Contact Details</h3>
          <ul className="footer-contact-list">
            <li>
              <span className="icon">📍</span>
              <span className="text">Jagdish Saray, Chandauli 232104, Uttar Pradesh</span>
            </li>
            <li>
              <span className="icon">📞</span>
              <a href="tel:9026578856" className="text hover-gold">9026578856</a>
            </li>
            <li>
              <span className="icon">✉️</span>
              <a href="mailto:vriddhipathology@gmail.com" className="text hover-gold">vriddhipathology@gmail.com</a>
            </li>
            <li>
              <span className="icon">🕒</span>
              <span className="text">9:00 AM – 8:00 PM, 7 Days a Week</span>
            </li>
          </ul>
        </div>

        {/* Quick Links */}
        <div className="footer-col">
          <h3 className="footer-heading">Quick Links</h3>
          <ul className="footer-links">
            <li><Link to="/">Home Page</Link></li>
            <li><Link to="/tests">Browse Tests</Link></li>
            <li><Link to="/packages">Health Packages</Link></li>
            <li><Link to="/about">About Us</Link></li>
            <li><Link to="/contact">Contact & Map</Link></li>
            <li><Link to="/login">Patient Login & Sign Up</Link></li>
            <li><Link to="/login">Admin Portal</Link></li>
          </ul>
        </div>
      </div>
      
      <div className="footer-bottom">
        <div className="container footer-bottom-content">
          <p>&copy; {currentYear} Vriddhi Pathology Laboratory. All Rights Reserved.</p>
          <p className="footer-powered">CRL Diagnostics Partner</p>
        </div>
      </div>
    </footer>
  );
}
