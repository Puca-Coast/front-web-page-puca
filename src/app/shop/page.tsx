"use client";

import React, { useEffect, useState, useRef, useCallback } from "react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { useRouter } from "next/navigation";
import anime from "animejs/lib/anime.js";
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
  const mapProduct = useCallback((product: Product): ProductItem => ({
    _id: product._id,
    imageUrl: productService.getProductImageUrl((product as any).imageUrl),
    hoverImageUrl: productService.getProductImageUrl((product as any).hoverImageUrl),
    name: product.name,
    price: product.price,
    sizes: product.stockBySize
  }), []);

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

  // Animação entrada sofisticada
  useEffect(() => {
    if (items.length === 0) return;
    
    const elements = document.querySelectorAll(".shop-item");
    if (elements.length === 0) return;
    
    anime({
      targets: elements,
      opacity: [0, 1],
      translateY: [60, 0],
      scale: [0.8, 1],
      easing: "easeOutCubic",
      duration: 1000,
      delay: anime.stagger(120),
    });
  }, [items]);

  const handleProductClick = (productId: string) => {
    router.push(`/product/${productId}`);
  };

  return (
    <>
    <div className="bg-gradient-to-br from-gray-50 via-white to-gray-100">
      {/* Grid Pattern Background Elegante */}
      <div className="absolute inset-0 opacity-[0.02]">
        <div className="absolute inset-0" style={{
          backgroundImage: `
            linear-gradient(rgba(0,0,0,0.3) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0,0,0,0.3) 1px, transparent 1px)
          `,
          backgroundSize: '40px 40px'
        }} />
      </div>

      <Header isHome={false} />

      {/* CORRIGIDO: Scroll permitido */}
      <main className="puca-page-content pb-16 relative z-10">
        
        {loading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto px-6">
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
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto px-6">
            {items.map((item, i) => (
              <div
                key={item._id}
                className="group relative cursor-pointer transition-all duration-300"
                onMouseEnter={() => setHoverIdx(i)}
                onMouseLeave={() => setHoverIdx(null)}
                onClick={() => handleProductClick(item._id)}
              >
                {/* Card Container minimalista */}
                <div className="relative overflow-hidden">
                  
                  {/* Imagem do produto - design clean */}
                  <div className="relative w-full aspect-[3/4] overflow-hidden bg-white group" >
                    
                    {/* Imagem principal */}
                    <Image
                      src={item.imageUrl}
                      alt={item.name}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      className={`
                        object-contain transition-all duration-500
                        ${hoverIdx === i ? 'opacity-0' : 'opacity-100'}
                      `}
                      priority={i < 6}
                    />
                    
                    {/* Imagem hover */}
                    <Image
                      src={item.hoverImageUrl}
                      alt={`${item.name} - hover`}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      className={`
                        object-contain absolute top-0 left-0 transition-all duration-500
                        ${hoverIdx === i ? 'opacity-100' : 'opacity-0'}
                      `}
                    />

                    {/* Overlay escuro no hover - simples e elegante */}
                    <div className={`
                      absolute inset-0 bg-black/100 transition-opacity duration-500
                      ${hoverIdx === i ? 'opacity-0' : 'opacity-0'}
                    `} />

                    {/* Informações do produto - overlay minimalista */}
                    <div className="absolute bottom-0 left-0 right-0 bg-black/5 backdrop-blur-sm p-4">
                      <h3 className="font-medium text-white text-sm mb-1 truncate">
                      {item.name}
                    </h3>
                    
                      <p className="text-lg font-semibold text-white">
                      R$ {item.price.toFixed(2)}
                    </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
      <Footer isHome={false} />
    </div>
     </>
  );
}
