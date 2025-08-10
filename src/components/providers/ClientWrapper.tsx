/**
 * Client-side wrapper component
 * 
 * Provides client-side only features like keyboard navigation
 */

"use client";

import React from 'react';
import { useKeyboardNavigation } from '@/lib/hooks/useKeyboardNavigation';

interface ClientWrapperProps {
  children: React.ReactNode;
}

export default function ClientWrapper({ children }: ClientWrapperProps) {
  // Initialize keyboard navigation
  useKeyboardNavigation({
    enableGlobalShortcuts: true,
    enableSearchShortcut: true,
    enableCartShortcut: true,
  });

  return <>{children}</>;
}