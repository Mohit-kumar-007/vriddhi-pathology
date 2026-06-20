import React from 'react';
import { Link } from 'react-router-dom';
import SearchBar from '../components/SearchBar';
import TestCard from '../components/TestCard';
import LoadingSpinner from '../components/LoadingSpinner';
import useTests from '../hooks/useTests';
import formatPrice from '../utils/formatPrice';
import './Tests.css';

const CATEGORIES = [
  'All',
  'Hematology',
  'Biochemistry',
  'Hormones',
  'Infection',
  'Urine',
  'Stool',
  'Vitamins',
  'Oncology',
  'Serology',
  'Microbiology',
  'Other'
];

export default function Tests({ selectedTests, onToggleSelect, onBookNow }) {
  const {
    tests,
    loading,
    error,
    total,
    pages,
    params,
    setPage,
    setSearch,
    setCategory
  } = useTests({ limit: 24 });

  const totalSelectedPrice = selectedTests.reduce((sum, item) => sum + (item.effectiveOfferPrice || item.offerPrice || 0), 0);

  return (
    <div className="tests-page container section">
      <div className="tests-header">
        <h1 className="page-title">Diagnostic Test Directory</h1>
        <p className="page-subtitle">Browse from our catalog of 112+ certified pathology tests. Use search and category filters below.</p>
      </div>

      {/* Search Bar */}
      <div className="search-section">
        <SearchBar onSearch={setSearch} />
      </div>

      {/* Category Chips */}
      <div className="category-section">
        <h3 className="filter-title">Filter by Category:</h3>
        <div className="category-chips">
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`category-chip ${params.category === cat ? 'active' : ''}`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Results Count */}
      <div className="results-count">
        {loading ? (
          <span>Searching tests...</span>
        ) : (
          <span>Found <strong>{total}</strong> tests in <strong>{params.category}</strong></span>
        )}
      </div>

      {/* Tests Grid */}
      {error && <div className="error-alert">{error}</div>}
      
      {loading ? (
        <LoadingSpinner />
      ) : tests.length === 0 ? (
        <div className="no-results-alert">
          <h3>No tests found matching your criteria.</h3>
          <p>Try searching another keyword or clearing filters.</p>
        </div>
      ) : (
        <>
          <div className="grid grid-4">
            {tests.map(test => (
              <TestCard
                key={test._id}
                test={test}
                isSelected={selectedTests.some(t => t._id === test._id)}
                onToggleSelect={onToggleSelect}
                onBookNow={onBookNow}
              />
            ))}
          </div>

          {/* Pagination Controls */}
          {pages > 1 && (
            <div className="pagination-wrapper">
              <button
                disabled={params.page === 1}
                onClick={() => setPage(params.page - 1)}
                className="btn btn-sm btn-outline pagination-btn"
              >
                ◀ Previous
              </button>
              
              <span className="pagination-info">
                Page <strong>{params.page}</strong> of <strong>{pages}</strong>
              </span>

              <button
                disabled={params.page === pages}
                onClick={() => setPage(params.page + 1)}
                className="btn btn-sm btn-outline pagination-btn"
              >
                Next ▶
              </button>
            </div>
          )}
        </>
      )}

      {/* Sticky Selection Bar */}
      {selectedTests.length > 0 && (
        <div className="sticky-selection-bar">
          <div className="selection-info">
            <span className="selection-count">
              <strong>{selectedTests.length}</strong> items selected
            </span>
            <span className="selection-price">
              Total Amount: <strong>{formatPrice(totalSelectedPrice)}</strong>
            </span>
          </div>
          <div className="selection-actions">
            <Link to="/book" className="btn btn-gold">
              Proceed to Booking Form ➡️
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
