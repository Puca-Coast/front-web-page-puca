"use client";

import React, { useEffect, useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import LookbookSection from "@/components/LookBook/LookbookSection";
import anime from "animejs/lib/anime.es.js";
import Image from "next/image";

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

const LookbookPage: React.FC = () => {
  const [sections, setSections] = useState<Section[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulação de busca de seções (substitua pela sua lógica de obtenção de dados)
    const fetchSections = async () => {
      // Exemplo estático:
      setSections([
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
      ]);
      setIsLoading(false);
    };

    fetchSections();
  }, []);

  useEffect(() => {
    if (!isLoading) {
      // Animação de entrada suave após o carregamento das seções
      anime.timeline()
        .add({
          targets: '.lookbook-section',
          opacity: [0, 1],
          translateY: [50, 0],
          easing: 'easeOutExpo',
          duration: 800,
          delay: anime.stagger(100),
        })
        .add({
          targets: '.preloader',
          opacity: [1, 0],
          duration: 1500,
          easing: 'easeInOutQuad',
          complete: function(anim) {
            document.querySelector('.preloader')?.classList.add('hidden');
          }
        });
    }
  }, [isLoading]);

  return (
    <>
      <div className="min-h-screen flex flex-col">
        <Header isHome={false}  />

        {/* Preloader */}
        {isLoading && (
          <div className="preloader fixed inset-0 bg-white flex items-center justify-center z-50">
            <Image src="/assets/logo_mini.svg" alt="Logo Puca Coast" width={100} height={100} />
          </div>
        )}

        {/* Conteúdo da Página */}
        <div className="flex-1 px-6 lg:px-36 py-8">
          {sections.map((section) => (
            <LookbookSection key={section.id} pattern={section.pattern} images={section.images} />
          ))}
        </div>

        <Footer isHome={false} />
      </div>

      <style jsx>{`
        /* Preloader */
        .preloader {
          transition: opacity 1.5s ease-in-out;
        }
        .preloader.hidden {
          display: none;
        }
      `}</style>
    </>
  );
};

export default LookbookPage;
