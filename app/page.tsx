"use client";
import React, { useEffect, useRef } from 'react';
import anime from 'animejs';

export default function Home() {
  const introRef = useRef(null);
  const logoRef = useRef(null); 

  useEffect(() => {
    anime({
      targets: logoRef.current,
      opacity: [0, 1],
      duration: 1000,
      easing: 'easeInOutQuad',
    });


    setTimeout(() => {
      anime({
        targets: logoRef.current,
        translateY: [
          { value: -20, duration: 2000 },
          { value: 20, duration: 2000 }
        ],
        rotate: ['1deg', '-1deg'], 
        loop: true,
        direction: 'alternate',
        easing: 'easeInOutSine',
        delay: anime.stagger(100) 
      });
    }, 100);

    setTimeout(() => {
      anime({
        targets: introRef.current,
        opacity: 1,
        scaleX: [0, 100],
        scaleY: [0, 100],
        easing: 'easeInOutQuad',
        duration: 1500,
        begin: () => {
          introRef.current.style.opacity = 1;
        },
        complete: () => {
          logoRef.current.style.display = 'none';
        }
      });
    }, 4000);

  }, []);

  return (
    <div className="flex items-center justify-center h-screen w-screen p-0 m-0 relative overflow-hidden">
      <video 
        autoPlay 
        loop 
        muted 
        playsInline 
        disablePictureInPicture
        className="object-cover w-full h-full absolute z-0"
        src="/assets/introVideo.mp4"
      ></video>
      <img src="/assets/logo.png" ref={logoRef} className="relative z-10" style={{ opacity: 0, width: '50%' }} />
      <div ref={introRef} className="absolute w-full h-full bg-white" style={{ opacity: 0 }}></div>
    </div>
  );
}
