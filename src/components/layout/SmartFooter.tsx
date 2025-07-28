/**
 * SmartFooter Component - Intelligent Footer Rendering
 * 
 * Wraps the existing Footer component with scroll-based visibility logic.
 * Footer only appears when user has scrolled near the bottom of the content,
 * preventing jarring appearances when users scroll through content.
 * 
 * Features:
 * - Scroll-based visibility (appears at ~85% scroll)
 * - Smooth fade transitions
 * - Preserves all existing Footer functionality
 * - Homepage support with intro system compatibility
 */

"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import Footer from "./Footer";
import { useScrollProgress } from "@/hooks/useScrollProgress";

interface SmartFooterProps {
  isHome?: boolean;
  threshold?: number; // Scroll percentage to show footer (default 85%)
  className?: string;
  [key: string]: any; // Preserve any existing Footer props
}

export default function SmartFooter({ 
  isHome = false, 
  threshold = 85,
  className = "",
  ...footerProps 
}: SmartFooterProps) {
  const { isNearBottom, scrollProgress } = useScrollProgress(threshold);
  
  const shouldShowFooter = isNearBottom;

  return (
    <AnimatePresence mode="wait">
      {shouldShowFooter && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          transition={{ 
            duration: 0.4, 
            ease: [0.25, 0.46, 0.45, 0.94] 
          }}
          className={`smart-footer-container ${className}`}
        >
          <Footer 
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// Export hook for external use if needed
export { useScrollProgress };