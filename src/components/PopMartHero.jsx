import React from 'react';
import { motion } from 'framer-motion';
import '../styles/HeroSection.css';

const PopMartHero = ({ onNavigate }) => {
  return (
    <section className="hero">
      {/* Background */}
      <div className="hero-background">
        <div className="hero-gradient"></div>
        <div className="hero-mesh"></div>
      </div>

      <div className="container">
        <div className="hero-content">
          {/* Left Content */}
          <motion.div 
            className="hero-text"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <motion.div 
              className="hero-badge"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.3, type: "spring" }}
            >
              <div className="badge-dot"></div>
              <span>Chào mừng đến với thế giới squishy</span>
            </motion.div>

            <motion.h1 
              className="hero-title"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.8 }}
            >
              <span className="title-line-1">Dudu Store</span>
              <span className="title-line-2">Squishy Collection</span>
            </motion.h1>

            <motion.p 
              className="hero-subtitle"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.6 }}
            >
              Khám phá bộ sưu tập squishy cao cấp được thiết kế đặc biệt cho những cô gái yêu thích sự dễ thương và chất lượng.
            </motion.p>

            <motion.div 
              className="hero-buttons"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 0.6 }}
            >
              <motion.button
                className="btn btn-primary"
                onClick={() => onNavigate('products')}
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
              >
                Khám phá ngay
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" strokeWidth="2"/>
                </svg>
              </motion.button>
            </motion.div>

            <motion.div 
              className="hero-social-proof"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1, duration: 0.6 }}
            >
              <div className="proof-avatars">
                <div className="avatar avatar-1"></div>
                <div className="avatar avatar-2"></div>
                <div className="avatar avatar-3"></div>
                <div className="avatar-more">+99</div>
              </div>
              <div className="proof-rating">
                <div className="rating-stars">
                  <span>⭐</span>
                  <span>⭐</span>
                  <span>⭐</span>
                  <span>⭐</span>
                  <span>⭐</span>
                </div>
                <span className="rating-text">4.9/5 từ 1000+ khách hàng</span>
              </div>
            </motion.div>
          </motion.div>

          {/* Right Visual */}
          <motion.div 
            className="hero-visual"
            initial={{ opacity: 0, scale: 0.8, x: 50 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            transition={{ duration: 1, delay: 0.2 }}
          >
            <div className="hero-visual-container">
              {/* Main Product Card */}
              <motion.div 
                className="visual-card main-card"
                animate={{ 
                  y: [0, -10, 0],
                  rotateY: [0, 2, 0]
                }}
                transition={{ 
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              >
                <div className="card-header">
                  <div className="card-badge">Premium</div>
                </div>
                <div className="card-content">
                  <div className="product-preview">
                    <div className="preview-image"></div>
                    <div className="preview-info">
                      <h4>Limited Edition Squishy</h4>
                      <div className="preview-price">
                        <span className="price-current">850.000đ</span>
                        <span className="price-original">1.200.000đ</span>
                      </div>
                    </div>
                  </div>
                  <div className="card-actions">
                    <button className="action-btn primary">Mua ngay</button>
                    <button className="action-btn secondary">♡</button>
                  </div>
                </div>
              </motion.div>

              {/* Accent Card */}
              <motion.div 
                className="visual-card accent-card"
                animate={{ 
                  y: [0, -8, 0],
                  x: [0, 5, 0]
                }}
                transition={{ 
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 1
                }}
              >
                <div className="quality-indicator">
                  <div className="indicator-icon">✨</div>
                  <div className="indicator-text">
                    <span className="indicator-title">Chất lượng</span>
                    <span className="indicator-subtitle">đảm bảo</span>
                  </div>
                </div>
              </motion.div>

              {/* Floating Elements */}
              <div className="floating-elements">
                <div className="floating-shape shape-1"></div>
                <div className="floating-shape shape-2"></div>
                <div className="floating-shape shape-3"></div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default PopMartHero;