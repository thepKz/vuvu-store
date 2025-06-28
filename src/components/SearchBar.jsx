import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { productsAPI } from '../services/api';
import { useApi } from '../hooks/useApi';
import '../styles/SearchBar.css';

const SearchBar = ({ onProductSelect, onNavigate }) => {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const searchRef = useRef(null);
  const inputRef = useRef(null);

  const { execute: searchProducts, loading } = useApi(productsAPI.search);

  // Handle search input
  const handleInputChange = async (e) => {
    const value = e.target.value;
    setQuery(value);

    if (value.length >= 2) {
      try {
        const results = await searchProducts(value, { limit: 5 });
        setSuggestions(results.items || []);
        setIsOpen(true);
      } catch (error) {
        console.error('Search error:', error);
        setSuggestions([]);
      }
    } else {
      setSuggestions([]);
      setIsOpen(false);
    }
  };

  // Handle suggestion click
  const handleSuggestionClick = (product) => {
    setQuery('');
    setIsOpen(false);
    onProductSelect(product);
    onNavigate('product-detail');
  };

  // Handle search submit
  const handleSubmit = (e) => {
    e.preventDefault();
    if (query.trim()) {
      setIsOpen(false);
      onNavigate('products', { search: query });
    }
  };

  // Close suggestions when clicking outside
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
    <div className="search-container" ref={searchRef}>
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
            onChange={handleInputChange}
            onFocus={() => query.length >= 2 && setIsOpen(true)}
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
                setQuery('');
                setSuggestions([]);
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

      {/* Search Suggestions */}
      <AnimatePresence>
        {isOpen && suggestions.length > 0 && (
          <motion.div
            className="search-suggestions"
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
          >
            <div className="suggestions-header">
              <span>Gợi ý tìm kiếm</span>
            </div>
            
            <div className="suggestions-list">
              {suggestions.map((product, index) => (
                <motion.div
                  key={product.id}
                  className="suggestion-item"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  onClick={() => handleSuggestionClick(product)}
                  whileHover={{ backgroundColor: 'rgba(168, 85, 247, 0.05)' }}
                >
                  <div className="suggestion-image">
                    <img src={product.image} alt={product.name} />
                  </div>
                  <div className="suggestion-info">
                    <h4>{product.name}</h4>
                    <p className="suggestion-price">{product.price}</p>
                  </div>
                  <svg className="suggestion-arrow" width="16" height="16" viewBox="0 0 24 24" fill="none">
                    <path d="M9 18L15 12L9 6" stroke="currentColor" strokeWidth="2"/>
                  </svg>
                </motion.div>
              ))}
            </div>
            
            {query && (
              <div className="suggestions-footer">
                <button 
                  className="view-all-results"
                  onClick={() => {
                    setIsOpen(false);
                    onNavigate('products', { search: query });
                  }}
                >
                  Xem tất cả kết quả cho "{query}"
                </button>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SearchBar;