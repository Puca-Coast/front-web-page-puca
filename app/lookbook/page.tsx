"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import "@/styles/lookbookStyles.css"; // Importa o CSS global do masonry

// Tipagem simples para cada foto
interface LookbookPhoto {
  id: string;
  src: string;
  width: number;
  height: number;
}

export default function LookbookPage() {
  const [photos, setPhotos] = useState<LookbookPhoto[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  // Ref do "sentinela" para IntersectionObserver
  const observerRef = useRef<HTMLDivElement | null>(null);

  // Função para buscar fotos (paginação)
  const fetchPhotos = useCallback(async () => {
    if (isLoading || !hasMore) return;
    setIsLoading(true);

    try {
      const res = await fetch(
        `http://localhost:3000/api/lookbook/photos?page=${page}&limit=10`
      );
      const data = await res.json();

      if (data.success) {
        // Carrega cada imagem para obter width/height corretos
        const newPhotos: LookbookPhoto[] = await Promise.all(
          data.data.map(async (photo: any) => {
            const img = new window.Image();
            img.src = photo.url;
            await new Promise((resolve) => {
              img.onload = resolve;
            });
            return {
              id: photo._id,
              src: photo.url,
              width: img.width,
              height: img.height,
            };
          })
        );

        // Adiciona as novas fotos ao estado
        setPhotos((prev) => [...prev, ...newPhotos]);
        setPage((prev) => prev + 1);

        // Se chegamos à última página
        if (data.pagination.currentPage >= data.pagination.totalPages) {
          setHasMore(false);
        }
      } else {
        console.error("Erro ao buscar fotos:", data.error);
      }
    } catch (error) {
      console.error("Erro ao conectar com a API:", error);
    } finally {
      setIsLoading(false);
    }
  }, [page, isLoading, hasMore]);

  // IntersectionObserver para carregar a próxima página antes do final
  const handleObserver = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      const [entry] = entries;
      if (entry.isIntersecting && hasMore) {
        fetchPhotos();
      }
    },
    [fetchPhotos, hasMore]
  );

  useEffect(() => {
    // Configura o IntersectionObserver
    const observer = new IntersectionObserver(handleObserver, {
      root: null,
      rootMargin: "600px", // carrega antes de chegar ao fim
      threshold: 0.1,
    });

    if (observerRef.current) observer.observe(observerRef.current);

    return () => {
      if (observerRef.current) observer.unobserve(observerRef.current);
    };
  }, [handleObserver]);

  // Busca a primeira página ao montar
  useEffect(() => {
    fetchPhotos();
  }, [fetchPhotos]);

  return (
    <div className="min-h-screen flex flex-col">
      <Header isHome={false} />

      {/* Container do conteúdo */}
      <div className="flex-1 w-full mx-auto px-4 pt-20">
        {/* Mosaico */}
        <div className="masonry-grid">
          {photos.map((photo) => (
            <PhotoCard key={photo.id} photo={photo} />
          ))}
        </div>

        {/* Sentinela do IntersectionObserver */}
        <div ref={observerRef} className="h-10" />
      </div>

      <Footer isHome={false} />

      {isLoading && (
        <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2">
          <div className="spinner-border animate-spin w-8 h-8 border-4 rounded-full text-blue-500"></div>
        </div>
      )}

      <style jsx>{`
        .spinner-border {
          border-color: #ccc;
          border-top-color: #3498db;
          border-radius: 50%;
        }
      `}</style>
    </div>
  );
}

// Componente de cada foto, com fade-in e placeholder
function PhotoCard({ photo }: { photo: LookbookPhoto }) {
  const [loaded, setLoaded] = useState(false);

  return (
    <div className="masonry-item">
      <Image
        src={photo.src}
        alt="Lookbook Photo"
        width={photo.width}
        height={photo.height}
        layout="responsive"
        objectFit="cover"
        loading="lazy"       // lazy loading
        decoding="async"
        placeholder="blur"   // placeholder de blur
        blurDataURL="/assets/placeholder.png"
        sizes="(max-width: 640px) 100vw,
               (max-width: 1024px) 50vw,
               33vw"
        onLoadingComplete={() => setLoaded(true)}
        className={`rounded-md transition-opacity duration-700 ${
          loaded ? "opacity-100" : "opacity-0"
          
        }`}
      />
    </div>
  );
}
