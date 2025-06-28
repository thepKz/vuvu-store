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
          </motion.div>

          {/* Right Visual - Enhanced & Properly Contained */}
          <motion.div 
            className="hero-visual"
            initial={{ opacity: 0, scale: 0.8, x: 50 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            transition={{ duration: 1, delay: 0.2 }}
          >
            <div className="hero-visual-container">
              {/* Main Product Card - Properly Positioned */}
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
              >
                <div className="card-header">
                  <div className="card-badge">Premium</div>
                </div>
                <div className="card-content">
                  <div className="product-preview">
                    <motion.div 
                      className="preview-image"
                      whileHover={{ scale: 1.05 }}
                      transition={{ duration: 0.3 }}
                    >
                      <img 
                        src="/images/lubu1.jpg" 
                        alt="Limited Edition Squishy"
                        style={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover',
                          borderRadius: '10px'
                        }}
                        onError={(e) => {
                          e.target.src = 'https://images.pexels.com/photos/6195121/pexels-photo-6195121.jpeg?auto=compress&cs=tinysrgb&w=400';
                        }}
                      />
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
                      <motion.div 
                        className="image-overlay"
                        initial={{ opacity: 0 }}
                        whileHover={{ opacity: 1 }}
                        transition={{ duration: 0.3 }}
                      >
                        <motion.button
                          className="view-detail-btn"
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => window.open('/images/lubu1.jpg', '_blank')}
                        >
                          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                            <path d="M1 12C1 12 5 4 12 4C19 4 23 12 23 12C23 12 19 20 12 20C5 20 1 12 1 12Z" stroke="currentColor" strokeWidth="2"/>
                            <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="2"/>
                          </svg>
                          Xem chi tiết
                        </motion.button>
                      </motion.div>
                    </motion.div>
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

              {/* Premium Indicator Card */}
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

              {/* Enhanced Floating Elements - Properly Contained */}
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