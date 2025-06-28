import React from 'react';
import { motion } from 'framer-motion';
import Header from './Header';
import NewHeroSection from './NewHeroSection';
import PopMartProducts from './PopMartProducts';
import Footer from './Footer';

const HomePage = ({ onNavigate, onProductSelect }) => {
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
                href="https://shopee.vn/shop/123456789" 
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
      
      <Footer />
    </motion.div>
  );
};

export default HomePage;