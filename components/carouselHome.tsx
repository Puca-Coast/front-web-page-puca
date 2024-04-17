import React, {useRef, useEffect} from 'react';
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "../styles/carouselStyles.css";

export default function CarouselHome() {
  const swiperRef = useRef(null);
  
  useEffect(() => {
    setTimeout(() => {
      swiperRef.current.style.display = "block";
    }, 6000);
  }, []);

  return (
    <Swiper
      spaceBetween={0}
      slidesPerView={1}
      loop={true}
      onSlideChange={() => console.log("slide change")}
      onSwiper={(swiper) => console.log(swiper)}
      className="h-full w-full relative"
      style={{display: "none"}}
      ref={swiperRef}
    >
      <SwiperSlide style={{width: '100%', height: 'auto', objectPosition: '50% 50%', objectFit: "cover"}}>
        <Image layout="fill"  src="/assets/photo1.jpg" alt="image1" />
      </SwiperSlide>
      <SwiperSlide  style={{width: '100%', height: '100%'}}>
        <Image layout="fill" src="/assets/photo2.jpg" alt="image2" />
      </SwiperSlide>
      <SwiperSlide  style={{width: '100%', height: '100%'}}>
        <Image layout="fill" src="/assets/photo3.jpg" alt="image3" />
      </SwiperSlide>
      <SwiperSlide  style={{width: '100%', height: '100%'}}>
        <Image layout="fill" src="/assets/photo4.jpg" alt="image4" />
      </SwiperSlide>
      {/* Adicione mais SwiperSlides se necessário */}
    </Swiper>
  );
}
