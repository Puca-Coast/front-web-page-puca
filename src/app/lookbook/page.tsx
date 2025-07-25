"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import "@/styles/lookbookStyles.css";
import { lookbookService, LookbookPhoto } from "@/lib/services/api/lookbookService";
import { SimpleLookbookImage } from "@/components/ui/OptimizedImage/SimpleOptimizedImage";

interface LookbookPhotoItem {
  id: string;
  src: string;
  width: number | string;
  height: number | string;
  description: string;
}

export default function LookbookPage() {
  const [photos, setPhotos] = useState<LookbookPhotoItem[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);

  const observerRef = useRef<HTMLDivElement | null>(null);
  const controllerRef = useRef<AbortController | null>(null);

  // Mapear foto da API para o formato local
  const mapPhotoToItem = useCallback((photo: LookbookPhoto): LookbookPhotoItem => {
    return {
      id: photo._id,
      src: photo.url,
      width: 'auto', // Largura automática para o masonry se adaptar
      height: 'auto', // Altura automática para o masonry se adaptar
      description: photo.description || 'Lookbook PUCA',
    };
  }, []);

  // Função para buscar as fotos usando o serviço
  const fetchPhotos = useCallback(async () => {
    if (isLoading || !hasMore || controllerRef.current?.signal.aborted) return;
    setIsLoading(true);
    setError(null);

    try {
      // Cancelar requisição anterior se existir
      if (controllerRef.current) {
        controllerRef.current.abort();
      }
      
      // Criar novo controller para esta requisição
      controllerRef.current = new AbortController();

      console.log(`🔍 Buscando fotos - Página: ${currentPage}, Limite: 10`);
      
      // Usar o serviço de lookbook
      const response = await lookbookService.getPhotos(currentPage, 10, 'primavera2024');
      
      console.log('📸 Resposta da API:', {
        success: response.success,
        totalFotos: response.data.length,
        pagination: response.pagination
      });

      if (response.success && response.data) {
        const newPhotos = response.data.map(mapPhotoToItem);
        
        // Se for a primeira página, substituir; senão, adicionar
        if (currentPage === 1) {
          setPhotos(newPhotos);
        } else {
          setPhotos((prev) => {
            // Filtrar fotos duplicadas baseado no ID
            const existingIds = new Set(prev.map(p => p.id));
            const uniqueNewPhotos = newPhotos.filter(photo => !existingIds.has(photo.id));
            return [...prev, ...uniqueNewPhotos];
          });
        }
        
        // Atualizar controles de paginação
        setCurrentPage((prev) => prev + 1);
        setHasMore(response.pagination.currentPage < response.pagination.totalPages);
      } else {
        console.error("❌ Erro na resposta da API:", response);
        setError('Erro ao carregar fotos do lookbook');
      }
    } catch (error: any) {
      if (error.name === 'AbortError') {
        console.log('📡 Requisição cancelada');
        return;
      }
      
      console.error("❌ Erro ao conectar com a API:", error);
      setError('Erro ao carregar fotos. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  }, [currentPage, isLoading, hasMore, mapPhotoToItem]);

  // Intersection observer para infinite scroll
  const onIntersect = useCallback(
    ([entry]: IntersectionObserverEntry[]) => {
      if (entry.isIntersecting && hasMore && !isLoading) {
        fetchPhotos();
      }
    },
    [hasMore, isLoading, fetchPhotos]
  );

  // Configurar observer
  useEffect(() => {
    const observer = new IntersectionObserver(onIntersect, {
      root: null,
      rootMargin: "200px",
      threshold: 0.1,
    });

    if (observerRef.current) {
      observer.observe(observerRef.current);
    }

    return () => {
      if (observerRef.current) {
        observer.unobserve(observerRef.current);
      }
    };
  }, [onIntersect]);

  // Carregar primeira página
  useEffect(() => {
    if (!isInitialized) {
      setIsInitialized(true);
      fetchPhotos();
    }
  }, [isInitialized, fetchPhotos]);

  // Cleanup
  useEffect(() => {
    return () => {
      if (controllerRef.current) {
        controllerRef.current.abort();
      }
    };
  }, []);

  return (
    <div className="bg-gradient-to-br from-gray-50 via-white to-gray-100 min-h-screen">
      {/* Background elegante */}
      <div className="absolute inset-0 elegant-grid-bg opacity-20"></div>
      <div className="absolute inset-0 subtle-dots-bg opacity-10"></div>

      <Header isHome={false} />

      <main className="flex-1 w-full mx-auto px-6 pb-16 relative z-10">
        
        <div className="masonry-grid pt-6">
          {photos.map((photo, index) => (
            <OptimizedPhotoCard 
              key={`${photo.id}-${index}`} 
              photo={photo} 
              index={index} 
              isPriority={index < 3}
            />
          ))}

          {isLoading &&
            Array.from({ length: 6 }).map((_, idx) => (
              <SkeletonCard key={`skeleton-${idx}`} />
            ))}
        </div>

        {error && photos.length === 0 && (
          <div className="flex flex-col items-center justify-center py-32">
            <div className="bg-white/80 backdrop-blur-sm p-8 shadow-lg border border-gray-200 rounded-lg">
              <p className="text-red-500 text-lg mb-6 text-center">{error}</p>
              <button
                onClick={() => {
                  setError(null);
                  setCurrentPage(1);
                  setHasMore(true);
                  setIsInitialized(false);
                }}
                className="px-8 py-3 bg-black text-white hover:bg-gray-800 transition-all duration-300 hover:scale-105 shadow-lg rounded-lg"
              >
                Tentar Novamente
              </button>
            </div>
          </div>
        )}

        <div ref={observerRef} className="h-10" />
      </main>

      <Footer isHome={false} />
    </div>
  );
}

// Componente otimizado com o novo componente de imagem
const OptimizedPhotoCard: React.FC<{ 
  photo: LookbookPhotoItem; 
  index: number;
  isPriority: boolean;
  key?: string | number;
}> = ({ photo, index, isPriority }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div 
      className="masonry-item group relative overflow-hidden shadow-md hover:shadow-xl transition-all duration-500 bg-white/90 backdrop-blur-sm rounded-lg"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative overflow-hidden rounded-lg">
        <SimpleLookbookImage
          src={photo.src}
          alt={photo.description}
          width={'auto'}
          height={'auto'}
          className={`
            w-full h-auto object-cover transition-all duration-500 ease-out
            ${isHovered ? 'scale-105' : 'scale-100'}
          `}
          priority={isPriority}
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        />
        
        {/* Overlay suave no hover */}
        <div 
          className={`
            absolute inset-0 bg-black/10 transition-opacity duration-300
            ${isHovered ? 'opacity-100' : 'opacity-0'}
          `}
        />
      </div>
    </div>
  );
};

// Skeleton loading otimizado
function SkeletonCard() {
  return (
    <div className="masonry-item">
      <div className="bg-gray-200 animate-pulse rounded-lg" style={{ height: '400px' }}>
        <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300 rounded-lg"></div>
      </div>
    </div>
  );
}
