import React from 'react';
import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import '../styles/PopMartProducts.css';

import lubu1 from '../images/lubu1.jpg';
import lubu2 from '../images/lubu2.jpg';
import lubu3 from '../images/lubu3.jpg';
import lubu4 from '../images/lubu4.jpg';
import lubu5 from '../images/lubu5.jpg';
import lubu6 from '../images/lubu6.jpg';

const PopMartProducts = ({ onNavigate, onProductSelect }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, threshold: 0.1 });

  const products = [
    {
      id: 1,
      image: lubu1,
      name: "DIMOO Premium Collection",
      price: "230.000đ",
      originalPrice: null,
      rating: 4.9
    },
    {
      id: 2,
      image: lubu2,
      name: "DIMOO Limited Edition",
      price: "253.000đ",
      originalPrice: null,
      rating: 4.8
    },
    {
      id: 3,
      image: lubu3,
      name: "MOLLY Exclusive Series",
      price: "805.000đ",
      originalPrice: "1.150.000đ",
      rating: 4.7
    },
    {
      id: 4,
      image: lubu4,
      name: "MOLLY Deluxe Collection",
      price: "805.000đ",
      originalPrice: "1.150.000đ",
      rating: 4.9
    },
    {
      id: 5,
      image: lubu5,
      name: "LABUBU Special Edition",
      price: "805.000đ",
      originalPrice: "1.150.000đ",
      rating: 4.8
    },
    {
      id: 6,
      image: lubu6,
      name: "LABUBU Collector Series",
      price: "805.000đ",
      originalPrice: "1.150.000đ",
      rating: 4.6
    }
  ];

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

  const handleProductClick = (product) => {
    if (onProductSelect && onNavigate) {
      onProductSelect(product);
      onNavigate('product-detail');
      window.scrollTo(0, 0);
    }
  };

  const handleViewAllProducts = () => {
    if (onNavigate) {
      onNavigate('products');
      window.scrollTo(0, 0);
    }
  };

  return (
    <section className="products-section" ref={ref}>
      <div className="container">
        <motion.div
          className="section-header"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
        >
          <div className="section-badge">
            <div className="badge-dot"></div>
            <span>Sản phẩm nổi bật</span>
          </div>
          <h2 className="section-title">Bộ sưu tập đặc biệt</h2>
        </motion.div>
        
        <motion.div 
          className="products-grid"
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
        >
          {products.map((product) => (
            <motion.div
              key={product.id}
              className="product-card"
              variants={productVariants}
              whileHover={{ 
                y: -4,
                transition: { duration: 0.2 }
              }}
              onClick={() => handleProductClick(product)}
            >
              <div className="product-image-container">
                <img 
                  src={product.image} 
                  alt={product.name} 
                  className="product-image"
                  onError={(e) => {
                    e.target.src = 'https://via.placeholder.com/300x300?text=Image+Not+Found';
                  }}
                />
                <motion.div 
                  className="product-overlay"
                  initial={{ opacity: 0 }}
                  whileHover={{ opacity: 1 }}
                  transition={{ duration: 0.2 }}
                >
                  <motion.button
                    className="quick-view-btn"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleProductClick(product);
                    }}
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                      <path d="M1 12C1 12 5 4 12 4C19 4 23 12 23 12C23 12 19 20 12 20C5 20 1 12 1 12Z" stroke="currentColor" strokeWidth="2"/>
                      <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="2"/>
                    </svg>
                  </motion.button>
                </motion.div>
              </div>
              
              <div className="product-info">
                <div className="product-header">
                  <h3 className="product-name">{product.name}</h3>
                  <div className="product-rating">
                    <div className="rating-stars">
                      {[...Array(5)].map((_, i) => (
                        <span key={i} className={i < Math.floor(product.rating) ? 'filled' : ''}>
                          ⭐
                        </span>
                      ))}
                    </div>
                    <span className="rating-value">({product.rating})</span>
                  </div>
                </div>
                
                <div className="product-price">
                  <span className="current-price">{product.price}</span>
                  {product.originalPrice && (
                    <span className="original-price">{product.originalPrice}</span>
                  )}
                </div>
                
                <motion.button
                  className="product-detail-btn"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleProductClick(product);
                  }}
                >
                  Chi tiết sản phẩm
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
            onClick={handleViewAllProducts}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <span>Xem tất cả sản phẩm</span>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" strokeWidth="2"/>
            </svg>
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
};

export default PopMartProducts;