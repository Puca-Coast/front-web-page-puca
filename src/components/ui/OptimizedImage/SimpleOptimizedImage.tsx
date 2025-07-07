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
  fallbackSrc = CLOUDINARY_PLACEHOLDER_IMAGE,
  enableFallback = true,
  priority = false,
  quality = CLOUDINARY_QUALITY.HIGH,
  sizes,
}) => {
  const [imageError, setImageError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

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

  // Handler para erro de imagem
  const handleImageError = () => {
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
      <div className="relative bg-gray-100 flex items-center justify-center" style={{ width, height }}>
        <img
          src={fallbackSrc}
          alt={`${alt} (fallback)`}
          className={`${className} opacity-75 max-w-full max-h-full object-contain`}
          style={{ width: 'auto', height: 'auto' }}
        />
      </div>
    );
  }

  // Para imagens do Cloudinary, usar tag img nativa
  if (isCloudinaryImage(src)) {
    return (
      <div className="relative" style={{ width, height }}>
        {isLoading && (
          <div className="absolute inset-0 bg-gray-200 animate-pulse flex items-center justify-center">
            <div className="w-8 h-8 bg-gray-300 rounded-full animate-pulse"></div>
          </div>
        )}
        <img
          src={optimizedSrc}
          alt={alt}
          className={`${className} ${isLoading ? 'opacity-0' : 'opacity-100'} transition-opacity duration-300`}
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          onError={handleImageError}
          onLoad={handleImageLoad}
          loading={priority ? 'eager' : 'lazy'}
        />
      </div>
    );
  }

  // Para outras imagens, usar Next.js Image
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