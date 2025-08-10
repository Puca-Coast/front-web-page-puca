/**
 * Memoized Product Card Component
 * 
 * Optimized product card that prevents unnecessary re-renders
 * and implements intelligent hover states with prefetching.
 */

"use client";

import React, { memo, useCallback } from "react";
import { motion, Variants } from "framer-motion";
import Image from "next/image";

interface ProductCardProps {
  product: {
    _id: string;
    imageUrl: string;
    hoverImageUrl: string;
    name: string;
    price: number;
    sizes: { size: string; stock: number }[];
  };
  index: number;
  isHovered: boolean;
  onHover: (productId: string) => void;
  onLeave: () => void;
  onClick: (productId: string) => void;
}

const itemVariants: Variants = {
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
      duration: 0.6,
      ease: [0.25, 0.46, 0.45, 0.94]
    }
  }
};

const ProductCard: React.FC<ProductCardProps> = memo(({
  product,
  index,
  isHovered,
  onHover,
  onLeave,
  onClick
}) => {
  const handleMouseEnter = useCallback(() => {
    onHover(product._id);
  }, [onHover, product._id]);

  const handleClick = useCallback(() => {
    onClick(product._id);
  }, [onClick, product._id]);

  const handleKeyDown = useCallback((event: React.KeyboardEvent) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      onClick(product._id);
    }
  }, [onClick, product._id]);

  return (
    <motion.div
      className="group relative cursor-pointer transition-all duration-300 w-full focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2 rounded-lg"
      variants={itemVariants}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={onLeave}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      tabIndex={0}
      role="button"
      aria-label={`Ver produto ${product.name} - R$ ${product.price.toFixed(2)}`}
      whileHover={{ 
        transition: { duration: 0.2 }
      }}
    >
      <div className="relative">
        <div className="relative w-full bg-white group aspect-[3/4] lg:aspect-auto lg:h-[calc(92vh)]">
          {/* Main Image */}
          <Image
            src={product.imageUrl}
            alt={`${product.name} - Produto PUCA por R$ ${product.price.toFixed(2)}`}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className={`
              object-contain lg:object-cover transition-all duration-500
              ${isHovered ? 'opacity-0' : 'opacity-100'}
            `}
            priority={index < 6}
          />
          
          {/* Hover Image */}
          <Image
            src={product.hoverImageUrl}
            alt={`${product.name} - Vista alternativa do produto`}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className={`
              object-cover absolute inset-0 transition-all duration-500
              ${isHovered ? 'opacity-100' : 'opacity-0'}
            `}
          />
        </div>

        {/* Product Info */}
        <div className="absolute bottom-0 left-0 right-0 p-4 bg-transparent backdrop-blur-sm">
          <h3 className="text-sm font-medium text-gray-900 uppercase tracking-tight line-clamp-1">
            {product.name}
          </h3>
          <p className="text-xs text-gray-500 mt-0.5">
            {product.sizes.map(s => s.size).join(' / ')}
          </p>
          <p className="text-sm font-semibold text-gray-900 mt-1">
            R$ {product.price.toFixed(2)}
          </p>
        </div>
      </div>
    </motion.div>
  );
});

ProductCard.displayName = 'ProductCard';

export default ProductCard;