"use client";

import React, { useState, useEffect, useRef } from "react";
import PageLayout from "@/layouts/PageLayout";
import "@/styles/lookbookStyles.css";
import { lookbookService } from "@/lib/services/api/lookbookService";

export default function LookbookPage() {
  const [photos, setPhotos] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const observerRef = useRef(null);
  const loadingRef = useRef(false);

  // Fetch photos
  const loadPhotos = async (pageNum) => {
    if (loadingRef.current) return;
    loadingRef.current = true;
    
    try {
      const response = await lookbookService.getPhotos(pageNum, 20, 'primavera2024');
      if (response.success && response.data.length > 0) {
        setPhotos(prev => {
          if (pageNum === 1) return response.data;
          
          // Filter out duplicates
          const existingIds = new Set(prev.map(p => p._id));
          const newPhotos = response.data.filter(photo => !existingIds.has(photo._id));
          return [...prev, ...newPhotos];
        });
        
        setHasMore(response.pagination.currentPage < response.pagination.totalPages);
        
        // Preload next batch
        response.data.forEach(photo => {
          const img = new Image();
          img.src = photo.url;
        });
      }
    } catch (error) {
      console.error("Error loading photos:", error);
    } finally {
      loadingRef.current = false;
    }
  };

  // Setup intersection observer
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loadingRef.current) {
          setPage(p => p + 1);
        }
      },
      { rootMargin: "1000px" }
    );

    if (observerRef.current) observer.observe(observerRef.current);
    return () => observer.disconnect();
  }, [hasMore]);

  // Load photos when page changes
  useEffect(() => {
    loadPhotos(page);
  }, [page]);

  return (
    <PageLayout noPaddingTop={true}>
      <main className="flex-1 w-full mx-auto px-6 pb-16">
        <div className="masonry-grid pt-6">
          {photos.map((photo, index) => (
            <div key={`${photo._id}-${index}`} className="masonry-item">
              <img
                src={photo.url}
                alt={photo.description || 'Lookbook PUCA'}
                className="w-full h-auto rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300"
                loading="lazy"
              />
            </div>
          ))}
        </div>
        
        {hasMore && <div ref={observerRef} className="h-10" />}
        
        {!hasMore && photos.length > 0 && (
          <p className="text-center text-gray-500 py-8">Fim da galeria</p>
        )}
      </main>
    </PageLayout>
  );
}