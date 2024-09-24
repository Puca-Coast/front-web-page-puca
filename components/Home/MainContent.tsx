// components/MainContent.tsx
"use client";

import React from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CarouselHome from "@/components/Home/carouselHome";

interface MainContentProps {
  isHome: boolean;
}

const MainContent: React.FC<MainContentProps> = ({ isHome }) => {
  return (
    <div className="w-full h-full flex flex-col">
      {/* Header */}
      <Header isHome={isHome} />

      {/* Conteúdo Principal */}
      <div
        className="flex items-center justify-center h-full w-full p-0 m-0 relative overflow-hidden flex-col bg-contain"
        style={{ backgroundImage: 'url(/assets/details.svg)' }}
      >
        <CarouselHome />
      </div>

      {/* Footer */}
      <Footer isHome={isHome} />
    </div>
  );
};

export default MainContent;
