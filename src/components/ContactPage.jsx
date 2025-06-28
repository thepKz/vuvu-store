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
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitSuccess(true);
      
      // Reset form after success
      setTimeout(() => {
        setSubmitSuccess(false);
        setFormData({
          name: '',
          email: '',
          phone: '',
          subject: '',
          message: ''
        });
      }, 3000);
    }, 1500);
  };

  const contactInfo = [
    {
      emoji: '📍',
      title: 'Địa chỉ cửa hàng',
      content: '123 Đường ABC, Quận XYZ, TP.HCM',
      link: null
    },
    {
      emoji: '📞',
      title: 'Hotline hỗ trợ',
      content: '0123 456 789',
      link: 'tel:0123456789'
    },
    {
      emoji: '📧',
      title: 'Email liên hệ',
      content: 'hello@dudustore.com',
      link: 'mailto:hello@dudustore.com'
    },
    {
      emoji: '🕒',
      title: 'Giờ làm việc',
      content: 'T2-T7: 8:00 - 22:00\nCN: 9:00 - 21:00',
      link: null
    }
  ];

  const socialLinks = [
    { emoji: '📘', name: 'Facebook', link: '#', color: '#4267B2' },
    { emoji: '📷', name: 'Instagram', link: '#', color: '#E4405F' },
    { emoji: '📺', name: 'YouTube', link: '#', color: '#FF0000' },
    { emoji: '🎵', name: 'TikTok', link: '#', color: '#000000' }
  ];

  const storeLocations = [
    {
      name: 'Dudu Store - Chi nhánh 1',
      address: '123 Đường ABC, Quận XYZ, TP.HCM',
      hours: 'T2-T7: 8:00 - 22:00, CN: 9:00 - 21:00',
      phone: '0123 456 789'
    },
    {
      name: 'Dudu Store - Chi nhánh 2',
      address: '456 Đường DEF, Quận UVW, TP.HCM',
      hours: 'T2-T7: 8:00 - 22:00, CN: 9:00 - 21:00',
      phone: '0987 654 321'
    }
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
        {/* Hero Section */}
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

        {/* Contact Content */}
        <section className="contact-content">
          <div className="container">
            <div className="contact-layout">
              {/* Contact Info */}
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
                      <div className="info-emoji">{info.emoji}</div>
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
                        <span className="social-emoji">{social.emoji}</span>
                        <span className="social-name">{social.name}</span>
                      </motion.a>
                    ))}
                  </div>
                </div>
              </motion.div>

              {/* Contact Form */}
              <motion.div
                className="contact-form-section"
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
              >
                <div className="form-container">
                  <h2>Gửi tin nhắn</h2>
                  <p>Điền thông tin bên dưới và chúng tôi sẽ liên hệ lại với bạn sớm nhất!</p>
                  
                  {submitSuccess ? (
                    <motion.div 
                      className="success-message"
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.3 }}
                    >
                      <div className="success-icon">✅</div>
                      <h3>Gửi tin nhắn thành công!</h3>
                      <p>Cảm ơn bạn đã liên hệ với chúng tôi. Chúng tôi sẽ phản hồi trong thời gian sớm nhất.</p>
                    </motion.div>
                  ) : (
                    <form onSubmit={handleSubmit} className="contact-form">
                      <div className="form-row">
                        <div className="form-group">
                          <label htmlFor="name">Họ và tên <span className="required">*</span></label>
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
                          <label htmlFor="email">Email <span className="required">*</span></label>
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
                          <label htmlFor="subject">Chủ đề <span className="required">*</span></label>
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
                        <label htmlFor="message">Tin nhắn <span className="required">*</span></label>
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
                        className="submit-btn"
                        disabled={isSubmitting}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        {isSubmitting ? (
                          <motion.span 
                            className="loading-spinner"
                            animate={{ rotate: 360 }}
                            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                          >
                            🔄
                          </motion.span>
                        ) : (
                          <>
                            📤 Gửi tin nhắn
                          </>
                        )}
                      </motion.button>
                    </form>
                  )}
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Store Locations */}
        <section className="store-locations">
          <div className="container">
            <motion.div
              className="section-header"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <h2>Hệ thống cửa hàng</h2>
              <p>Ghé thăm cửa hàng gần nhất để trải nghiệm sản phẩm</p>
            </motion.div>

            <div className="locations-grid">
              {storeLocations.map((location, index) => (
                <motion.div
                  key={index}
                  className="location-card"
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.2 }}
                  whileHover={{ y: -10 }}
                >
                  <div className="location-header">
                    <div className="location-emoji">🏬</div>
                    <h3>{location.name}</h3>
                  </div>
                  <div className="location-details">
                    <div className="location-detail">
                      <span>📍</span>
                      <p>{location.address}</p>
                    </div>
                    <div className="location-detail">
                      <span>🕒</span>
                      <p>{location.hours}</p>
                    </div>
                    <div className="location-detail">
                      <span>📞</span>
                      <p>{location.phone}</p>
                    </div>
                  </div>
                  <motion.button
                    className="location-btn"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    🗺️ Xem bản đồ
                  </motion.button>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="faq-section">
          <div className="container">
            <motion.div
              className="section-header"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <h2>Câu hỏi thường gặp</h2>
              <p>Những thắc mắc phổ biến về sản phẩm và dịch vụ của chúng tôi</p>
            </motion.div>

            <div className="faq-grid">
              {[
                {
                  question: "Thời gian giao hàng mất bao lâu?",
                  answer: "Thời gian giao hàng thông thường từ 2-3 ngày làm việc đối với khu vực nội thành và 3-5 ngày đối với khu vực ngoại thành và các tỉnh thành khác."
                },
                {
                  question: "Làm thế nào để đổi trả sản phẩm?",
                  answer: "Bạn có thể đổi trả sản phẩm trong vòng 7 ngày kể từ ngày nhận hàng. Sản phẩm cần giữ nguyên tem mác, hộp đựng và không có dấu hiệu đã qua sử dụng."
                },
                {
                  question: "Có chính sách bảo hành không?",
                  answer: "Tất cả sản phẩm của Dudu Store đều được bảo hành 12 tháng đối với các lỗi từ nhà sản xuất. Vui lòng liên hệ với chúng tôi nếu sản phẩm gặp vấn đề."
                },
                {
                  question: "Có thể thanh toán bằng những phương thức nào?",
                  answer: "Chúng tôi chấp nhận thanh toán qua chuyển khoản ngân hàng, ví điện tử (MoMo, ZaloPay, VNPay), thẻ tín dụng/ghi nợ và thanh toán khi nhận hàng (COD)."
                }
              ].map((faq, index) => (
                <motion.div
                  key={index}
                  className="faq-item"
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                >
                  <div className="faq-question">
                    <span className="question-icon">❓</span>
                    <h3>{faq.question}</h3>
                  </div>
                  <div className="faq-answer">
                    <p>{faq.answer}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="contact-cta">
          <div className="container">
            <motion.div
              className="cta-content"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <h2>Sẵn sàng khám phá?</h2>
              <p>Hãy cùng chúng tôi tạo ra những khoảnh khắc vui vẻ với bộ sưu tập squishy tuyệt vời!</p>
              <div className="cta-buttons">
                <motion.button
                  className="cta-primary"
                  onClick={() => onNavigate('products')}
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                >
                  🛍️ Xem sản phẩm
                </motion.button>
                
                <motion.button
                  className="cta-secondary"
                  onClick={() => onNavigate('about')}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  ℹ️ Về chúng tôi
                </motion.button>
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