"use client";

import React, { useEffect, useRef } from "react";
import anime from "animejs";

interface IntroProps {
  onComplete: () => void;
}

const Intro: React.FC<IntroProps> = ({ onComplete }) => {
  const introRef = useRef<HTMLDivElement>(null);
  const logoRef = useRef<HTMLImageElement>(null);

  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
  console.log(API_BASE_URL);

  useEffect(() => {
    // Animação de entrada da logo
    anime({
      targets: logoRef.current,
      opacity: [0, 1],
      duration: 1200,
      easing: "easeInOutQuad",
    });

    const logoMoving = setTimeout(() => {
      anime({
        targets: logoRef.current,
        translateY: [
          { value: -15, duration: 2500 },
          { value: 15, duration: 2500 },
        ],
        rotate: ["0.5deg", "-0.5deg"],
        loop: true,
        direction: "alternate",
        easing: "easeInOutSine",
        delay: anime.stagger(200),
      });
    }, 100);

    // Fetch dos dados do carousel durante a Intro (caso ainda não estejam em cache)
    const fetchCarouselPhotos = async () => {
      if (localStorage.getItem("carouselPhotos")) return;
      try {
        const response = await fetch(
          `${API_BASE_URL}/api/lookbook/photos?launch=primavera2024&limit=10`
        );
        const data = await response.json();
        if (data.success) {
          localStorage.setItem("carouselPhotos", JSON.stringify(data.data));
        } else {
          console.error("Erro ao buscar fotos do carousel na Intro:", data.error);
        }
      } catch (error) {
        console.error("Erro ao buscar fotos do carousel na Intro:", error);
      }
    };
    fetchCarouselPhotos();

    const introTimeout = setTimeout(() => {
      anime({
        targets: introRef.current,
        opacity: [1, 0],
        easing: "easeInOutQuad",
        duration: 3000,
        complete: () => onComplete(),
      });
      clearTimeout(logoMoving);
    }, 4000);

    return () => {
      clearTimeout(logoMoving);
      clearTimeout(introTimeout);
    };
  }, [onComplete]);

  return (
    <div
      ref={introRef}
      className="absolute top-0 left-0 w-full h-full bg-black flex items-center justify-center flex-col z-50 transition-opacity duration-1500 overflow-y-hidden"
      style={{ opacity: 1 }}
    >
      <video
        autoPlay
        loop
        muted
        playsInline
        disablePictureInPicture
        className="object-cover w-full h-full absolute z-0"
        src="/assets/introVideo.mp4"
      ></video>
      <img
        src="/assets/logo.png"
        ref={logoRef}
        className="absolute z-10"
        style={{ opacity: 0, width: "50%" }}
        alt="Logo"
      />
    </div>
  );
};

export default Intro;
