"use client";

import React, { useEffect, useState, useRef, useCallback } from "react";
import { motion } from "framer-motion";
import { PageLayout } from "@/layouts";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { productService, Product } from "@/lib/services/api/productService";

interface ProductItem {
  _id: string;
  imageUrl: string;
  hoverImageUrl: string;
  name: string;
  price: number;
  sizes: { size: string; stock: number }[];
}

export default function Shop() {
  const [items, setItems] = useState<ProductItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hoverIdx, setHoverIdx] = useState<number | null>(null);
  const router = useRouter();

  const controllerRef = useRef<AbortController | null>(null);

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

  // Buscar produtos
  const fetchProducts = useCallback(async () => {
    if (controllerRef.current) {
      controllerRef.current.abort();
    }

    const controller = new AbortController();
    controllerRef.current = controller;

    setLoading(true);
    setError(null);

    try {
      const response = await productService.getProducts(1, 20);
      
      if (!response.success) {
        throw new Error("Erro ao buscar produtos");
      }

      const mappedProducts = response.data.map(mapProduct);
      setItems(mappedProducts);
      
    } catch (err: any) {
      if (err.name !== "AbortError") {
        console.error("Erro ao buscar produtos:", err);
        setError("Erro ao carregar produtos");
      }
    } finally {
      if (!controller.signal.aborted) {
        setLoading(false);
      }
    }
  }, [mapProduct]);

  useEffect(() => {
    fetchProducts();
    
    return () => {
      if (controllerRef.current) {
        controllerRef.current.abort();
      }
    };
  }, [fetchProducts]);

  const handleProductClick = (productId: string) => {
    router.push(`/product/${productId}`);
  };

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

  const itemVariants = {
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
        
        {loading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 w-full mx-auto">
            {Array.from({ length: 9 }).map((_, idx) => (
              <div
                key={`skeleton-${idx}`}
                className="aspect-[3/4] bg-gradient-to-br from-gray-200 to-gray-300 animate-pulse shadow-sm"
              />
            ))}
          </div>
        )}

        {error && (
          <div className="flex flex-col items-center justify-center py-32">
            <div className="bg-white/80 backdrop-blur-sm p-8 shadow-lg border border-gray-200">
              <p className="text-red-500 text-lg mb-6 text-center">{error}</p>
              <button
                onClick={fetchProducts}
                className="px-8 py-3 bg-black text-white hover:bg-gray-800 transition-all duration-300"
              >
                Tentar Novamente
              </button>
            </div>
          </div>
        )}

        {!loading && !error && (
          <motion.div 
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 w-full mx-auto"
            variants={containerVariants}
            animate="visible"
          >
            {items.map((item, i) => (
              <motion.div
                key={item._id}
                className="group relative cursor-pointer transition-all duration-300 w-full"
                variants={itemVariants}
                onMouseEnter={() => setHoverIdx(i)}
                onMouseLeave={() => setHoverIdx(null)}
                onClick={() => handleProductClick(item._id)}
                whileHover={{ 
                  transition: { duration: 0.2 }
                }}
              >
               
                <div className="relative">
                  
         
                  <div className="relative w-full bg-white group aspect-[3/4] lg:aspect-auto lg:h-[calc(92vh)]">
                    
     
                    <Image
                      src={item.imageUrl}
                      alt={item.name}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      className={`
                        object-contain lg:object-cover transition-all duration-500
                        ${hoverIdx === i ? 'opacity-0' : 'opacity-100'}
                      `}
                      priority={i < 6}
                    />
                    
              
                    <Image
                      src={item.hoverImageUrl}
                      alt={`${item.name} - hover`}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      className={`
                        object-cover absolute inset-0 transition-all duration-500
                        ${hoverIdx === i ? 'opacity-100' : 'opacity-0'}
                      `}
                    />
                  </div>

            
                  <div className="absolute bottom-0 left-0 right-0 p-4 bg-transparent backdrop-blur-sm">
                    <h3 className="text-sm font-medium text-gray-900 uppercase tracking-tight line-clamp-1">
                      {item.name}
                    </h3>
                    <p className="text-xs text-gray-500 mt-0.5">
                      {item.sizes.map(s => s.size).join(' / ')}
                    </p>
                    <p className="text-sm font-semibold text-gray-900 mt-1">
                      R$ {item.price.toFixed(2)}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </main>
    </PageLayout>
  );
}
