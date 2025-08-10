/**
 * Accessibility Provider
 * 
 * Provides comprehensive accessibility features including keyboard navigation,
 * screen reader announcements, and focus management.
 */

"use client";

import React, { createContext, useContext, useRef, useCallback } from 'react';
import { useKeyboardNavigation } from '@/lib/hooks/useKeyboardNavigation';

interface AccessibilityContextType {
  announce: (message: string, priority?: 'polite' | 'assertive') => void;
  setFocus: (elementId: string) => void;
}

const AccessibilityContext = createContext<AccessibilityContextType | undefined>(undefined);

interface AccessibilityProviderProps {
  children: React.ReactNode;
}

export function AccessibilityProvider({ children }: AccessibilityProviderProps) {
  const politeAnnouncerRef = useRef<HTMLDivElement>(null);
  const assertiveAnnouncerRef = useRef<HTMLDivElement>(null);

  // Initialize keyboard navigation
  useKeyboardNavigation({
    enableGlobalShortcuts: true,
    enableSearchShortcut: true,
    enableCartShortcut: true,
  });

  const announce = useCallback((message: string, priority: 'polite' | 'assertive' = 'polite') => {
    const announcer = priority === 'assertive' ? assertiveAnnouncerRef.current : politeAnnouncerRef.current;
    
    if (announcer) {
      // Clear previous announcement
      announcer.textContent = '';
      
      // Set new announcement after a brief delay to ensure screen readers pick it up
      setTimeout(() => {
        if (announcer) {
          announcer.textContent = message;
        }
      }, 100);
    }
  }, []);

  const setFocus = useCallback((elementId: string) => {
    const element = document.getElementById(elementId);
    if (element) {
      element.focus();
    }
  }, []);

  const value: AccessibilityContextType = {
    announce,
    setFocus,
  };

  return (
    <AccessibilityContext.Provider value={value}>
      {children}
      
      {/* Screen reader announcements */}
      <div
        ref={politeAnnouncerRef}
        className="sr-only"
        aria-live="polite"
        aria-atomic="true"
      />
      <div
        ref={assertiveAnnouncerRef}
        className="sr-only"
        aria-live="assertive"
        aria-atomic="true"
      />
    </AccessibilityContext.Provider>
  );
}

export function useAccessibility() {
  const context = useContext(AccessibilityContext);
  
  if (!context) {
    throw new Error('useAccessibility must be used within an AccessibilityProvider');
  }
  
  return context;
}

/**
 * Hook for managing announcements on page load
 */
export function usePageAnnouncement(title: string, description?: string) {
  const { announce } = useAccessibility();
  
  React.useEffect(() => {
    const message = description ? `${title}. ${description}` : title;
    announce(message, 'polite');
  }, [title, description, announce]);
}

/**
 * Hook for managing loading state announcements
 */
export function useLoadingAnnouncement(isLoading: boolean, loadingMessage = 'Carregando...', completeMessage = 'Carregamento concluído') {
  const { announce } = useAccessibility();
  
  React.useEffect(() => {
    if (isLoading) {
      announce(loadingMessage, 'polite');
    } else {
      announce(completeMessage, 'polite');
    }
  }, [isLoading, loadingMessage, completeMessage, announce]);
}

/**
 * Hook for managing error announcements
 */
export function useErrorAnnouncement(error: string | null) {
  const { announce } = useAccessibility();
  
  React.useEffect(() => {
    if (error) {
      announce(`Erro: ${error}`, 'assertive');
    }
  }, [error, announce]);
}