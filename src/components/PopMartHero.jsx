import React from 'react';
import { motion } from 'framer-motion';
import '../styles/HeroSection.css';

const PopMartHero = ({ onNavigate }) => {
  return (
    <section className="hero">
      {/* Enhanced Background with Multiple Layers */}
      <div className="hero-background">
        <div className="hero-gradient"></div>
        <div className="hero-mesh"></div>
        
        {/* Floating Orbs */}
        <motion.div 
          className="floating-orb orb-1"
          animate={{
            x: [0, 30, -20, 0],
            y: [0, -40, 20, 0],
            scale: [1, 1.2, 0.8, 1]
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div 
          className="floating-orb orb-2"
          animate={{
            x: [0, -25, 35, 0],
            y: [0, 30, -25, 0],
            scale: [1, 0.9, 1.1, 1]
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 5
          }}
        />
        <motion.div 
          className="floating-orb orb-3"
          animate={{
            x: [0, 20, -30, 0],
            y: [0, -20, 40, 0],
            scale: [1, 1.1, 0.9, 1]
          }}
          transition={{
            duration: 18,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 10
          }}
        />
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

            {/* Social Proof WITHOUT Stars */}
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
              <div className="proof-text">
                <span className="trust-text">Được tin tưởng bởi 1000+ khách hàng</span>
              </div>
            </motion.div>
          </motion.div>

          {/* Right Visual - Enhanced & Larger */}
          <motion.div 
            className="hero-visual"
            initial={{ opacity: 0, scale: 0.8, x: 50 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            transition={{ duration: 1, delay: 0.2 }}
          >
            <div className="hero-visual-container">
              {/* Main Product Card - Larger & Tilted */}
              <motion.div 
                className="visual-card main-card"
                animate={{ 
                  y: [0, -15, 0],
                  rotateY: [2, 5, 2],
                  rotateX: [1, 3, 1]
                }}
                transition={{ 
                  duration: 6,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
                style={{
                  transform: 'perspective(1000px) rotateY(8deg) rotateX(2deg)'
                }}
              >
                <div className="card-header">
                  <div className="card-badge">Premium</div>
                </div>
                <div className="card-content">
                  <div className="product-preview">
                    <div className="preview-image">
                      <motion.div 
                        className="image-shimmer"
                        animate={{
                          x: [-100, 300],
                          opacity: [0, 1, 0]
                        }}
                        transition={{
                          duration: 2,
                          repeat: Infinity,
                          ease: "easeInOut",
                          delay: 2
                        }}
                      />
                    </div>
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

              {/* Quality Card - Removed "Chất lượng đảm bảo" */}
              <motion.div 
                className="visual-card accent-card"
                animate={{ 
                  y: [0, -12, 0],
                  x: [0, 8, 0],
                  rotateZ: [-1, 1, -1]
                }}
                transition={{ 
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 1
                }}
                style={{
                  transform: 'perspective(800px) rotateY(-5deg)'
                }}
              >
                <div className="premium-indicator">
                  <div className="indicator-icon">
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                    >
                      💎
                    </motion.div>
                  </div>
                  <div className="indicator-text">
                    <span className="indicator-title">Premium</span>
                    <span className="indicator-subtitle">Collection</span>
                  </div>
                </div>
              </motion.div>

              {/* Enhanced Floating Elements */}
              <div className="floating-elements">
                <motion.div 
                  className="floating-shape shape-1"
                  animate={{
                    y: [0, -20, 0],
                    rotate: [0, 180, 360],
                    scale: [1, 1.2, 1]
                  }}
                  transition={{
                    duration: 8,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                />
                <motion.div 
                  className="floating-shape shape-2"
                  animate={{
                    y: [0, 15, 0],
                    rotate: [0, -180, -360],
                    scale: [1, 0.8, 1]
                  }}
                  transition={{
                    duration: 10,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 2
                  }}
                />
                <motion.div 
                  className="floating-shape shape-3"
                  animate={{
                    y: [0, -10, 0],
                    rotate: [0, 90, 180],
                    scale: [1, 1.1, 1]
                  }}
                  transition={{
                    duration: 12,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 4
                  }}
                />
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default PopMartHero;