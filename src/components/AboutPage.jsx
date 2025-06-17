import React from 'react';
import { motion } from 'framer-motion';
import Header from './Header';
import Footer from './Footer';
import '../styles/AboutPage.css';

const AboutPage = ({ onNavigate }) => {
  const teamMembers = [
    {
      name: "Nguyễn Văn A",
      role: "Founder & CEO",
      image: "👨‍💼",
      description: "Người sáng lập với tình yêu dành cho squishy"
    },
    {
      name: "Trần Thị B",
      role: "Creative Director",
      image: "👩‍🎨",
      description: "Chuyên gia thiết kế và sáng tạo sản phẩm"
    },
    {
      name: "Lê Văn C",
      role: "Quality Manager",
      image: "👨‍🔬",
      description: "Đảm bảo chất lượng sản phẩm tốt nhất"
    }
  ];

  const values = [
    {
      icon: "🌟",
      title: "Chất lượng",
      description: "Cam kết mang đến những sản phẩm squishy chất lượng cao nhất"
    },
    {
      icon: "💝",
      title: "Tình yêu",
      description: "Tạo ra những món đồ chơi mang lại niềm vui và hạnh phúc"
    },
    {
      icon: "🛡️",
      title: "An toàn",
      description: "Sử dụng chất liệu an toàn, không độc hại cho trẻ em"
    },
    {
      icon: "🌍",
      title: "Bền vững",
      description: "Cam kết bảo vệ môi trường trong quá trình sản xuất"
    }
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="about-page"
    >
      <Header currentPage="about" onNavigate={onNavigate} />
      
      <main className="about-main">
        <section className="about-hero">
          <div className="container">
            <motion.div
              className="about-hero-content"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h1>Về Dudu Taba Squishy</h1>
              <p>Câu chuyện của chúng tôi bắt đầu từ tình yêu dành cho những món đồ chơi mềm mại và dễ thương</p>
            </motion.div>
          </div>
        </section>

        <section className="about-story">
          <div className="container">
            <div className="story-content">
              <motion.div
                className="story-text"
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
              >
                <h2>Câu chuyện của chúng tôi</h2>
                <p>
                  Dudu Taba Squishy được thành lập vào năm 2020 với mong muốn mang đến những món đồ chơi 
                  squishy chất lượng cao và an toàn cho trẻ em Việt Nam. Chúng tôi tin rằng mỗi đứa trẻ 
                  đều xứng đáng có những món đồ chơi tuyệt vời nhất.
                </p>
                <p>
                  Từ một cửa hàng nhỏ, chúng tôi đã phát triển thành một trong những thương hiệu squishy 
                  hàng đầu tại Việt Nam, với hơn 500 sản phẩm đa dạng và 10,000+ khách hàng hài lòng.
                </p>
                <div className="story-stats">
                  <div className="stat">
                    <span className="stat-number">4+</span>
                    <span className="stat-label">Năm kinh nghiệm</span>
                  </div>
                  <div className="stat">
                    <span className="stat-number">500+</span>
                    <span className="stat-label">Sản phẩm</span>
                  </div>
                  <div className="stat">
                    <span className="stat-number">10K+</span>
                    <span className="stat-label">Khách hàng</span>
                  </div>
                </div>
              </motion.div>
              
              <motion.div
                className="story-visual"
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.2 }}
              >
                <div className="visual-container">
                  <div className="visual-item">🧸</div>
                  <div className="visual-item">🐱</div>
                  <div className="visual-item">🐰</div>
                  <div className="visual-item">🐻</div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        <section className="about-values">
          <div className="container">
            <motion.div
              className="section-header"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2>Giá trị cốt lõi</h2>
              <p>Những giá trị định hướng mọi hoạt động của chúng tôi</p>
            </motion.div>
            
            <div className="values-grid">
              {values.map((value, index) => (
                <motion.div
                  key={index}
                  className="value-card"
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  whileHover={{ y: -10 }}
                >
                  <div className="value-icon">{value.icon}</div>
                  <h3>{value.title}</h3>
                  <p>{value.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        <section className="about-team">
          <div className="container">
            <motion.div
              className="section-header"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2>Đội ngũ của chúng tôi</h2>
              <p>Những người đam mê tạo ra những sản phẩm tuyệt vời</p>
            </motion.div>
            
            <div className="team-grid">
              {teamMembers.map((member, index) => (
                <motion.div
                  key={index}
                  className="team-card"
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  whileHover={{ y: -10 }}
                >
                  <div className="member-avatar">{member.image}</div>
                  <h3>{member.name}</h3>
                  <p className="member-role">{member.role}</p>
                  <p className="member-description">{member.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        <section className="about-cta">
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
                  className="btn btn-primary"
                  onClick={() => onNavigate('products')}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  🛍️ Xem sản phẩm
                </motion.button>
                <motion.button
                  className="btn btn-secondary"
                  onClick={() => onNavigate('contact')}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  📞 Liên hệ
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

export default AboutPage;