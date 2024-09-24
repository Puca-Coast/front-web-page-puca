"use client";

import React from "react";
import LookbookSection from "./LookbookSection";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

interface Image {
  id: string;
  src: string;
  orientation: "horizontal" | "vertical";
}

interface Section {
  id: string;
  pattern: "single" | "double" | "triple" | "mixed" | "masonry";
  images: Image[];
}

const Lookbook: React.FC = () => {
  const sections: Section[] = [
    {
      id: "section-double",
      pattern: "double",
      images: [
        { id: "img1", src: "/assets/photo1.jpg", orientation: "horizontal" },
        { id: "img2", src: "/assets/photo3.jpg", orientation: "horizontal" },
      ],
    },
    {
      id: "section-triple",
      pattern: "triple",
      images: [
        { id: "img3", src: "/assets/photo4.jpg", orientation: "horizontal" },
        { id: "img4", src: "/assets/photo1.jpg", orientation: "horizontal" },
        { id: "img5", src: "/assets/photo4.jpg", orientation: "horizontal" },
      ],
    },
    {
      id: "section-mixed",
      pattern: "mixed",
      images: [
        { id: "img6", src: "/assets/photo1.jpg", orientation: "horizontal" },
        { id: "img7", src: "/assets/photo4.jpg", orientation: "vertical" },
        { id: "img8", src: "/assets/photo1.jpg", orientation: "horizontal" },
      ],
    },
    // Adicione mais seções conforme necessário
  ];

  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      <Header isHome={false}  />
      
      {/* Aumentar o padding lateral para dar mais espaço */}
      <div className="flex-1 px-6 lg:px-36 py-8">
        {sections.map((section) => (
          <LookbookSection key={section.id} pattern={section.pattern} images={section.images} />
        ))}
      </div>

      <Footer isHome={false} />
    </div>
  );
};

export default Lookbook;
