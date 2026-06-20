import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../utils/api';
import formatPrice from '../utils/formatPrice';
import LoadingSpinner from '../components/LoadingSpinner';
import './TestManager.css';

const CATEGORIES = [
  'Hematology', 'Biochemistry', 'Hormones', 'Infection', 'Urine',
  'Stool', 'Vitamins', 'Oncology', 'Serology', 'Microbiology', 'Other'
];

const SAMPLES = ['Blood', 'Urine', 'Stool', 'Serum', 'Plasma', 'Other'];

export default function TestManager() {
  const [tests, setTests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [showModal, setShowModal] = useState(false);
  const [editingTest, setEditingTest] = useState(null);
  
  // Form fields
  const [form, setForm] = useState({
    testCode: '',
    testName: '',
    category: 'Hematology',
    sampleType: 'Blood',
    mrp: '',
    offerPrice: '',
    description: '',
    isFeatured: false,
    isActive: true
  });
  
  const [formError, setFormError] = useState('');
  const [formSuccess, setFormSuccess] = useState('');
  const [saving, setSaving] = useState(false);

  // Pagination states
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchTests = async () => {
    setLoading(true);
    try {
      const res = await api.get('/tests', {
        params: { search, category, page, limit: 15 }
      });
      if (res.data.success) {
        setTests(res.data.data);
        setTotalPages(res.data.pages);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTests();
  }, [search, category, page]);

  const handleOpenAddModal = () => {
    setEditingTest(null);
    setForm({
      testCode: '',
      testName: '',
      category: 'Hematology',
      sampleType: 'Blood',
      mrp: '',
      offerPrice: '',
      description: '',
      isFeatured: false,
      isActive: true
    });
    setFormError('');
    setFormSuccess('');
    setShowModal(true);
  };

  const handleOpenEditModal = (test) => {
    setEditingTest(test);
    setForm({
      testCode: test.testCode,
      testName: test.testName,
      category: test.category,
      sampleType: test.sampleType,
      mrp: test.mrp,
      offerPrice: test.offerPrice || '',
      description: test.description || '',
      isFeatured: test.isFeatured,
      isActive: test.isActive
    });
    setFormError('');
    setFormSuccess('');
    setShowModal(true);
  };

  const handleDeleteTest = async (id) => {
    if (!window.confirm('Are you sure you want to delete this test permanently?')) return;
    try {
      const res = await api.delete(`/tests/${id}`);
      if (res.data.success) {
        alert('Test deleted successfully!');
        fetchTests();
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete test');
    }
  };

  const handleToggleFeatured = async (test) => {
    try {
      const res = await api.put(`/tests/${test._id}`, { isFeatured: !test.isFeatured });
      if (res.data.success) {
        setTests(prev => prev.map(t => t._id === test._id ? { ...t, isFeatured: !t.isFeatured } : t));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (!form.testCode || !form.testName || !form.mrp) {
      setFormError('Please fill in Code, Name and MRP price.');
      return;
    }

    setSaving(true);
    setFormError('');
    setFormSuccess('');

    try {
      const payload = {
        ...form,
        mrp: parseFloat(form.mrp),
        offerPrice: form.offerPrice ? parseFloat(form.offerPrice) : null
      };

      let res;
      if (editingTest) {
        res = await api.put(`/tests/${editingTest._id}`, payload);
      } else {
        res = await api.post('/tests', payload);
      }

      if (res.data.success) {
        setFormSuccess(editingTest ? 'Test updated successfully!' : 'New test created successfully!');
        setTimeout(() => {
          setShowModal(false);
          fetchTests();
        }, 1500);
      } else {
        setFormError(res.data.message || 'Operation failed.');
      }
    } catch (err) {
      setFormError(err.response?.data?.message || 'Error saving test parameters.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="test-manager-page container section">
      <div className="manager-header">
        <div>
          <Link to="/admin" className="back-link">⬅️ Back to Dashboard</Link>
          <h1 className="page-title">Test Directory Editor</h1>
          <p className="page-subtitle">Add new tests, adjust medical pricing (MRP), change specimen samples, or feature tests.</p>
        </div>
        <button onClick={handleOpenAddModal} className="btn btn-gold">
          + Add New Test
        </button>
      </div>

      {/* Filters */}
      <div className="filters-card card">
        <div className="grid grid-2">
          <div className="form-group">
            <label className="form-label">Search by Name/Code</label>
            <input
              type="text"
              className="form-input"
              placeholder="e.g. Hemoglobin or H033"
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            />
          </div>
          <div className="form-group">
            <label className="form-label">Filter by Category</label>
            <select
              className="form-input"
              value={category}
              onChange={(e) => { setCategory(e.target.value); setPage(1); }}
            >
              <option value="All">All Categories</option>
              {CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
            </select>
          </div>
        </div>
      </div>

      {/* Tests Table */}
      {loading ? (
        <LoadingSpinner />
      ) : tests.length === 0 ? (
        <div className="no-data-card card">
          <p>No tests found matching search criteria.</p>
        </div>
      ) : (
        <div className="card table-card">
          <div className="table-responsive">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Code</th>
                  <th>Name</th>
                  <th>Category</th>
                  <th>Sample</th>
                  <th>MRP</th>
                  <th>Offer Price</th>
                  <th>Featured</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {tests.map(test => (
                  <tr key={test._id}>
                    <td><strong className="code-text">{test.testCode}</strong></td>
                    <td>{test.testName}</td>
                    <td><span className="badge badge-gold">{test.category}</span></td>
                    <td>{test.sampleType}</td>
                    <td>{formatPrice(test.mrp)}</td>
                    <td>
                      {test.offerPrice ? (
                        <span className="green-text font-bold">{formatPrice(test.offerPrice)}</span>
                      ) : (
                        <span className="text-muted italic">Dynamic ({formatPrice(test.effectiveOfferPrice)})</span>
                      )}
                    </td>
                    <td>
                      <button
                        onClick={() => handleToggleFeatured(test)}
                        className={`star-btn ${test.isFeatured ? 'featured' : ''}`}
                        title="Toggle Featured"
                      >
                        {test.isFeatured ? '⭐' : '☆'}
                      </button>
                    </td>
                    <td>
                      <span className={`status-dot ${test.isActive ? 'active' : 'inactive'}`}></span>
                      {test.isActive ? 'Active' : 'Hidden'}
                    </td>
                    <td>
                      <div className="action-btns">
                        <button onClick={() => handleOpenEditModal(test)} className="btn btn-sm btn-outline">
                          Edit
                        </button>
                        <button onClick={() => handleDeleteTest(test._id)} className="btn btn-sm btn-outline" style={{ color: 'var(--accent-red)', borderColor: 'var(--accent-red)' }}>
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="pagination-wrapper">
              <button
                disabled={page === 1}
                onClick={() => setPage(p => p - 1)}
                className="btn btn-sm btn-outline"
              >
                ◀ Prev
              </button>
              <span>Page {page} of {totalPages}</span>
              <button
                disabled={page === totalPages}
                onClick={() => setPage(p => p + 1)}
                className="btn btn-sm btn-outline"
              >
                Next ▶
              </button>
            </div>
          )}
        </div>
      )}

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content card" style={{ maxWidth: '600px' }}>
            <button className="close-modal-btn" onClick={() => setShowModal(false)}>✕</button>
            <h2>{editingTest ? 'Modify Test Parameters' : 'Create New Test'}</h2>
            
            {formError && <div className="error-alert">{formError}</div>}
            {formSuccess && <div className="success-alert">{formSuccess}</div>}

            <form onSubmit={handleFormSubmit} className="modal-form">
              <div className="grid grid-2">
                <div className="form-group">
                  <label className="form-label">Test Code*</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="e.g. H033"
                    value={form.testCode}
                    onChange={(e) => setForm(p => ({ ...p, testCode: e.target.value }))}
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Test Name*</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="e.g. Complete Blood Count"
                    value={form.testName}
                    onChange={(e) => setForm(p => ({ ...p, testName: e.target.value }))}
                    required
                  />
                </div>
              </div>

              <div className="grid grid-2">
                <div className="form-group">
                  <label className="form-label">Category*</label>
                  <select
                    className="form-input"
                    value={form.category}
                    onChange={(e) => setForm(p => ({ ...p, category: e.target.value }))}
                  >
                    {CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Specimen Sample Type*</label>
                  <select
                    className="form-input"
                    value={form.sampleType}
                    onChange={(e) => setForm(p => ({ ...p, sampleType: e.target.value }))}
                  >
                    {SAMPLES.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
              </div>

              <div className="grid grid-2">
                <div className="form-group">
                  <label className="form-label">Original Price (MRP)*</label>
                  <input
                    type="number"
                    className="form-input"
                    placeholder="₹ 400"
                    value={form.mrp}
                    onChange={(e) => setForm(p => ({ ...p, mrp: e.target.value }))}
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Specific Offer Price (Optional)</label>
                  <input
                    type="number"
                    className="form-input"
                    placeholder="e.g. 280 (Overrides Global Discount)"
                    value={form.offerPrice}
                    onChange={(e) => setForm(p => ({ ...p, offerPrice: e.target.value }))}
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Description / Clinical Significance</label>
                <textarea
                  className="form-input"
                  rows="2"
                  placeholder="e.g. Screen for anemia and leukemia..."
                  value={form.description}
                  onChange={(e) => setForm(p => ({ ...p, description: e.target.value }))}
                />
              </div>

              <div className="checkbox-groups">
                <label className="radio-label">
                  <input
                    type="checkbox"
                    checked={form.isFeatured}
                    onChange={(e) => setForm(p => ({ ...p, isFeatured: e.target.checked }))}
                  />
                  Featured Test (Show on Home Page)
                </label>
                <label className="radio-label" style={{ marginTop: '10px' }}>
                  <input
                    type="checkbox"
                    checked={form.isActive}
                    onChange={(e) => setForm(p => ({ ...p, isActive: e.target.checked }))}
                  />
                  Active & Available for Booking
                </label>
              </div>

              <button
                type="submit"
                className="btn btn-gold w-full mt-20"
                disabled={saving}
              >
                {saving ? 'Saving test...' : editingTest ? 'Update Test' : 'Create Test'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
