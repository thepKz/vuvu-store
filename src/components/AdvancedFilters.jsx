import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSearchFilters } from '../hooks/useSearch';
import '../styles/AdvancedFilters.css';

const AdvancedFilters = ({ filters, onFiltersChange, onClose }) => {
  const { availableFilters } = useSearchFilters();
  const [localFilters, setLocalFilters] = useState(filters);

  const handleFilterChange = (filterType, value) => {
    setLocalFilters(prev => ({
      ...prev,
      [filterType]: value
    }));
  };

  const handleApplyFilters = () => {
    onFiltersChange(localFilters);
    onClose();
  };

  const handleResetFilters = () => {
    setLocalFilters({});
    onFiltersChange({});
  };

  const getActiveFiltersCount = () => {
    return Object.values(localFilters).filter(value => 
      value !== undefined && value !== null && value !== ''
    ).length;
  };

  return (
    <motion.div
      className="filters-overlay"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        className="filters-panel"
        initial={{ x: '100%' }}
        animate={{ x: 0 }}
        exit={{ x: '100%' }}
        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="filters-header">
          <h3>Bộ lọc tìm kiếm</h3>
          <button className="close-btn" onClick={onClose}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <line x1="18" y1="6" x2="6" y2="18" stroke="currentColor" strokeWidth="2"/>
              <line x1="6" y1="6" x2="18" y2="18" stroke="currentColor" strokeWidth="2"/>
            </svg>
          </button>
        </div>

        <div className="filters-content">
          {/* Categories Filter */}
          <div className="filter-group">
            <h4>Danh mục</h4>
            <div className="filter-options">
              {availableFilters.categories?.map((category) => (
                <motion.button
                  key={category.id}
                  className={`filter-option ${localFilters.category === category.id ? 'active' : ''}`}
                  onClick={() => handleFilterChange('category', 
                    localFilters.category === category.id ? null : category.id
                  )}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <span>{category.name}</span>
                  <span className="option-count">({category.count})</span>
                </motion.button>
              ))}
            </div>
          </div>

          {/* Price Range Filter */}
          <div className="filter-group">
            <h4>Khoảng giá</h4>
            <div className="filter-options">
              {availableFilters.priceRanges?.map((range) => (
                <motion.button
                  key={range.id}
                  className={`filter-option ${localFilters.priceRange === range.id ? 'active' : ''}`}
                  onClick={() => handleFilterChange('priceRange', 
                    localFilters.priceRange === range.id ? null : range.id
                  )}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {range.name}
                </motion.button>
              ))}
            </div>
          </div>

          {/* Sort Options */}
          <div className="filter-group">
            <h4>Sắp xếp theo</h4>
            <div className="filter-options">
              {availableFilters.sortOptions?.map((option) => (
                <motion.button
                  key={option.id}
                  className={`filter-option ${localFilters.sortBy === option.id ? 'active' : ''}`}
                  onClick={() => handleFilterChange('sortBy', option.id)}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {option.name}
                </motion.button>
              ))}
            </div>
          </div>

          {/* Additional Filters */}
          <div className="filter-group">
            <h4>Bộ lọc khác</h4>
            <div className="filter-toggles">
              <motion.label 
                className="filter-toggle"
                whileHover={{ scale: 1.02 }}
              >
                <input
                  type="checkbox"
                  checked={localFilters.inStock || false}
                  onChange={(e) => handleFilterChange('inStock', e.target.checked)}
                />
                <span className="toggle-slider"></span>
                <span className="toggle-label">Chỉ hiển thị có sẵn</span>
              </motion.label>

              <motion.label 
                className="filter-toggle"
                whileHover={{ scale: 1.02 }}
              >
                <input
                  type="checkbox"
                  checked={localFilters.onSale || false}
                  onChange={(e) => handleFilterChange('onSale', e.target.checked)}
                />
                <span className="toggle-slider"></span>
                <span className="toggle-label">Đang giảm giá</span>
              </motion.label>

              <motion.label 
                className="filter-toggle"
                whileHover={{ scale: 1.02 }}
              >
                <input
                  type="checkbox"
                  checked={localFilters.newArrivals || false}
                  onChange={(e) => handleFilterChange('newArrivals', e.target.checked)}
                />
                <span className="toggle-slider"></span>
                <span className="toggle-label">Sản phẩm mới</span>
              </motion.label>
            </div>
          </div>
        </div>

        <div className="filters-footer">
          <div className="filters-summary">
            {getActiveFiltersCount() > 0 && (
              <span className="active-filters-count">
                {getActiveFiltersCount()} bộ lọc đang áp dụng
              </span>
            )}
          </div>
          
          <div className="filters-actions">
            <motion.button
              className="reset-btn"
              onClick={handleResetFilters}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              disabled={getActiveFiltersCount() === 0}
            >
              Đặt lại
            </motion.button>
            
            <motion.button
              className="apply-btn"
              onClick={handleApplyFilters}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Áp dụng bộ lọc
            </motion.button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default AdvancedFilters;