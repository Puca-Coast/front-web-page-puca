"use client";

import React, { useEffect, useState, useCallback, useMemo } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, EffectFade } from "swiper/modules";
import { useInView } from "react-intersection-observer";
import WavyLoader from "@/components/ui/WavyLoader";
import { lookbookService, LookbookPhoto } from "@/lib/services/api/lookbookService";
import { CarouselHomeProps } from "@/types";
import { SimpleLookbookImage } from "@/components/ui/OptimizedImage/SimpleOptimizedImage";

// Import Swiper styles
import "swiper/css";
import "swiper/css/autoplay";
import "swiper/css/effect-fade";
import "@/styles/carouselStyles.css";

// Cache key para localStorage
const CACHE_KEY = "carousel_photos_v2";
const CACHE_EXPIRY = 30 * 60 * 1000; // 30 minutos

// Interface para cache
interface CachedData {
  photos: LookbookPhoto[];
  timestamp: number;
}

// Custom hook para buscar e gerenciar as fotos com cache inteligente
function useLookbookPhotos() {
  const [photos, setPhotos] = useState<LookbookPhoto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Função para verificar e obter cache
  const getCachedData = useCallback((): LookbookPhoto[] | null => {
    try {
      const cached = localStorage.getItem(CACHE_KEY);
      if (!cached) return null;

      const cachedData: CachedData = JSON.parse(cached);
      const now = Date.now();

      // Verificar se o cache ainda é válido
      if (now - cachedData.timestamp < CACHE_EXPIRY && cachedData.photos.length > 0) {
        return cachedData.photos;
      }

      // Cache expirado, remover
      localStorage.removeItem(CACHE_KEY);
      return null;
    } catch (error) {
      console.warn("Erro ao ler cache:", error);
      localStorage.removeItem(CACHE_KEY);
      return null;
    }
  }, []);

  // Função para salvar no cache
  const setCachedData = useCallback((photos: LookbookPhoto[]) => {
    try {
      const cacheData: CachedData = {
        photos,
        timestamp: Date.now()
      };
      localStorage.setItem(CACHE_KEY, JSON.stringify(cacheData));
    } catch (error) {
      console.warn("Erro ao salvar cache:", error);
    }
  }, []);

  // Buscar fotos do lookbook
  const fetchLookbookPhotos = useCallback(async () => {
    try {
      setError(null);
      const response = await lookbookService.getPhotos(1, 10, "primavera2024");
      
      if (response.success && response.data.length > 0) {
        setPhotos(response.data);
        setCachedData(response.data);
      } else {
        setError("Nenhuma foto encontrada");
      }
    } catch (error) {
      console.error("Erro ao buscar fotos:", error);
      setError("Erro ao carregar fotos");
    } finally {
      setLoading(false);
    }
  }, [setCachedData]);

  // Inicializar dados
  useEffect(() => {
    const cachedPhotos = getCachedData();
    
    if (cachedPhotos) {
      // Usar cache e carregar em background
      setPhotos(cachedPhotos);
      setLoading(false);
      
      // Atualizar em background se necessário
      setTimeout(fetchLookbookPhotos, 1000);
    } else {
      // Buscar dados frescos
      fetchLookbookPhotos();
    }
  }, [getCachedData, fetchLookbookPhotos]);

  return { photos, loading, error };
}

// Componente otimizado para imagem com lazy loading
const OptimizedImage = ({ photo, index, isPriority }: { 
  photo: LookbookPhoto; 
  index: number; 
  isPriority: boolean;
}) => {
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
    rootMargin: "100px",
  });

  // Otimizar tamanho da imagem baseado no dispositivo
  const sizes = useMemo(() => "(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw", []);

  return (
    <div ref={ref} className="relative w-full h-full overflow-hidden">
      {(inView || isPriority) && (
        <SimpleLookbookImage
          src={photo.url}
          alt={photo.description || `Lookbook ${index + 1}`}
          width={1200}
          height={1080}
          className="w-full h-full object-center"
          priority={isPriority}
          sizes={sizes}
        />
      )}
    </div>
  );
};

export default function CarouselHome({ carouselHeight }: CarouselHomeProps) {
  const { photos, loading, error } = useLookbookPhotos();
  const [swiperSpeed, setSwiperSpeed] = useState(5000);
  const { ref, inView } = useInView({
    threshold: 0.1,
    triggerOnce: false,
  });

  // Otimizar velocidade do carousel baseado na interação
  const handleMouseEnter = useCallback(() => {
    setSwiperSpeed(15000); // Mais lento no hover
  }, []);
  
  const handleMouseLeave = useCallback(() => {
    setSwiperSpeed(5000); // Velocidade normal
  }, []);

  // Duplicar fotos para efeito infinito otimizado
  const duplicatedPhotos = useMemo(() => {
    if (photos.length === 0) return [];
    return [...photos, ...photos];
  }, [photos]);

  // Loading state
  if (loading) {
    return (
      <div 
        className="relative w-full bg-gray-100 flex items-center justify-center"
        style={{ height: carouselHeight || "300px" }}
      >
        <WavyLoader />
      </div>
    );
  }

  // Error state
  if (error || photos.length === 0) {
    return (
      <div 
        className="relative w-full bg-gray-100 flex items-center justify-center"
        style={{ height: carouselHeight || "300px" }}
      >
        <p className="text-gray-500">Não foi possível carregar as imagens</p>
      </div>
    );
  }

  return (
    <div 
      ref={ref} 
      className="marquee-container relative w-full bg-white overflow-hidden"
      style={{ height: carouselHeight || "300px" }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <Swiper
        modules={[Autoplay, EffectFade]}
        spaceBetween={10}
        slidesPerView="auto"
        loop={true}
        autoplay={{
          delay: 0,
          disableOnInteraction: false,
          pauseOnMouseEnter: false,
          reverseDirection: false,
        }}
        speed={swiperSpeed}
        centeredSlides={false}
        allowTouchMove={true}
        grabCursor={true}
        freeMode={true}
        watchSlidesProgress={true}
        className="h-full marquee-wrapper bg-white"
      >
        {duplicatedPhotos.map((photo, index) => (
          <SwiperSlide
            key={`${photo._id}-${Math.floor(index / photos.length)}`}
            className="marquee-item"
            style={{ width: "auto", height: "100%" }}
          >
            <OptimizedImage 
              photo={photo} 
              index={index}
              isPriority={index < 4} // Priorizar as primeiras 4 imagens
            />
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Overlay sutil para melhor contraste */}
      <div className="absolute inset-0 bg-black bg-opacity-5 pointer-events-none" />
    </div>
  );
}