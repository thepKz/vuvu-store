import React from 'react';
import { motion } from 'framer-motion';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Navigation, Pagination, EffectCoverflow } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/effect-coverflow';
import '../styles/ProductCarousel.css';

import meo1 from '../images/meo1.webp';
import meo2 from '../images/meo2.webp';
import meo3 from '../images/meo3.png';

const ProductCarousel = () => {
  const slides = [
    {
      image: meo1,
      title: "Bộ sưu tập Squishy đáng yêu nhất!",
      subtitle: "Khám phá những món đồ chơi mềm mại và dễ thương"
    },
    {
      image: meo2,
      title: "Chất lượng cao, an toàn cho trẻ em",
      subtitle: "Được làm từ chất liệu cao cấp, không độc hại"
    },
    {
      image: meo3,
      title: "Những nhân vật dễ thương, mềm mại",
      subtitle: "Mang lại cảm giác thư giãn và vui vẻ"
    }
  ];

  return (
    <section className="carousel-section">
      <div className="container">
        <motion.div
          className="section-header"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="section-title">🌟 Bộ sưu tập nổi bật 🌟</h2>
          <p className="section-subtitle">
            Khám phá những sản phẩm squishy tuyệt vời nhất của chúng tôi
          </p>
        </motion.div>

        <motion.div
          className="carousel-container"
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <Swiper
            modules={[Navigation, Pagination, Autoplay, EffectCoverflow]}
            spaceBetween={30}
            slidesPerView={1}
            navigation
            pagination={{ clickable: true }}
            autoplay={{ 
              delay: 5000,
              disableOnInteraction: false
            }}
            effect="coverflow"
            coverflowEffect={{
              rotate: 50,
              stretch: 0,
              depth: 100,
              modifier: 1,
              slideShadows: true,
            }}
            loop={true}
            className="product-swiper"
          >
            {slides.map((slide, index) => (
              <SwiperSlide key={index}>
                <motion.div
                  className="slide-content"
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                >
                  <div className="slide-image">
                    <motion.img
                      src={slide.image}
                      alt={slide.title}
                      whileHover={{ scale: 1.05 }}
                      transition={{ duration: 0.3 }}
                    />
                  </div>
                  <motion.div
                    className="slide-caption"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5, duration: 0.6 }}
                  >
                    <h3>{slide.title}</h3>
                    <p>{slide.subtitle}</p>
                  </motion.div>
                </motion.div>
              </SwiperSlide>
            ))}
          </Swiper>
        </motion.div>
      </div>
    </section>
  );
};

export default ProductCarousel;