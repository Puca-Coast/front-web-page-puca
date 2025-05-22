"use client";

import { useEffect, useState, useCallback } from "react";
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, EffectFade } from "swiper/modules";
import { useInView } from "react-intersection-observer";
import WavyLoader from "@/components/ui/WavyLoader";
import { LookbookPhoto, CarouselHomeProps } from "@/types";

// Import Swiper styles
import "swiper/css";
import "swiper/css/autoplay";
import "swiper/css/effect-fade";
import "@/styles/carouselStyles.css";

// Custom hook para buscar e gerenciar as fotos
function useLookbookPhotos() {
  const [photos, setPhotos] = useState<LookbookPhoto[]>([]);
  const [loading, setLoading] = useState(true);
  const [preloaded, setPreloaded] = useState(false);

  // Buscar fotos do cache ou API
  useEffect(() => {
    const cached = localStorage.getItem("carouselPhotos");
    if (cached && cached !== '[]') {
      setPhotos(JSON.parse(cached));
      setLoading(false);
    } else {
      fetchLookbookPhotos();
    }
  }, []);

  // Pré-carregar imagens para evitar atrasos na exibição
  useEffect(() => {
    if (photos.length > 0 && !preloaded) {
      const preloadImages = async () => {
        const imagePromises = photos.slice(0, 5).map((photo) => {
          return new Promise((resolve, reject) => {
            const img = new Image();
            img.src = photo.url;
            img.onload = () => resolve(img);
            img.onerror = reject;
          });
        });

        try {
          await Promise.all(imagePromises);
          setPreloaded(true);
        } catch (error) {
          console.error("Erro ao pré-carregar imagens:", error);
        }
      };

      preloadImages();
    }
  }, [photos, preloaded]);

  async function fetchLookbookPhotos() {
    try {
      const response = await fetch(
        "http://localhost:3000/api/lookbook/photos?launch=primavera2024&limit=10"
      );
      const data = await response.json();
      if (data.success) {
        setPhotos(data.data);
        localStorage.setItem("carouselPhotos", JSON.stringify(data.data));
      } else {
        console.error("Erro ao buscar fotos:", data.error);
      }
    } catch (error) {
      console.error("Erro ao conectar com a API:", error);
    } finally {
      setLoading(false);
    }
  }

  return { photos, loading, preloaded };
}

// Componente para imagem com blur lazy-loading
const BlurImage = ({ photo, index, inViewport }) => {
  const [loaded, setLoaded] = useState(false);
  const { ref, inView } = useInView({
    triggerOnce: false,
    threshold: 0.1,
  });
  
  const handleLoad = useCallback(() => {
    setLoaded(true);
  }, []);

  const isVisible = inView || inViewport;

  return (
    <div 
      ref={ref} 
      className={`relative w-full h-full overflow-hidden transition-all duration-500 ease-in-out ${
        loaded ? '' : 'bg-gray-200'
      }`}
    >
      <Image
        src={photo.url}
        alt={photo.description || `Imagem ${index + 1}`}
        fill
        sizes="300px"
        className={`object-cover transition-all duration-500 blur-transition ${
          isVisible 
            ? loaded 
              ? 'no-blur' 
              : 'blur-image'
            : 'blur-image'
        }`}
        priority={index < 4}
        onLoad={handleLoad}
      />
    </div>
  );
};

export default function CarouselHome({ carouselHeight }: CarouselHomeProps) {
  const { photos, loading, preloaded } = useLookbookPhotos();
  const [visibleSlides, setVisibleSlides] = useState([]);
  const { ref, inView } = useInView({
    threshold: 0.1,
    triggerOnce: false,
  });
  
  const [speed, setSpeed] = useState(5000); // Velocidade do slide em ms

  // Gerenciar velocidade do carrossel com hover
  const handleMouseEnter = () => setSpeed(15000); // Mais lento no hover
  const handleMouseLeave = () => setSpeed(5000); // Velocidade normal ao sair
  
  const handleSlideChange = (swiper) => {
    if (swiper && swiper.visibleSlides) {
      const visibleIndices = swiper.visibleSlides.map(slide => 
        parseInt(slide.getAttribute('data-swiper-slide-index'), 10)
      );
      setVisibleSlides(visibleIndices);
    }
  };

  return (
    <div 
      ref={ref} 
      className="marquee-container relative w-full bg-white transition-opacity duration-1000 ease-in-out"
      style={{ height: carouselHeight || "300px", opacity: preloaded ? 0.3 : 1 }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-white z-10">
          <WavyLoader />
        </div>
      )}

      {!loading && photos.length > 0 && (
        <Swiper
          modules={[Autoplay, EffectFade]}
          spaceBetween={0}
          slidesPerView="auto"
          loop={true}
          autoplay={{
            delay: 0,
            disableOnInteraction: false,
            stopOnLastSlide: false,
            waitForTransition: true,
            reverseDirection: false,
          }}
          speed={speed}
          centeredSlides={false}
          allowTouchMove={true}
          grabCursor={true}
          freeMode={true}
          className="h-full marquee-wrapper carousel-fade-in"
          onSlideChange={handleSlideChange}
          onImagesReady={() => setVisibleSlides([])}
        >
          {/* Duplicamos as fotos para criar o efeito de loop infinito similar ao original */}
          {[...photos, ...photos].map((photo, index) => (
            <SwiperSlide
              key={`${photo._id || 'photo'}-${index}`}
              className="marquee-item"
              style={{ width: "900px", height: "100%" }}
              data-swiper-slide-index={index % photos.length}
            >
              <BlurImage 
                photo={photo} 
                index={index}
                inViewport={visibleSlides.includes(index % photos.length)}
              />
            </SwiperSlide>
          ))}
        </Swiper>
      )}
    </div>
  );
}