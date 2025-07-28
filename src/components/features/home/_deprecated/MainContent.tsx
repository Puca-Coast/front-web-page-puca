"use client";

import { FC } from "react";
import Header from "@/components/layout/Header";
import SmartFooter from "@/components/layout/SmartFooter";
import CarouselHome from "@/components/features/home/CarouselHome";
import { MainContentProps } from "@/types";
import { LAYOUT_TOKENS } from "@/design-system/tokens/layout";

const MainContent: FC<MainContentProps> = ({ isHome }) => {
  // Use design tokens for consistent header height
  const headerHeight = LAYOUT_TOKENS.header.height; // 80px from design tokens
  
  // Calcula a altura disponível para o carousel
  const carouselHeight = `calc(100vh - ${headerHeight}px)`;
  console.log(isHome);
  return (
    <div
      className="w-full min-h-screen flex flex-col"
    >
      <Header isHome={isHome} />

      <div
        className="flex-grow"
        style={{
          marginTop: `${headerHeight}px`,
          minHeight: carouselHeight,
        }}
      >
        <CarouselHome carouselHeight={carouselHeight} />
      </div>

      <SmartFooter />
    </div>
  );
};

export default MainContent;
