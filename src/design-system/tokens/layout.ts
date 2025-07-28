/**
 * Layout Design Tokens - Single Source of Truth
 * 
 * This file centralizes all layout-related constants to eliminate
 * the current chaos of inconsistent spacing values across the app.
 * 
 * Current Issues Being Solved:
 * - Header height: 6px (Home) vs 80px (CSS) vs 128px (pt-32)
 * - Z-index conflicts: Footer z-40 > Header z-30
 * - Inconsistent spacing across pages
 */

export const LAYOUT_TOKENS = {
  header: {
    height: 80,           // Single source of truth - matches current CSS
    zIndex: 50,           // Fixed: higher than footer
  },
  footer: {
    zIndex: 10,           // Fixed: lower than header
  },
  content: {
    paddingTop: 80,       // Matches header height exactly
  },
  modal: {
    zIndex: 100,          // Above everything else
    overlay: 90,          // Modal overlay layer
  },
  navigation: {
    mobileMenu: 60,       // Mobile menu overlay
  },
  toast: {
    zIndex: 110,          // Above modals
  }
} as const;

// Helper for consistent spacing
export const getHeaderSpacing = () => `${LAYOUT_TOKENS.content.paddingTop}px`;

// Helper for z-index management
export const getZIndex = (layer: 'header' | 'footer' | 'modal' | 'toast') => {
  const layerConfig = LAYOUT_TOKENS[layer];
  return 'zIndex' in layerConfig ? layerConfig.zIndex : 0;
};