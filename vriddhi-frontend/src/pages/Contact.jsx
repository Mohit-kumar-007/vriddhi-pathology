import React, { useState } from 'react';
import { generateWhatsAppContactLink } from '../utils/generateWhatsApp';
import './Contact.css';

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });

  const [formError, setFormError] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setFormError('');
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.message.trim()) {
      setFormError('Please fill in your name and message details.');
      return;
    }

    const waLink = generateWhatsAppContactLink(formData.name, formData.email, formData.message);
    window.open(waLink, '_blank');
    
    // Clear form
    setFormData({ name: '', email: '', message: '' });
  };

  return (
    <div className="contact-page container section">
      <div className="contact-header">
        <h1 className="page-title">Contact & Location</h1>
        <p className="page-subtitle">Get in touch with us for inquiries, home collections, or report questions. We respond instantly.</p>
      </div>

      <div className="contact-layout">
        {/* Contact info card */}
        <div className="contact-info-panel">
          <div className="card info-card">
            <h2>Vriddhi Contact Info</h2>
            
            <ul className="contact-details-list">
              <li className="contact-detail-item">
                <span className="icon">📍</span>
                <div>
                  <strong>Laboratory Address:</strong>
                  <p>Jagdish Saray, Chandauli 232104, Uttar Pradesh</p>
                </div>
              </li>
              <li className="contact-detail-item">
                <span className="icon">📞</span>
                <div>
                  <strong>Mobile Hotline:</strong>
                  <p><a href="tel:9026578856" className="link-hover">9026578856</a></p>
                </div>
              </li>
              <li className="contact-detail-item">
                <span className="icon">✉️</span>
                <div>
                  <strong>Email Inbox:</strong>
                  <p><a href="mailto:vriddhipathology@gmail.com" className="link-hover">vriddhipathology@gmail.com</a></p>
                </div>
              </li>
              <li className="contact-detail-item">
                <span className="icon">🕒</span>
                <div>
                  <strong>Timings:</strong>
                  <p>9:00 AM – 8:00 PM, 7 Days a Week</p>
                </div>
              </li>
            </ul>

            <div className="quick-action-buttons">
              <a href="tel:9026578856" className="btn btn-primary cta-btn">
                📞 Call Lab Hotline
              </a>
              <a 
                href="https://wa.me/919026578856?text=Hi%20Vriddhi%20Lab%20I%20want%20to%20ask%20about%20a%20test" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="btn btn-secondary cta-btn"
              >
                💬 Chat on WhatsApp
              </a>
            </div>
          </div>
        </div>

        {/* Contact Form */}
        <div className="contact-form-panel">
          <form className="card form-card" onSubmit={handleFormSubmit}>
            <h2>Send Us a Message</h2>
            <p className="form-note">Submit this form to send a message directly to our lab operator via WhatsApp.</p>

            {formError && <div className="error-alert">{formError}</div>}

            <div className="form-group">
              <label className="form-label" htmlFor="name">Your Full Name*</label>
              <input
                type="text"
                id="name"
                name="name"
                placeholder="e.g. Amit Singh"
                className="form-input"
                value={formData.name}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="email">Email Address (Optional)</label>
              <input
                type="email"
                id="email"
                name="email"
                placeholder="e.g. amit@gmail.com"
                className="form-input"
                value={formData.email}
                onChange={handleInputChange}
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="message">Message Details*</label>
              <textarea
                id="message"
                name="message"
                rows="4"
                placeholder="Write your query, test requirements, or location specifics..."
                className="form-input"
                value={formData.message}
                onChange={handleInputChange}
                required
              />
            </div>

            <button type="submit" className="btn btn-gold submit-contact-btn">
              Send Message on WhatsApp 🚀
            </button>
          </form>
        </div>
      </div>

      {/* Google Maps embed */}
      <div className="map-section card">
        <h2 className="map-title">Locate Us in Chandauli</h2>
        <p className="map-subtitle">Visit our physical collection point to drop samples or pick up reports.</p>
        <div className="map-container">
          <iframe
            title="Vriddhi Pathology Lab Google Maps Coordinates"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d14436.980649774647!2d83.25624795!3d25.2622765!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x398e29a9df9f52f3%3A0xe54fb7256191b4fa!2sChandauli%2C%20Uttar%20Pradesh%20232104!5e0!3m2!1sen!2sin!4v1781843000000!5m2!1sen!2sin"
            width="100%"
            height="400"
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
