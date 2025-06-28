import React from 'react';
import { motion } from 'framer-motion';
import '../styles/CategoryNavigation.css';

const CategoryNavigation = ({ selectedCategory, onCategoryChange, onNavigate }) => {
  const categories = [
    {
      id: 'all',
      name: 'Tất cả',
      icon: '🎯',
      count: 24,
      color: '#a855f7'
    },
    {
      id: 'premium',
      name: 'Premium',
      icon: '💎',
      count: 8,
      color: '#ec4899'
    },
    {
      id: 'limited',
      name: 'Limited Edition',
      icon: '⭐',
      count: 6,
      color: '#f59e0b'
    },
    {
      id: 'dimoo',
      name: 'DIMOO',
      icon: '🐱',
      count: 12,
      color: '#10b981'
    },
    {
      id: 'molly',
      name: 'MOLLY',
      icon: '🧸',
      count: 10,
      color: '#ef4444'
    },
    {
      id: 'labubu',
      name: 'LABUBU',
      icon: '🐰',
      count: 14,
      color: '#8b5cf6'
    }
  ];

  return (
    <section className="category-navigation">
      <div className="container">
        <motion.div
          className="section-header"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2>Khám phá theo danh mục</h2>
          <p>Tìm kiếm squishy yêu thích theo từng bộ sưu tập đặc biệt</p>
        </motion.div>

        <div className="categories-grid">
          {categories.map((category, index) => (
            <motion.div
              key={category.id}
              className={`category-card ${selectedCategory === category.id ? 'active' : ''}`}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ y: -8, scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => {
                onCategoryChange(category.id);
                onNavigate('products');
              }}
              style={{ '--category-color': category.color }}
            >
              <div className="category-icon">
                <span>{category.icon}</span>
              </div>
              <div className="category-info">
                <h3>{category.name}</h3>
                <p>{category.count} sản phẩm</p>
              </div>
              <div className="category-arrow">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <path d="M9 18L15 12L9 6" stroke="currentColor" strokeWidth="2"/>
                </svg>
              </div>
              <div className="category-glow"></div>
            </motion.div>
          ))}
        </div>

        <motion.div
          className="quick-actions"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.8 }}
        >
          <motion.button
            className="quick-action-btn"
            onClick={() => onNavigate('products')}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <span>🔍</span>
            Xem tất cả sản phẩm
          </motion.button>
          
          <motion.button
            className="quick-action-btn secondary"
            onClick={() => onNavigate('about')}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <span>ℹ️</span>
            Tìm hiểu thêm
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
};

export default CategoryNavigation;