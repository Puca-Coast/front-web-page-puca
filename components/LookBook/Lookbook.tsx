"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import Header from "@/components/Header"; // se quiser remover, fique à vontade
import Footer from "@/components/Footer"; // idem
import "@/styles/lookbookStyles.css"; // Importa o arquivo de estilo global (AJUSTE O CAMINHO)

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

  const observerRef = useRef<HTMLDivElement | null>(null);

  // Função para buscar as fotos (com paginação)
  const fetchPhotos = useCallback(async () => {
    if (isLoading || !hasMore) return;
    setIsLoading(true);

    try {
      // Chame sua API (AJUSTE O ENDPOINT CONFORME NECESSÁRIO)
      const res = await fetch(`http://localhost:3000/api/lookbook/photos?page=${page}&limit=10`);
      const data = await res.json();

      if (data.success) {
        // Para cada foto, carregamos a imagem para obter width e height
        const newPhotos: LookbookPhoto[] = await Promise.all(
          data.data.map(async (photo: any) => {
            const img = new window.Image();
            img.src = photo.url;

            // Espera carregar para ter width e height corretos
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

        setPhotos((prev) => [...prev, ...newPhotos]);
        setPage((prev) => prev + 1);

        // Verifica se ainda há mais páginas
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

  // IntersectionObserver: dispara fetch antes de chegar ao fim
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
    const observer = new IntersectionObserver(handleObserver, {
      root: null,
      rootMargin: "600px", // Carrega fotos 600px antes do final
      threshold: 0.1,
    });

    if (observerRef.current) observer.observe(observerRef.current);

    return () => {
      if (observerRef.current) observer.unobserve(observerRef.current);
    };
  }, [handleObserver]);

  return (
    <div className="min-h-screen flex flex-col">
      <Header isHome={false} />

      {/* Container centralizado e amplo */}
      <div className="flex-1 w-full max-w-screen-xl mx-auto px-4">
        {/* Mosaico */}
        <div className="masonry-grid mt-8">
          {photos.map((photo) => (
            <div key={photo.id} className="masonry-item">
              <Image
                src={photo.src}
                alt="Lookbook Photo"
                width={photo.width}
                height={photo.height}
                layout="responsive"
                objectFit="cover"
                loading="lazy"
              />
            </div>
          ))}
        </div>

        {/* Sentinela para disparar paginação */}
        <div ref={observerRef} className="h-10" />
      </div>

      <Footer isHome={false} />

      {/* Loading Spinner (opcional) */}
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
