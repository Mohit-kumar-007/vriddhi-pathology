import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../utils/api';
import formatPrice from '../utils/formatPrice';
import LoadingSpinner from '../components/LoadingSpinner';
import './PackageManager.css';

const BADGES = ['Most Popular', 'Best Value', 'Allergy', 'None'];
const GENDERS = ['All', 'Male', 'Female'];

export default function PackageManager() {
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingPkg, setEditingPkg] = useState(null);

  // Form fields
  const [form, setForm] = useState({
    name: '',
    targetGender: 'All',
    includedTestsText: '',
    mrp: '',
    offerPrice: '',
    badge: 'None',
    isActive: true,
    sortOrder: 0
  });

  const [formError, setFormError] = useState('');
  const [formSuccess, setFormSuccess] = useState('');
  const [saving, setSaving] = useState(false);

  const fetchPackages = async () => {
    setLoading(true);
    try {
      // Use the admin route to fetch all (including inactive ones)
      const res = await api.get('/packages/admin/all');
      if (res.data.success) {
        setPackages(res.data.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPackages();
  }, []);

  const handleOpenAddModal = () => {
    setEditingPkg(null);
    setForm({
      name: '',
      targetGender: 'All',
      includedTestsText: '',
      mrp: '',
      offerPrice: '',
      badge: 'None',
      isActive: true,
      sortOrder: 0
    });
    setFormError('');
    setFormSuccess('');
    setShowModal(true);
  };

  const handleOpenEditModal = (pkg) => {
    setEditingPkg(pkg);
    setForm({
      name: pkg.name,
      targetGender: pkg.targetGender,
      includedTestsText: pkg.includedTests.join('\n'),
      mrp: pkg.mrp,
      offerPrice: pkg.offerPrice,
      badge: pkg.badge || 'None',
      isActive: pkg.isActive,
      sortOrder: pkg.sortOrder || 0
    });
    setFormError('');
    setFormSuccess('');
    setShowModal(true);
  };

  const handleDeletePkg = async (id) => {
    if (!window.confirm('Are you sure you want to delete this package permanently?')) return;
    try {
      const res = await api.delete(`/packages/${id}`);
      if (res.data.success) {
        alert('Package deleted successfully!');
        fetchPackages();
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete package');
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.mrp || !form.offerPrice) {
      setFormError('Please fill in Name, MRP and Offer Price.');
      return;
    }

    setSaving(true);
    setFormError('');
    setFormSuccess('');

    try {
      // Convert text lines to array of strings
      const includedTests = form.includedTestsText
        .split('\n')
        .map(t => t.trim())
        .filter(t => t.length > 0);

      const payload = {
        name: form.name,
        targetGender: form.targetGender,
        includedTests,
        mrp: parseFloat(form.mrp),
        offerPrice: parseFloat(form.offerPrice),
        badge: form.badge === 'None' ? null : form.badge,
        isActive: form.isActive,
        sortOrder: parseInt(form.sortOrder)
      };

      let res;
      if (editingPkg) {
        res = await api.put(`/packages/${editingPkg._id}`, payload);
      } else {
        res = await api.post('/packages', payload);
      }

      if (res.data.success) {
        setFormSuccess(editingPkg ? 'Package updated successfully!' : 'Package created successfully!');
        setTimeout(() => {
          setShowModal(false);
          fetchPackages();
        }, 1500);
      } else {
        setFormError(res.data.message || 'Operation failed.');
      }
    } catch (err) {
      setFormError(err.response?.data?.message || 'Error occurred.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="package-manager-page container section">
      <div className="manager-header">
        <div>
          <Link to="/admin" className="back-link">⬅️ Back to Dashboard</Link>
          <h1 className="page-title">Health Package Manager</h1>
          <p className="page-subtitle">Configure bundle packages, pricing, target audiences, list included tests, and tag active badges.</p>
        </div>
        <button onClick={handleOpenAddModal} className="btn btn-gold">
          + Add New Package
        </button>
      </div>

      {loading ? (
        <LoadingSpinner />
      ) : packages.length === 0 ? (
        <div className="no-data-card card">
          <p>No health packages configured yet.</p>
        </div>
      ) : (
        <div className="card table-card">
          <div className="table-responsive">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Order</th>
                  <th>Package Name</th>
                  <th>Target Gender</th>
                  <th>Tests Count</th>
                  <th>MRP</th>
                  <th>Offer Price</th>
                  <th>Badge</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {packages.map(pkg => (
                  <tr key={pkg._id}>
                    <td><strong>{pkg.sortOrder || 0}</strong></td>
                    <td><strong className="code-text" style={{ background: 'none', padding: 0 }}>{pkg.name}</strong></td>
                    <td>{pkg.targetGender}</td>
                    <td><span className="badge badge-gold">{pkg.includedTests.length} Tests</span></td>
                    <td>{formatPrice(pkg.mrp)}</td>
                    <td><span className="green-text font-bold">{formatPrice(pkg.offerPrice)}</span></td>
                    <td>
                      {pkg.badge ? (
                        <span className={`badge ${pkg.badge === 'Most Popular' ? 'badge-gold' : pkg.badge === 'Best Value' ? 'badge-green' : 'badge-red'}`}>
                          {pkg.badge}
                        </span>
                      ) : (
                        <span className="text-muted italic">None</span>
                      )}
                    </td>
                    <td>
                      <span className={`status-dot ${pkg.isActive ? 'active' : 'inactive'}`}></span>
                      {pkg.isActive ? 'Active' : 'Hidden'}
                    </td>
                    <td>
                      <div className="action-btns">
                        <button onClick={() => handleOpenEditModal(pkg)} className="btn btn-sm btn-outline">
                          Edit
                        </button>
                        <button onClick={() => handleDeletePkg(pkg._id)} className="btn btn-sm btn-outline" style={{ color: 'var(--accent-red)', borderColor: 'var(--accent-red)' }}>
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Form Modal */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content card" style={{ maxWidth: '650px' }}>
            <button className="close-modal-btn" onClick={() => setShowModal(false)}>✕</button>
            <h2>{editingPkg ? 'Edit Wellness Package' : 'Create Wellness Package'}</h2>
            
            {formError && <div className="error-alert">{formError}</div>}
            {formSuccess && <div className="success-alert">{formSuccess}</div>}

            <form onSubmit={handleFormSubmit} className="modal-form">
              <div className="grid grid-2">
                <div className="form-group">
                  <label className="form-label">Package Name*</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="e.g. Fit India Full Body"
                    value={form.name}
                    onChange={(e) => setForm(p => ({ ...p, name: e.target.value }))}
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Target Gender*</label>
                  <select
                    className="form-input"
                    value={form.targetGender}
                    onChange={(e) => setForm(p => ({ ...p, targetGender: e.target.value }))}
                  >
                    {GENDERS.map(g => <option key={g} value={g}>{g}</option>)}
                  </select>
                </div>
              </div>

              <div className="grid grid-3">
                <div className="form-group">
                  <label className="form-label">MRP Price*</label>
                  <input
                    type="number"
                    className="form-input"
                    placeholder="₹ 1500"
                    value={form.mrp}
                    onChange={(e) => setForm(p => ({ ...p, mrp: e.target.value }))}
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Offer Price*</label>
                  <input
                    type="number"
                    className="form-input"
                    placeholder="₹ 999"
                    value={form.offerPrice}
                    onChange={(e) => setForm(p => ({ ...p, offerPrice: e.target.value }))}
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Sort Order</label>
                  <input
                    type="number"
                    className="form-input"
                    value={form.sortOrder}
                    onChange={(e) => setForm(p => ({ ...p, sortOrder: e.target.value }))}
                  />
                </div>
              </div>

              <div className="grid grid-2">
                <div className="form-group">
                  <label className="form-label">Promo Tag / Badge</label>
                  <select
                    className="form-input"
                    value={form.badge}
                    onChange={(e) => setForm(p => ({ ...p, badge: e.target.value }))}
                  >
                    {BADGES.map(b => <option key={b} value={b}>{b}</option>)}
                  </select>
                </div>
                <div className="form-group" style={{ display: 'flex', alignItems: 'flex-end', paddingBottom: '12px' }}>
                  <label className="radio-label">
                    <input
                      type="checkbox"
                      checked={form.isActive}
                      onChange={(e) => setForm(p => ({ ...p, isActive: e.target.checked }))}
                    />
                    Active & Available for booking
                  </label>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Included Tests List (One test name per line)*</label>
                <textarea
                  className="form-input"
                  rows="5"
                  placeholder="e.g.&#10;Hemoglobin (Hb)&#10;Total Cholesterol&#10;Thyroid Stimulating Hormone (TSH)"
                  value={form.includedTestsText}
                  onChange={(e) => setForm(p => ({ ...p, includedTestsText: e.target.value }))}
                  required
                />
              </div>

              <button
                type="submit"
                className="btn btn-gold w-full mt-20"
                disabled={saving}
              >
                {saving ? 'Saving package...' : editingPkg ? 'Update Package' : 'Create Package'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
