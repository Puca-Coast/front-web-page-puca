"use client";

import React, { useEffect, useRef } from "react";
import anime from "animejs";

const AnimeTest = () => {
  const boxRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    console.log("anime object:", anime);
    console.log("anime type:", typeof anime);
    
    if (boxRef.current) {
      try {
        // Basic animation
        anime({
          targets: boxRef.current,
          translateX: 250,
          rotate: '1turn',
          backgroundColor: '#FFC107',
          duration: 2000,
          loop: true
        });
        console.log("Animation started successfully");
      } catch (error) {
        console.error("Animation error:", error);
      }
    }
  }, []);

  return (
    <div className="flex justify-center items-center h-screen">
      <div 
        ref={boxRef}
        className="w-32 h-32 bg-blue-500"
        style={{ margin: '0 auto' }}
      ></div>
    </div>
  );
};

export default AnimeTest; 