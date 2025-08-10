/**
 * Skeleton Loading Components
 * 
 * Provides various skeleton loading states to improve perceived performance
 * while data is being loaded.
 */

"use client";

import React from 'react';

interface SkeletonProps {
  className?: string;
  animate?: boolean;
  style?: React.CSSProperties;
}

// Base Skeleton Component
export const Skeleton: React.FC<SkeletonProps> = ({ 
  className = "", 
  animate = true,
  style 
}) => (
  <div 
    className={`
      bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded-md
      ${animate ? 'animate-pulse' : ''}
      ${className}
    `}
    style={style}
  />
);

// Product Card Skeleton
export const ProductCardSkeleton: React.FC = () => (
  <div className="group relative cursor-pointer transition-all duration-300 w-full">
    <div className="relative">
      <div className="relative w-full bg-white aspect-[3/4] lg:aspect-auto lg:h-[calc(92vh)]">
        <Skeleton className="w-full h-full" />
      </div>
      
      {/* Product Info Skeleton */}
      <div className="absolute bottom-0 left-0 right-0 p-4 bg-transparent backdrop-blur-sm">
        <Skeleton className="h-4 w-3/4 mb-2" />
        <Skeleton className="h-3 w-1/2 mb-2" />
        <Skeleton className="h-4 w-1/3" />
      </div>
    </div>
  </div>
);

// Product Grid Skeleton
export const ProductGridSkeleton: React.FC<{ count?: number }> = ({ count = 9 }) => (
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 w-full mx-auto">
    {Array.from({ length: count }).map((_, idx) => (
      <ProductCardSkeleton key={`product-skeleton-${idx}`} />
    ))}
  </div>
);

// Lookbook Photo Skeleton
export const LookbookPhotoSkeleton: React.FC = () => (
  <div className="masonry-item">
    <Skeleton 
      className="w-full rounded-lg shadow-md"
      style={{ 
        height: `${200 + Math.random() * 200}px` // Random heights for masonry effect
      }}
    />
  </div>
);

// Lookbook Grid Skeleton
export const LookbookGridSkeleton: React.FC<{ count?: number }> = ({ count = 12 }) => (
  <div className="masonry-grid pt-6">
    {Array.from({ length: count }).map((_, idx) => (
      <LookbookPhotoSkeleton key={`lookbook-skeleton-${idx}`} />
    ))}
  </div>
);

// Text Skeleton Components
export const TextSkeleton: React.FC<{ lines?: number; className?: string }> = ({ 
  lines = 3, 
  className = "" 
}) => (
  <div className={`space-y-2 ${className}`}>
    {Array.from({ length: lines }).map((_, idx) => (
      <Skeleton 
        key={idx}
        className={`h-4 ${
          idx === lines - 1 ? 'w-3/4' : 'w-full'
        }`} 
      />
    ))}
  </div>
);

// Button Skeleton
export const ButtonSkeleton: React.FC<{ className?: string }> = ({ className = "" }) => (
  <Skeleton className={`h-10 w-32 rounded-md ${className}`} />
);

// Header Skeleton
export const HeaderSkeleton: React.FC = () => (
  <div className="fixed top-0 left-0 right-0 flex items-center justify-between py-4 px-5 w-full z-50 bg-white border-b-2 border-gray-200">
    <Skeleton className="w-24 h-8" />
    <div className="hidden md:flex flex-row gap-8">
      <Skeleton className="w-20 h-6" />
      <Skeleton className="w-16 h-6" />
      <Skeleton className="w-24 h-6" />
    </div>
    <div className="flex items-center space-x-4">
      <Skeleton className="w-6 h-6 rounded-full" />
      <Skeleton className="w-6 h-6 rounded-full" />
    </div>
  </div>
);

// Page Skeleton - Full page loading state
export const PageSkeleton: React.FC = () => (
  <div className="min-h-screen bg-white">
    <HeaderSkeleton />
    <div className="pt-20 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <Skeleton className="h-8 w-1/3 mb-4" />
          <TextSkeleton lines={2} className="max-w-2xl" />
        </div>
        <ProductGridSkeleton count={6} />
      </div>
    </div>
  </div>
);

// Form Skeleton
export const FormSkeleton: React.FC = () => (
  <div className="space-y-6">
    <div>
      <Skeleton className="h-4 w-20 mb-2" />
      <Skeleton className="h-10 w-full rounded-md" />
    </div>
    <div>
      <Skeleton className="h-4 w-16 mb-2" />
      <Skeleton className="h-10 w-full rounded-md" />
    </div>
    <div>
      <Skeleton className="h-4 w-24 mb-2" />
      <Skeleton className="h-24 w-full rounded-md" />
    </div>
    <ButtonSkeleton className="w-full h-12" />
  </div>
);

// Card Skeleton
export const CardSkeleton: React.FC<{ className?: string }> = ({ className = "" }) => (
  <div className={`bg-white border border-gray-200 rounded-lg p-6 ${className}`}>
    <div className="flex items-start space-x-4">
      <Skeleton className="w-12 h-12 rounded-full flex-shrink-0" />
      <div className="flex-1 min-w-0">
        <Skeleton className="h-5 w-1/2 mb-2" />
        <TextSkeleton lines={2} />
        <div className="mt-4 flex space-x-2">
          <ButtonSkeleton className="w-20 h-8" />
          <ButtonSkeleton className="w-24 h-8" />
        </div>
      </div>
    </div>
  </div>
);

// Table Skeleton
export const TableSkeleton: React.FC<{ rows?: number; cols?: number }> = ({ 
  rows = 5, 
  cols = 4 
}) => (
  <div className="overflow-hidden bg-white border border-gray-200 rounded-lg">
    {/* Header */}
    <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
      <div className="flex space-x-4">
        {Array.from({ length: cols }).map((_, idx) => (
          <Skeleton key={idx} className="h-4 w-24" />
        ))}
      </div>
    </div>
    
    {/* Rows */}
    {Array.from({ length: rows }).map((_, rowIdx) => (
      <div key={rowIdx} className="px-6 py-4 border-b border-gray-100 last:border-b-0">
        <div className="flex space-x-4">
          {Array.from({ length: cols }).map((_, colIdx) => (
            <Skeleton 
              key={colIdx} 
              className={`h-4 ${colIdx === 0 ? 'w-32' : 'w-20'}`} 
            />
          ))}
        </div>
      </div>
    ))}
  </div>
);