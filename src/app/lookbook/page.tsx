"use client";

import React, { useCallback, useMemo } from "react";
import PageLayout from "@/layouts/PageLayout";
import "@/styles/lookbookStyles.css";
import { useInfiniteLookbook } from "@/lib/hooks/useLookbook";
import { useSmartPrefetch, useIntersectionPrefetch } from "@/lib/hooks/usePrefetch";
import { LookbookGridSkeleton, ErrorBoundary, ErrorState, LoadingIndicator, EmptyState } from "@/components/ui";
import { usePageAnnouncement, useLoadingAnnouncement, useErrorAnnouncement } from "@/lib/providers/AccessibilityProvider";

interface LookbookPhoto {
  _id: string;
  url: string;
  description?: string;
}

function LookbookContent() {
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
    error
  } = useInfiniteLookbook(20, 'primavera2024');

  const { preloadImages, trackInteraction } = useSmartPrefetch();

  // Flatten all photos from all pages
  const allPhotos = useMemo(() => {
    if (!data?.pages) return [];
    
    return data.pages.flatMap(page => 
      page.success ? page.data : []
    );
  }, [data?.pages]);

  // Accessibility announcements
  usePageAnnouncement('Lookbook PUCA', 'Explore nossa galeria de fotos da coleção');
  useLoadingAnnouncement(isLoading, 'Carregando galeria...', `${allPhotos.length} fotos carregadas`);
  useErrorAnnouncement(error?.message || null);

  // Preload images when photos change
  React.useEffect(() => {
    if (allPhotos.length > 0) {
      const urls = allPhotos.map(photo => photo.url);
      preloadImages(urls);
    }
  }, [allPhotos, preloadImages]);

  // Intersection observer for infinite scrolling
  const loadMoreRef = useIntersectionPrefetch(
    useCallback(() => {
      if (hasNextPage && !isFetchingNextPage) {
        fetchNextPage();
      }
    }, [hasNextPage, isFetchingNextPage, fetchNextPage]),
    { rootMargin: "500px" } // Start loading earlier for better UX
  );

  // Track user interactions for analytics
  const handleImageClick = useCallback((photoId: string) => {
    trackInteraction('click', 'lookbook-photo', { photoId });
  }, [trackInteraction]);

  return (
    <PageLayout noPaddingTop={true}>
      <main className="flex-1 w-full mx-auto px-6 pb-16">
        
        {/* Loading State */}
        {isLoading && <LookbookGridSkeleton count={12} />}

        {/* Error State */}
        {isError && (
          <ErrorState
            message={error?.message || 'Erro ao carregar galeria'}
            onRetry={() => window.location.reload()}
          />
        )}

        {/* Photos Masonry Grid */}
        {!isLoading && !isError && allPhotos.length > 0 && (
          <div className="masonry-grid pt-6">
            {allPhotos.map((photo, index) => (
              <div 
                key={`${photo._id}-${index}`} 
                className="masonry-item"
                onClick={() => handleImageClick(photo._id)}
              >
                <img
                  src={photo.url}
                  alt={photo.description || 'Lookbook PUCA'}
                  className="w-full h-auto rounded-lg shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer transform hover:scale-[1.02]"
                  loading="lazy"
                  onLoad={() => {
                    // Track successful image loads for performance monitoring
                    trackInteraction('load', 'lookbook-photo', { 
                      photoId: photo._id, 
                      loadTime: performance.now() 
                    });
                  }}
                />
              </div>
            ))}
          </div>
        )}
        
        {/* Load More Trigger & Loading State */}
        {hasNextPage && (
          <div ref={loadMoreRef} className="h-20 flex items-center justify-center mt-8">
            {isFetchingNextPage && (
              <LoadingIndicator text="Carregando mais fotos..." />
            )}
          </div>
        )}
        
        {/* End of Gallery Message */}
        {!hasNextPage && allPhotos.length > 0 && (
          <p className="text-center text-gray-500 py-8">Fim da galeria</p>
        )}

        {/* Empty State */}
        {!isLoading && !isError && allPhotos.length === 0 && (
          <EmptyState
            title="Galeria vazia"
            description="Não encontramos fotos para exibir no momento."
          />
        )}
      </main>
    </PageLayout>
  );
}

export default function LookbookPage() {
  return (
    <ErrorBoundary level="page">
      <LookbookContent />
    </ErrorBoundary>
  );
}