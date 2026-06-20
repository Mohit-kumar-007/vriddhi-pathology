import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';
import formatPrice from '../utils/formatPrice';
import LoadingSpinner from '../components/LoadingSpinner';
import { AuthContext } from '../context/AuthContext';
import './Book.css';

export default function Book({ selectedTests, onRemoveTest, onAddTest, onClearTests }) {
  const navigate = useNavigate();
  const { user, isAuthenticated, loading: authLoading } = useContext(AuthContext);
  
  const [formData, setFormData] = useState({
    patientName: '',
    age: '',
    gender: '',
    phone: '',
    address: '',
    pincode: '',
    preferredDate: '',
    preferredSlot: '',
    notes: ''
  });

  // Pre-fill booking details if user is authenticated
  useEffect(() => {
    if (user && user.role === 'user') {
      setFormData(prev => ({
        ...prev,
        patientName: prev.patientName || user.name || '',
        phone: prev.phone || user.phone || '',
        age: prev.age || user.age || '',
        gender: prev.gender || user.gender || '',
        address: prev.address || user.address || '',
        pincode: prev.pincode || user.pincode || ''
      }));
    }
  }, [user]);

  const [formErrors, setFormErrors] = useState({});
  const [settings, setSettings] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [searching, setSearching] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');

  // Fetch offer settings for discount logic
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await api.get('/offers');
        if (res.data.success) {
          setSettings(res.data.data);
        }
      } catch (err) {
        console.error('Failed to load settings:', err);
      }
    };
    fetchSettings();
  }, []);

  // Search tests to add more tests
  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      return;
    }
    const delay = setTimeout(async () => {
      setSearching(true);
      try {
        const res = await api.get(`/tests?search=${searchQuery}&limit=5`);
        if (res.data.success) {
          setSearchResults(res.data.data);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setSearching(false);
      }
    }, 300);

    return () => clearTimeout(delay);
  }, [searchQuery]);

  // Calculate pricing summary
  const subtotal = selectedTests.reduce((sum, item) => sum + (item.mrp || 0), 0);
  
  // Calculate discount dynamically based on settings and patient age
  const globalDiscount = settings?.globalDiscountPercent || 30;
  const isSenior = formData.age && parseInt(formData.age) >= 60;
  const seniorExtraDiscount = isSenior ? (settings?.seniorCitizenExtraDiscount || 10) : 0;
  const totalDiscountPercent = globalDiscount + seniorExtraDiscount;

  // Final offer price summation
  const totalAmount = selectedTests.reduce((sum, item) => {
    const price = item.effectiveOfferPrice || item.offerPrice;
    if (price) return sum + price;
    // Calculate fallback if missing
    return sum + Math.round((item.mrp || 0) * (1 - globalDiscount / 100));
  }, 0);

  // Apply senior citizen extra discount if applicable
  const finalAmount = isSenior 
    ? Math.round(totalAmount * (1 - (settings?.seniorCitizenExtraDiscount || 10) / 100))
    : totalAmount;

  const discountSavings = subtotal - finalAmount;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (formErrors[name]) {
      setFormErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const errors = {};
    if (!formData.patientName.trim()) errors.patientName = 'Patient name is required';
    if (!formData.age) {
      errors.age = 'Age is required';
    } else if (isNaN(formData.age) || parseInt(formData.age) <= 0) {
      errors.age = 'Enter a valid age';
    }
    if (!formData.gender) errors.gender = 'Gender is required';
    if (!formData.phone) {
      errors.phone = 'Phone number is required';
    } else if (!/^\d{10}$/.test(formData.phone)) {
      errors.phone = 'Enter a valid 10-digit phone number';
    }
    if (!formData.address.trim()) errors.address = 'Address is required';
    if (!formData.pincode) {
      errors.pincode = 'Pincode is required';
    } else if (!/^\d{6}$/.test(formData.pincode)) {
      errors.pincode = 'Enter a valid 6-digit PIN code';
    }
    if (!formData.preferredDate) errors.preferredDate = 'Date is required';
    if (!formData.preferredSlot) errors.preferredSlot = 'Time slot is required';
    
    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (selectedTests.length === 0) {
      setSubmitError('Please select at least one test or health package to book.');
      return;
    }

    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      // Scroll to first error
      const firstError = Object.keys(errors)[0];
      const element = document.getElementsByName(firstError)[0];
      if (element) element.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }

    setSubmitting(true);
    setSubmitError('');

    try {
      const payloadTests = selectedTests.map(t => ({
        testId: t._id,
        testName: t.testName || t.name,
        offerPrice: t.effectiveOfferPrice || t.offerPrice || Math.round(t.mrp * (1 - globalDiscount / 100))
      }));

      // Adjust payload tests with extra senior discount if patient is senior
      const adjustedPayloadTests = payloadTests.map(pt => ({
        ...pt,
        offerPrice: isSenior 
          ? Math.round(pt.offerPrice * (1 - (settings?.seniorCitizenExtraDiscount || 10) / 100)) 
          : pt.offerPrice
      }));

      const payload = {
        ...formData,
        age: parseInt(formData.age),
        selectedTests: adjustedPayloadTests,
        preferredDate: new Date(formData.preferredDate)
      };

      const res = await api.post('/bookings', payload);
      if (res.data.success) {
        onClearTests();
        navigate('/booking-success', { state: { booking: res.data.data.booking, whatsappLink: res.data.data.whatsappLink } });
      } else {
        setSubmitError(res.data.message || 'Booking failed. Please try again.');
      }
    } catch (err) {
      setSubmitError(err.response?.data?.message || 'Something went wrong. Please check connection.');
    } finally {
      setSubmitting(false);
    }
  };

  if (authLoading) {
    return <LoadingSpinner fullPage />;
  }

  if (!isAuthenticated) {
    return (
      <div className="book-page container section">
        <div className="book-header">
          <h1 className="page-title">Book Diagnostic Test</h1>
          <p className="page-subtitle">Fill in the patient details and address for home collection. Your request will be verified instantly.</p>
        </div>
        <div className="login-required-state card" style={{ textAlign: 'center', padding: '40px', maxWidth: '550px', margin: '40px auto' }}>
          <div className="required-icon" style={{ fontSize: '3rem', marginBottom: '20px' }}>🔒</div>
          <h2>Authentication Required</h2>
          <p style={{ margin: '15px 0 25px', color: 'var(--text-muted)' }}>
            Before booking a slot or diagnostic test, you must log in or create a patient profile.
          </p>
          <div className="required-actions">
            <button onClick={() => navigate('/login', { state: { from: { pathname: '/book' } } })} className="btn btn-gold">
              Login / Create Profile ➡️
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Get current date string for min date picker constraint (today onwards)
  const todayStr = new Date().toISOString().split('T')[0];

  return (
    <div className="book-page container section">
      <div className="book-header">
        <h1 className="page-title">Book Diagnostic Test</h1>
        <p className="page-subtitle">Fill in the patient details and address for home collection. Your request will be verified instantly.</p>
      </div>

      {selectedTests.length === 0 ? (
        <div className="empty-booking-state">
          <h3>Your selected tests list is empty</h3>
          <p>Please browse and select from our available tests directory or wellness packages.</p>
          <div className="empty-actions">
            <button onClick={() => navigate('/tests')} className="btn btn-primary">Browse Tests</button>
            <button onClick={() => navigate('/packages')} className="btn btn-secondary">Wellness Packages</button>
          </div>
        </div>
      ) : (
        <div className="booking-layout">
          {/* Booking Form */}
          <form className="booking-form card" onSubmit={handleSubmit}>
            <h2 className="form-section-title">Patient & Collection Information</h2>

            {submitError && <div className="error-alert">{submitError}</div>}

            <div className="grid grid-2">
              {/* Patient Name */}
              <div className="form-group">
                <label className="form-label" htmlFor="patientName">Patient Full Name*</label>
                <input
                  type="text"
                  id="patientName"
                  name="patientName"
                  placeholder="e.g. Rahul Kumar"
                  className={`form-input ${formErrors.patientName ? 'input-error' : ''}`}
                  value={formData.patientName}
                  onChange={handleInputChange}
                />
                {formErrors.patientName && <span className="error-text">{formErrors.patientName}</span>}
              </div>

              {/* Patient Age */}
              <div className="form-group">
                <label className="form-label" htmlFor="age">Age (in years)*</label>
                <input
                  type="number"
                  id="age"
                  name="age"
                  placeholder="e.g. 45"
                  className={`form-input ${formErrors.age ? 'input-error' : ''}`}
                  value={formData.age}
                  onChange={handleInputChange}
                />
                {formErrors.age && <span className="error-text">{formErrors.age}</span>}
                {isSenior && <span className="senior-badge-lbl">👴 Senior Citizen Extra 10% OFF applied!</span>}
              </div>
            </div>

            <div className="grid grid-2">
              {/* Gender */}
              <div className="form-group">
                <label className="form-label">Gender*</label>
                <div className="gender-radio-group">
                  <label className="radio-label">
                    <input
                      type="radio"
                      name="gender"
                      value="Male"
                      checked={formData.gender === 'Male'}
                      onChange={handleInputChange}
                    />
                    Male
                  </label>
                  <label className="radio-label">
                    <input
                      type="radio"
                      name="gender"
                      value="Female"
                      checked={formData.gender === 'Female'}
                      onChange={handleInputChange}
                    />
                    Female
                  </label>
                  <label className="radio-label">
                    <input
                      type="radio"
                      name="gender"
                      value="Other"
                      checked={formData.gender === 'Other'}
                      onChange={handleInputChange}
                    />
                    Other
                  </label>
                </div>
                {formErrors.gender && <span className="error-text">{formErrors.gender}</span>}
              </div>

              {/* Phone */}
              <div className="form-group">
                <label className="form-label" htmlFor="phone">WhatsApp Mobile Number*</label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  placeholder="e.g. 9026578856"
                  maxLength="10"
                  className={`form-input ${formErrors.phone ? 'input-error' : ''}`}
                  value={formData.phone}
                  onChange={handleInputChange}
                />
                {formErrors.phone && <span className="error-text">{formErrors.phone}</span>}
              </div>
            </div>

            {/* Address */}
            <div className="form-group">
              <label className="form-label" htmlFor="address">Collection Address (Street/Mohalla/Landmark)*</label>
              <textarea
                id="address"
                name="address"
                rows="3"
                placeholder="e.g. Near Shiv Mandir, Ward No. 5"
                className={`form-input ${formErrors.address ? 'input-error' : ''}`}
                value={formData.address}
                onChange={handleInputChange}
              />
              {formErrors.address && <span className="error-text">{formErrors.address}</span>}
            </div>

            <div className="grid grid-2">
              {/* Pincode */}
              <div className="form-group">
                <label className="form-label" htmlFor="pincode">Pincode (UP Areas)*</label>
                <input
                  type="text"
                  id="pincode"
                  name="pincode"
                  placeholder="e.g. 232104"
                  maxLength="6"
                  className={`form-input ${formErrors.pincode ? 'input-error' : ''}`}
                  value={formData.pincode}
                  onChange={handleInputChange}
                />
                {formErrors.pincode && <span className="error-text">{formErrors.pincode}</span>}
              </div>

              {/* Preferred Date */}
              <div className="form-group">
                <label className="form-label" htmlFor="preferredDate">Preferred Date*</label>
                <input
                  type="date"
                  id="preferredDate"
                  name="preferredDate"
                  min={todayStr}
                  className={`form-input ${formErrors.preferredDate ? 'input-error' : ''}`}
                  value={formData.preferredDate}
                  onChange={handleInputChange}
                />
                {formErrors.preferredDate && <span className="error-text">{formErrors.preferredDate}</span>}
              </div>
            </div>

            <div className="grid grid-2">
              {/* Preferred Time Slot */}
              <div className="form-group">
                <label className="form-label" htmlFor="preferredSlot">Preferred Time Slot*</label>
                <select
                  id="preferredSlot"
                  name="preferredSlot"
                  className={`form-input ${formErrors.preferredSlot ? 'input-error' : ''}`}
                  value={formData.preferredSlot}
                  onChange={handleInputChange}
                >
                  <option value="">-- Select Time Slot --</option>
                  <option value="9AM-11AM">9:00 AM – 11:00 AM</option>
                  <option value="11AM-1PM">11:00 AM – 1:00 PM</option>
                  <option value="1PM-3PM">1:00 PM – 3:00 PM</option>
                  <option value="3PM-5PM">3:00 PM – 5:00 PM</option>
                  <option value="5PM-7PM">5:00 PM – 7:00 PM</option>
                </select>
                {formErrors.preferredSlot && <span className="error-text">{formErrors.preferredSlot}</span>}
              </div>

              {/* Notes */}
              <div className="form-group">
                <label className="form-label" htmlFor="notes">Special Notes/Instructions (Optional)</label>
                <input
                  type="text"
                  id="notes"
                  name="notes"
                  placeholder="e.g. Call before coming, fasting samples"
                  className="form-input"
                  value={formData.notes}
                  onChange={handleInputChange}
                />
              </div>
            </div>

            {/* Inline Test Search & Add */}
            <div className="inline-test-search-wrapper">
              <h3 className="inline-search-heading">Forgot a test? Search & Add here:</h3>
              <div className="inline-search-bar">
                <input
                  type="text"
                  placeholder="Search test to add..."
                  className="form-input"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              
              {searching && <p className="inline-search-msg">Searching tests...</p>}
              
              {searchResults.length > 0 && (
                <div className="inline-search-results">
                  {searchResults.map(test => {
                    const isAlreadySelected = selectedTests.some(t => t._id === test._id);
                    return (
                      <div key={test._id} className="inline-search-item">
                        <div className="item-details">
                          <span className="code">{test.testCode}</span>
                          <span className="name">{test.testName}</span>
                          <span className="price">{formatPrice(test.effectiveOfferPrice || test.offerPrice || Math.round(test.mrp * 0.7))}</span>
                        </div>
                        <button
                          type="button"
                          className={`btn btn-sm ${isAlreadySelected ? 'btn-disabled' : 'btn-gold'}`}
                          disabled={isAlreadySelected}
                          onClick={() => {
                            onAddTest(test);
                            setSearchQuery('');
                          }}
                        >
                          {isAlreadySelected ? 'Added' : '+ Add'}
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            <button
              type="submit"
              className="btn btn-gold submit-booking-btn"
              disabled={submitting}
            >
              {submitting ? 'Creating Booking Request...' : 'Confirm Booking via WhatsApp 🚀'}
            </button>
          </form>

          {/* Booking Summary Sidebar */}
          <div className="booking-summary-sidebar">
            <div className="card summary-card">
              <h2 className="summary-title">Order Summary</h2>
              
              <ul className="selected-items-list">
                {selectedTests.map(item => (
                  <li key={item._id} className="summary-item">
                    <div className="item-info">
                      <span className="item-name">{item.testName || item.name}</span>
                      <span className="item-code">{item.testCode || 'Package'}</span>
                    </div>
                    <div className="item-pricing">
                      <span className="price">{formatPrice(item.effectiveOfferPrice || item.offerPrice || Math.round(item.mrp * 0.7))}</span>
                      <button
                        type="button"
                        className="remove-item-btn"
                        title="Remove test"
                        onClick={() => onRemoveTest(item)}
                      >
                        ✕
                      </button>
                    </div>
                  </li>
                ))}
              </ul>

              <div className="summary-calculations">
                <div className="calc-row">
                  <span>Subtotal (MRP):</span>
                  <span className="mrp-subtotal">{formatPrice(subtotal)}</span>
                </div>
                <div className="calc-row discount-row">
                  <span>Dynamic Discount Savings:</span>
                  <span>-{formatPrice(discountSavings)}</span>
                </div>
                <div className="calc-row collection-row">
                  <span>Home Collection Charges:</span>
                  <span className="green-text">FREE</span>
                </div>
                
                <div className="calc-divider"></div>

                <div className="calc-row total-row">
                  <span>Total Amount to Pay:</span>
                  <span className="final-price">{formatPrice(finalAmount)}</span>
                </div>
              </div>

              <div className="summary-info-box">
                <p>💡 <strong>Note:</strong> Cash or UPI payment will be collected at your home during sample collection.</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
