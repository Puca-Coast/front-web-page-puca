/**
 * Intelligent Prefetching Hooks
 * 
 * This module provides hooks and utilities for intelligent data prefetching
 * to optimize user experience by loading data before it's needed.
 */

import { useQueryClient } from '@tanstack/react-query';
import { useCallback, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { queryKeys, staleTime } from '../queryKeys';
import { productService } from '../services/api/productService';
import { lookbookService } from '../services/api/lookbookService';

/**
 * Hook for prefetching product data
 */
export function usePrefetchProducts() {
  const queryClient = useQueryClient();

  const prefetchProducts = useCallback(
    async (page = 1, limit = 20) => {
      await queryClient.prefetchQuery({
        queryKey: queryKeys.products.list({ page, limit }),
        queryFn: () => productService.getProducts(page, limit),
        staleTime: staleTime.PRODUCTS,
      });
    },
    [queryClient]
  );

  const prefetchProduct = useCallback(
    async (productId: string) => {
      await queryClient.prefetchQuery({
        queryKey: queryKeys.products.detail(productId),
        queryFn: () => productService.getProductById(productId),
        staleTime: staleTime.PRODUCTS,
      });
    },
    [queryClient]
  );

  const prefetchRelatedProducts = useCallback(
    async (productId: string) => {
      // For now, we'll prefetch trending products as "related"
      // You can implement actual related products logic later
      await queryClient.prefetchQuery({
        queryKey: queryKeys.products.related(productId),
        queryFn: () => productService.getProducts(1, 8), // Get 8 related products
        staleTime: staleTime.PRODUCTS,
      });
    },
    [queryClient]
  );

  return {
    prefetchProducts,
    prefetchProduct,
    prefetchRelatedProducts,
  };
}

/**
 * Hook for prefetching lookbook data
 */
export function usePrefetchLookbook() {
  const queryClient = useQueryClient();

  const prefetchLookbook = useCallback(
    async (page = 1, limit = 20, season = 'primavera2024') => {
      await queryClient.prefetchQuery({
        queryKey: queryKeys.lookbook.photos({ page, limit, season }),
        queryFn: () => lookbookService.getPhotos(page, limit, season),
        staleTime: staleTime.LOOKBOOK,
      });
    },
    [queryClient]
  );

  return {
    prefetchLookbook,
  };
}

/**
 * Hook for route-based prefetching
 * Prefetches data when user hovers over navigation links
 */
export function useRoutePrefetch() {
  const { prefetchProducts, prefetchProduct } = usePrefetchProducts();
  const { prefetchLookbook } = usePrefetchLookbook();

  const prefetchRoute = useCallback(
    (route: string) => {
      switch (route) {
        case '/shop':
          prefetchProducts(1, 20);
          break;
        case '/lookbook':
          prefetchLookbook(1, 20);
          break;
        case '/':
          // Prefetch featured products for homepage
          prefetchProducts(1, 8);
          break;
        default:
          // If it's a product detail route
          if (route.startsWith('/product/')) {
            const productId = route.split('/').pop();
            if (productId) {
              prefetchProduct(productId);
            }
          }
      }
    },
    [prefetchProducts, prefetchLookbook, prefetchProduct]
  );

  return { prefetchRoute };
}

/**
 * Hook for intersection-based prefetching
 * Prefetches next page data when user scrolls near the bottom
 */
export function useIntersectionPrefetch<T extends HTMLElement = HTMLDivElement>(
  callback: () => void,
  options: IntersectionObserverInit = {}
) {
  const observerRef = useRef<T | null>(null);
  const intersectionObserverRef = useRef<IntersectionObserver | null>(null);
  const callbackRef = useRef(callback);
  
  // Update callback ref when callback changes to avoid stale closures
  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  useEffect(() => {
    const element = observerRef.current;
    if (!element) return;

    // Cleanup previous observer if exists
    if (intersectionObserverRef.current) {
      intersectionObserverRef.current.disconnect();
      intersectionObserverRef.current = null;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting) {
          callbackRef.current();
        }
      },
      {
        rootMargin: '200px', // Start prefetching 200px before the element is visible
        ...options,
      }
    );

    intersectionObserverRef.current = observer;
    observer.observe(element);

    return () => {
      if (intersectionObserverRef.current) {
        intersectionObserverRef.current.disconnect();
        intersectionObserverRef.current = null;
      }
    };
  }, [options.rootMargin, options.root, options.threshold]); // Only re-run when options change

  // Additional cleanup on unmount
  useEffect(() => {
    return () => {
      if (intersectionObserverRef.current) {
        intersectionObserverRef.current.disconnect();
        intersectionObserverRef.current = null;
      }
    };
  }, []);

  return observerRef;
}

