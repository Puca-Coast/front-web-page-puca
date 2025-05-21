"use client";

import React from "react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import CarouselHome from "@/components/features/home/carouselHome";

interface MainContentProps {
  isHome: boolean;
}

const MainContent: React.FC<MainContentProps> = ({ isHome }) => {
  const headerHeight = 6; // Altura real do seu header em pixels
  const footerHeight = 64; // Altura real do seu footer em pixels

  // Calcula a altura disponível para o carousel
  const carouselHeight = `calc(100vh - ${headerHeight}px - ${footerHeight}px)`;

  return (
    <div className="w-full h-screen flex flex-col">
      <Header isHome={isHome} />

      <div
        className="flex-grow"
        style={{
          marginTop: `${headerHeight}em`,
          marginBottom: `${footerHeight}px`,
          height: carouselHeight,
        }}
      >
        <CarouselHome carouselHeight={carouselHeight} />
      </div>

      <Footer isHome={isHome} />
    </div>
  );
};

export default MainContent;
