// components/carouselHome.tsx
"use client";

import React, { useRef, useEffect } from "react";
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import "swiper/css";
import "../../styles/carouselStyles.css";

export default function CarouselHome() {
  const swiperRef = useRef(null);

  useEffect(() => {
    if (swiperRef.current) {
      // Inicialmente, opacidade 0
      swiperRef.current.style.opacity = 0;
      // Definir a transição
      swiperRef.current.style.transition = "opacity 1.5s ease-in-out";
      // Forçar reflow para garantir que a transição será aplicada
      void swiperRef.current.offsetWidth;
      // Definir opacidade para 1 para iniciar a transição
      swiperRef.current.style.opacity = 1;
    }
  }, []);

  return (
    <Swiper
      spaceBetween={30}
      slidesPerView={1.5}
      loop={true}
      speed={12000} // Controla a velocidade da transição (em milissegundos)
      autoplay={{
        delay: 0, // Tempo entre transições automáticas (em milissegundos)
        disableOnInteraction: false, // Continua o autoplay após interações do usuário
      }}
      modules={[Autoplay]}
      onSlideChange={() => console.log("slide change")}
      onSwiper={(swiper) => {
        swiper.wrapperEl.style.transitionTimingFunction = "linear";
      }}    
      className="h-full w-full relative bg-transparent"
      style={{ opacity: 0 }} // Inicialmente opacidade 0
      ref={swiperRef}
    >
      <SwiperSlide
        style={{
          width: "100%",
          height: "auto",
          objectPosition: "50% 50%",
          objectFit: "cover",
        }}
      >
        <Image src="/assets/photo1.jpg" alt="image1" fill />
      </SwiperSlide>
      <SwiperSlide
        style={{
          width: "100%",
          height: "auto",
          objectPosition: "50% 50%",
          objectFit: "cover",
        }}
      >
        <Image src="/assets/photo2.jpg" alt="image2" fill />
      </SwiperSlide>
      <SwiperSlide
        style={{
          width: "100%",
          height: "auto",
          objectPosition: "50% 50%",
          objectFit: "cover",
        }}
      >
        <Image src="/assets/photo3.jpg" alt="image3" fill />
      </SwiperSlide>
      <SwiperSlide
        style={{
          width: "100%",
          height: "auto",
          objectPosition: "50% 50%",
          objectFit: "cover",
        }}
      >
        <Image src="/assets/photo4.jpg" alt="image4" fill />
      </SwiperSlide>
      {/* Adicione mais SwiperSlides se necessário */}
    </Swiper>
  );
}
