import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Header from './Header';
import Footer from './Footer';
import '../styles/LoginPage.css';

const LoginPage = ({ onNavigate, onAdminLogin }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate login process
    setTimeout(() => {
      setIsLoading(false);
      
      // Check if admin login
      if (formData.email === 'admin@dudustore.com' && formData.password === 'admin123') {
        if (onAdminLogin) {
          onAdminLogin();
        }
        onNavigate('admin');
      } else {
        alert('Đăng nhập thành công! 🎉');
        onNavigate('home');
      }
    }, 2000);
  };

  const floatingSquishies = [
    { emoji: '🧸', delay: 0, duration: 3 },
    { emoji: '🐱', delay: 0.5, duration: 4 },
    { emoji: '🐰', delay: 1, duration: 3.5 },
    { emoji: '🐻', delay: 1.5, duration: 4.5 },
    { emoji: '🦄', delay: 2, duration: 3.8 },
    { emoji: '🐼', delay: 2.5, duration: 4.2 }
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="login-page"
    >
      <Header currentPage="login" onNavigate={onNavigate} />
      
      <main className="login-main">
        {/* Floating Squishy Background */}
        <div className="floating-squishies">
          {floatingSquishies.map((squishy, index) => (
            <motion.div
              key={index}
              className="floating-squishy"
              initial={{ 
                y: window.innerHeight + 100,
                x: Math.random() * window.innerWidth,
                rotate: 0,
                scale: 0.5
              }}
              animate={{
                y: -100,
                x: Math.random() * window.innerWidth,
                rotate: 360,
                scale: [0.5, 1.2, 0.8, 1]
              }}
              transition={{
                duration: squishy.duration,
                delay: squishy.delay,
                repeat: Infinity,
                ease: "linear"
              }}
            >
              {squishy.emoji}
            </motion.div>
          ))}
        </div>

        <div className="login-container">
          <motion.div
            className="login-card"
            initial={{ scale: 0.8, opacity: 0, y: 50 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            transition={{ 
              duration: 0.8,
              type: "spring",
              stiffness: 100
            }}
          >
            {/* Login Header */}
            <motion.div 
              className="login-header"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
            >
              <div className="login-logo">
                <motion.div
                  className="logo-squishy"
                  animate={{
                    scale: [1, 1.1, 1],
                    rotate: [0, 5, -5, 0]
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                >
                  🧸
                </motion.div>
              </div>
              <h1>Chào mừng trở lại!</h1>
              <p>Đăng nhập để khám phá thế giới squishy tuyệt vời</p>
            </motion.div>

            {/* Login Form */}
            <motion.form 
              className="login-form"
              onSubmit={handleSubmit}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.6 }}
            >
              <div className="form-group">
                <motion.div
                  className="input-container"
                  whileFocus={{ scale: 1.02 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="input-icon">📧</div>
                  <input
                    type="email"
                    name="email"
                    placeholder="Email của bạn"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                  />
                </motion.div>
              </div>

              <div className="form-group">
                <motion.div
                  className="input-container"
                  whileFocus={{ scale: 1.02 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="input-icon">🔒</div>
                  <input
                    type="password"
                    name="password"
                    placeholder="Mật khẩu"
                    value={formData.password}
                    onChange={handleInputChange}
                    required
                  />
                </motion.div>
              </div>

              <div className="form-options">
                <label className="remember-me">
                  <input type="checkbox" />
                  <span className="checkmark"></span>
                  Ghi nhớ đăng nhập
                </label>
                <button type="button" className="forgot-password">
                  Quên mật khẩu?
                </button>
              </div>

              <motion.button
                type="submit"
                className="login-btn"
                disabled={isLoading}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                animate={isLoading ? {
                  background: [
                    "linear-gradient(135deg, #ff6b9d, #ffa8cc)",
                    "linear-gradient(135deg, #ffa8cc, #ff6b9d)",
                    "linear-gradient(135deg, #ff6b9d, #ffa8cc)"
                  ]
                } : {}}
                transition={isLoading ? {
                  duration: 1,
                  repeat: Infinity,
                  ease: "easeInOut"
                } : { duration: 0.2 }}
              >
                {isLoading ? (
                  <motion.div
                    className="loading-spinner"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  >
                    🌀
                  </motion.div>
                ) : (
                  <>
                    <span>🚀</span>
                    Đăng nhập
                  </>
                )}
              </motion.button>
            </motion.form>

            {/* Social Login */}
            <motion.div 
              className="social-login"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7, duration: 0.6 }}
            >
              <div className="divider">
                <span>hoặc đăng nhập với</span>
              </div>
              <div className="social-buttons">
                <motion.button
                  className="social-btn google"
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <span>🔍</span>
                  Google
                </motion.button>
                <motion.button
                  className="social-btn facebook"
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <span>📘</span>
                  Facebook
                </motion.button>
              </div>
            </motion.div>

            {/* Register Notice */}
            <motion.div 
              className="register-notice"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.9, duration: 0.6 }}
            >
              <div className="notice-card">
                <div className="notice-icon">ℹ️</div>
                <div className="notice-content">
                  <h4>Chưa có tài khoản?</h4>
                  <p>Hiện tại chúng tôi chưa mở tính năng đăng ký. Vui lòng liên hệ với chúng tôi để được hỗ trợ tạo tài khoản.</p>
                  <motion.button
                    className="contact-btn"
                    onClick={() => onNavigate('contact')}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    📞 Liên hệ ngay
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </motion.div>

          {/* Decorative Elements */}
          <div className="decorative-elements">
            <motion.div
              className="deco-circle deco-1"
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.3, 0.6, 0.3]
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
            <motion.div
              className="deco-circle deco-2"
              animate={{
                scale: [1.2, 1, 1.2],
                opacity: [0.2, 0.5, 0.2]
              }}
              transition={{
                duration: 5,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 1
              }}
            />
            <motion.div
              className="deco-star"
              animate={{
                rotate: 360,
                scale: [1, 1.3, 1]
              }}
              transition={{
                rotate: { duration: 8, repeat: Infinity, ease: "linear" },
                scale: { duration: 2, repeat: Infinity, ease: "easeInOut" }
              }}
            >
              ⭐
            </motion.div>
          </div>
        </div>
      </main>

      <Footer />
    </motion.div>
  );
};

export default LoginPage;