"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

interface IntroProps {
  onComplete: () => void;
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export default function Intro({ onComplete }: IntroProps) {
  const [introState, setIntroState] = useState<'active' | 'fading' | 'complete'>('active');
  const [imagesPreloaded, setImagesPreloaded] = useState(false);

  // Pré-carregamento dos dados do carrossel e imagens durante a exibição da intro
  useEffect(() => {
    const preloadCarouselData = async () => {
      // 1. Buscar dados das imagens se não estiverem em cache
      if (!localStorage.getItem("carouselPhotos")) {
        try {
          const response = await fetch(
            `${API_BASE_URL}/api/lookbook/photos?launch=primavera2024&limit=10`
          );
          const data = await response.json();
          
          if (data.success) {
            localStorage.setItem("carouselPhotos", JSON.stringify(data.data));
            
            // 2. Pré-carregar pelo menos 3 imagens
            const preloadImages = async () => {
              try {
                const imagePromises = data.data.slice(0, 3).map((photo: any) => {
                  return new Promise((resolve, reject) => {
                    const img = new window.Image();
                    img.src = photo.url;
                    img.onload = () => resolve(img);
                    img.onerror = reject;
                  });
                });
                
                await Promise.all(imagePromises);
                setImagesPreloaded(true);
              } catch (error) {
                console.error("Erro ao pré-carregar imagens:", error);
                // Mesmo com erro, continuamos o fluxo
                setImagesPreloaded(true);
              }
            };
            
            preloadImages();
          }
        } catch (error) {
          setImagesPreloaded(true); // Continuar mesmo com erro
        }
      } else {
        // Se já temos dados em cache, apenas marcar como carregado
        setImagesPreloaded(true);
      }
    };
    
    preloadCarouselData();
    
    // Iniciar fade out da intro após 3.5 segundos
    const startFadeTimer = setTimeout(() => {
      setIntroState('fading');
    }, 3500);
    
    return () => clearTimeout(startFadeTimer);
  }, []);
  
  // Monitorar quando o estado muda para 'fading' e imagens estão pré-carregadas
  useEffect(() => {
    if (introState === 'fading' && imagesPreloaded) {
      // Após iniciar o fade out, espera mais 1 segundo antes de completar
      const completeTimer = setTimeout(() => {
        setIntroState('complete');
        onComplete();
      }, 1500);
      
      return () => clearTimeout(completeTimer);
    }
  }, [introState, imagesPreloaded, onComplete]);

  return (
    <AnimatePresence>
      {introState !== 'complete' && (
        <motion.div
          className="absolute top-0 left-0 w-full h-full bg-black flex items-center justify-center flex-col z-50 overflow-y-hidden"
          initial={{ opacity: 1 }}
          animate={{ 
            opacity: introState === 'fading' ? 0 : 1 
          }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1, ease: "easeInOut" }}
        >
          <video
            autoPlay
            loop
            muted
            playsInline
            disablePictureInPicture
            className="object-cover w-full h-full absolute z-0"
            src="/assets/introVideo.mp4"
          />
          
          <motion.div 
            initial={{ opacity: 0, y: 0 }}
            animate={{ 
              opacity: introState === 'fading' ? 0 : 1, 
              y: [0, -15, 15, 0],
              transition: { 
                opacity: { duration: 1, ease: "easeInOut" },
                y: { 
                  duration: 5, 
                  repeat: Infinity, 
                  repeatType: "reverse", 
                  ease: "easeInOut" 
                }
              }
            }}
            className="z-10"
          >
            <Image
              src="/assets/logo.png"
              alt="Logo"
              width={500}
              height={200}
              priority
              className="w-1/2 mx-auto"
            />
          </motion.div>
          
          {/* Indicador de pré-carregamento */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ 
              opacity: imagesPreloaded ? 0 : 0.7
            }}
            className="absolute bottom-10 left-0 right-0 flex justify-center items-center text-white z-20"
          >
            <div className="flex gap-2">
              <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
              <div className="w-2 h-2 bg-white rounded-full animate-pulse delay-100"></div>
              <div className="w-2 h-2 bg-white rounded-full animate-pulse delay-200"></div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
