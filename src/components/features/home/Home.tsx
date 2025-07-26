"use client";

import React, { FC, useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Intro from "@/components/features/home/Intro";
import MainContent from "@/components/features/home/MainContent";

interface HomeProps {
  showIntro?: boolean;
}

/**
 * Componente unificado da página Home que pode exibir ou pular a intro
 * @param showIntro - Define se a intro deve ser mostrada ou não
 */
const Home: FC<HomeProps> = ({ showIntro = true }) => {
  console.log("🏠 Home component render - showIntro:", showIntro);
  
  // Estado para controlar se a intro foi concluída
  const [introCompleted, setIntroCompleted] = useState(!showIntro);
  // Estado para controlar a pré-renderização do MainContent antes da intro terminar
  const [preRenderMainContent, setPreRenderMainContent] = useState(!showIntro);

  // Debug log
  console.log("🏠 Home states:", { introCompleted, preRenderMainContent, showIntro });

  // Função executada quando a intro termina
  const handleIntroComplete = () => {
    console.log("✅ Intro Concluída");
    setIntroCompleted(true);
  };
  
  // Iniciar pré-renderização do MainContent 1.5 segundos antes da intro terminar
  useEffect(() => {
    console.log("🔄 Home useEffect triggered", { showIntro, preRenderMainContent });
    
    if (showIntro && !preRenderMainContent) {
      console.log("⏰ Setting up prerender timer");
      const timer = setTimeout(() => {
        console.log("🎬 Iniciando pré-renderização do MainContent");
        setPreRenderMainContent(true);
      }, 2000); // Pré-renderiza após 2s (a intro dura ~4.5s no total)
      
      return () => clearTimeout(timer);
    }
  }, [showIntro, preRenderMainContent]);

  // Simplified logic - if anything goes wrong, show MainContent
  const shouldShowMainContent = introCompleted || !showIntro;
  const shouldShowIntro = !introCompleted && showIntro;
  
  console.log("🎨 Rendering decisions:", {
    shouldShowMainContent,
    shouldShowIntro,
    introCompleted,
    showIntro
  });

  return (
    <>
      {/* Always render MainContent, control with z-index and opacity */}
      <motion.div
        initial={{ opacity: shouldShowMainContent ? 1 : 0 }}
        animate={{ opacity: shouldShowMainContent ? 1 : 0 }}
        transition={{ duration: 1, ease: "easeInOut" }}
        className="w-full h-screen relative"
        style={{ zIndex: shouldShowMainContent ? 10 : 1 }}
      >
        <MainContent isHome={!introCompleted} />
      </motion.div>
      
      {/* Intro overlay */}
      {shouldShowIntro && (
        <div className="fixed inset-0 z-50">
          <Intro onComplete={handleIntroComplete} />
        </div>
      )}
    </>
  );
};

export default Home; 