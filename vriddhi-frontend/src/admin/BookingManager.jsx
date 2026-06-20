import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../utils/api';
import formatPrice from '../utils/formatPrice';
import LoadingSpinner from '../components/LoadingSpinner';
import './BookingManager.css';

const STATUS_OPTIONS = ['pending', 'confirmed', 'collected', 'completed', 'cancelled'];

export default function BookingManager() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [exporting, setExporting] = useState(false);

  // Expanded row tracking
  const [expandedId, setExpandedId] = useState(null);

  const fetchBookings = async () => {
    setLoading(true);
    try {
      const res = await api.get('/bookings', {
        params: { search, status, startDate, endDate, page, limit: 15 }
      });
      if (res.data.success) {
        setBookings(res.data.data);
        setTotalPages(res.data.pages);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, [search, status, startDate, endDate, page]);

  const handleUpdateStatus = async (id, newStatus) => {
    try {
      const res = await api.put(`/bookings/${id}/status`, { status: newStatus });
      if (res.data.success) {
        setBookings(prev => prev.map(b => b._id === id ? { ...b, status: newStatus } : b));
        alert('Status updated successfully!');
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update status.');
    }
  };

  const handleDeleteBooking = async (id) => {
    if (!window.confirm('Delete this booking? This action is permanent.')) return;
    try {
      const res = await api.delete(`/bookings/${id}`);
      if (res.data.success) {
        alert('Booking deleted.');
        fetchBookings();
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete booking.');
    }
  };

  const handleExportCSV = async () => {
    setExporting(true);
    try {
      const response = await api.get('/bookings/export/csv', { responseType: 'blob' });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'bookings_export.csv');
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
    } catch (err) {
      alert('CSV Export failed. Access denied or server down.');
    } finally {
      setExporting(false);
    }
  };

  const toggleExpandRow = (id) => {
    setExpandedId(prev => (prev === id ? null : id));
  };

  const getStatusColorClass = (stat) => {
    switch (stat) {
      case 'pending': return 'badge-gold';
      case 'confirmed': return 'badge-green';
      case 'collected': return 'badge-green';
      case 'completed': return 'badge-green';
      case 'cancelled': return 'badge-red';
      default: return '';
    }
  };

  return (
    <div className="booking-manager-page container section">
      <div className="manager-header">
        <div>
          <Link to="/admin" className="back-link">⬅️ Back to Dashboard</Link>
          <h1 className="page-title">Bookings Manager</h1>
          <p className="page-subtitle">Inspect patient appointments, update medical process stages, and export reports.</p>
        </div>
        <button 
          onClick={handleExportCSV} 
          className="btn btn-secondary"
          disabled={exporting}
        >
          {exporting ? 'Exporting...' : '📥 Export Bookings CSV'}
        </button>
      </div>

      {/* Filters Card */}
      <div className="filters-card card">
        <div className="grid grid-4 filter-grid-wrapper">
          <div className="form-group">
            <label className="form-label">Search Patient / Phone / ID</label>
            <input
              type="text"
              className="form-input"
              placeholder="e.g. VPL-2026-0001 or Rahul"
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            />
          </div>
          
          <div className="form-group">
            <label className="form-label">Booking Status</label>
            <select
              className="form-input"
              value={status}
              onChange={(e) => { setStatus(e.target.value); setPage(1); }}
            >
              <option value="">All Statuses</option>
              {STATUS_OPTIONS.map(opt => <option key={opt} value={opt}>{opt.toUpperCase()}</option>)}
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Start Date</label>
            <input
              type="date"
              className="form-input"
              value={startDate}
              onChange={(e) => { setStartDate(e.target.value); setPage(1); }}
            />
          </div>

          <div className="form-group">
            <label className="form-label">End Date</label>
            <input
              type="date"
              className="form-input"
              value={endDate}
              onChange={(e) => { setEndDate(e.target.value); setPage(1); }}
            />
          </div>
        </div>
      </div>

      {/* Bookings Table */}
      {loading ? (
        <LoadingSpinner />
      ) : bookings.length === 0 ? (
        <div className="no-data-card card">
          <p>No patient booking records found.</p>
        </div>
      ) : (
        <div className="card table-card">
          <div className="table-responsive">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Booking ID</th>
                  <th>Patient Name</th>
                  <th>Contact Phone</th>
                  <th>Preferred Date</th>
                  <th>Slot</th>
                  <th>Total Amount</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {bookings.map(book => {
                  const isExpanded = expandedId === book._id;
                  const dateStr = new Date(book.preferredDate).toLocaleDateString('en-IN');
                  return (
                    <React.Fragment key={book._id}>
                      {/* Main Row */}
                      <tr className="main-row" onClick={() => toggleExpandRow(book._id)}>
                        <td>
                          <button className="expand-indicator-btn">
                            {isExpanded ? '▼' : '▶'}
                          </button>
                          <strong className="code-text">{book.bookingId}</strong>
                        </td>
                        <td>{book.patientName} ({book.age} Y / {book.gender[0]})</td>
                        <td>{book.phone}</td>
                        <td>{dateStr}</td>
                        <td>{book.preferredSlot}</td>
                        <td className="font-bold">{formatPrice(book.totalAmount)}</td>
                        <td>
                          <select
                            value={book.status}
                            onClick={(e) => e.stopPropagation()} // Stop expansion trigger
                            onChange={(e) => handleUpdateStatus(book._id, e.target.value)}
                            className={`status-select-btn badge ${getStatusColorClass(book.status)}`}
                          >
                            {STATUS_OPTIONS.map(opt => (
                              <option key={opt} value={opt}>{opt.toUpperCase()}</option>
                            ))}
                          </select>
                        </td>
                        <td>
                          <div className="action-btns" onClick={(e) => e.stopPropagation()}>
                            <a
                              href={book.whatsappLink}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="btn btn-sm btn-outline-gold"
                            >
                              WA Link
                            </a>
                            <button
                              onClick={() => handleDeleteBooking(book._id)}
                              className="btn btn-sm btn-outline"
                              style={{ color: 'var(--accent-red)', borderColor: 'var(--accent-red)' }}
                            >
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>

                      {/* Expandable Details Row */}
                      {isExpanded && (
                        <tr className="expanded-row">
                          <td colSpan="8">
                            <div className="expanded-detail-box">
                              <h3>Full Booking Specification</h3>
                              <div className="detail-grid">
                                <div className="detail-info-col">
                                  <p><strong>Home Collection Address:</strong> {book.address} - {book.pincode}</p>
                                  <p><strong>Notes:</strong> {book.notes || 'None'}</p>
                                  <p><strong>Record Created At:</strong> {new Date(book.createdAt).toLocaleString('en-IN')}</p>
                                </div>
                                <div className="detail-tests-col">
                                  <strong>Selected Tests ({book.selectedTests.length}):</strong>
                                  <ul className="detail-tests-list">
                                    {book.selectedTests.map((t, idx) => (
                                      <li key={idx}>
                                        {t.testName} — <span className="green-text font-bold">{formatPrice(t.offerPrice)}</span>
                                      </li>
                                    ))}
                                  </ul>
                                </div>
                              </div>
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="pagination-wrapper" style={{ padding: '20px' }}>
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
    </div>
  );
}
