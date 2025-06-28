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
      name: "DIMOO Premium",
      description: "Squishy Vương Quốc Động Vật - Phiên bản cao cấp với chất liệu mềm mại tuyệt vời",
      price: "230.000đ",
      originalPrice: null,
      badge: "Mới",
      category: "premium",
      rating: 4.9
    },
    {
      id: 2,
      image: lubu2,
      name: "DIMOO Limited",
      description: "Squishy Thỏ Nghỉ Lễ - Bộ sưu tập giới hạn dành cho những người sành điệu",
      price: "253.000đ",
      originalPrice: null,
      badge: "Hot",
      category: "limited",
      rating: 4.8
    },
    {
      id: 3,
      image: lubu3,
      name: "MOLLY Exclusive",
      description: "MOLLY SQUISHY KHỔNG LỒ - Bộ sưu tập độc quyền với thiết kế tinh xảo",
      price: "805.000đ",
      originalPrice: "1.150.000đ",
      badge: "Sale",
      category: "exclusive",
      rating: 4.7
    },
    {
      id: 4,
      image: lubu4,
      name: "MOLLY Deluxe",
      description: "MOLLY SQUISHY KHỔNG LỒ - Phiên bản deluxe với chất lượng vượt trội",
      price: "805.000đ",
      originalPrice: "1.150.000đ",
      badge: "Sale",
      category: "deluxe",
      rating: 4.9
    },
    {
      id: 5,
      image: lubu5,
      name: "LABUBU Special",
      description: "LABUBU SQUISHY KHỔNG LỒ - Bộ sưu tập đặc biệt cho những tín đồ squishy",
      price: "805.000đ",
      originalPrice: "1.150.000đ",
      badge: "Sale",
      category: "special",
      rating: 4.8
    },
    {
      id: 6,
      image: lubu6,
      name: "LABUBU Collector",
      description: "LABUBU SQUISHY KHỔNG LỒ - Dành cho nhà sưu tập với giá trị đặc biệt",
      price: "805.000đ",
      originalPrice: "1.150.000đ",
      badge: "Sale",
      category: "collector",
      rating: 4.9
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
      scale: 0.95
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
    <section className="products-section" id="products" ref={ref}>
      <div className="container">
        <motion.div
          className="section-header"
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
          <div className="section-badge">
            <span className="badge-dot"></span>
            <span>Bộ sưu tập nổi bật</span>
          </div>
          <h2 className="section-title">Sản phẩm được yêu thích nhất</h2>
          <p className="section-subtitle">
            Khám phá những sản phẩm squishy cao cấp được thiết kế đặc biệt cho phụ nữ hiện đại. 
            Mỗi sản phẩm đều mang đến chất lượng tuyệt vời và vẻ đẹp tinh tế.
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
                y: -8,
                transition: { duration: 0.3 }
              }}
              onClick={() => handleProductClick(product)}
            >
              {product.badge && (
                <motion.div 
                  className={`product-badge badge-${product.badge.toLowerCase()}`}
                  initial={{ scale: 0, rotate: -10 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ delay: 0.5, type: "spring", stiffness: 200 }}
                >
                  {product.badge}
                </motion.div>
              )}
              
              <motion.div 
                className="product-image-container"
                whileHover={{ scale: 1.02 }}
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
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                      <path d="M1 12C1 12 5 4 12 4C19 4 23 12 23 12C23 12 19 20 12 20C5 20 1 12 1 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="2"/>
                    </svg>
                    <span>Xem chi tiết</span>
                  </motion.button>
                </motion.div>
              </motion.div>
              
              <div className="product-info">
                <div className="product-header">
                  <motion.h3 
                    className="product-name"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                  >
                    {product.name}
                  </motion.h3>
                  <div className="product-rating">
                    <div className="rating-stars">
                      {[...Array(5)].map((_, i) => (
                        <svg key={i} width="14" height="14" viewBox="0 0 24 24" fill={i < Math.floor(product.rating) ? "currentColor" : "none"}>
                          <path d="M12 2L15.09 8.26L22 9L16 14.74L17.18 21.02L12 18.77L6.82 21.02L8 14.74L2 9L8.91 8.26L12 2Z" stroke="currentColor" strokeWidth="1"/>
                        </svg>
                      ))}
                    </div>
                    <span className="rating-value">{product.rating}</span>
                  </div>
                </div>
                
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
                  <span className="current-price">{product.price}</span>
                  {product.originalPrice && (
                    <span className="original-price">{product.originalPrice}</span>
                  )}
                  {product.originalPrice && (
                    <span className="discount-badge">
                      -{Math.round((1 - parseInt(product.price.replace(/\D/g, '')) / parseInt(product.originalPrice.replace(/\D/g, ''))) * 100)}%
                    </span>
                  )}
                </motion.div>
                
                <motion.button
                  className="add-to-cart-btn"
                  whileHover={{ 
                    scale: 1.02,
                    boxShadow: "0 8px 25px rgba(168, 85, 247, 0.25)"
                  }}
                  whileTap={{ scale: 0.98 }}
                  transition={{ duration: 0.2 }}
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                    <path d="M9 22C9.55228 22 10 21.5523 10 21C10 20.4477 9.55228 20 9 20C8.44772 20 8 20.4477 8 21C8 21.5523 8.44772 22 9 22Z" stroke="currentColor" strokeWidth="2"/>
                    <path d="M20 22C20.5523 22 21 21.5523 21 21C21 20.4477 20.5523 20 20 20C19.4477 20 19 20.4477 19 21C19 21.5523 19.4477 22 20 22Z" stroke="currentColor" strokeWidth="2"/>
                    <path d="M1 1H5L7.68 14.39C7.77144 14.8504 8.02191 15.264 8.38755 15.5583C8.75318 15.8526 9.2107 16.009 9.68 16H19.4C19.8693 16.009 20.3268 15.8526 20.6925 15.5583C21.0581 15.264 21.3086 14.8504 21.4 14.39L23 6H6" stroke="currentColor" strokeWidth="2"/>
                  </svg>
                  <span>Thêm vào giỏ hàng</span>
                </motion.button>
              </div>
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          className="section-footer"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
          <motion.button
            className="btn btn-primary view-all-btn"
            onClick={handleViewAllProducts}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <span>Khám phá toàn bộ bộ sưu tập</span>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
};

export default ProductGrid;