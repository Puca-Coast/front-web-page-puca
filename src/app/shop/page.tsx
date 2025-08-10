"use client";

import React, { useCallback, useMemo } from "react";
import { motion, Variants } from "framer-motion";
import { PageLayout } from "@/layouts";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { productService, Product } from "@/lib/services/api/productService";
import { useInfiniteProducts } from "@/lib/hooks/useProducts";
import { useSmartPrefetch, useIntersectionPrefetch } from "@/lib/hooks/usePrefetch";
import { ProductGridSkeleton, ErrorBoundary, ErrorState, LoadingIndicator, EmptyState } from "@/components/ui";
import { usePageAnnouncement, useLoadingAnnouncement, useErrorAnnouncement } from "@/lib/providers/AccessibilityProvider";
import ProductCard from "@/components/features/products/ProductCard";

interface ProductItem {
  _id: string;
  imageUrl: string;
  hoverImageUrl: string;
  name: string;
  price: number;
  sizes: { size: string; stock: number }[];
}

function ShopContent() {
  const router = useRouter();
  const { 
    data, 
    fetchNextPage, 
    hasNextPage, 
    isFetchingNextPage, 
    isLoading, 
    isError, 
    error 
  } = useInfiniteProducts(20);
  
  const { preloadProductImages, trackInteraction, prefetchProduct } = useSmartPrefetch();

  // State declarations moved up to avoid reference errors
  const [hoverIdx, setHoverIdx] = React.useState<number | null>(null);

  // Função para mapear produtos da API
  const mapProduct = useCallback((product: Product): ProductItem => {
    const mainId = (product as any).imageUrl;
    const hoverId = (product as any).hoverImageUrl;

    const mainUrl = mainId
      ? productService.getProductImageUrl(mainId)
      : (product as any).image?.url || '/assets/placeholder-product.svg';

    const hoverUrl = hoverId
      ? productService.getProductImageUrl(hoverId)
      : (product as any).hoverImage?.url || mainUrl;

    return {
      _id: product._id,
      imageUrl: mainUrl,
      hoverImageUrl: hoverUrl,
      name: product.name,
      price: product.price,
      sizes: product.stockBySize
    };
  }, []);

  // Flatten all products from all pages and memoize the result
  const allProducts = useMemo(() => {
    if (!data?.pages) return [];
    
    return data.pages.flatMap(page => 
      page.success ? page.data.map(mapProduct) : []
    );
  }, [data?.pages, mapProduct]);

  // Accessibility announcements
  usePageAnnouncement('Loja PUCA', 'Explore nossa coleção de produtos streetwear');
  useLoadingAnnouncement(isLoading, 'Carregando produtos...', `${allProducts.length} produtos carregados`);
  useErrorAnnouncement(error?.message || null);

  // Pre-compute product ID to index mapping for O(1) hover lookups
  const productIndexMap = useMemo(() => {
    const map = new Map<string, number>();
    allProducts.forEach((product, index) => {
      map.set(product._id, index);
    });
    return map;
  }, [allProducts]);

  // Preload images when products change
  React.useEffect(() => {
    if (allProducts.length > 0) {
      preloadProductImages(allProducts);
    }
  }, [allProducts, preloadProductImages]);

  // Intersection observer for infinite scrolling
  const loadMoreRef = useIntersectionPrefetch(
    useCallback(() => {
      if (hasNextPage && !isFetchingNextPage) {
        fetchNextPage();
      }
    }, [hasNextPage, isFetchingNextPage, fetchNextPage])
  );

  const handleProductClick = (productId: string) => {
    trackInteraction('click', 'product-card', { productId });
    router.push(`/product/${productId}`);
  };

  const handleProductHover = useCallback((productId: string) => {
    trackInteraction('hover', 'product-card', { productId });
    // Prefetch product details when user hovers
    prefetchProduct(productId);
    // Use O(1) lookup instead of O(n) findIndex
    const index = productIndexMap.get(productId);
    setHoverIdx(index !== undefined ? index : null);
  }, [trackInteraction, prefetchProduct, productIndexMap]);

  const handleProductLeave = useCallback(() => {
    setHoverIdx(null);
  }, []);

  // Variantes de animação para Framer Motion
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.12,
        delayChildren: 0.1
      }
    }
  };

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

  return (
    <PageLayout background="gradient" noPaddingTop={true}>
      <main className="flex-1 w-full z-10">
        
        {/* Loading State */}
        {isLoading && <ProductGridSkeleton count={9} />}

        {/* Error State */}
        {isError && (
          <ErrorState
            message={error?.message || 'Erro ao carregar produtos'}
            onRetry={() => window.location.reload()}
          />
        )}

        {/* Products Grid */}
        {!isLoading && !isError && allProducts.length > 0 && (
          <motion.div 
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 w-full mx-auto"
            variants={containerVariants}
            animate="visible"
          >
            {allProducts.map((product, i) => (
              <ProductCard
                key={product._id}
                product={product}
                index={i}
                isHovered={hoverIdx === i}
                onHover={handleProductHover}
                onLeave={handleProductLeave}
                onClick={handleProductClick}
              />
            ))}
          </motion.div>
        )}

        {/* Load More Trigger & Loading State */}
        {hasNextPage && (
          <div ref={loadMoreRef} className="h-20 flex items-center justify-center">
            {isFetchingNextPage && (
              <LoadingIndicator text="Carregando mais produtos..." />
            )}
          </div>
        )}

        {/* Empty State */}
        {!isLoading && !isError && allProducts.length === 0 && (
          <EmptyState
            title="Nenhum produto encontrado"
            description="Não encontramos produtos no momento. Tente novamente mais tarde."
            action={{
              text: "Recarregar Página",
              onClick: () => window.location.reload()
            }}
          />
        )}
      </main>
    </PageLayout>
  );
}

export default function Shop() {
  return (
    <ErrorBoundary level="page">
      <ShopContent />
    </ErrorBoundary>
  );
}
