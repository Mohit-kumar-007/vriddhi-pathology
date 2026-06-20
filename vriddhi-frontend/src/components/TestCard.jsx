import React from 'react';
import formatPrice from '../utils/formatPrice';
import './TestCard.css';

export default function TestCard({ test, isSelected, onToggleSelect, onBookNow }) {
  const { testCode, testName, category, sampleType, mrp, effectiveOfferPrice, description } = test;
  const discountPercent = Math.round(((mrp - effectiveOfferPrice) / mrp) * 100);

  return (
    <div className={`card test-card ${isSelected ? 'selected-card' : ''}`}>
      {discountPercent > 0 && (
        <span className="discount-tag">{discountPercent}% OFF</span>
      )}
      
      <div className="test-meta">
        <span className="test-code">{testCode}</span>
        <span className="test-category">{category}</span>
      </div>

      <h3 className="test-title" title={testName}>{testName}</h3>
      
      {description && <p className="test-desc">{description}</p>}
      
      <div className="sample-info">
        <span className="sample-icon">🧪</span>
        <span>Sample: {sampleType}</span>
      </div>

      <div className="test-pricing-wrapper">
        <div className="price-row">
          <span className="price-mrp">{formatPrice(mrp)}</span>
          <span className="price-offer">{formatPrice(effectiveOfferPrice)}</span>
        </div>
      </div>

      <div className="card-actions">
        <button 
          onClick={() => onToggleSelect(test)} 
          className={`btn btn-sm ${isSelected ? 'btn-primary' : 'btn-outline'}`}
          style={{ flex: 1 }}
        >
          {isSelected ? '✓ Selected' : '+ Add Test'}
        </button>
        <button 
          onClick={() => onBookNow(test)} 
          className="btn btn-sm btn-gold"
          style={{ flex: 1 }}
        >
          Book Now
        </button>
      </div>
    </div>
  );
}
