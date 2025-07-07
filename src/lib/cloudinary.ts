/**
 * cloudinary.ts - Utilities for Cloudinary image optimization
 * 
 * Este módulo implementa otimizações personalizadas para imagens do Cloudinary,
 * evitando conflitos com o Next.js Image Optimization no Netlify.
 */

/**
 * Cloudinary Image Loader para Next.js
 * Bypass da otimização do Next.js para usar diretamente o Cloudinary
 */
const cloudinaryLoader = ({ src, width, quality }: {
  src: string;
  width: number;
  quality?: number;
}) => {
  // Se a URL já for do Cloudinary, otimizar usando as transformações do Cloudinary
  if (src.includes('res.cloudinary.com')) {
    const params = ['f_auto', 'c_limit'];
    
    if (width) {
      params.push(`w_${width}`);
    }
    
    if (quality) {
      params.push(`q_${quality}`);
    }
    
    // Inserir as transformações na URL do Cloudinary
    const transformations = params.join(',');
    return src.replace('/upload/', `/upload/${transformations}/`);
  }
  
  // Para outras URLs, retornar como está
  return src;
};

// Export default para uso como loader do Next.js
export default cloudinaryLoader;

// Export named para uso em outros lugares
export { cloudinaryLoader };

/**
 * Configurações de quality presets para diferentes usos
 */
export const CLOUDINARY_QUALITY = {
  LOW: 30,
  MEDIUM: 60,
  HIGH: 80,
  ULTRA: 95,
} as const;

/**
 * Configurações de tamanhos responsivos
 */
export const CLOUDINARY_SIZES = {
  THUMBNAIL: 150,
  SMALL: 300,
  MEDIUM: 600,
  LARGE: 1200,
  XLARGE: 1920,
} as const;

/**
 * Função para gerar URL otimizada do Cloudinary
 */
export const optimizeCloudinaryImage = (
  url: string,
  options: {
    width?: number;
    height?: number;
    quality?: number;
    format?: 'auto' | 'webp' | 'avif' | 'jpg' | 'png';
    crop?: 'limit' | 'fill' | 'scale' | 'fit';
  } = {}
) => {
  if (!url || !url.includes('res.cloudinary.com')) {
    return url;
  }

  const {
    width,
    height,
    quality = CLOUDINARY_QUALITY.HIGH,
    format = 'auto',
    crop = 'limit'
  } = options;

  const transformations = [];
  
  // Formato
  if (format) {
    transformations.push(`f_${format}`);
  }
  
  // Qualidade
  if (quality) {
    transformations.push(`q_${quality}`);
  }
  
  // Crop mode
  if (crop) {
    transformations.push(`c_${crop}`);
  }
  
  // Dimensões
  if (width) {
    transformations.push(`w_${width}`);
  }
  
  if (height) {
    transformations.push(`h_${height}`);
  }

  const transformString = transformations.join(',');
  return url.replace('/upload/', `/upload/${transformString}/`);
};

/**
 * Função para gerar URLs responsivas do Cloudinary
 */
export const generateResponsiveCloudinaryUrls = (
  url: string,
  sizes: number[] = [300, 600, 1200, 1920]
) => {
  if (!url || !url.includes('res.cloudinary.com')) {
    return { srcSet: '', sizes: '' };
  }

  const srcSet = sizes
    .map(size => {
      const optimizedUrl = optimizeCloudinaryImage(url, { 
        width: size, 
        quality: CLOUDINARY_QUALITY.HIGH 
      });
      return `${optimizedUrl} ${size}w`;
    })
    .join(', ');

  const sizesString = '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw';

  return { srcSet, sizes: sizesString };
};

/**
 * Hook para detectar se uma imagem é do Cloudinary
 */
export const isCloudinaryImage = (url: string): boolean => {
  return url?.includes('res.cloudinary.com') || url?.includes('cloudinary.com');
};

/**
 * Função para extrair o public_id de uma URL do Cloudinary
 */
export const extractCloudinaryPublicId = (url: string): string | null => {
  if (!isCloudinaryImage(url)) {
    return null;
  }

  try {
    // Regex para extrair o public_id da URL do Cloudinary
    const regex = /\/upload\/(?:v\d+\/)?(.+?)(?:\.[^.]+)?$/;
    const match = url.match(regex);
    return match ? match[1] : null;
  } catch (error) {
    console.error('Error extracting Cloudinary public_id:', error);
    return null;
  }
};

/**
 * Verificar se a imagem está disponível
 */
export const checkCloudinaryImageAvailability = async (url: string): Promise<boolean> => {
  if (!isCloudinaryImage(url)) {
    return false;
  }

  try {
    const response = await fetch(url, { method: 'HEAD' });
    return response.ok;
  } catch (error) {
    console.error('Error checking Cloudinary image availability:', error);
    return false;
  }
};

/**
 * Configuração de fallback para imagens quebradas
 */
export const CLOUDINARY_FALLBACK = '/assets/placeholder-product.svg';

/**
 * Imagem de placeholder inline para carregamento rápido
 */
export const CLOUDINARY_PLACEHOLDER_IMAGE = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjQwMCIgdmlld0JveD0iMCAwIDQwMCA0MDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI0MDAiIGhlaWdodD0iNDAwIiBmaWxsPSIjRjVGNUY1Ii8+CjxjaXJjbGUgY3g9IjIwMCIgY3k9IjE4MCIgcj0iNDAiIHN0cm9rZT0iI0NDQ0NDQyIgc3Ryb2tlLXdpZHRoPSIyIiBmaWxsPSJub25lIi8+CjxwYXRoIGQ9Ik0xNzAgMjAwTDIwMCAxNzBMMjMwIDIwMEwyMDAgMjMwTDE3MCAyMDBaIiBzdHJva2U9IiNDQ0NDQ0MiIHN0cm9rZS13aWR0aD0iMiIgZmlsbD0ibm9uZSIvPgo8dGV4dCB4PSIyMDAiIHk9IjI4MCIgZm9udC1mYW1pbHk9IkFyaWFsLCBzYW5zLXNlcmlmIiBmb250LXNpemU9IjE0IiBmaWxsPSIjOTk5OTk5IiB0ZXh0LWFuY2hvcj0ibWlkZGxlIj5QVUNBPC90ZXh0Pgo8L3N2Zz4K"; 