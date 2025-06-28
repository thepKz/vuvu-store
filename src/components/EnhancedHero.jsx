import React from 'react';
import { motion } from 'framer-motion';
import '../styles/EnhancedHero.css';

const EnhancedHero = ({ onNavigate }) => {
  return (
    <section className="enhanced-hero">
      {/* Advanced Blended Background Effects */}
      <div className="hero-background">
        <div className="gradient-mesh"></div>
        <div className="floating-particles">
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              className={`particle particle-${i + 1}`}
              animate={{
                y: [0, -30, 0],
                x: [0, 15, -15, 0],
                scale: [1, 1.2, 1],
                opacity: [0.3, 0.7, 0.3]
              }}
              transition={{
                duration: 4 + i,
                repeat: Infinity,
                ease: "easeInOut",
                delay: i * 0.5
              }}
            />
          ))}
        </div>
      </div>

      <div className="container">
        <div className="hero-content">
          {/* Left Content */}
          <motion.div 
            className="hero-text"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <motion.div 
              className="hero-badge"
              initial={{ scale: 0, rotate: -10 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ delay: 0.3, type: "spring" }}
            >
              <span className="badge-icon">✨</span>
              <span>Chào mừng đến với Dudu Store</span>
            </motion.div>

            <motion.h1 
              className="hero-title"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.8 }}
            >
              <span className="title-main">Dudu Store</span>
              <span className="title-sub">Premium Squishy Collection</span>
            </motion.h1>

            <motion.p 
              className="hero-description"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.6 }}
            >
              Khám phá bộ sưu tập squishy cao cấp được thiết kế đặc biệt cho những ai yêu thích 
              sự dễ thương và chất lượng. Từ Limited Edition đến Premium Collection.
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
                <span>🛍️</span>
                Khám phá ngay
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" strokeWidth="2"/>
                </svg>
              </motion.button>
              
              <motion.button
                className="cta-secondary"
                onClick={() => onNavigate('about')}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Tìm hiểu thêm
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
              {/* Main Product Showcase */}
              <motion.div 
                className="main-showcase"
                animate={{ 
                  y: [0, -15, 0],
                  rotateY: [2, 8, 2],
                }}
                transition={{ 
                  duration: 6,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              >
                <div className="showcase-card">
                  <div className="card-badge">Limited Edition</div>
                  <div className="product-image">
                    <img 
                      src="/images/lubu1.jpg" 
                      alt="Premium Squishy Collection"
                      onError={(e) => {
                        e.target.src = 'https://images.pexels.com/photos/6195121/pexels-photo-6195121.jpeg?auto=compress&cs=tinysrgb&w=400';
                      }}
                    />
                    <div className="image-glow"></div>
                  </div>
                  <div className="product-info">
                    <h3>Premium Squishy</h3>
                    <div className="price-display">
                      <span className="current-price">850.000đ</span>
                      <span className="original-price">1.200.000đ</span>
                    </div>
                    <div className="product-actions">
                      <button className="btn-primary">Mua ngay</button>
                      <button className="btn-wishlist">♡</button>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Floating Elements - Minimal */}
              <motion.div 
                className="floating-badge badge-1"
                animate={{
                  y: [0, -20, 0],
                  rotate: [0, 3, 0]
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              >
                <span className="badge-icon">🔥</span>
                <span>Hot Seller</span>
              </motion.div>

              <motion.div 
                className="floating-badge badge-2"
                animate={{
                  y: [0, 15, 0],
                  rotate: [0, -2, 0]
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

              <motion.div 
                className="floating-badge badge-3"
                animate={{
                  y: [0, -10, 0],
                  x: [0, 5, 0]
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 2
                }}
              >
                <span>Gift Ready</span>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default EnhancedHero;