import React from 'react';
import { motion } from 'framer-motion';
import { Autoplay, Navigation, Pagination } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import '../assets/CSS/Carousel.css';
import meo1 from '../images/meo1.webp';
import meo2 from '../images/meo2.webp';
import meo3 from '../images/meo3.png';

const AnimatedCarousel = () => {
  const slideVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { 
      opacity: 1, 
      scale: 1,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.6 }}
    >
      <Swiper
        modules={[Navigation, Pagination, Autoplay]}
        spaceBetween={50}
        slidesPerView={1}
        navigation
        pagination={{ clickable: true }}
        autoplay={{ delay: 5000 }}
        loop={true}
        className="animated-swiper"
      >
        <SwiperSlide>
          <motion.div
            variants={slideVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <img src={meo1} alt="Dudu Taba Squishy Collection" />
            <motion.div 
              className="carousel-caption"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1, duration: 0.6 }}
            >
              <p>Bộ sưu tập Squishy đáng yêu nhất!</p>
            </motion.div>
          </motion.div>
        </SwiperSlide>
        <SwiperSlide>
          <motion.div
            variants={slideVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <img src={meo2} alt="Premium Squishy Toys" />
            <motion.div 
              className="carousel-caption"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1, duration: 0.6 }}
            >
              <p>Chất lượng cao, an toàn cho trẻ em</p>
            </motion.div>
          </motion.div>
        </SwiperSlide>
        <SwiperSlide>
          <motion.div
            variants={slideVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <img src={meo3} alt="Cute Squishy Characters" />
            <motion.div 
              className="carousel-caption"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1, duration: 0.6 }}
            >
              <p>Những nhân vật dễ thương, mềm mại</p>
            </motion.div>
          </motion.div>
        </SwiperSlide>
      </Swiper>
    </motion.div>
  );
};

export default AnimatedCarousel;