import React, { useState, useEffect } from 'react';
import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import '../styles/ProductRecommendations.css';

import lubu1 from '../images/lubu1.jpg';
import lubu2 from '../images/lubu2.jpg';
import lubu3 from '../images/lubu3.jpg';
import lubu4 from '../images/lubu4.jpg';
import lubu5 from '../images/lubu5.jpg';
import lubu6 from '../images/lubu6.jpg';

const ProductRecommendations = ({ onNavigate, onProductSelect, currentProduct }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, threshold: 0.1 });
  const [recommendations, setRecommendations] = useState([]);

  // Mock recommendation algorithm
  useEffect(() => {
    const allProducts = [
      {
        id: 1,
        image: lubu1,
        name: "DIMOO Premium Collection",
        description: "Bộ sưu tập cao cấp với thiết kế độc đáo",
        price: "230.000đ",
        originalPrice: null,
        category: "dimoo",
        rating: 4.9,
        tags: ["premium", "limited", "cute"]
      },
      {
        id: 2,
        image: lubu2,
        name: "MOLLY Limited Edition",
        description: "Phiên bản giới hạn chỉ có tại Dudu Store",
        price: "805.000đ",
        originalPrice: "1.150.000đ",
        category: "molly",
        rating: 4.7,
        tags: ["limited", "sale", "popular"]
      },
      {
        id: 3,
        image: lubu3,
        name: "LABUBU Special Series",
        description: "Series đặc biệt với màu sắc độc đáo",
        price: "805.000đ",
        originalPrice: "1.150.000đ",
        category: "labubu",
        rating: 4.8,
        tags: ["special", "colorful", "trending"]
      },
      {
        id: 4,
        image: lubu4,
        name: "DIMOO Seasonal Collection",
        description: "Bộ sưu tập theo mùa với thiết kế thời thượng",
        price: "450.000đ",
        category: "dimoo",
        rating: 4.6,
        tags: ["seasonal", "trendy", "affordable"]
      },
      {
        id: 5,
        image: lubu5,
        name: "MOLLY Classic Series",
        description: "Series kinh điển được yêu thích nhất",
        price: "320.000đ",
        category: "molly",
        rating: 4.8,
        tags: ["classic", "bestseller", "affordable"]
      },
      {
        id: 6,
        image: lubu6,
        name: "LABUBU Collector Edition",
        description: "Phiên bản sưu tập dành cho collector",
        price: "950.000đ",
        originalPrice: "1.200.000đ",
        category: "labubu",
        rating: 4.9,
        tags: ["collector", "rare", "premium"]
      }
    ];

    // Simple recommendation logic
    let filtered = allProducts;
    
    if (currentProduct) {
      // Filter out current product
      filtered = filtered.filter(p => p.id !== currentProduct.id);
      
      // Prioritize same category
      const sameCategory = filtered.filter(p => p.category === currentProduct.category);
      const otherCategory = filtered.filter(p => p.category !== currentProduct.category);
      
      // Mix same category and others
      filtered = [...sameCategory.slice(0, 2), ...otherCategory.slice(0, 2)];
    }

    // Sort by rating and limit to 4
    const recommended = filtered
      .sort((a, b) => b.rating - a.rating)
      .slice(0, 4);

    setRecommendations(recommended);
  }, [currentProduct]);

  const handleProductClick = (product) => {
    onProductSelect(product);
    onNavigate('product-detail');
    window.scrollTo(0, 0);
  };

  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const productVariants = {
    hidden: { 
      opacity: 0, 
      y: 40,
      scale: 0.9
    },
    visible: { 
      opacity: 1, 
      y: 0,
      scale: 1,
      transition: {
        duration: 0.6,
        ease: [0.25, 0.46, 0.45, 0.94]
      }
    }
  };

  if (recommendations.length === 0) return null;

  return (
    <section className="product-recommendations" ref={ref}>
      <div className="container">
        <motion.div
          className="section-header"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
        >
          <div className="header-badge">
            <span className="badge-icon">🎯</span>
            <span>Gợi ý cho bạn</span>
          </div>
          <h2>Sản phẩm tương tự</h2>
          <p>Những sản phẩm khác bạn có thể thích</p>
        </motion.div>
        
        <motion.div 
          className="recommendations-grid"
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
        >
          {recommendations.map((product, index) => (
            <motion.div
              key={product.id}
              className="recommendation-card"
              variants={productVariants}
              whileHover={{ 
                y: -8,
                scale: 1.02,
                transition: { duration: 0.3 }
              }}
              onClick={() => handleProductClick(product)}
            >
              <div className="recommendation-product-image-container">
                <img src={product.image} alt={product.name} className="recommendation-product-image" />
                <motion.div 
                  className="recommendation-product-overlay"
                  initial={{ opacity: 0 }}
                  whileHover={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  <motion.button
                    className="recommendation-quick-view-btn"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                      <path d="M1 12C1 12 5 4 12 4C19 4 23 12 23 12C23 12 19 20 12 20C5 20 1 12 1 12Z" stroke="currentColor" strokeWidth="2"/>
                      <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="2"/>
                    </svg>
                  </motion.button>
                </motion.div>
              </div>
              
              <div className="recommendation-product-info">
                <h3 className="recommendation-product-name">{product.name}</h3>
                <p className="recommendation-product-description">{product.description}</p>
                
                <div className="recommendation-product-rating">
                  <div className="recommendation-rating-stars">
                    {[...Array(5)].map((_, i) => (
                      <span key={i} className={i < Math.floor(product.rating) ? 'filled' : ''}>
                        ⭐
                      </span>
                    ))}
                  </div>
                  <span className="recommendation-rating-value">({product.rating})</span>
                </div>
                
                <div className="recommendation-product-price">
                  <span className="recommendation-current-price">{product.price}</span>
                  {product.originalPrice && (
                    <span className="recommendation-original-price">{product.originalPrice}</span>
                  )}
                </div>

                <div className="recommendation-product-tags">
                  {product.tags.slice(0, 2).map((tag, tagIndex) => (
                    <span key={tagIndex} className="recommendation-product-tag">
                      {tag}
                    </span>
                  ))}
                </div>
                
                <motion.button
                  className="recommendation-view-product-btn"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={(e) => e.stopPropagation()}
                >
                  Xem chi tiết
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                    <path d="M9 18L15 12L9 6" stroke="currentColor" strokeWidth="2"/>
                  </svg>
                </motion.button>
              </div>
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          className="section-footer"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          <motion.button
            className="view-all-btn"
            onClick={() => onNavigate('products')}
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
          >
            <span>🛍️</span>
            Xem tất cả sản phẩm
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" strokeWidth="2"/>
            </svg>
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
};

export default ProductRecommendations;