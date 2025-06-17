import React from 'react';
import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import logo from '../images/vuvu.png';

const AnimatedFooter = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, threshold: 0.1 });

  const footerVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.6,
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.5 }
    }
  };

  return (
    <motion.footer 
      className="footer-container"
      ref={ref}
      variants={footerVariants}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
    >
      <div className="footer-content">
        <motion.div className="footer-logo" variants={itemVariants}>
          <motion.img 
            src={logo} 
            alt="Dudu Taba Squishy Logo" 
            width="300px"
            whileHover={{ scale: 1.05, rotate: 5 }}
            transition={{ duration: 0.3 }}
          />
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            Dudu Taba Squishy
          </motion.p>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
          >
            Cửa hàng squishy và đồ chơi mềm mại đáng yêu nhất
          </motion.p>
        </motion.div>
        
        <motion.div className="footer-links" variants={itemVariants}>
          <div className="link-column">
            <motion.h4
              whileHover={{ color: '#fff', scale: 1.05 }}
              transition={{ duration: 0.2 }}
            >
              Sản phẩm
            </motion.h4>
            <ul>
              {['Squishy Mới & Nổi bật', 'Bộ sưu tập Squishy', 'Mega Squishy'].map((item, index) => (
                <motion.li key={index}>
                  <motion.a 
                    href="#a"
                    whileHover={{ 
                      x: 5,
                      color: '#fff',
                      transition: { duration: 0.2 }
                    }}
                  >
                    {item}
                  </motion.a>
                </motion.li>
              ))}
            </ul>
          </div>
          <div className="link-column">
            <motion.h4
              whileHover={{ color: '#fff', scale: 1.05 }}
              transition={{ duration: 0.2 }}
            >
              Về chúng tôi
            </motion.h4>
            <ul>
              {['Giới thiệu', 'Liên hệ', 'Chính sách'].map((item, index) => (
                <motion.li key={index}>
                  <motion.a 
                    href="#a"
                    whileHover={{ 
                      x: 5,
                      color: '#fff',
                      transition: { duration: 0.2 }
                    }}
                  >
                    {item}
                  </motion.a>
                </motion.li>
              ))}
            </ul>
          </div>
        </motion.div>
      </div>
      
      <motion.div className="footer-bottom" variants={itemVariants}>
        <motion.div className="social-links">
          {[
            { icon: 'fab fa-facebook-square', color: '#4267B2' },
            { icon: 'fab fa-instagram', color: '#E4405F' },
            { icon: 'fab fa-youtube', color: '#FF0000' }
          ].map((social, index) => (
            <motion.a 
              key={index}
              href="#a"
              whileHover={{ 
                scale: 1.2,
                color: social.color,
                y: -3
              }}
              whileTap={{ scale: 0.9 }}
              transition={{ duration: 0.2 }}
            >
              <i className={social.icon}></i>
            </motion.a>
          ))}
        </motion.div>
        <motion.p 
          className="copyright"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
        >
          © 2024 Dudu Taba Squishy. All rights reserved ✨
        </motion.p>
      </motion.div>
    </motion.footer>
  );
};

export default AnimatedFooter;