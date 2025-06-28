import React from 'react';
import { motion } from 'framer-motion';
import Header from './Header';
import Footer from './Footer';
import '../styles/AboutPagePopMart.css';

const AboutPagePopMart = ({ onNavigate }) => {
  const storyTimeline = [
    {
      year: '2020',
      title: 'Khởi đầu',
      description: 'Dudu Store được thành lập với tình yêu dành cho squishy',
      color: '#ff6b9d'
    },
    {
      year: '2021',
      title: 'Phát triển',
      description: 'Mở rộng bộ sưu tập với hơn 100 sản phẩm độc đáo',
      color: '#a855f7'
    },
    {
      year: '2022',
      title: 'Đột phá',
      description: 'Ra mắt dòng Premium Collection và Limited Edition',
      color: '#10b981'
    },
    {
      year: '2023',
      title: 'Thành công',
      description: 'Đạt 10,000+ khách hàng hài lòng trên toàn quốc',
      color: '#f59e0b'
    },
    {
      year: '2024',
      title: 'Tương lai',
      description: 'Hướng tới trở thành thương hiệu squishy số 1 Việt Nam',
      color: '#ef4444'
    }
  ];

  const teamValues = [
    {
      title: 'Chất lượng',
      description: 'Cam kết mang đến những sản phẩm squishy chất lượng cao nhất',
      gradient: 'linear-gradient(135deg, #ff6b9d, #ffa8cc)'
    },
    {
      title: 'Sáng tạo',
      description: 'Không ngừng đổi mới và sáng tạo trong thiết kế sản phẩm',
      gradient: 'linear-gradient(135deg, #a855f7, #c084fc)'
    },
    {
      title: 'Khách hàng',
      description: 'Đặt khách hàng làm trung tâm trong mọi hoạt động',
      gradient: 'linear-gradient(135deg, #10b981, #34d399)'
    },
    {
      title: 'Đam mê',
      description: 'Tình yêu và đam mê với những món đồ chơi dễ thương',
      gradient: 'linear-gradient(135deg, #f59e0b, #fbbf24)'
    }
  ];

  const achievements = [
    { number: '4+', label: 'Năm kinh nghiệm', color: '#ff6b9d' },
    { number: '500+', label: 'Sản phẩm', color: '#a855f7' },
    { number: '10K+', label: 'Khách hàng', color: '#10b981' },
    { number: '50+', label: 'Đối tác', color: '#f59e0b' }
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="about-page-popmart"
    >
      <Header currentPage="about" onNavigate={onNavigate} />
      
      <main className="about-main">
        {/* Hero Section */}
        <section className="about-hero">
          <div className="hero-background">
            <div className="floating-shapes">
              {[...Array(8)].map((_, i) => (
                <motion.div
                  key={i}
                  className={`floating-shape shape-${i + 1}`}
                  animate={{
                    y: [0, -30, 0],
                    x: [0, 15, -15, 0],
                    rotate: [0, 180, 360],
                    scale: [1, 1.2, 1]
                  }}
                  transition={{
                    duration: 6 + i,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: i * 0.5
                  }}
                />
              ))}
            </div>
          </div>
          
          <div className="container">
            <motion.div
              className="hero-content"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <motion.h1 
                className="hero-title"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3, duration: 0.8 }}
              >
                <span className="title-line-1">Về Dudu Store</span>
                <span className="title-line-2">Câu chuyện của chúng tôi</span>
              </motion.h1>
              
              <motion.p 
                className="hero-subtitle"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.6 }}
              >
                Hành trình tạo nên những khoảnh khắc vui vẻ với bộ sưu tập squishy tuyệt vời
              </motion.p>
            </motion.div>
          </div>
        </section>

        {/* Story Timeline */}
        <section className="story-timeline">
          <div className="container">
            <motion.div
              className="section-header"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h2>Hành trình phát triển</h2>
              <p>Từ một ý tưởng nhỏ đến thương hiệu được yêu thích</p>
            </motion.div>

            <div className="timeline-container">
              <div className="timeline-line"></div>
              {storyTimeline.map((item, index) => (
                <motion.div
                  key={index}
                  className="timeline-item"
                  initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.2 }}
                  style={{ '--item-color': item.color }}
                >
                  <div className="timeline-content">
                    <div className="timeline-year">{item.year}</div>
                    <h3>{item.title}</h3>
                    <p>{item.description}</p>
                  </div>
                  <div className="timeline-dot"></div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Values Section */}
        <section className="values-section">
          <div className="container">
            <motion.div
              className="section-header"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h2>Giá trị cốt lõi</h2>
              <p>Những giá trị định hướng mọi hoạt động của chúng tôi</p>
            </motion.div>

            <div className="values-grid">
              {teamValues.map((value, index) => (
                <motion.div
                  key={index}
                  className="value-card"
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ y: -10, scale: 1.02 }}
                  style={{ '--value-gradient': value.gradient }}
                >
                  <div className="value-background"></div>
                  <div className="value-content">
                    <h3>{value.title}</h3>
                    <p>{value.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Achievements */}
        <section className="achievements-section">
          <div className="container">
            <motion.div
              className="section-header"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h2>Thành tựu đạt được</h2>
              <p>Những con số ấn tượng trong hành trình phát triển</p>
            </motion.div>

            <div className="achievements-grid">
              {achievements.map((achievement, index) => (
                <motion.div
                  key={index}
                  className="achievement-card"
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1, type: "spring" }}
                  whileHover={{ scale: 1.05 }}
                  style={{ '--achievement-color': achievement.color }}
                >
                  <div className="achievement-number">{achievement.number}</div>
                  <div className="achievement-label">{achievement.label}</div>
                  <div className="achievement-glow"></div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Vision Section */}
        <section className="vision-section">
          <div className="container">
            <motion.div
              className="vision-content"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <div className="vision-text">
                <h2>Tầm nhìn tương lai</h2>
                <p>
                  Chúng tôi hướng tới việc trở thành thương hiệu squishy hàng đầu Việt Nam, 
                  mang đến niềm vui và hạnh phúc cho hàng triệu khách hàng thông qua những 
                  sản phẩm chất lượng cao và dịch vụ tuyệt vời.
                </p>
                <div className="vision-features">
                  <div className="feature-item">
                    <h4>Đổi mới không ngừng</h4>
                    <p>Luôn tìm kiếm và phát triển những sản phẩm mới độc đáo</p>
                  </div>
                  <div className="feature-item">
                    <h4>Chất lượng hàng đầu</h4>
                    <p>Cam kết về chất lượng sản phẩm và dịch vụ khách hàng</p>
                  </div>
                  <div className="feature-item">
                    <h4>Cộng đồng yêu thương</h4>
                    <p>Xây dựng cộng đồng những người yêu thích squishy</p>
                  </div>
                </div>
              </div>
              
              <div className="vision-visual">
                <motion.div
                  className="vision-card"
                  animate={{
                    y: [0, -20, 0],
                    rotateY: [0, 5, 0]
                  }}
                  transition={{
                    duration: 6,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                >
                  <div className="card-content">
                    <h3>Dudu Store 2030</h3>
                    <div className="future-stats">
                      <div className="stat">
                        <span className="stat-number">100K+</span>
                        <span className="stat-label">Khách hàng</span>
                      </div>
                      <div className="stat">
                        <span className="stat-number">1000+</span>
                        <span className="stat-label">Sản phẩm</span>
                      </div>
                      <div className="stat">
                        <span className="stat-number">50+</span>
                        <span className="stat-label">Cửa hàng</span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="cta-section">
          <div className="container">
            <motion.div
              className="cta-content"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
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
                  Xem sản phẩm
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                    <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" strokeWidth="2"/>
                  </svg>
                </motion.button>
                
                <motion.button
                  className="cta-secondary"
                  onClick={() => onNavigate('contact')}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Liên hệ
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

export default AboutPagePopMart;