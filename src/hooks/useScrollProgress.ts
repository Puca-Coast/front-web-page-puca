/**
 * useScrollProgress Hook - Intelligent Scroll Detection
 * 
 * Tracks scroll progress and determines when footer should be visible.
 * Footer appears when user has scrolled ~85% of the content to avoid
 * sudden appearance when reaching the very bottom.
 * 
 * Can monitor either window scroll or a specific container scroll.
 */

import { useState, useEffect, useCallback } from 'react';
import { RefObject } from 'react/index';

interface ScrollProgress {
  scrollProgress: number; // 0-100 percentage
  isNearBottom: boolean;  // true when footer should be visible
  isAtTop: boolean;       // true when at page top
}

interface UseScrollProgressOptions {
  threshold?: number;
  containerRef?: RefObject<HTMLElement>;
}

export const useScrollProgress = (options: UseScrollProgressOptions | number = {}): ScrollProgress => {
  // Handle both legacy number parameter and new options object
  const { threshold = 85, containerRef } = typeof options === 'number' 
    ? { threshold: options, containerRef: undefined }
    : options;

  const [scrollProgress, setScrollProgress] = useState(0);
  const [isNearBottom, setIsNearBottom] = useState(false);
  const [isAtTop, setIsAtTop] = useState(true);

  const handleScroll = useCallback(() => {
    const container = containerRef?.current;
    
    if (container) {
      // Container-based scrolling
      const scrollTop = container.scrollTop;
      const scrollHeight = container.scrollHeight;
      const clientHeight = container.clientHeight;
      
      const maxScroll = scrollHeight - clientHeight;
      const progress = maxScroll > 0 ? (scrollTop / maxScroll) * 100 : 0;
      
      setScrollProgress(Math.min(100, Math.max(0, progress)));
      setIsNearBottom(progress >= threshold);
      setIsAtTop(scrollTop < 50);
    } else {
      // Window-based scrolling (legacy behavior)
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      const documentHeight = document.documentElement.scrollHeight;
      const windowHeight = window.innerHeight;
      
      const maxScroll = documentHeight - windowHeight;
      const progress = maxScroll > 0 ? (scrollTop / maxScroll) * 100 : 0;
      
      setScrollProgress(Math.min(100, Math.max(0, progress)));
      setIsNearBottom(progress >= threshold);
      setIsAtTop(scrollTop < 50);
    }
  }, [threshold, containerRef]);

  useEffect(() => {
    // Initial check
    handleScroll();
    
    const container = containerRef?.current;
    
    // Add scroll listener with throttling for performance
    let ticking = false;
    const throttledScrollHandler = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          handleScroll();
          ticking = false;
        });
        ticking = true;
      }
    };

    if (container) {
      // Listen to container scroll
      container.addEventListener('scroll', throttledScrollHandler, { passive: true });
      window.addEventListener('resize', handleScroll, { passive: true });
      
      return () => {
        container.removeEventListener('scroll', throttledScrollHandler);
        window.removeEventListener('resize', handleScroll);
      };
    } else {
      // Listen to window scroll (legacy behavior)
      window.addEventListener('scroll', throttledScrollHandler, { passive: true });
      window.addEventListener('resize', handleScroll, { passive: true });

      return () => {
        window.removeEventListener('scroll', throttledScrollHandler);
        window.removeEventListener('resize', handleScroll);
      };
    }
  }, [handleScroll, containerRef]);

  return {
    scrollProgress,
    isNearBottom,
    isAtTop
  };
};