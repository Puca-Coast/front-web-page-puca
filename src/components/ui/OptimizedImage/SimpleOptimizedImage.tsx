/**
 * SimpleOptimizedImage.tsx - Versão simplificada do componente de imagem otimizado
 * 
 * Este componente resolve problemas de imagens do Cloudinary em produção
 * usando tag img nativa para evitar processamento do Next.js.
 */

'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { 
  isCloudinaryImage, 
  optimizeCloudinaryImage, 
  CLOUDINARY_FALLBACK, 
  CLOUDINARY_QUALITY,
  CLOUDINARY_PLACEHOLDER_IMAGE 
} from '@/lib/cloudinary';

interface SimpleOptimizedImageProps {
  src: string;
  alt: string;
  width: number | string;
  height: number | string;
  className?: string;
  fallbackSrc?: string;
  enableFallback?: boolean;
  priority?: boolean;
  quality?: number;
  sizes?: string;
  objectFit?: 'fill' | 'contain' | 'cover' | 'none' | 'scale-down';
}

export const SimpleOptimizedImage: React.FC<SimpleOptimizedImageProps> = ({
  src,
  alt,
  width,
  height,
  className = '',
  fallbackSrc = CLOUDINARY_PLACEHOLDER_IMAGE,
  enableFallback = true,
  priority = false,
  quality = CLOUDINARY_QUALITY.HIGH,
  sizes,
  objectFit = 'cover',
}) => {
  const [imageError, setImageError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Otimizar URL se for do Cloudinary
  const optimizedSrc = isCloudinaryImage(src) 
    ? optimizeCloudinaryImage(src, {
        width: typeof width === 'string' ? undefined : width,
        height: typeof height === 'string' ? undefined : height,
        quality,
        format: 'auto',
        crop: objectFit === 'cover' ? 'fill' : 'limit',
      })
    : src;

  // Handler para erro de imagem
  const handleImageError = () => {
    console.error(`Failed to load image: ${src}`);
    setImageError(true);
    setIsLoading(false);
  };

  // Handler para sucesso de carregamento
  const handleImageLoad = () => {
    setIsLoading(false);
  };

  // Se houver erro e fallback estiver habilitado
  if (imageError && enableFallback) {
    return (
      <div 
        className={`relative bg-gray-100 flex items-center justify-center ${className}`} 
        style={typeof width === 'string' || typeof height === 'string' ? {} : { width, height }}
      >
        <img
          src={fallbackSrc}
          alt={`${alt} (fallback)`}
          className="opacity-50 max-w-[80%] max-h-[80%] object-contain"
          style={{ filter: 'grayscale(100%)' }}
        />
      </div>
    );
  }

  // Usar Next/Image com unoptimized para todas as imagens
  // já que configuramos unoptimized: true no next.config.mjs
  return (
    <div 
      className={`relative ${className}`} 
      style={typeof width === 'string' || typeof height === 'string' ? {} : { width, height }}
    >
      {isLoading && (
        <div className="absolute inset-0 bg-gray-200 animate-pulse flex items-center justify-center">
          <div className="w-8 h-8 bg-gray-300 rounded-full animate-pulse"></div>
        </div>
      )}
      <Image
        src={optimizedSrc}
        alt={alt}
        width={typeof width === 'string' ? 0 : width}
        height={typeof height === 'string' ? 0 : height}
        className={`${isLoading ? 'opacity-0' : 'opacity-100'} transition-opacity duration-300 w-full h-auto`}
        style={{ objectFit }}
        onLoadingComplete={(result) => {
          if (result.naturalWidth === 0) {
            // Broken image
            handleImageError();
          } else {
            handleImageLoad();
          }
        }}
        priority={priority}
        quality={quality}
        sizes={sizes}
        unoptimized={true}
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