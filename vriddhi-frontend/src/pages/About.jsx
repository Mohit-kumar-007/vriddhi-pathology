import React from 'react';
import './About.css';

export default function About() {
  return (
    <div className="about-page container section">
      <div className="about-header">
        <h1 className="page-title">About Vriddhi Pathology Laboratory</h1>
        <p className="page-subtitle">Your local diagnostics partner providing quality-assured laboratory testing services in Chandauli, UP.</p>
      </div>

      <div className="about-content-layout">
        {/* Intro */}
        <div className="card about-story-card">
          <h2>Our Story & Values</h2>
          <p>
            Established with a commitment to providing precise, quick, and affordable diagnostic services, <strong>Vriddhi Pathology Laboratory</strong> has become a trusted household name in Chandauli, Uttar Pradesh. Located at <strong>Jagdish Saray</strong>, we operate 7 days a week from <strong>9:00 AM to 8:00 PM</strong> to serve our patients at their convenience.
          </p>
          <p>
            Our core values are anchored in clinical accuracy, patient safety, and transparency. By providing free home collection services, we ensure that senior citizens and patients with mobility challenges can access crucial diagnostics without leaving their homes.
          </p>
        </div>

        {/* CRL Partnership */}
        <div className="card crl-partnership-card">
          <div className="crl-badge-header">CRL DIAGNOSTICS PARTNER</div>
          <h2>Authorized Collection Point</h2>
          <p>
            We are proud to be an <strong>Authorized Collection Point for Central Reference Laboratory (CRL)</strong>, one of India’s premier diagnostics and reference laboratory networks.
          </p>
          <p>
            This partnership allows us to offer:
          </p>
          <ul className="crl-benefits-list">
            <li>✓ Access to advanced specialized clinical tests</li>
            <li>✓ Automated verification and double-check reporting</li>
            <li>✓ Standardized barcoded specimen collection</li>
            <li>✓ Strict cold-chain sample preservation protocols</li>
          </ul>
        </div>
      </div>

      {/* Facilities & Services Grid */}
      <div className="facilities-section">
        <h2 className="sub-section-title">Our Testing Capabilities</h2>
        <div className="grid grid-3">
          <div className="facility-card card">
            <span className="icon">🩸</span>
            <h3>Comprehensive Hematology</h3>
            <p>Complete Blood Counts (CBC), Peripheral Blood Smears, ESR, and clotting profiles using automated cell counters.</p>
          </div>
          <div className="facility-card card">
            <span className="icon">🧪</span>
            <h3>Clinical Biochemistry</h3>
            <p>Lipid Profiles, Liver Function Tests (LFT), Kidney Function Tests (KFT), Glucose levels, and electrolyte balances.</p>
          </div>
          <div className="facility-card card">
            <h3>Hormone Assays & Vitamins</h3>
            <p>Thyroid screens (T3, T4, TSH), Vitamin D3, Vitamin B12, and vital wellness monitoring markers.</p>
          </div>
        </div>
      </div>

      {/* Map and Timings */}
      <div className="location-section card">
        <div className="location-details">
          <h2>Find Us & Operation Hours</h2>
          <ul className="details-list">
            <li>
              <strong>📍 Address:</strong> Jagdish Saray, Chandauli 232104, Uttar Pradesh
            </li>
            <li>
              <strong>📞 Phone:</strong> 9026578856
            </li>
            <li>
              <strong>✉️ Email:</strong> vriddhipathology@gmail.com
            </li>
            <li>
              <strong>🕒 Timings:</strong> 9:00 AM – 8:00 PM, Open 7 Days a Week
            </li>
          </ul>
        </div>
        <div className="map-wrapper">
          {/* Google Map Iframe centered on Chandauli, UP */}
          <iframe
            title="Vriddhi Pathology Lab Location Map"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d14436.980649774647!2d83.25624795!3d25.2622765!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x398e29a9df9f52f3%3A0xe54fb7256191b4fa!2sChandauli%2C%20Uttar%20Pradesh%20232104!5e0!3m2!1sen!2sin!4v1781843000000!5m2!1sen!2sin"
            width="100%"
            height="300"
            style={{ border: 0, borderRadius: '8px' }}
            allowFullScreen=""
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          ></iframe>
        </div>
      </div>
    </div>
  );
}
