import React from 'react';
import { motion } from 'framer-motion';
import Header from './Header';
import NewHeroSection from './NewHeroSection';
import PopMartProducts from './PopMartProducts';
import Footer from './Footer';
import '../styles/HomePage.css';

const HomePage = ({ onNavigate, onProductSelect }) => {
  // Social media and Shopee links
  const socialLinks = {
    facebook: 'https://www.facebook.com/your-facebook-page',
    instagram: 'https://www.instagram.com/your-instagram-page',
    shopee: 'https://shopee.vn/shop/your-shop-id'
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="homepage"
      style={{ width: '100%', minHeight: '100vh' }}
    >
      <Header currentPage="home" onNavigate={onNavigate} />
      <NewHeroSection onNavigate={onNavigate} />
      <PopMartProducts onNavigate={onNavigate} onProductSelect={onProductSelect} />
      
      {/* Shopee Banner */}
      <section className="shopee-home-banner">
        <div className="container">
          <div className="banner-content">
            <div className="banner-text">
              <h2>Mua sắm trên Shopee</h2>
              <p>Ghé thăm cửa hàng Shopee của chúng tôi để nhận nhiều ưu đãi hấp dẫn!</p>
              <ul className="banner-features">
                <li>🎁 Freeship Xtra cho đơn từ 50K</li>
                <li>🔥 Giảm 10% cho đơn hàng đầu tiên</li>
                <li>💰 Hoàn xu 5% khi thanh toán qua ShopeePay</li>
              </ul>
            </div>
            <div className="banner-actions">
              <motion.a 
                href={socialLinks.shopee}
                target="_blank" 
                rel="noopener noreferrer"
                className="shopee-link"
                whileHover={{ scale: 1.05, y: -3 }}
                whileTap={{ scale: 0.95 }}
              >
                <img 
                  src="https://deo.shopeemobile.com/shopee/shopee-pcmall-live-sg/assets/ca5d12864c12916c05640b36e47ac5c9.png" 
                  alt="Shopee" 
                  className="shopee-logo"
                />
                Đến cửa hàng Shopee
              </motion.a>
              <motion.button
                className="products-link"
                onClick={() => onNavigate('products')}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Xem tất cả sản phẩm
              </motion.button>
            </div>
          </div>
        </div>
      </section>
      
      {/* Social Media Section */}
      <section className="social-media-section">
        <div className="container">
          <motion.div
            className="section-header"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2>Kết nối với chúng tôi</h2>
            <p>Theo dõi chúng tôi trên các nền tảng mạng xã hội để cập nhật những sản phẩm mới nhất</p>
          </motion.div>
          
          <div className="social-platforms">
            <motion.a
              href={socialLinks.facebook}
              target="_blank"
              rel="noopener noreferrer"
              className="social-platform facebook"
              whileHover={{ y: -10, scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              <div className="platform-icon">📘</div>
              <h3>Facebook</h3>
              <p>Theo dõi chúng tôi trên Facebook để cập nhật tin tức và khuyến mãi mới nhất</p>
              <div className="platform-cta">Theo dõi ngay</div>
            </motion.a>
            
            <motion.a
              href={socialLinks.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="social-platform instagram"
              whileHover={{ y: -10, scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <div className="platform-icon">📷</div>
              <h3>Instagram</h3>
              <p>Khám phá hình ảnh sản phẩm mới nhất và đẹp nhất trên Instagram</p>
              <div className="platform-cta">Theo dõi ngay</div>
            </motion.a>
            
            <motion.a
              href={socialLinks.shopee}
              target="_blank"
              rel="noopener noreferrer"
              className="social-platform shopee"
              whileHover={{ y: -10, scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <div className="platform-icon">🛒</div>
              <h3>Shopee</h3>
              <p>Mua sắm sản phẩm của chúng tôi trên Shopee với nhiều ưu đãi hấp dẫn</p>
              <div className="platform-cta">Mua sắm ngay</div>
            </motion.a>
          </div>
        </div>
      </section>
      
      <Footer />
    </motion.div>
  );
};

export default HomePage;