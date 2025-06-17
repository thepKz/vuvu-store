import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Header from './Header';
import Footer from './Footer';
import '../styles/ContactPage.css';

const ContactPage = ({ onNavigate }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission here
    alert('Cảm ơn bạn đã liên hệ! Chúng tôi sẽ phản hồi sớm nhất có thể.');
    setFormData({
      name: '',
      email: '',
      phone: '',
      subject: '',
      message: ''
    });
  };

  const contactInfo = [
    {
      icon: '📍',
      title: 'Địa chỉ',
      content: '123 Đường ABC, Quận XYZ, TP.HCM',
      link: null
    },
    {
      icon: '📞',
      title: 'Điện thoại',
      content: '0123 456 789',
      link: 'tel:0123456789'
    },
    {
      icon: '📧',
      title: 'Email',
      content: 'hello@dudutaba.com',
      link: 'mailto:hello@dudutaba.com'
    },
    {
      icon: '🕒',
      title: 'Giờ làm việc',
      content: 'T2-T7: 8:00 - 22:00\nCN: 9:00 - 21:00',
      link: null
    }
  ];

  const socialLinks = [
    { icon: '📘', name: 'Facebook', link: '#', color: '#4267B2' },
    { icon: '📷', name: 'Instagram', link: '#', color: '#E4405F' },
    { icon: '📺', name: 'YouTube', link: '#', color: '#FF0000' },
    { icon: '🎵', name: 'TikTok', link: '#', color: '#000000' }
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="contact-page"
    >
      <Header currentPage="contact" onNavigate={onNavigate} />
      
      <main className="contact-main">
        <section className="contact-hero">
          <div className="container">
            <motion.div
              className="contact-hero-content"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h1>Liên hệ với chúng tôi</h1>
              <p>Chúng tôi luôn sẵn sàng lắng nghe và hỗ trợ bạn!</p>
            </motion.div>
          </div>
        </section>

        <section className="contact-content">
          <div className="container">
            <div className="contact-layout">
              <motion.div
                className="contact-info-section"
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
              >
                <h2>Thông tin liên hệ</h2>
                <p>Hãy liên hệ với chúng tôi qua các kênh sau:</p>
                
                <div className="contact-info-grid">
                  {contactInfo.map((info, index) => (
                    <motion.div
                      key={index}
                      className="contact-info-item"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: index * 0.1 }}
                      whileHover={{ scale: 1.02 }}
                    >
                      <div className="info-icon">{info.icon}</div>
                      <div className="info-content">
                        <h3>{info.title}</h3>
                        {info.link ? (
                          <a href={info.link} className="info-link">
                            {info.content}
                          </a>
                        ) : (
                          <p>{info.content}</p>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </div>

                <div className="social-section">
                  <h3>Theo dõi chúng tôi</h3>
                  <div className="social-links">
                    {socialLinks.map((social, index) => (
                      <motion.a
                        key={index}
                        href={social.link}
                        className="social-link"
                        style={{ '--social-color': social.color }}
                        whileHover={{ scale: 1.1, y: -3 }}
                        whileTap={{ scale: 0.9 }}
                      >
                        <span className="social-icon">{social.icon}</span>
                        <span className="social-name">{social.name}</span>
                      </motion.a>
                    ))}
                  </div>
                </div>
              </motion.div>

              <motion.div
                className="contact-form-section"
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
              >
                <div className="form-container">
                  <h2>Gửi tin nhắn</h2>
                  <p>Điền thông tin bên dưới và chúng tôi sẽ liên hệ lại với bạn sớm nhất!</p>
                  
                  <form onSubmit={handleSubmit} className="contact-form">
                    <div className="form-row">
                      <div className="form-group">
                        <label htmlFor="name">Họ và tên *</label>
                        <input
                          type="text"
                          id="name"
                          name="name"
                          value={formData.name}
                          onChange={handleInputChange}
                          required
                          placeholder="Nhập họ và tên của bạn"
                        />
                      </div>
                      <div className="form-group">
                        <label htmlFor="email">Email *</label>
                        <input
                          type="email"
                          id="email"
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          required
                          placeholder="Nhập email của bạn"
                        />
                      </div>
                    </div>

                    <div className="form-row">
                      <div className="form-group">
                        <label htmlFor="phone">Số điện thoại</label>
                        <input
                          type="tel"
                          id="phone"
                          name="phone"
                          value={formData.phone}
                          onChange={handleInputChange}
                          placeholder="Nhập số điện thoại"
                        />
                      </div>
                      <div className="form-group">
                        <label htmlFor="subject">Chủ đề *</label>
                        <select
                          id="subject"
                          name="subject"
                          value={formData.subject}
                          onChange={handleInputChange}
                          required
                        >
                          <option value="">Chọn chủ đề</option>
                          <option value="product">Hỏi về sản phẩm</option>
                          <option value="order">Đặt hàng</option>
                          <option value="support">Hỗ trợ kỹ thuật</option>
                          <option value="partnership">Hợp tác</option>
                          <option value="other">Khác</option>
                        </select>
                      </div>
                    </div>

                    <div className="form-group">
                      <label htmlFor="message">Tin nhắn *</label>
                      <textarea
                        id="message"
                        name="message"
                        value={formData.message}
                        onChange={handleInputChange}
                        required
                        rows="6"
                        placeholder="Nhập tin nhắn của bạn..."
                      ></textarea>
                    </div>

                    <motion.button
                      type="submit"
                      className="btn btn-primary submit-btn"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      📤 Gửi tin nhắn
                    </motion.button>
                  </form>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        <section className="map-section">
          <div className="container">
            <motion.div
              className="map-container"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <h2>Vị trí cửa hàng</h2>
              <div className="map-placeholder">
                <div className="map-content">
                  <div className="map-icon">🗺️</div>
                  <h3>Dudu Taba Squishy Store</h3>
                  <p>123 Đường ABC, Quận XYZ, TP.HCM</p>
                  <p>Mở cửa: T2-T7 (8:00-22:00), CN (9:00-21:00)</p>
                </div>
              </div>
            </motion.div>
          </div>
        </section>
      </main>

      <Footer />
    </motion.div>
  );
};

export default ContactPage;