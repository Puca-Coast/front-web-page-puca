/**
 * Keyboard Navigation Hook
 * 
 * Provides keyboard navigation support for better accessibility
 * and power user experience.
 */

import { useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';

interface KeyboardNavigationOptions {
  enableGlobalShortcuts?: boolean;
  enableSearchShortcut?: boolean;
  enableCartShortcut?: boolean;
}

export function useKeyboardNavigation(options: KeyboardNavigationOptions = {}) {
  const {
    enableGlobalShortcuts = true,
    enableSearchShortcut = true,
    enableCartShortcut = true,
  } = options;

  const router = useRouter();

  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    // Don't trigger shortcuts when user is typing in inputs
    if (
      event.target instanceof HTMLInputElement ||
      event.target instanceof HTMLTextAreaElement ||
      event.target instanceof HTMLSelectElement ||
      (event.target as Element)?.getAttribute('contenteditable') === 'true'
    ) {
      return;
    }

    // Global shortcuts (Cmd/Ctrl + key)
    if (enableGlobalShortcuts && (event.metaKey || event.ctrlKey)) {
      switch (event.key) {
        case 'h':
          event.preventDefault();
          router.push('/');
          break;
        case 's':
          if (enableSearchShortcut) {
            event.preventDefault();
            router.push('/shop');
          }
          break;
        case 'l':
          event.preventDefault();
          router.push('/lookbook');
          break;
        case 'b':
          if (enableCartShortcut) {
            event.preventDefault();
            // Trigger cart modal - you can emit a custom event or use a global state
            window.dispatchEvent(new CustomEvent('toggle-cart'));
          }
          break;
        case '/':
          if (enableSearchShortcut) {
            event.preventDefault();
            // Focus search input if available
            const searchInput = document.querySelector('input[type="search"]') as HTMLInputElement;
            if (searchInput) {
              searchInput.focus();
            }
          }
          break;
      }
    }

    // Single key shortcuts
    if (!event.metaKey && !event.ctrlKey && !event.altKey) {
      switch (event.key) {
        case 'Escape':
          // Close modals, clear focus, etc.
          window.dispatchEvent(new CustomEvent('close-modal'));
          const activeElement = document.activeElement as HTMLElement;
          if (activeElement && activeElement.blur) {
            activeElement.blur();
          }
          break;
      }
    }
  }, [router, enableGlobalShortcuts, enableSearchShortcut, enableCartShortcut]);

  useEffect(() => {
    if (!enableGlobalShortcuts) return;

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleKeyDown, enableGlobalShortcuts]);

  return {
    // You can return helper functions if needed
    navigateToHome: () => router.push('/'),
    navigateToShop: () => router.push('/shop'),
    navigateToLookbook: () => router.push('/lookbook'),
  };
}

/**
 * Hook for managing focus trap in modals
 */
export function useFocusTrap(isActive: boolean, containerRef: React.RefObject<HTMLElement>) {
  useEffect(() => {
    if (!isActive || !containerRef.current) return;

    const container = containerRef.current;
    const focusableElements = container.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    const firstElement = focusableElements[0] as HTMLElement;
    const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;

    const handleTabKey = (event: KeyboardEvent) => {
      if (event.key !== 'Tab') return;

      if (event.shiftKey) {
        if (document.activeElement === firstElement) {
          event.preventDefault();
          lastElement?.focus();
        }
      } else {
        if (document.activeElement === lastElement) {
          event.preventDefault();
          firstElement?.focus();
        }
      }
    };

    document.addEventListener('keydown', handleTabKey);
    firstElement?.focus();

    return () => {
      document.removeEventListener('keydown', handleTabKey);
    };
  }, [isActive, containerRef]);
}