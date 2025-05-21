"use client";

import React, { useEffect, useState } from "react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { useRouter } from "next/navigation";
import anime from "animejs/lib/anime.js";
import Image from "next/image";
import WavyLoader from "@/components/ui/WavyLoader";

interface ProductItem {
  _id: string;
  imageUrl: string;      // ex: /api/products/image/:id
  hoverImageUrl: string; // ex: /api/products/image/:id
  name: string;
  price: number;
}

const API_BASE_URL = "http://localhost:3000"; // Ajuste conforme sua API

export default function Shop() {
  const [items, setItems] = useState<ProductItem[]>([]);
  const [loadingProducts, setLoadingProducts] = useState(false);
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);
  const router = useRouter();

  // Busca produtos
  useEffect(() => {
    const fetchProducts = async () => {
      setLoadingProducts(true);
      try {
        const response = await fetch(`${API_BASE_URL}/api/products?page=1&limit=100`);
        if (!response.ok) {
          throw new Error(`Erro na resposta: ${response.status}`);
        }
        const data = await response.json();
        if (data.success) {
          const fetchedItems = data.data.map((product: any) => ({
            _id: product._id,
            imageUrl: `${API_BASE_URL}/api/products/image/${product.imageUrl}`,
            hoverImageUrl: `${API_BASE_URL}/api/products/image/${product.hoverImageUrl}`,
            name: product.name,
            price: product.price,
          }));
          setItems(fetchedItems);
        } else {
          console.error("Erro ao buscar produtos:", data.message);
        }
      } catch (error) {
        console.error("Erro ao buscar produtos:", error);
      } finally {
        setLoadingProducts(false);
      }
    };

    fetchProducts();
  }, []);

  // Animação de entrada com anime.js
  useEffect(() => {
    if (items.length === 0) return;
    const shopItems = document.querySelectorAll<HTMLElement>(".shop-item");
    anime({
      targets: shopItems,
      opacity: [0, 1],
      translateY: [100, 0],
      easing: "easeOutExpo",
      duration: 1200,
      delay: anime.stagger(200, { start: 0 }),
    });
  }, [items]);

  if (loadingProducts) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <WavyLoader />
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-600 text-lg">Não há produtos para exibir.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full flex flex-col">
      <Header isHome={false} />

      {/* Container principal da listagem */}
      <div className="flex-1 px-6 pt-10">
        {/* Grid de produtos: 1 col no mobile, 2 col no sm, 3 col no md */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
          {items.map((item, index) => (
            <div
              key={item._id}
              className="shop-item relative cursor-pointer overflow-hidden"
              style={{ opacity: 0 }} // inicia invisível p/ animação
              onMouseEnter={() => setHoverIndex(index)}
              onMouseLeave={() => setHoverIndex(null)}
              onClick={() => router.push(`/product/${item._id}`)}
              role="button"
              tabIndex={0}
              aria-label={`Visitar página do produto ${item.name}`}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  router.push(`/product/${item._id}`);
                }
              }}
            >
              {/* Contêiner para Image fill - define a altura ou aspect ratio */}
              {/* Exemplo: aspect-[4/5] => 4:5. Altere para aspect-square, h-96 etc. */}
              <div className="relative w-full aspect-[4/5]">
                {/* Imagem principal */}
                <Image
                  src={item.imageUrl}
                  alt={item.name}
                  fill
                  unoptimized
                  className="object-cover transition-opacity duration-1000 ease-in-out"
                  style={{ opacity: hoverIndex === index ? 0 : 1 }}
                />
                {/* Imagem hover */}
                <Image
                  src={item.hoverImageUrl}
                  alt={`${item.name} - Hover`}
                  fill
                  unoptimized
                  className="object-cover absolute top-0 left-0 transition-opacity duration-1000 ease-in-out"
                  style={{ opacity: hoverIndex === index ? 1 : 0 }}
                />
                {/* Overlay semitransparente */}
                <div
                  className="absolute top-0 left-0 w-full h-full bg-black transition-opacity duration-1000 ease-in-out"
                  style={{ opacity: hoverIndex === index ? 0 : 0.5 }}
                ></div>
              </div>

              {/* Texto (nome e preço) - canto inferior direito */}
              <div className="absolute bottom-2 right-2 text-white text-right z-10">
                <p className="font-bold">{item.name}</p>
                <p>R$ {item.price.toFixed(2)}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <Footer isHome={false} />
    </div>
  );
}
