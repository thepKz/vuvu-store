import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSearch, usePopularSearches } from '../hooks/useSearch';
import '../styles/SearchComponent.css';

const SearchComponent = ({ onProductSelect, onNavigate }) => {
  const [isOpen, setIsOpen] = useState(false);
  const searchRef = useRef(null);
  const inputRef = useRef(null);

  const {
    query,
    results,
    suggestions,
    loading,
    error,
    totalResults,
    updateQuery,
    clearSearch
  } = useSearch();

  const { popularSearches } = usePopularSearches();

  // Handle search input focus
  const handleInputFocus = () => {
    setIsOpen(true);
  };

  // Handle suggestion click
  const handleSuggestionClick = (product) => {
    clearSearch();
    setIsOpen(false);
    onProductSelect(product);
    onNavigate('product-detail');
  };

  // Handle popular search click
  const handlePopularSearchClick = (searchTerm) => {
    updateQuery(searchTerm);
    setIsOpen(false);
    onNavigate('products', { search: searchTerm });
  };

  // Handle search submit
  const handleSubmit = (e) => {
    e.preventDefault();
    if (query.trim()) {
      setIsOpen(false);
      onNavigate('products', { search: query });
    }
  };

  // Close search when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="search-component" ref={searchRef}>
      <form className="search-form" onSubmit={handleSubmit}>
        <div className="search-input-container">
          <svg className="search-icon" width="20" height="20" viewBox="0 0 24 24" fill="none">
            <circle cx="11" cy="11" r="8" stroke="currentColor" strokeWidth="2"/>
            <path d="M21 21L16.65 16.65" stroke="currentColor" strokeWidth="2"/>
          </svg>
          
          <input
            ref={inputRef}
            type="text"
            className="search-input"
            placeholder="Tìm kiếm squishy..."
            value={query}
            onChange={(e) => updateQuery(e.target.value)}
            onFocus={handleInputFocus}
          />
          
          {loading && (
            <motion.div 
              className="search-loading"
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" strokeDasharray="60" strokeDashoffset="60"/>
              </svg>
            </motion.div>
          )}
          
          {query && (
            <button
              type="button"
              className="search-clear"
              onClick={() => {
                clearSearch();
                setIsOpen(false);
                inputRef.current?.focus();
              }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <line x1="18" y1="6" x2="6" y2="18" stroke="currentColor" strokeWidth="2"/>
                <line x1="6" y1="6" x2="18" y2="18" stroke="currentColor" strokeWidth="2"/>
              </svg>
            </button>
          )}
        </div>
      </form>

      {/* Search Dropdown */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="search-dropdown"
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
          >
            {/* Search Results */}
            {query && results.length > 0 && (
              <div className="search-section">
                <div className="section-header">
                  <span>Kết quả tìm kiếm ({totalResults})</span>
                </div>
                <div className="results-list">
                  {results.slice(0, 5).map((product, index) => (
                    <motion.div
                      key={product.id}
                      className="result-item"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      onClick={() => handleSuggestionClick(product)}
                    >
                      <div className="result-image">
                        <img src={product.image} alt={product.name} />
                      </div>
                      <div className="result-info">
                        <h4>{product.name}</h4>
                        <p className="result-price">{product.price}</p>
                      </div>
                      <svg className="result-arrow" width="16" height="16" viewBox="0 0 24 24" fill="none">
                        <path d="M9 18L15 12L9 6" stroke="currentColor" strokeWidth="2"/>
                      </svg>
                    </motion.div>
                  ))}
                </div>
                {totalResults > 5 && (
                  <div className="view-all-results">
                    <button 
                      onClick={() => {
                        setIsOpen(false);
                        onNavigate('products', { search: query });
                      }}
                    >
                      Xem tất cả {totalResults} kết quả
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* No Results */}
            {query && results.length === 0 && !loading && (
              <div className="search-section">
                <div className="no-results">
                  <div className="no-results-icon">🔍</div>
                  <h4>Không tìm thấy kết quả</h4>
                  <p>Thử tìm kiếm với từ khóa khác</p>
                </div>
              </div>
            )}

            {/* Popular Searches */}
            {!query && popularSearches.length > 0 && (
              <div className="search-section">
                <div className="section-header">
                  <span>Tìm kiếm phổ biến</span>
                </div>
                <div className="popular-searches">
                  {popularSearches.slice(0, 8).map((search, index) => (
                    <motion.button
                      key={index}
                      className="popular-search-tag"
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: index * 0.05 }}
                      onClick={() => handlePopularSearchClick(search)}
                    >
                      <span className="search-icon">🔥</span>
                      {search}
                    </motion.button>
                  ))}
                </div>
              </div>
            )}

            {/* Quick Actions */}
            <div className="search-section">
              <div className="quick-actions">
                <button 
                  className="quick-action"
                  onClick={() => {
                    setIsOpen(false);
                    onNavigate('products');
                  }}
                >
                  <span>🛍️</span>
                  Xem tất cả sản phẩm
                </button>
                <button 
                  className="quick-action"
                  onClick={() => {
                    setIsOpen(false);
                    onNavigate('collections');
                  }}
                >
                  <span>🎨</span>
                  Bộ sưu tập
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SearchComponent;