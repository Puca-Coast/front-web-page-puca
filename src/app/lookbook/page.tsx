"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import Image from "next/image";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import "@/styles/lookbookStyles.css";
import { API_BASE_URL } from "@/config/environment";

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

  /* ---------------------- FETCH ---------------------- */
  const fetchPhotos = useCallback(
    async (pageToFetch: number) => {
      if (!hasMore) return;
      setIsLoading(true);
      try {
        const res = await fetch(`${API_BASE_URL}/api/lookbook/photos?page=${pageToFetch}&limit=10`);

        // 1) Qualquer status 4xx/5xx encerra paginação
        if (!res.ok) {
          console.warn(`Stop paging: server returned ${res.status}`);
          setHasMore(false);
          return;
        }

        const data = await res.json();

        // 2) Se API sinalizar erro ou vier vazia, também paramos
        if (!data.success || data.data.length === 0) {
          setHasMore(false);
          return;
        }

        const newPhotos: LookbookPhoto[] = await Promise.all(
          data.data.map(
            (photo: any) =>
              new Promise<LookbookPhoto>((resolve) => {
                const img = new window.Image();
                img.src = photo.url;
                img.onload = () =>
                  resolve({
                    id: photo._id,
                    src: photo.url,
                    width: img.width,
                    height: img.height,
                  });
              })
          )
        );

        // -------- deduplicação --------
        setPhotos((prev) => {
          const ids = new Set(prev.map((p) => p.id));
          const unique = newPhotos.filter((p) => !ids.has(p.id));
          return [...prev, ...unique];
        });
      } catch (err) {
        console.error("Fetch failed:", err);
        setHasMore(false); // falha de rede => não tente de novo
      } finally {
        setIsLoading(false);
      }
    },
    [hasMore]
  );

  /* ---------------- INTERSECTION OBSERVER ------------- */
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
    if (observerRef.current) io.observe(observerRef.current);
    return () => io.disconnect();
  }, [onIntersect]);

  /* ---------------- BUSCA INICIAL + PAGE -------------- */
  useEffect(() => {
    fetchPhotos(page);
  }, [page, fetchPhotos]);

  /* --------------------- RENDER ----------------------- */
  return (
    <div className="min-h-screen flex flex-col">
      <Header isHome={false} />

      <main className="flex-1 w-full mx-auto px-4 pt-20">
        <div className="masonry-grid">
          {photos.map((photo) => (
            <PhotoCard key={photo.id} photo={photo} />
          ))}
        </div>
        <div ref={observerRef} className="h-10" />
      </main>

      <Footer isHome={false} />

      {isLoading && (
        <div className="fixed bottom-4 left-1/2 -translate-x-1/2">
          <span className="spinner" />
        </div>
      )}

      <style jsx>{`
        .spinner {
          width: 2rem;
          height: 2rem;
          border: 4px solid #ccc;
          border-top-color: #3498db;
          border-radius: 50%;
          animation: spin 0.8s linear infinite;
        }
        @keyframes spin {
          to {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </div>
  );
}

/* --------------------- CARD ------------------------- */
function PhotoCard({ photo }: { photo: LookbookPhoto }) {
  const [loaded, setLoaded] = useState(false);

  return (
    <div className="masonry-item">
      <Image
        src={photo.src}
        alt=""
        width={photo.width}
        height={photo.height}
        sizes="(max-width:640px)100vw, (max-width:1024px)50vw, 33vw"
        placeholder="blur"
        blurDataURL="/placeholder.png"
        onLoad={() => setLoaded(true)}
        className={`rounded-md object-cover transition-opacity duration-700 ${
          loaded ? "opacity-100" : "opacity-0"
        }`}
      />
    </div>
  );
}
