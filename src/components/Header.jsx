import React, { useState, useEffect } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import logo from '../images/vuvu.png';
import '../styles/Header.css';

const Header = () => {
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
    { name: 'Trang chủ', href: '#home' },
    { name: 'Sản phẩm', href: '#products' },
    { name: 'Bộ sưu tập', href: '#collections' },
    { name: 'Về chúng tôi', href: '#about' },
    { name: 'Liên hệ', href: '#contact' }
  ];

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
                  <motion.a
                    href={item.href}
                    className="nav-link"
                    whileHover={{ scale: 1.05, color: '#ff6b9d' }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {item.name}
                  </motion.a>
                </motion.li>
              ))}
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