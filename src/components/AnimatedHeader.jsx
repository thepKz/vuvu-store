import React, { useEffect, useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import logo from '../images/vuvu.png';

const AnimatedHeader = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const { scrollY } = useScroll();
  
  // Transform opacity based on scroll
  const headerOpacity = useTransform(scrollY, [0, 100], [1, 0.9]);
  const headerBackground = useTransform(
    scrollY,
    [0, 100],
    ['rgba(249, 245, 246, 0.95)', 'rgba(249, 245, 246, 0.98)']
  );

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = 'visible';
    } else {
      document.body.style.overflow = 'visible';
    }
  }, [menuOpen]);

  const menuVariants = {
    closed: {
      opacity: 0,
      y: -20,
      transition: {
        duration: 0.3
      }
    },
    open: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.3,
        staggerChildren: 0.1
      }
    }
  };

  const menuItemVariants = {
    closed: {
      opacity: 0,
      x: -20
    },
    open: {
      opacity: 1,
      x: 0
    }
  };

  return (
    <motion.header
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
          className="logo"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <a href="index.html">
            <motion.img 
              src={logo} 
              alt="Dudu Taba Squishy" 
              width="75px"
              initial={{ rotate: -10, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            />
          </a>
        </motion.div>
        
        <motion.div 
          className="menu-toggle" 
          onClick={toggleMenu}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          animate={{ rotate: menuOpen ? 90 : 0 }}
          transition={{ duration: 0.3 }}
        >
          <i className={`fas ${menuOpen ? 'fa-times' : 'fa-bars'}`}></i>
        </motion.div>
        
        <motion.nav 
          className={`menu ${menuOpen ? 'show' : ''}`}
          variants={menuVariants}
          initial="closed"
          animate={menuOpen ? "open" : "closed"}
        >
          <ul>
            {['Squishy Mới', 'Bộ sưu tập', 'Mega Squishy', 'Về chúng tôi'].map((item, index) => (
              <motion.li key={index} variants={menuItemVariants}>
                <motion.a 
                  href="#a" 
                  onClick={toggleMenu}
                  whileHover={{ 
                    scale: 1.05,
                    color: '#fa86b1',
                    transition: { duration: 0.2 }
                  }}
                  whileTap={{ scale: 0.95 }}
                >
                  {item}
                </motion.a>
              </motion.li>
            ))}
          </ul>
        </motion.nav>
      </div>
    </motion.header>
  );
};

export default AnimatedHeader;