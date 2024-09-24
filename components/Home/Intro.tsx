// components/Intro.tsx
"use client";

import React, { useEffect, useRef } from "react";
import anime from "animejs";

interface IntroProps {
  onComplete: () => void;
}

const Intro: React.FC<IntroProps> = ({ onComplete }) => {
  const introRef = useRef<HTMLDivElement>(null);
  const logoRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    console.log("Intro Mounted");

    // Animação de opacidade do logo
    anime({
      targets: logoRef.current,
      opacity: [0, 1],
      duration: 1000,
      easing: "easeInOutQuad",
    });

    // Animação de movimento e rotação do logo
    const logoMoving = setTimeout(() => {
      anime({
        targets: logoRef.current,
        translateY: [
          { value: -20, duration: 2000 },
          { value: 20, duration: 2000 },
        ],
        rotate: ["1deg", "-1deg"],
        loop: true,
        direction: "alternate",
        easing: "easeInOutSine",
        delay: anime.stagger(100),
      });
    }, 100);

    // Após 4 segundos, termina a intro
    const introTimeout = setTimeout(() => {
      console.log("Intro Timeout Triggered");
      anime({
        targets: introRef.current,
        opacity: [1, 0],
        scaleX: [1, 0],
        scaleY: [1, 0],
        easing: "easeInOutQuad",
        duration: 1500,
        complete: () => {
          console.log("Intro Animation Complete");
          onComplete();
        },
      });
      clearTimeout(logoMoving);
    }, 4000);

    return () => {
      console.log("Intro Unmounted");
      clearTimeout(logoMoving);
      clearTimeout(introTimeout);
    };
  }, [onComplete]);

  return (
    <div
      ref={introRef}
      className="absolute top-0 left-0 w-full h-full bg-black flex items-center justify-center flex-col z-50 transition-opacity duration-1500"
      style={{ opacity: 1, transform: "scale(1)" }}
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
      {/* Adicione mais conteúdo de intro aqui, se necessário */}
    </div>
  );
};

export default Intro;
