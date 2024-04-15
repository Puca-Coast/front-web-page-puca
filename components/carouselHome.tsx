import React from 'react';
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "../styles/carouselStyles.css";

export default function CarouselHome() {
  return (
    <Swiper
      spaceBetween={0}
      slidesPerView={3}
      loop={true}
      onSlideChange={() => console.log("slide change")}
      onSwiper={(swiper) => console.log(swiper)}
      className="h-full w-full relative"
    >
      <SwiperSlide style={{width: '100%'}}>
        <Image layout="fill"  src="/assets/photo1.jpg" alt="image1" />
      </SwiperSlide>
      <SwiperSlide  style={{width: '100%'}}>
        <Image layout="fill" src="/assets/photo2.jpg" alt="image2" />
      </SwiperSlide>
      <SwiperSlide  style={{width: '100%'}}>
        <Image layout="fill" src="/assets/photo3.jpg" alt="image3" />
      </SwiperSlide>
      <SwiperSlide  style={{width: '100%'}}>
        <Image layout="fill" src="/assets/photo4.jpg" alt="image4" />
      </SwiperSlide>
      {/* Adicione mais SwiperSlides se necessário */}
    </Swiper>
  );
}
