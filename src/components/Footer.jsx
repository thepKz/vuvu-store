import React from 'react';
import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import '../styles/Footer.css';

const Footer = () => {
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
      className="footer"
      ref={ref}
      variants={footerVariants}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
    >
      <div className="container">
        <div className="footer-content">
          <motion.div className="footer-brand" variants={itemVariants}>
            <motion.div 
              className="footer-logo"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.3 }}
            >
              <h2>Dudu Store</h2>
            </motion.div>
            <h3>Dudu Taba Squishy</h3>
            <p>Cửa hàng squishy và đồ chơi mềm mại đáng yêu nhất Việt Nam</p>
            <div className="contact-info">
              <div className="contact-item">
                <span>Địa chỉ:</span>
                <span>123 Đường ABC, Quận XYZ, TP.HCM</span>
              </div>
              <div className="contact-item">
                <span>Số điện thoại:</span>
                <span>0123 456 789</span>
              </div>
              <div className="contact-item">
                <span>Email:</span>
                <span>hello@dudustore.com</span>
              </div>
            </div>
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
                {['Squishy Mới & Nổi bật', 'Bộ sưu tập Squishy', 'Mega Squishy', 'Phụ kiện'].map((item, index) => (
                  <motion.li key={index}>
                    <motion.a 
                      href="#"
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
                Hỗ trợ
              </motion.h4>
              <ul>
                {['Hướng dẫn mua hàng', 'Chính sách đổi trả', 'Bảo hành sản phẩm', 'FAQ'].map((item, index) => (
                  <motion.li key={index}>
                    <motion.a 
                      href="#"
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
                {['Giới thiệu', 'Tin tức', 'Tuyển dụng', 'Liên hệ'].map((item, index) => (
                  <motion.li key={index}>
                    <motion.a 
                      href="#"
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
              { label: 'Facebook' },
              { label: 'Instagram' },
              { label: 'YouTube' },
              { label: 'TikTok' }
            ].map((social, index) => (
              <motion.a 
                key={index}
                href="#"
                className="social-link"
                whileHover={{ 
                  scale: 1.1,
                  y: -3
                }}
                whileTap={{ scale: 0.9 }}
                transition={{ duration: 0.2 }}
              >
                <span className="social-label">{social.label}</span>
              </motion.a>
            ))}
          </motion.div>
          
          <motion.div className="footer-divider" variants={itemVariants} />
          
          <motion.div className="copyright" variants={itemVariants}>
            <p>© 2024 Dudu Store. All rights reserved ✨</p>
            <p>Made with ❤️ for squishy lovers</p>
          </motion.div>

          <motion.div className="footer-newsletter" variants={itemVariants}>
            <h4>Đăng ký nhận tin</h4>
            <p>Nhận thông tin về sản phẩm mới và khuyến mãi đặc biệt</p>
            <div className="newsletter-form">
              <input type="email" placeholder="Email của bạn" />
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Đăng ký
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </motion.footer>
  );
};

export default Footer;