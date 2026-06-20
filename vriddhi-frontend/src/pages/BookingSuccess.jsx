import React from 'react';
import { useLocation, Link, Navigate } from 'react-router-dom';
import formatPrice from '../utils/formatPrice';
import './BookingSuccess.css';

export default function BookingSuccess() {
  const location = useLocation();
  const state = location.state;

  if (!state || !state.booking) {
    return <Navigate to="/" replace />;
  }

  const { booking, whatsappLink } = state;
  const { bookingId, patientName, age, gender, phone, address, pincode, selectedTests, preferredDate, preferredSlot, totalAmount } = booking;

  const formattedDate = new Date(preferredDate).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });

  return (
    <div className="booking-success-page container section">
      <div className="success-card card">
        <div className="success-icon-wrapper">
          <span className="success-icon">✓</span>
        </div>

        <h1 className="success-title">Booking Request Received!</h1>
        <p className="success-subtitle">
          Your booking reference is <strong className="booking-id-tag">{bookingId}</strong>.
        </p>

        {/* IMPORTANT ACTION ALERT */}
        <div className="whatsapp-action-alert">
          <h3>⚠️ CRITICAL NEXT STEP REQUIRED</h3>
          <p>
            Please click the button below to send your booking summary directly to our laboratory operator on WhatsApp. This completes and confirms your slot.
          </p>
          <a
            href={whatsappLink}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-secondary whatsapp-btn"
          >
            💬 Click to Send Booking on WhatsApp
          </a>
        </div>

        {/* Booking Details Summary */}
        <div className="booking-receipt-details">
          <h2>Patient & Schedule Summary</h2>
          <div className="receipt-grid">
            <div className="receipt-item">
              <span className="label">Patient Name:</span>
              <span className="value">{patientName}</span>
            </div>
            <div className="receipt-item">
              <span className="label">Age & Gender:</span>
              <span className="value">{age} Years / {gender}</span>
            </div>
            <div className="receipt-item">
              <span className="label">Contact Phone:</span>
              <span className="value">{phone}</span>
            </div>
            <div className="receipt-item">
              <span className="label">Preferred Date:</span>
              <span className="value">{formattedDate}</span>
            </div>
            <div className="receipt-item">
              <span className="label">Time Slot:</span>
              <span className="value">{preferredSlot}</span>
            </div>
            <div className="receipt-item">
              <span className="label">Pincode:</span>
              <span className="value">{pincode}</span>
            </div>
          </div>

          <div className="receipt-address">
            <span className="label">Home Collection Address:</span>
            <span className="value">{address}</span>
          </div>

          <div className="receipt-tests">
            <h3>Selected Tests / Packages</h3>
            <ul className="receipt-tests-list">
              {selectedTests.map((t, idx) => (
                <li key={idx} className="receipt-test-item">
                  <span>{t.testName}</span>
                  <strong>{formatPrice(t.offerPrice)}</strong>
                </li>
              ))}
            </ul>
          </div>

          <div className="receipt-divider"></div>

          <div className="receipt-total">
            <span>Total Payable Amount:</span>
            <strong>{formatPrice(totalAmount)}</strong>
          </div>
        </div>

        <div className="success-footer-actions">
          <button onClick={() => window.print()} className="btn btn-secondary print-btn">
            📥 Print / Save Receipt (PDF)
          </button>
          <Link to="/" className="btn btn-outline">Back to Home Page</Link>
          <Link to="/tests" className="btn btn-primary">Browse Other Tests</Link>
        </div>
      </div>
    </div>
  );
}
