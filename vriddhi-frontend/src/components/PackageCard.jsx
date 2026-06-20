import React from 'react';
import formatPrice from '../utils/formatPrice';
import './PackageCard.css';

export default function PackageCard({ pkg, isSelected, onToggleSelect, onBookNow }) {
  const { name, targetGender, includedTests, mrp, offerPrice, badge } = pkg;
  const discountPercent = Math.round(((mrp - offerPrice) / mrp) * 100);

  return (
    <div className={`card package-card ${isSelected ? 'selected-package-card' : ''}`}>
      {badge && (
        <span className={`package-badge ${badge === 'Most Popular' ? 'badge-popular' : badge === 'Best Value' ? 'badge-value' : 'badge-allergy'}`}>
          {badge}
        </span>
      )}

      <div className="package-header">
        <h3 className="package-title">{name}</h3>
        <span className="gender-tag">Target: {targetGender}</span>
      </div>

      <div className="package-includes-wrapper">
        <h4 className="includes-title">Includes {includedTests.length} Tests:</h4>
        <ul className="includes-list">
          {includedTests.slice(0, 5).map((testName, idx) => (
            <li key={idx} className="includes-item">
              <span className="bullet">✓</span> {testName}
            </li>
          ))}
          {includedTests.length > 5 && (
            <li className="includes-more">
              + {includedTests.length - 5} more tests...
            </li>
          )}
        </ul>
      </div>

      <div className="package-footer-wrapper">
        <div className="pricing-info">
          <span className="price-mrp">{formatPrice(mrp)}</span>
          <span className="price-offer">{formatPrice(offerPrice)}</span>
          {discountPercent > 0 && (
            <span className="discount-lbl">{discountPercent}% OFF</span>
          )}
        </div>
        
        <div className="package-actions">
          <button 
            onClick={() => onToggleSelect(pkg)} 
            className={`btn btn-sm ${isSelected ? 'btn-primary' : 'btn-outline'}`}
            style={{ flex: 1 }}
          >
            {isSelected ? '✓ Selected' : '+ Add Package'}
          </button>
          <button 
            onClick={() => onBookNow(pkg)} 
            className="btn btn-sm btn-gold"
            style={{ flex: 1 }}
          >
            Book Now
          </button>
        </div>
      </div>
    </div>
  );
}
