"use client";

import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import "../../styles/carouselStyles.css"; // CSS específico para o marquee
import WavyLoader from "../WavyLoader";    // Seu componente de loader
import { get } from "@/app/utils/api";

interface LookbookPhoto {
  url: string;
  description?: string;
}

interface CarouselApiResponse {
  success: boolean;
  data: LookbookPhoto[];
  error?: string;
}

interface CarouselHomeProps {
  carouselHeight?: string;
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
console.log(API_BASE_URL);
export default function CarouselHome({ carouselHeight }: CarouselHomeProps) {
  const [photos, setPhotos] = useState<LookbookPhoto[]>([]);
  const [loading, setLoading] = useState(true);

  // Tenta recuperar do cache; se não houver, faz o fetch
  useEffect(() => {
    const cached = localStorage.getItem("carouselPhotos");
    if (cached) {
      try {
        const parsedData = JSON.parse(cached);
        if (Array.isArray(parsedData) && parsedData.length > 0) {
          setPhotos(parsedData);
          setLoading(false);
          return;
        }
      } catch (e) {
        // Se houver erro no parsing, apenas continua e busca os dados novamente
        console.log("Cache inválido, buscando novos dados");
      }
    }
    fetchLookbookPhotos();
  }, []);

  async function fetchLookbookPhotos() {
    try {
      const data = await get<CarouselApiResponse>(
        `/api/lookbook/photos?launch=primavera2024&limit=10`
      );
      
      if (data.success) {
        setPhotos(data.data);
        // Salva no cache com expiração de 1 hora
        localStorage.setItem("carouselPhotos", JSON.stringify(data.data));
        localStorage.setItem("carouselPhotosExpiry", String(Date.now() + 3600000));
      } else {
        console.error("Erro ao buscar fotos:", data.error);
      }
    } catch (error) {
      console.error("Erro ao conectar com a API:", error);
    } finally {
      setLoading(false);
    }
  }

  // Configurações de animação
  const trackRef = useRef<HTMLDivElement>(null);
  const requestRef = useRef<number>(0);
  const xRef = useRef<number>(0);
  const [speed, setSpeed] = useState<number>(0.5); // velocidade em pixels por frame
  const SLIDE_WIDTH = 300; // largura fixa de cada slide (em pixels)

  // Metade do comprimento do track (necessário para o loop)
  const halfTrackWidth = photos.length * SLIDE_WIDTH;

  // Função de animação com requestAnimationFrame
  const animate = () => {
    xRef.current += speed;
    if (xRef.current >= halfTrackWidth) {
      xRef.current = 0;
    }
    if (trackRef.current) {
      trackRef.current.style.transform = `translateX(-${xRef.current}px)`;
    }
    requestRef.current = requestAnimationFrame(animate);
  };

  useEffect(() => {
    // Inicia a animação
    requestRef.current = requestAnimationFrame(animate);
    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
    // Dependência: se as fotos mudarem, o loop será reiniciado
  }, [photos, speed]);

  // Ao passar o mouse, reduz a velocidade
  const handleMouseEnter = () => setSpeed(0.1);
  // Ao sair, restaura a velocidade original
  const handleMouseLeave = () => setSpeed(0.5);

  return (
    <div
      className="marquee-container relative w-full bg-white"
      style={{ height: carouselHeight || '300px' }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-white z-10">
          <WavyLoader />
        </div>
      )}

      <div className="marquee-wrapper">
        <div ref={trackRef} className="marquee-track">
          {/* Duplicamos as fotos para criar o loop infinito */}
          {photos.concat(photos).map((photo, index) => (
            <div
              key={index}
              className="marquee-item"
              style={{ width: SLIDE_WIDTH, height: "100%" }}
            >
              <Image
                src={photo.url}
                alt={photo.description || `Imagem ${index + 1}`}
                fill
                className="object-cover"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}