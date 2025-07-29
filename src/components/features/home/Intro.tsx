"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

interface IntroProps {
  onComplete: () => void;
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export default function Intro({ onComplete }: IntroProps) {
  const [introState, setIntroState] = useState<'loading' | 'active' | 'fading' | 'complete'>('loading');
  const [imagesPreloaded, setImagesPreloaded] = useState(false);
  const [videoLoaded, setVideoLoaded] = useState(false);

  // Preload video
  useEffect(() => {
    const video = document.createElement('video');
    video.src = '/assets/introVideo.mp4';
    
    video.onloadeddata = () => {
      console.log('Video loaded successfully');
      setVideoLoaded(true);
    };
    
    video.onerror = () => {
      console.error('Error loading video');
      setVideoLoaded(true); // Continue anyway
    };
    
    // Force load
    video.load();
  }, []);

  // Start intro only when video is loaded
  useEffect(() => {
    if (videoLoaded && imagesPreloaded) {
      setIntroState('active');
      
      // Start fade timer
      const timer = setTimeout(() => {
        setIntroState('fading');
      }, 3500);
      
      return () => clearTimeout(timer);
    }
  }, [videoLoaded, imagesPreloaded]);

  // Preload carousel data
  useEffect(() => {
    const preloadCarouselData = async () => {
      try {
        const cached = localStorage.getItem("carousel_photos_v2");
        if (cached) {
          setImagesPreloaded(true);
          return;
        }

        const response = await fetch(
          `${API_BASE_URL}/api/lookbook/photos?launch=primavera2024&limit=10`
        );
        const data = await response.json();
        
        if (data.success && data.data) {
          // Preload first 3 images
          const imagePromises = data.data.slice(0, 3).map((photo: any) => {
            return new Promise((resolve) => {
              const img = new window.Image();
              img.src = photo.url;
              img.onload = resolve;
              img.onerror = resolve; // Continue even if error
            });
          });
          
          await Promise.all(imagePromises);
        }
      } catch (error) {
        console.error("Error preloading carousel:", error);
      } finally {
        setImagesPreloaded(true);
      }
    };
    
    preloadCarouselData();
  }, []);
  
  // Complete intro after fade
  useEffect(() => {
    if (introState === 'fading') {
      const timer = setTimeout(() => {
        setIntroState('complete');
        onComplete();
      }, 1500);
      
      return () => clearTimeout(timer);
    }
  }, [introState, onComplete]);

  // Show loading while video loads
  if (introState === 'loading') {
    return (
      <div className="fixed inset-0 z-50 bg-black flex items-center justify-center">
        <div className="text-white text-center">
          <div className="mb-4">
            <div className="animate-spin h-8 w-8 border-4 border-white border-t-transparent rounded-full mx-auto"></div>
          </div>
          <p className="text-sm opacity-70">Carregando...</p>
        </div>
      </div>
    );
  }

  return (
    <AnimatePresence>
      {introState !== 'complete' && (
        <motion.div
          className="fixed inset-0 bg-black flex items-center justify-center z-50"
          initial={{ opacity: 1 }}
          animate={{ opacity: introState === 'fading' ? 0 : 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1, ease: "easeInOut" }}
        >
          <video
            autoPlay
            loop
            muted
            playsInline
            disablePictureInPicture
            className="absolute inset-0 w-full h-full object-cover"
            src="/assets/introVideo.mp4"
          />
          
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ 
              opacity: introState === 'fading' ? 0 : 1,
              y: [0, -15, 15, 0]
            }}
            transition={{ 
              opacity: { duration: 1 },
              y: { duration: 5, repeat: Infinity, ease: "easeInOut" }
            }}
            className="relative z-10"
          >
            <Image
              src="/assets/logo.png"
              alt="Logo"
              width={500}
              height={200}
              priority
              className="w-auto h-auto max-w-[80vw]"
            />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}