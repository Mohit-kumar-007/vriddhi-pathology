import React, { useState, useEffect, useRef } from 'react';
import './SearchBar.css';

export default function SearchBar({ onSearch, placeholder = "Search for blood tests, thyroid, lipid profile..." }) {
  const [searchTerm, setSearchTerm] = useState('');
  const isFirstRender = useRef(true);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    const delayDebounce = setTimeout(() => {
      onSearch(searchTerm);
    }, 300);

    return () => clearTimeout(delayDebounce);
  }, [searchTerm, onSearch]);

  return (
    <div className="search-bar-wrapper">
      <span className="search-icon">🔍</span>
      <input
        type="text"
        className="search-input"
        placeholder={placeholder}
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      {searchTerm && (
        <button className="clear-search-btn" onClick={() => setSearchTerm('')}>
          ✕
        </button>
      )}
    </div>
  );
}
