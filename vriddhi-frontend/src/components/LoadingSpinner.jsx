import React from 'react';
import './LoadingSpinner.css';

export default function LoadingSpinner({ fullPage = false }) {
  const spinner = <div className="loading-spinner"></div>;

  if (fullPage) {
    return (
      <div className="full-page-spinner">
        {spinner}
      </div>
    );
  }

  return (
    <div className="inline-spinner">
      {spinner}
    </div>
  );
}
