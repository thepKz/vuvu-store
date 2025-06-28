import React from 'react';
import { motion } from 'framer-motion';
import '../styles/NewHeroSection.css';

const NewHeroSection = ({ onNavigate }) => {
  return (
    <section className="new-hero-section">
      {/* Background Effects */}
      <div className="hero-bg-effects">
        <div className="gradient-overlay"></div>
        <div className="floating-particles">
          {[...Array(12)].map((_, i) => (
            <motion.div
              key={i}
              className={`particle particle-${i + 1}`}
              animate={{
                y: [0, -40, 0],
                x: [0, 20, -20, 0],
                scale: [1, 1.3, 1],
                opacity: [0.4, 0.8, 0.4]
              }}
              transition={{
                duration: 5 + i * 0.5,
                repeat: Infinity,
                ease: "easeInOut",
                delay: i * 0.3
              }}
            />
          ))}
        </div>
      </div>

      <div className="container">
        <div className="hero-layout">
          {/* Left Content */}
          <motion.div 
            className="hero-content"
            initial={{ opacity: 0, x: -60 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, ease: "easeOut" }}
          >
            <motion.div 
              className="hero-badge"
              initial={{ scale: 0, rotate: -15 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
            >
              <span className="badge-sparkle">✨</span>
              <span>Chào mừng đến với Dudu Store</span>
            </motion.div>

            <motion.h1 
              className="hero-title"
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 1 }}
            >
              <span className="title-primary">Dudu Store</span>
              <span className="title-secondary">Premium Squishy Collection</span>
            </motion.h1>

            <motion.div 
              className="hero-actions"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 0.8 }}
            >
              <motion.button
                className="cta-button primary"
                onClick={() => onNavigate('products')}
                whileHover={{ scale: 1.05, y: -3 }}
                whileTap={{ scale: 0.95 }}
              >
                <span className="btn-icon">🛍️</span>
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
            initial={{ opacity: 0, scale: 0.8, x: 60 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            transition={{ duration: 1.2, delay: 0.3 }}
          >
            <div className="visual-showcase">
              {/* Main Product Display */}
              <motion.div 
                className="main-product-card"
                animate={{ 
                  y: [0, -20, 0],
                  rotateY: [0, 8, 0],
                  rotateX: [0, 3, 0]
                }}
                transition={{ 
                  duration: 8,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              >
                <div className="product-badge">Limited</div>
                <div className="product-image-area">
                  <img 
                    src="/images/lubu1.jpg" 
                    alt="Premium Squishy"
                    onError={(e) => {
                      e.target.src = 'https://images.pexels.com/photos/6195121/pexels-photo-6195121.jpeg?auto=compress&cs=tinysrgb&w=400';
                    }}
                  />
                  <div className="image-shine"></div>
                </div>
                <div className="product-details">
                  <h3>Premium Squishy</h3>
                  <div className="price-info">
                    <span className="current-price">850.000đ</span>
                    <span className="original-price">1.200.000đ</span>
                  </div>
                </div>
              </motion.div>

              {/* Floating Info Cards */}
              <motion.div 
                className="info-card card-1"
                animate={{
                  y: [0, -15, 0],
                  rotate: [0, 2, 0]
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              >
                <span className="card-icon">🔥</span>
                <span>Hot Seller</span>
              </motion.div>

              <motion.div 
                className="info-card card-2"
                animate={{
                  y: [0, 12, 0],
                  rotate: [0, -1, 0]
                }}
                transition={{
                  duration: 5,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 1
                }}
              >
                <span>Premium</span>
              </motion.div>

              {/* Background Glow */}
              <div className="visual-glow"></div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default NewHeroSection;