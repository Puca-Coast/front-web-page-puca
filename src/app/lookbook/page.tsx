"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import Image from "next/image";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import "@/styles/lookbookStyles.css";
import { lookbookService, LookbookPhoto } from "@/lib/services/api/lookbookService";

interface LookbookPhotoItem {
  id: string;
  src: string;
  width: number;
  height: number;
}

export default function LookbookPage() {
  const [photos, setPhotos] = useState<LookbookPhotoItem[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);

  const observerRef = useRef<HTMLDivElement | null>(null);
  const controllerRef = useRef<AbortController | null>(null);

  // Mapear foto da API para o formato local
  const mapPhotoToItem = useCallback((photo: LookbookPhoto): Promise<LookbookPhotoItem> => {
    return new Promise((resolve) => {
      const img = new window.Image();
      img.src = photo.url;
      img.onload = () => {
        resolve({
          id: photo._id,
          src: photo.url,
          width: img.width,
          height: img.height,
        });
      };
      img.onerror = () => {
        resolve({
          id: photo._id,
          src: photo.url,
          width: 300,
          height: 400,
        });
      };
    });
  }, []);

  // Buscar fotos - CORRIGIDO para evitar loop infinito
  const fetchPhotos = useCallback(
    async (pageToFetch: number) => {
      if (!hasMore || isLoading) return;

      if (controllerRef.current) {
        controllerRef.current.abort();
      }

      const controller = new AbortController();
      controllerRef.current = controller;

      setIsLoading(true);
      setError(null);

      try {
        const response = await lookbookService.getPhotos(pageToFetch, 10);

        if (!response.success) {
          throw new Error("Erro ao buscar fotos do lookbook");
        }

        if (response.data.length === 0) {
          setHasMore(false);
          return;
        }

        const mappedPhotos = await Promise.all(
          response.data.map(mapPhotoToItem)
        );

        setPhotos((prev) => {
          const existingIds = new Set(prev.map((p) => p.id));
          const newPhotos = mappedPhotos.filter((p) => !existingIds.has(p.id));
          return [...prev, ...newPhotos];
        });

        setHasMore(response.pagination.currentPage < response.pagination.totalPages);

      } catch (err: any) {
        if (err.name !== "AbortError") {
          console.error("Erro ao buscar fotos:", err);
          setError(err.message || "Erro ao carregar fotos");
          setHasMore(false);
        }
      } finally {
        if (!controller.signal.aborted) {
          setIsLoading(false);
        }
      }
    },
    [hasMore, isLoading, mapPhotoToItem]
  );

  // Intersection observer para infinite scroll
  const onIntersect = useCallback(
    ([entry]: IntersectionObserverEntry[]) => {
      if (entry.isIntersecting && hasMore && !isLoading) {
        setPage((prev) => prev + 1);
      }
    },
    [hasMore, isLoading]
  );

  useEffect(() => {
    const io = new IntersectionObserver(onIntersect, {
      root: null,
      rootMargin: "600px",
      threshold: 0.1,
    });
    
    if (observerRef.current) {
      io.observe(observerRef.current);
    }
    
    return () => io.disconnect();
  }, [onIntersect]);

  // CORRIGIDO: Busca inicial separada do page change
  useEffect(() => {
    if (!isInitialized) {
      fetchPhotos(1);
      setIsInitialized(true);
    }
  }, [isInitialized, fetchPhotos]);

  // CORRIGIDO: Page change só para páginas > 1
  useEffect(() => {
    if (page > 1) {
      fetchPhotos(page);
    }
  }, [page]); // Removido fetchPhotos das dependências para evitar loop

  useEffect(() => {
    return () => {
      if (controllerRef.current) {
        controllerRef.current.abort();
      }
    };
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 relative">
      {/* Grid Pattern Background Elegante */}
      <div className="absolute inset-0 opacity-[0.015]">
        <div className="absolute inset-0" style={{
          backgroundImage: `
            linear-gradient(rgba(0,0,0,0.2) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0,0,0,0.2) 1px, transparent 1px)
          `,
          backgroundSize: '50px 50px'
        }} />
      </div>

      {/* Diagonal Pattern Overlay */}
      <div className="absolute inset-0 opacity-[0.008]">
        <div className="absolute inset-0" style={{
          backgroundImage: `repeating-linear-gradient(
            45deg,
            rgba(0,0,0,0.1) 0px,
            rgba(0,0,0,0.1) 1px,
            transparent 1px,
            transparent 30px
          )`
        }} />
      </div>

      <Header isHome={false} />

      {/* CORRIGIDO: Espaçamento adequado do header e scroll permitido */}
      <main className="flex-1 w-full mx-auto px-6 pb-16 relative z-10">
        
        <div className="masonry-grid pt-6">
          {photos.map((photo) => (
            <PhotoCard key={photo.id} photo={photo} />
          ))}

          {isLoading &&
            Array.from({ length: 6 }).map((_, idx) => (
              <SkeletonCard key={`skeleton-${idx}`} />
            ))}
        </div>

        {error && photos.length === 0 && (
          <div className="flex flex-col items-center justify-center py-32">
            <div className="bg-white/80 backdrop-blur-sm p-8 shadow-lg border border-gray-200">
              <p className="text-red-500 text-lg mb-6 text-center">{error}</p>
              <button
                onClick={() => {
                  setError(null);
                  setPage(1);
                  setHasMore(true);
                  setIsInitialized(false);
                }}
                className="px-8 py-3 bg-black text-white hover:bg-gray-800 transition-all duration-300 hover:scale-105 shadow-lg"
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

// Componente com micro animações elegantes
function PhotoCard({ photo }: { photo: LookbookPhotoItem; key?: string }) {
  const [loaded, setLoaded] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div 
      className="masonry-item group relative overflow-hidden shadow-md hover:shadow-xl transition-all duration-500 bg-white/90 backdrop-blur-sm"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
        <div className="relative overflow-hidden">
          <Image
            src={photo.src}
            alt="Lookbook"
            width={photo.width}
            height={photo.height}
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className={`
              w-full h-auto object-cover transition-all duration-500 ease-out
              ${loaded ? 'opacity-100' : 'opacity-20'}
              ${isHovered ? 'scale-105' : 'scale-100'}
            `}
          onLoadingComplete={() => setLoaded(true)}
            loading="lazy"
          />
        </div>
      
      {!loaded && (
        <div 
          className="absolute inset-0 bg-gradient-to-br from-gray-200 to-gray-300 animate-pulse"
          style={{ height: photo.height }}
        />
      )}
    </div>
  );
}

// Skeleton elegante
function SkeletonCard() {
  const randomHeight = Math.floor(Math.random() * 120) + 180;
  return (
    <div
      className="masonry-item bg-gradient-to-br from-gray-200 to-gray-300 animate-pulse shadow-md"
      style={{ height: randomHeight }}
    />
  );
}
