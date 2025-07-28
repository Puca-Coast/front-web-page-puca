/**
 * Animation Design Tokens - Unified Animation System
 * 
 * This file centralizes all animation-related constants to ensure
 * consistent timing, easing, and transitions across the entire app.
 * 
 * Usage:
 * import { ANIMATION_TOKENS } from '@/design-system/tokens/animation';
 * 
 * // Framer Motion
 * transition={{ duration: ANIMATION_TOKENS.durations.normal }}
 * 
 * // CSS
 * transition: opacity ${ANIMATION_TOKENS.durations.fast}s ease-out;
 */

export const ANIMATION_TOKENS = {
  // Duration tokens (in seconds)
  durations: {
    instant: 0.1,        // Micro-interactions (hover, focus)
    fast: 0.2,           // Quick state changes (buttons, toggles)
    normal: 0.4,         // Standard transitions (modal, drawer)
    slow: 0.6,           // Content transitions (page elements)
    intro: 1.0,          // Intro animations, hero sections
    pageTransition: 0.8, // Page-to-page transitions
  },

  // Easing functions (cubic-bezier)
  easings: {
    // Standard easings
    linear: [0, 0, 1, 1],
    easeOut: [0.25, 0.46, 0.45, 0.94],    // Most common - smooth deceleration
    easeIn: [0.55, 0.06, 0.68, 0.19],     // Acceleration
    easeInOut: [0.65, 0.05, 0.36, 1],     // Smooth both ways
    
    // Special easings
    smooth: [0.25, 0.46, 0.45, 0.94],     // Alias for easeOut
    bounce: [0.68, -0.55, 0.265, 1.55],   // Bouncy effect
    elastic: [0.25, 0.46, 0.45, 0.94],    // Elastic-like
    sharp: [0.4, 0.0, 0.2, 1],            // Sharp, material design
  },

  // Delay tokens for staggered animations
  delays: {
    none: 0,
    tiny: 0.05,      // Micro stagger
    small: 0.1,      // List items
    medium: 0.2,     // Cards, sections
    large: 0.4,      // Major sections
  },

  // Spring configurations for Framer Motion
  springs: {
    gentle: {
      type: "spring",
      stiffness: 120,
      damping: 14,
    },
    snappy: {
      type: "spring", 
      stiffness: 400,
      damping: 30,
    },
    wobbly: {
      type: "spring",
      stiffness: 180,
      damping: 12,
    },
  },

  // Page transition variants
  pageVariants: {
    initial: { 
      opacity: 0, 
      y: 20,
      scale: 0.98,
    },
    animate: { 
      opacity: 1, 
      y: 0,
      scale: 1,
      transition: {
        duration: 0.6,
        ease: [0.25, 0.46, 0.45, 0.94],
      }
    },
    exit: { 
      opacity: 0, 
      y: -20,
      scale: 0.98,
      transition: {
        duration: 0.4,
        ease: [0.25, 0.46, 0.45, 0.94],
      }
    },
  },

  // Stagger configurations
  stagger: {
    // Fast stagger for small lists
    fast: {
      staggerChildren: 0.05,
      delayChildren: 0.1,
    },
    // Normal stagger for cards/items
    normal: {
      staggerChildren: 0.12,
      delayChildren: 0.1,
    },
    // Slow stagger for major sections
    slow: {
      staggerChildren: 0.2,
      delayChildren: 0.2,
    },
  },

  // Common animation presets
  presets: {
    // Fade in from bottom (most common)
    fadeInUp: {
      initial: { opacity: 0, y: 60, scale: 0.8 },
      animate: { 
        opacity: 1, 
        y: 0, 
        scale: 1,
        transition: {
          duration: 0.6,
          ease: [0.25, 0.46, 0.45, 0.94]
        }
      }
    },

    // Scale in (for modals, cards)
    scaleIn: {
      initial: { opacity: 0, scale: 0.95 },
      animate: { 
        opacity: 1, 
        scale: 1,
        transition: {
          duration: 0.4,
          ease: [0.25, 0.46, 0.45, 0.94]
        }
      }
    },

    // Slide in from right (for panels, drawers)
    slideInRight: {
      initial: { opacity: 0, x: 100 },
      animate: { 
        opacity: 1, 
        x: 0,
        transition: {
          duration: 0.4,
          ease: [0.25, 0.46, 0.45, 0.94]
        }
      }
    },

    // Header appearance (for fixed headers)
    headerDrop: {
      initial: { opacity: 0, y: -50 },
      animate: { 
        opacity: 1, 
        y: 0,
        transition: {
          duration: 0.8,
          ease: [0.25, 0.46, 0.45, 0.94]
        }
      }
    },

    // Footer rise (for footers)
    footerRise: {
      initial: { opacity: 0, y: 20 },
      animate: { 
        opacity: 1, 
        y: 0,
        transition: {
          duration: 0.4,
          ease: [0.25, 0.46, 0.45, 0.94]
        }
      }
    },
  },

  // Hover animations
  hover: {
    scale: {
      whileHover: { 
        scale: 1.02,
        transition: { duration: 0.2 }
      }
    },
    lift: {
      whileHover: { 
        y: -4,
        transition: { duration: 0.2 }
      }
    },
    glow: {
      whileHover: { 
        boxShadow: "0 10px 30px rgba(0,0,0,0.1)",
        transition: { duration: 0.2 }
      }
    },
  },
} as const;

// Utility functions for common use cases
export const getAnimationDuration = (speed: keyof typeof ANIMATION_TOKENS.durations) => 
  ANIMATION_TOKENS.durations[speed];

export const getAnimationEasing = (type: keyof typeof ANIMATION_TOKENS.easings) => 
  ANIMATION_TOKENS.easings[type];

export const createStaggerContainer = (speed: keyof typeof ANIMATION_TOKENS.stagger = 'normal') => ({
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: ANIMATION_TOKENS.stagger[speed]
  }
});

export const createStaggerItem = (delay: number = 0) => ({
  hidden: { 
    opacity: 0, 
    y: 60, 
    scale: 0.8 
  },
  visible: { 
    opacity: 1, 
    y: 0, 
    scale: 1,
    transition: {
      duration: ANIMATION_TOKENS.durations.slow,
      ease: ANIMATION_TOKENS.easings.easeOut,
      delay
    }
  }
});
