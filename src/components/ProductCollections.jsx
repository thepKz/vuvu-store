import React from 'react';
import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import '../styles/ProductCollections.css';

const ProductCollections = ({ onNavigate, onProductSelect }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, threshold: 0.1 });

  const collections = [
    {
      id: 'premium',
      name: 'Premium Collection',
      description: 'Bộ sưu tập cao cấp với chất liệu và thiết kế đặc biệt',
      image: '/images/lubu1.jpg',
      fallbackImage: 'https://images.pexels.com/photos/6195121/pexels-photo-6195121.jpeg?auto=compress&cs=tinysrgb&w=600',
      productCount: 8,
      priceRange: '500.000đ - 2.000.000đ',
      badge: 'Premium',
      color: '#ec4899',
      features: ['Chất liệu cao cấp', 'Thiết kế độc quyền', 'Packaging đặc biệt']
    },
    {
      id: 'limited',
      name: 'Limited Edition',
      description: 'Phiên bản giới hạn chỉ có tại Dudu Store',
      image: '/images/lubu2.jpg',
      fallbackImage: 'https://images.pexels.com/photos/6195121/pexels-photo-6195121.jpeg?auto=compress&cs=tinysrgb&w=600',
      productCount: 6,
      priceRange: '300.000đ - 1.500.000đ',
      badge: 'Limited',
      color: '#f59e0b',
      features: ['Số lượng giới hạn', 'Certificate kèm theo', 'Collector item']
    },
    {
      id: 'seasonal',
      name: 'Seasonal Collection',
      description: 'Bộ sưu tập theo mùa với thiết kế thời thượng',
      image: '/images/lubu3.jpg',
      fallbackImage: 'https://images.pexels.com/photos/6195121/pexels-photo-6195121.jpeg?auto=compress&cs=tinysrgb&w=600',
      productCount: 12,
      priceRange: '200.000đ - 800.000đ',
      badge: 'Seasonal',
      color: '#10b981',
      features: ['Thiết kế theo mùa', 'Màu sắc trendy', 'Giá cả hợp lý']
    },
    {
      id: 'classic',
      name: 'Classic Collection',
      description: 'Bộ sưu tập kinh điển với những mẫu mã được yêu thích',
      image: '/images/lubu4.jpg',
      fallbackImage: 'https://images.pexels.com/photos/6195121/pexels-photo-6195121.jpeg?auto=compress&cs=tinysrgb&w=600',
      productCount: 15,
      priceRange: '150.000đ - 600.000đ',
      badge: 'Classic',
      color: '#8b5cf6',
      features: ['Thiết kế kinh điển', 'Chất lượng ổn định', 'Giá tốt nhất']
    }
  ];

  const handleCollectionClick = (collection) => {
    onNavigate('products', { collection: collection.id });
  };

  return (
    <section className="product-collections" ref={ref}>
      <div className="container">
        <motion.div
          className="section-header"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
        >
          <div className="header-badge">
            <span className="badge-icon">🎨</span>
            <span>Bộ sưu tập</span>
          </div>
          <h2>Khám phá các bộ sưu tập</h2>
          <p>Mỗi bộ sưu tập mang một câu chuyện và phong cách riêng biệt</p>
        </motion.div>

        <div className="collections-grid">
          {collections.map((collection, index) => (
            <motion.div
              key={collection.id}
              className="collection-card"
              initial={{ opacity: 0, y: 40 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: index * 0.15 }}
              whileHover={{ y: -10, scale: 1.02 }}
              onClick={() => handleCollectionClick(collection)}
              style={{ '--collection-color': collection.color }}
            >
              {/* Collection Badge */}
              <motion.div 
                className="collection-badge"
                initial={{ scale: 0, rotate: -10 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ delay: 0.5 + index * 0.1, type: "spring" }}
              >
                {collection.badge}
              </motion.div>

              {/* Collection Image */}
              <div className="collection-image-container">
                <motion.img 
                  src={collection.image} 
                  alt={collection.name}
                  className="collection-image"
                  whileHover={{ scale: 1.1 }}
                  transition={{ duration: 0.4 }}
                  onError={(e) => {
                    e.target.src = collection.fallbackImage;
                  }}
                />
                <div className="image-overlay">
                  <motion.button
                    className="explore-btn"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                      <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" strokeWidth="2"/>
                    </svg>
                    Khám phá
                  </motion.button>
                </div>
                <div className="collection-glow"></div>
              </div>

              {/* Collection Info */}
              <div className="collection-info">
                <div className="collection-header">
                  <h3>{collection.name}</h3>
                  <div className="collection-stats">
                    <span className="product-count">{collection.productCount} sản phẩm</span>
                    <span className="price-range">{collection.priceRange}</span>
                  </div>
                </div>

                <p className="collection-description">{collection.description}</p>

                <div className="collection-features">
                  {collection.features.map((feature, featureIndex) => (
                    <motion.div
                      key={featureIndex}
                      className="feature-tag"
                      initial={{ opacity: 0, x: -20 }}
                      animate={isInView ? { opacity: 1, x: 0 } : {}}
                      transition={{ delay: 0.8 + index * 0.1 + featureIndex * 0.05 }}
                    >
                      <span className="feature-icon">✓</span>
                      {feature}
                    </motion.div>
                  ))}
                </div>

                <motion.button
                  className="view-collection-btn"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Xem bộ sưu tập
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                    <path d="M9 18L15 12L9 6" stroke="currentColor" strokeWidth="2"/>
                  </svg>
                </motion.button>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Collections Summary */}
        <motion.div
          className="collections-summary"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 1 }}
        >
          <div className="summary-stats">
            <div className="stat-item">
              <span className="stat-number">41</span>
              <span className="stat-label">Tổng sản phẩm</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">4</span>
              <span className="stat-label">Bộ sưu tập</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">1000+</span>
              <span className="stat-label">Khách hàng hài lòng</span>
            </div>
          </div>

          <motion.button
            className="explore-all-btn"
            onClick={() => onNavigate('products')}
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
          >
            <span>🎯</span>
            Khám phá tất cả
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" strokeWidth="2"/>
            </svg>
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
};

export default ProductCollections;