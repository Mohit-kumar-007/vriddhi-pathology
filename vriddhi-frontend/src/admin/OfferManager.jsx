import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../utils/api';
import LoadingSpinner from '../components/LoadingSpinner';
import './OfferManager.css';

export default function OfferManager() {
  const [loading, setLoading] = useState(true);
  const [savingSettings, setSavingSettings] = useState(false);
  const [settings, setSettings] = useState({
    globalDiscountPercent: 30,
    seniorCitizenExtraDiscount: 10,
    familyDiscountPercent: 10,
    freeHomeCollection: true,
    offerBannerText: '',
    labPhone: '9026578856',
    labEmail: 'vriddhipathology@gmail.com',
    labAddress: 'Jagdish Saray, Chandauli 232104, Uttar Pradesh',
    labTimings: '9:00 AM – 8:00 PM, 7 Days a Week'
  });

  // Notifications state
  const [notifications, setNotifications] = useState([]);
  const [showNotifModal, setShowNotifModal] = useState(false);
  const [editingNotif, setEditingNotif] = useState(null);
  
  // Notification form
  const [notifForm, setNotifForm] = useState({
    title: '',
    message: '',
    discountPercent: '',
    validUntil: '',
    isActive: true
  });

  const [notifSaving, setNotifSaving] = useState(false);
  const [settingsSuccess, setSettingsSuccess] = useState('');
  const [settingsError, setSettingsError] = useState('');

  const fetchSettingsAndNotifs = async () => {
    setLoading(true);
    try {
      const [settingsRes, notifsRes] = await Promise.all([
        api.get('/offers'),
        api.get('/notifications/admin/all')
      ]);

      if (settingsRes.data.success) {
        setSettings(settingsRes.data.data);
      }
      if (notifsRes.data.success) {
        setNotifications(notifsRes.data.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSettingsAndNotifs();
  }, []);

  const handleSettingsChange = (e) => {
    const { name, value, type, checked } = e.target;
    setSettings(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : (type === 'number' ? parseFloat(value) : value)
    }));
  };

  const handleSaveSettings = async (e) => {
    e.preventDefault();
    setSavingSettings(true);
    setSettingsSuccess('');
    setSettingsError('');
    try {
      const res = await api.put('/offers', settings);
      if (res.data.success) {
        setSettingsSuccess('Lab settings and discount parameters updated successfully!');
      }
    } catch (err) {
      setSettingsError(err.response?.data?.message || 'Failed to save settings.');
    } finally {
      setSavingSettings(false);
    }
  };

  // Notification CRUD
  const handleOpenAddNotif = () => {
    setEditingNotif(null);
    setNotifForm({
      title: '',
      message: '',
      discountPercent: '',
      validUntil: '',
      isActive: true
    });
    setShowNotifModal(true);
  };

  const handleOpenEditNotif = (notif) => {
    setEditingNotif(notif);
    setNotifForm({
      title: notif.title,
      message: notif.message,
      discountPercent: notif.discountPercent || '',
      validUntil: notif.validUntil ? new Date(notif.validUntil).toISOString().split('T')[0] : '',
      isActive: notif.isActive
    });
    setShowNotifModal(true);
  };

  const handleDeleteNotif = async (id) => {
    if (!window.confirm('Delete this announcement permanently?')) return;
    try {
      const res = await api.delete(`/notifications/${id}`);
      if (res.data.success) {
        alert('Announcement deleted.');
        fetchSettingsAndNotifs();
      }
    } catch (err) {
      alert('Failed to delete.');
    }
  };

  const handleNotifSubmit = async (e) => {
    e.preventDefault();
    if (!notifForm.title || !notifForm.message) {
      alert('Title and Message are required.');
      return;
    }
    setNotifSaving(true);
    try {
      const payload = {
        ...notifForm,
        discountPercent: notifForm.discountPercent ? parseFloat(notifForm.discountPercent) : null,
        validUntil: notifForm.validUntil ? new Date(notifForm.validUntil) : null
      };

      let res;
      if (editingNotif) {
        res = await api.put(`/notifications/${editingNotif._id}`, payload);
      } else {
        res = await api.post('/notifications', payload);
      }

      if (res.data.success) {
        setShowNotifModal(false);
        fetchSettingsAndNotifs();
      }
    } catch (err) {
      alert('Error saving announcement details.');
    } finally {
      setNotifSaving(false);
    }
  };

  if (loading) return <LoadingSpinner fullPage />;

  return (
    <div className="offer-manager-page container section">
      <div className="manager-header">
        <div>
          <Link to="/admin" className="back-link">⬅️ Back to Dashboard</Link>
          <h1 className="page-title">Settings & Announcements</h1>
          <p className="page-subtitle">Configure laboratory configuration details, dynamic discount tiers, ticker banners, and active alerts.</p>
        </div>
      </div>

      <div className="settings-layout">
        {/* Settings Form */}
        <div className="settings-form-col">
          <form className="card form-card" onSubmit={handleSaveSettings}>
            <h2>Dynamic Pricing & Lab Details</h2>
            
            {settingsSuccess && <div className="success-alert">{settingsSuccess}</div>}
            {settingsError && <div className="error-alert">{settingsError}</div>}

            <div className="grid grid-3">
              <div className="form-group">
                <label className="form-label">Global Discount (%)</label>
                <input
                  type="number"
                  name="globalDiscountPercent"
                  className="form-input"
                  min="0"
                  max="100"
                  value={settings.globalDiscountPercent}
                  onChange={handleSettingsChange}
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label">Senior Citizen Extra (%)</label>
                <input
                  type="number"
                  name="seniorCitizenExtraDiscount"
                  className="form-input"
                  min="0"
                  max="100"
                  value={settings.seniorCitizenExtraDiscount}
                  onChange={handleSettingsChange}
                  required
                />
              </div>
              <div className="form-group" style={{ display: 'flex', alignItems: 'flex-end', paddingBottom: '12px' }}>
                <label className="radio-label">
                  <input
                    type="checkbox"
                    name="freeHomeCollection"
                    checked={settings.freeHomeCollection}
                    onChange={handleSettingsChange}
                  />
                  Free Home Collection
                </label>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Scrolling Announcement Banner Text</label>
              <textarea
                name="offerBannerText"
                rows="2"
                className="form-input"
                value={settings.offerBannerText}
                onChange={handleSettingsChange}
                placeholder="e.g. 30% OFF on All Tests | Free Home Collection..."
                required
              />
            </div>

            <h3 className="section-divider">Physical Lab Profile Details</h3>

            <div className="grid grid-2">
              <div className="form-group">
                <label className="form-label">Support Phone</label>
                <input
                  type="text"
                  name="labPhone"
                  className="form-input"
                  value={settings.labPhone}
                  onChange={handleSettingsChange}
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label">Lab Email</label>
                <input
                  type="email"
                  name="labEmail"
                  className="form-input"
                  value={settings.labEmail}
                  onChange={handleSettingsChange}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Physical Address</label>
              <input
                type="text"
                name="labAddress"
                className="form-input"
                value={settings.labAddress}
                onChange={handleSettingsChange}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Opening & Closing Hours</label>
              <input
                type="text"
                name="labTimings"
                className="form-input"
                value={settings.labTimings}
                onChange={handleSettingsChange}
                required
              />
            </div>

            <button type="submit" className="btn btn-gold w-full" disabled={savingSettings}>
              {savingSettings ? 'Saving Configuration...' : 'Save Configuration Changes'}
            </button>
          </form>
        </div>

        {/* Notifications Col */}
        <div className="announcements-col">
          <div className="card list-card">
            <div className="list-card-header">
              <h2>Announcement Alerts</h2>
              <button onClick={handleOpenAddNotif} className="btn btn-sm btn-gold">
                + Create Announcement
              </button>
            </div>

            {notifications.length === 0 ? (
              <p className="empty-msg">No announcements configured yet.</p>
            ) : (
              <ul className="admin-notif-list">
                {notifications.map(n => (
                  <li key={n._id} className="admin-notif-item">
                    <div className="notif-details">
                      <h3>{n.title}</h3>
                      <p>{n.message}</p>
                      <div className="notif-meta">
                        {n.discountPercent && <span className="notif-badge-lbl">🏷️ {n.discountPercent}% Off</span>}
                        <span className={`status-badge-lbl ${n.isActive ? 'active' : 'inactive'}`}>
                          {n.isActive ? 'ACTIVE' : 'INACTIVE'}
                        </span>
                      </div>
                    </div>
                    <div className="notif-actions">
                      <button onClick={() => handleOpenEditNotif(n)} className="btn btn-sm btn-outline">
                        Edit
                      </button>
                      <button 
                        onClick={() => handleDeleteNotif(n._id)} 
                        className="btn btn-sm btn-outline"
                        style={{ color: 'var(--accent-red)', borderColor: 'var(--accent-red)' }}
                      >
                        Delete
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>

      {/* Announcement Form Modal */}
      {showNotifModal && (
        <div className="modal-overlay">
          <div className="modal-content card">
            <button className="close-modal-btn" onClick={() => setShowNotifModal(false)}>✕</button>
            <h2>{editingNotif ? 'Edit Announcement' : 'Create Announcement'}</h2>
            
            <form onSubmit={handleNotifSubmit} className="modal-form">
              <div className="form-group">
                <label className="form-label">Alert Title*</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. Special Father's Day Screenings"
                  value={notifForm.title}
                  onChange={(e) => setNotifForm(p => ({ ...p, title: e.target.value }))}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Detailed Description / Alert Message*</label>
                <textarea
                  className="form-input"
                  rows="3"
                  placeholder="e.g. Get 40% discount on cardiac screening package this weekend..."
                  value={notifForm.message}
                  onChange={(e) => setNotifForm(p => ({ ...p, message: e.target.value }))}
                  required
                />
              </div>

              <div className="grid grid-2">
                <div className="form-group">
                  <label className="form-label">Discount Override (%)</label>
                  <input
                    type="number"
                    className="form-input"
                    placeholder="e.g. 40"
                    value={notifForm.discountPercent}
                    onChange={(e) => setNotifForm(p => ({ ...p, discountPercent: e.target.value }))}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Expiry Date</label>
                  <input
                    type="date"
                    className="form-input"
                    value={notifForm.validUntil}
                    onChange={(e) => setNotifForm(p => ({ ...p, validUntil: e.target.value }))}
                  />
                </div>
              </div>

              <div className="checkbox-groups">
                <label className="radio-label">
                  <input
                    type="checkbox"
                    checked={notifForm.isActive}
                    onChange={(e) => setNotifForm(p => ({ ...p, isActive: e.target.checked }))}
                  />
                  Active (Display immediately on website header bell)
                </label>
              </div>

              <button
                type="submit"
                className="btn btn-gold w-full mt-20"
                disabled={notifSaving}
              >
                {notifSaving ? 'Saving announcement...' : editingNotif ? 'Update Alert' : 'Publish Announcement'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
