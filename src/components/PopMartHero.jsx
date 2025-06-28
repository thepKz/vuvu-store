import React from 'react';
import { motion } from 'framer-motion';
import '../styles/PopMartHero.css';

const PopMartHero = ({ onNavigate }) => {
  return (
    <section className="popmart-hero">
      {/* Animated Background */}
      <div className="hero-bg">
        <div className="gradient-orb orb-1"></div>
        <div className="gradient-orb orb-2"></div>
        <div className="gradient-orb orb-3"></div>
        <div className="mesh-gradient"></div>
      </div>

      <div className="container">
        <div className="hero-layout">
          {/* Left Content */}
          <motion.div 
            className="hero-content"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <motion.div 
              className="content-badge"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.3, type: "spring" }}
            >
              Premium Collection
            </motion.div>

            <motion.h1 
              className="hero-title"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.8 }}
            >
              Dudu Taba
              <span className="title-accent">Squishy</span>
            </motion.h1>

            <motion.p 
              className="hero-description"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.6 }}
            >
              Bộ sưu tập squishy cao cấp được thiết kế đặc biệt cho phụ nữ hiện đại
            </motion.p>

            <motion.div 
              className="hero-actions"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 0.6 }}
            >
              <motion.button
                className="cta-primary"
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

          {/* Right Visual */}
          <motion.div 
            className="hero-visual"
            initial={{ opacity: 0, scale: 0.8, x: 50 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            transition={{ duration: 1, delay: 0.2 }}
          >
            <div className="visual-container">
              {/* Main Product Card */}
              <motion.div 
                className="product-showcase"
                animate={{ 
                  y: [0, -10, 0],
                  rotateY: [0, 5, 0]
                }}
                transition={{ 
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              >
                <div className="showcase-card">
                  <div className="card-glow"></div>
                  <div className="product-image-area">
                    <div className="image-placeholder">
                      <div className="placeholder-gradient"></div>
                    </div>
                    <div className="product-badge">Limited</div>
                  </div>
                  <div className="product-details">
                    <h3>Premium Squishy</h3>
                    <div className="price-display">
                      <span className="current">850.000đ</span>
                      <span className="original">1.200.000đ</span>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Floating Elements */}
              <motion.div 
                className="floating-element element-1"
                animate={{ 
                  y: [0, -15, 0],
                  x: [0, 5, 0],
                  rotate: [0, 10, 0]
                }}
                transition={{ 
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 0.5
                }}
              >
                <div className="mini-card">
                  <div className="mini-icon">✨</div>
                  <span>Premium</span>
                </div>
              </motion.div>

              <motion.div 
                className="floating-element element-2"
                animate={{ 
                  y: [0, 12, 0],
                  x: [0, -8, 0],
                  rotate: [0, -8, 0]
                }}
                transition={{ 
                  duration: 3.5,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 1
                }}
              >
                <div className="mini-card">
                  <div className="mini-icon">🎁</div>
                  <span>Limited</span>
                </div>
              </motion.div>

              <motion.div 
                className="floating-element element-3"
                animate={{ 
                  y: [0, -8, 0],
                  scale: [1, 1.1, 1]
                }}
                transition={{ 
                  duration: 2.5,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 1.5
                }}
              >
                <div className="mini-card">
                  <div className="mini-icon">💎</div>
                  <span>Exclusive</span>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default PopMartHero;