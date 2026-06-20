import React from 'react';
import { Link } from 'react-router-dom';
import PackageCard from '../components/PackageCard';
import LoadingSpinner from '../components/LoadingSpinner';
import usePackages from '../hooks/usePackages';
import formatPrice from '../utils/formatPrice';
import './Packages.css';

export default function Packages({ selectedTests, onToggleSelect, onBookNow }) {
  const { packages, loading, error } = usePackages();

  const totalSelectedPrice = selectedTests.reduce((sum, item) => sum + (item.effectiveOfferPrice || item.offerPrice || 0), 0);

  return (
    <div className="packages-page container section">
      <div className="packages-header">
        <h1 className="page-title">Health Checkup Packages</h1>
        <p className="page-subtitle">Select from our comprehensive wellness plans. From basic checks to advanced whole-body packages.</p>
      </div>

      {error && <div className="error-alert">{error}</div>}

      {loading ? (
        <LoadingSpinner />
      ) : packages.length === 0 ? (
        <div className="no-results-alert">
          <h3>No packages available currently.</h3>
          <p>Please check back later or contact lab support.</p>
        </div>
      ) : (
        <div className="grid grid-3">
          {packages.map(pkg => (
            <PackageCard
              key={pkg._id}
              pkg={pkg}
              isSelected={selectedTests.some(t => t._id === pkg._id)}
              onToggleSelect={onToggleSelect}
              onBookNow={onBookNow}
            />
          ))}
        </div>
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
