import React, { useState } from 'react';
import './SearchBar.css';

const SearchBar = ({ onSearch, placeholder = 'Поиск...', className = '' }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const handleChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    onSearch(value);
  };

  const handleClear = () => {
    setSearchTerm('');
    onSearch('');
  };

  return (
    <div className={`search-bar ${className}`}>
      <div className="search-input-container">
        <span className="search-icon">🔍</span>
        <input
          type="text"
          className="search-input"
          placeholder={placeholder}
          value={searchTerm}
          onChange={handleChange}
        />
        {searchTerm && (
          <button className="search-clear" onClick={handleClear} type="button">
            ✕
          </button>
        )}
      </div>
    </div>
  );
};

export default SearchBar;
