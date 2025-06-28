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
      description: "Squishy Vương Quốc Động Vật - Phiên bản cao cấp",
      price: "230.000đ",
      originalPrice: null,
      badge: "Mới",
      category: "premium"
    },
    {
      id: 2,
      image: lubu2,
      name: "DIMOO Limited",
      description: "Squishy Thỏ Nghỉ Lễ - Bộ sưu tập giới hạn",
      price: "253.000đ",
      originalPrice: null,
      badge: "Hot",
      category: "limited"
    },
    {
      id: 3,
      image: lubu3,
      name: "MOLLY Exclusive",
      description: "MOLLY SQUISHY KHỔNG LỒ - Bộ sưu tập độc quyền",
      price: "805.000đ",
      originalPrice: "1.150.000đ",
      badge: "Sale",
      category: "exclusive"
    },
    {
      id: 4,
      image: lubu4,
      name: "MOLLY Deluxe",
      description: "MOLLY SQUISHY KHỔNG LỒ - Phiên bản deluxe",
      price: "805.000đ",
      originalPrice: "1.150.000đ",
      badge: "Sale",
      category: "deluxe"
    },
    {
      id: 5,
      image: lubu5,
      name: "LABUBU Special",
      description: "LABUBU SQUISHY KHỔNG LỒ - Bộ sưu tập đặc biệt",
      price: "805.000đ",
      originalPrice: "1.150.000đ",
      badge: "Sale",
      category: "special"
    },
    {
      id: 6,
      image: lubu6,
      name: "LABUBU Collector",
      description: "LABUBU SQUISHY KHỔNG LỒ - Dành cho nhà sưu tập",
      price: "805.000đ",
      originalPrice: "1.150.000đ",
      badge: "Sale",
      category: "collector"
    },
    {
      id: 7,
      image: lubu7,
      name: "LABUBU Artist",
      description: "LABUBU SQUISHY KHỔNG LỒ - Phiên bản nghệ thuật",
      price: "805.000đ",
      originalPrice: "1.150.000đ",
      badge: "Sale",
      category: "artist"
    },
    {
      id: 8,
      image: lubu8,
      name: "LABUBU Signature",
      description: "LABUBU SQUISHY KHỔNG LỒ - Chữ ký độc quyền",
      price: "805.000đ",
      originalPrice: "1.150.000đ",
      badge: "Sale",
      category: "signature"
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
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <div className="section-badge">
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
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M1 12C1 12 5 4 12 4C19 4 23 12 23 12C23 12 19 20 12 20C5 20 1 12 1 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="2"/>
                    </svg>
                    <span>Xem chi tiết</span>
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
                    scale: 1.02,
                    boxShadow: "0 10px 25px rgba(236, 72, 153, 0.3)"
                  }}
                  whileTap={{ scale: 0.98 }}
                  transition={{ duration: 0.2 }}
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M9 22C9.55228 22 10 21.5523 10 21C10 20.4477 9.55228 20 9 20C8.44772 20 8 20.4477 8 21C8 21.5523 8.44772 22 9 22Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M20 22C20.5523 22 21 21.5523 21 21C21 20.4477 20.5523 20 20 20C19.4477 20 19 20.4477 19 21C19 21.5523 19.4477 22 20 22Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M1 1H5L7.68 14.39C7.77144 14.8504 8.02191 15.264 8.38755 15.5583C8.75318 15.8526 9.2107 16.009 9.68 16H19.4C19.8693 16.009 20.3268 15.8526 20.6925 15.5583C21.0581 15.264 21.3086 14.8504 21.4 14.39L23 6H6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
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
          transition={{ duration: 0.6, delay: 0.8 }}
        >
          <motion.button
            className="btn btn-primary view-all-btn"
            onClick={handleViewAllProducts}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <span>Khám phá toàn bộ bộ sưu tập</span>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
};

export default ProductGrid;