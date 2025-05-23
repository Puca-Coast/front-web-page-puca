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
  // Estado para controlar se a intro foi concluída
  const [introCompleted, setIntroCompleted] = useState(!showIntro);
  // Estado para controlar a pré-renderização do MainContent antes da intro terminar
  const [preRenderMainContent, setPreRenderMainContent] = useState(!showIntro);

  // Função executada quando a intro termina
  const handleIntroComplete = () => {
    console.log("Intro Concluída");
    setIntroCompleted(true);
  };
  
  // Iniciar pré-renderização do MainContent 1.5 segundos antes da intro terminar
  useEffect(() => {
    if (showIntro && !preRenderMainContent) {
      const timer = setTimeout(() => {
        console.log("Iniciando pré-renderização do MainContent");
        setPreRenderMainContent(true);
      }, 2000); // Pré-renderiza após 2s (a intro dura ~4.5s no total)
      
      return () => clearTimeout(timer);
    }
  }, [showIntro, preRenderMainContent]);

  return (
    <>
      {/* Renderizar MainContent com opacidade 0 antes da intro terminar para pré-carregamento */}
      {preRenderMainContent && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: introCompleted ? 1 : 0 }}
          transition={{ duration: 1, ease: "easeInOut" }}
          className="w-full h-screen"
        >
          <MainContent isHome={!introCompleted} />
        </motion.div>
      )}
      
      {/* Intro apenas se não estiver completa */}
      {!introCompleted && showIntro && (
        <Intro onComplete={handleIntroComplete} />
      )}
    </>
  );
};

export default Home; 