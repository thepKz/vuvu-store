import React, { useState, useEffect } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import logo from '../images/vuvu.png';
import '../styles/Header.css';

const Header = ({ currentPage, onNavigate }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { scrollY } = useScroll();
  
  const headerOpacity = useTransform(scrollY, [0, 100], [1, 0.95]);
  const headerBackground = useTransform(
    scrollY,
    [0, 100],
    ['rgba(255, 255, 255, 0.9)', 'rgba(255, 255, 255, 0.95)']
  );

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 768) {
        setIsMenuOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const menuItems = [
    { name: 'Trang chủ', page: 'home' },
    { name: 'Sản phẩm', page: 'products' },
    { name: 'Về chúng tôi', page: 'about' },
    { name: 'Liên hệ', page: 'contact' }
  ];

  const handleNavigation = (page) => {
    onNavigate(page);
    setIsMenuOpen(false);
    // Scroll to top immediately when navigating
    window.scrollTo(0, 0);
  };

  return (
    <motion.header
      className="header"
      style={{
        opacity: headerOpacity,
        backgroundColor: headerBackground
      }}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <div className="container">
        <motion.div 
          className="header-content"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <motion.div 
            className="logo"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => handleNavigation('home')}
          >
            <img src={logo} alt="Dudu Taba Squishy" />
          </motion.div>

          <nav className={`nav ${isMenuOpen ? 'nav-open' : ''}`}>
            <ul className="nav-list">
              {menuItems.map((item, index) => (
                <motion.li 
                  key={item.name}
                  className="nav-item"
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * index }}
                >
                  <motion.button
                    className={`nav-link ${currentPage === item.page ? 'active' : ''}`}
                    whileHover={{ scale: 1.05, color: '#ff6b9d' }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleNavigation(item.page)}
                  >
                    {item.name}
                  </motion.button>
                </motion.li>
              ))}
              
              {/* Login Button */}
              <motion.li 
                className="nav-item login-item"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * menuItems.length }}
              >
                <motion.button
                  className="login-btn-header"
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleNavigation('login')}
                >
                  <span className="login-icon">👤</span>
                  Đăng nhập
                </motion.button>
              </motion.li>
            </ul>
          </nav>

          <motion.button
            className="menu-toggle"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            animate={{ rotate: isMenuOpen ? 90 : 0 }}
          >
            <span className={`hamburger ${isMenuOpen ? 'hamburger-open' : ''}`}>
              <span></span>
              <span></span>
              <span></span>
            </span>
          </motion.button>
        </motion.div>
      </div>
    </motion.header>
  );
};

export default Header;