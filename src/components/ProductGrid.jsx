import React from 'react';
import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import '../styles/ProductGrid.css';

import lubu1 from '../images/lubu1.jpg';
import lubu2 from '../images/lubu2.jpg';
import lubu3 from '../images/lubu3.jpg';
import lubu4 from '../images/lubu4.jpg';
import lubu5 from '../images/lubu5.jpg';
import lubu6 from '../images/lubu6.jpg';
import lubu7 from '../images/lubu7.jpg';
import lubu8 from '../images/lubu8.jpg';

const ProductGrid = ({ onNavigate, onProductSelect }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, threshold: 0.1 });

  const products = [
    {
      id: 1,
      image: lubu1,
      name: "DIMOO",
      description: "Squishy Vương Quốc Động Vật",
      price: "230.000đ",
      originalPrice: null,
      badge: "Mới"
    },
    {
      id: 2,
      image: lubu2,
      name: "DIMOO",
      description: "Squishy Thỏ Nghỉ Lễ",
      price: "253.000đ",
      originalPrice: null,
      badge: "Hot"
    },
    {
      id: 3,
      image: lubu3,
      name: "MOLLY",
      description: "MOLLY SQUISHY KHỔNG LỒ 100% Loạt 2-B",
      price: "805.000đ",
      originalPrice: "1.150.000đ",
      badge: "Sale"
    },
    {
      id: 4,
      image: lubu4,
      name: "MOLLY",
      description: "MOLLY SQUISHY KHỔNG LỒ 100% Loạt 2-C",
      price: "805.000đ",
      originalPrice: "1.150.000đ",
      badge: "Sale"
    },
    {
      id: 5,
      image: lubu5,
      name: "LABUBU",
      description: "LABUBU SQUISHY KHỔNG LỒ 100% Loạt 2-C",
      price: "805.000đ",
      originalPrice: "1.150.000đ",
      badge: "Sale"
    },
    {
      id: 6,
      image: lubu6,
      name: "LABUBU",
      description: "LABUBU SQUISHY KHỔNG LỒ 100% Loạt 2-D",
      price: "805.000đ",
      originalPrice: "1.150.000đ",
      badge: "Sale"
    },
    {
      id: 7,
      image: lubu7,
      name: "LABUBU",
      description: "LABUBU SQUISHY KHỔNG LỒ 100% Loạt 2-E",
      price: "805.000đ",
      originalPrice: "1.150.000đ",
      badge: "Sale"
    },
    {
      id: 8,
      image: lubu8,
      name: "LABUBU",
      description: "LABUBU SQUISHY KHỔNG LỒ 100% Loạt 2-F",
      price: "805.000đ",
      originalPrice: "1.150.000đ",
      badge: "Sale"
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
      y: 50,
      scale: 0.9
    },
    visible: { 
      opacity: 1, 
      y: 0,
      scale: 1,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    }
  };

  const handleProductClick = (product) => {
    if (onProductSelect && onNavigate) {
      onProductSelect(product);
      onNavigate('product-detail');
      // Scroll to top when navigating to product detail
      window.scrollTo(0, 0);
    }
  };

  const handleViewAllProducts = () => {
    if (onNavigate) {
      onNavigate('products');
      // Scroll to top when navigating to products page
      window.scrollTo(0, 0);
    }
  };

  return (
    <section className="products-section" id="products" ref={ref}>
      <div className="container">
        <motion.div
          className="section-header"
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <h2 className="section-title">🛍️ Sản phẩm thịnh hành 🛍️</h2>
          <p className="section-subtitle">
            Khám phá bộ sưu tập squishy đa dạng và chất lượng cao
          </p>
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
                y: -10,
                transition: { duration: 0.3 }
              }}
              onClick={() => handleProductClick(product)}
            >
              {product.badge && (
                <motion.div 
                  className={`product-badge badge-${product.badge.toLowerCase()}`}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.5, type: "spring" }}
                >
                  {product.badge}
                </motion.div>
              )}
              
              <motion.div 
                className="product-image-container"
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.3 }}
              >
                <img src={product.image} alt={product.description} className="product-image" />
                <motion.div 
                  className="product-overlay"
                  initial={{ opacity: 0 }}
                  whileHover={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  <motion.button
                    className="quick-view-btn"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <span>👁️</span>
                    Xem nhanh
                  </motion.button>
                </motion.div>
              </motion.div>
              
              <div className="product-info">
                <motion.h3 
                  className="product-brand"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  {product.name}
                </motion.h3>
                <motion.p 
                  className="product-description"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                >
                  {product.description}
                </motion.p>
                <motion.div 
                  className="product-price"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4 }}
                >
                  {product.originalPrice && (
                    <span className="original-price">{product.originalPrice}</span>
                  )}
                  <span className="current-price">{product.price}</span>
                </motion.div>
                
                <motion.button
                  className="add-to-cart-btn"
                  whileHover={{ 
                    scale: 1.05,
                    boxShadow: "0 10px 25px rgba(255, 107, 157, 0.3)"
                  }}
                  whileTap={{ scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                >
                  <span>🛒</span>
                  Thêm vào giỏ
                </motion.button>
              </div>
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          className="section-footer"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.8 }}
          style={{ textAlign: 'center', marginTop: '50px' }}
        >
          <motion.button
            className="btn btn-primary"
            onClick={handleViewAllProducts}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            style={{
              padding: '15px 40px',
              fontSize: '1.1rem',
              fontWeight: '700'
            }}
          >
            🛍️ Xem tất cả sản phẩm
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
};

export default ProductGrid;