/**
 * Hook for predictive prefetching based on user behavior
 */
export function usePredictivePrefetch() {
  const { prefetchProducts, prefetchProduct } = usePrefetchProducts();
  const { prefetchLookbook } = usePrefetchLookbook();
  const router = useRouter();

  // Track user interactions for predictive loading
  const trackInteraction = useCallback(
    (type: 'hover' | 'click' | 'load', target: string, data?: any) => {
      try {
        // Store interaction in sessionStorage for behavior analysis
        const interactions = JSON.parse(
          sessionStorage.getItem('user_interactions') || '[]'
        );
        
        const newInteraction = {
          type,
          target,
          data,
          timestamp: Date.now(),
        };
        
        interactions.push(newInteraction);

        // Enhanced cleanup - keep only last 50 interactions and remove old ones (> 1 hour)
        const oneHourAgo = Date.now() - (60 * 60 * 1000);
        const cleanedInteractions = interactions
          .filter((interaction: any) => interaction.timestamp > oneHourAgo)
          .slice(-50); // Keep only last 50

        sessionStorage.setItem('user_interactions', JSON.stringify(cleanedInteractions));
        
        // Cleanup other session storage if it gets too large
        if (sessionStorage.length > 100) {
          // Remove old prefetch cache entries
          for (let i = sessionStorage.length - 1; i >= 0; i--) {
            const key = sessionStorage.key(i);
            if (key && key.startsWith('prefetch_cache_') && Math.random() > 0.5) {
              sessionStorage.removeItem(key);
            }
          }
        }
      } catch (error) {
        // Handle sessionStorage quota exceeded or other errors
        console.warn('Failed to store user interaction:', error);
        // Clear old data and retry with just the new interaction
        try {
          sessionStorage.removeItem('user_interactions');
          sessionStorage.setItem('user_interactions', JSON.stringify([{
            type,
            target,
            data,
            timestamp: Date.now(),
          }]));
        } catch (retryError) {
          console.error('SessionStorage completely unavailable:', retryError);
        }
      }

      // Trigger predictive prefetching based on patterns
      if (type === 'hover' && target === 'product-card') {
        // User is hovering over products, likely to visit product details
        prefetchProducts(1, 12); // Prefetch more products
      } else if (type === 'hover' && target === 'lookbook-nav') {
        // User is interested in lookbook
        prefetchLookbook(1, 20);
      }
    },
    [prefetchProducts, prefetchLookbook]
  );

  return { trackInteraction };
}

/**
 * Hook for image preloading
 * Preloads images to improve perceived performance
 */
export function useImagePreload() {
  const preloadImages = useCallback((urls: string[]) => {
    urls.forEach((url) => {
      if (typeof window !== 'undefined') {
        const img = new Image();
        img.src = url;
      }
    });
  }, []);

  const preloadProductImages = useCallback(
    (products: Array<{ imageUrl?: string; hoverImageUrl?: string }>) => {
      const urls = products
        .flatMap(product => [product.imageUrl, product.hoverImageUrl])
        .filter(Boolean) as string[];
      
      preloadImages(urls);
    },
    [preloadImages]
  );

  return {
    preloadImages,
    preloadProductImages,
  };
}

/**
 * Hook that combines all prefetching strategies
 * Use this as the main prefetching hook in your components
 */
export function useSmartPrefetch() {
  const routePrefetch = useRoutePrefetch();
  const predictivePrefetch = usePredictivePrefetch();
  const imagePreload = useImagePreload();
  const productPrefetch = usePrefetchProducts();
  const lookbookPrefetch = usePrefetchLookbook();

  return {
    ...routePrefetch,
    ...predictivePrefetch,
    ...imagePreload,
    ...productPrefetch,
    ...lookbookPrefetch,
  };
}