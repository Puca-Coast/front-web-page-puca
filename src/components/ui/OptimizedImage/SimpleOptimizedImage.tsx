/**
 * SimpleOptimizedImage.tsx - Versão simplificada do componente de imagem otimizado
 * 
 * Este componente resolve problemas de imagens do Cloudinary em produção
 * com uma abordagem mais simples e compatível com Next.js.
 */

'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { 
  isCloudinaryImage, 
  optimizeCloudinaryImage, 
  CLOUDINARY_FALLBACK, 
  CLOUDINARY_QUALITY 
} from '@/lib/cloudinary';

interface SimpleOptimizedImageProps {
  src: string;
  alt: string;
  width: number;
  height: number;
  className?: string;
  fallbackSrc?: string;
  enableFallback?: boolean;
  priority?: boolean;
  quality?: number;
  sizes?: string;
}

export const SimpleOptimizedImage: React.FC<SimpleOptimizedImageProps> = ({
  src,
  alt,
  width,
  height,
  className = '',
  fallbackSrc = CLOUDINARY_FALLBACK,
  enableFallback = true,
  priority = false,
  quality = CLOUDINARY_QUALITY.HIGH,
  sizes,
}) => {
  const [imageError, setImageError] = useState(false);

  // Otimizar URL se for do Cloudinary
  const optimizedSrc = isCloudinaryImage(src) 
    ? optimizeCloudinaryImage(src, {
        width,
        height,
        quality,
        format: 'auto',
        crop: 'limit',
      })
    : src;

  // Se houver erro e fallback estiver habilitado, usar imagem de fallback
  if (imageError && enableFallback) {
    return (
      <Image
        src={fallbackSrc}
        alt={`${alt} (fallback)`}
        width={width}
        height={height}
        className={`${className} opacity-75`}
        priority={priority}
        unoptimized={true}
      />
    );
  }

  return (
    <div className="relative">
      <Image
        src={optimizedSrc}
        alt={alt}
        width={width}
        height={height}
        className={className}
        priority={priority}
        quality={quality}
        sizes={sizes}
        unoptimized={isCloudinaryImage(src)} // Desabilita otimização do Next.js para Cloudinary
      />
    </div>
  );
};

/**
 * Componente especializado para imagens do lookbook
 */
export const SimpleLookbookImage: React.FC<Omit<SimpleOptimizedImageProps, 'quality'>> = (props) => {
  return (
    <SimpleOptimizedImage
      {...props}
      quality={CLOUDINARY_QUALITY.HIGH}
    />
  );
};

/**
 * Componente especializado para imagens de produtos
 */
export const SimpleProductImage: React.FC<Omit<SimpleOptimizedImageProps, 'quality'>> = (props) => {
  return (
    <SimpleOptimizedImage
      {...props}
      quality={CLOUDINARY_QUALITY.ULTRA}
    />
  );
};

/**
 * Componente especializado para thumbnails
 */
export const SimpleThumbnailImage: React.FC<Omit<SimpleOptimizedImageProps, 'quality'>> = (props) => {
  return (
    <SimpleOptimizedImage
      {...props}
      quality={CLOUDINARY_QUALITY.MEDIUM}
    />
  );
};

export default SimpleOptimizedImage; 