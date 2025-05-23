"use client";

import React, { useEffect, useState, useRef } from "react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { useRouter } from "next/navigation";
import anime from "animejs/lib/anime.js";
import Image from "next/image";
import WavyLoader from "@/components/ui/WavyLoader";
import { API_BASE_URL } from "@/config/environment";

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

  /* ---------- refs ---------- */
  const fetchedRef = useRef(false); // sucesso definitivo no ciclo atual
  const inFlightRef = useRef(false); // request em andamento
  const abortRef = useRef<AbortController | null>(null);

  /* ---------------- BUSCA ---------------- */
  useEffect(() => {
    // reset flags sempre que o componente MONTAR novamente
    fetchedRef.current = false;

    const controller = new AbortController();
    abortRef.current = controller;

    const fetchProducts = async () => {
      if (fetchedRef.current || inFlightRef.current) return;
      inFlightRef.current = true;
      setLoading(true);
      setError(null);

      try {
        const res = await fetch(`${API_BASE_URL}/api/products`, {
          signal: controller.signal,
        });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        if (!data.success) throw new Error(data.message ?? "Erro desconhecido");

        const mapped: ProductItem[] = data.data.map((p: any) => ({
          _id: p._id,
          imageUrl: p.image.url,
          hoverImageUrl: p.hoverImage.url,
          name: p.name,
          price: p.price,
          sizes: p.stockBySize,
        }));

        setItems(mapped);
        fetchedRef.current = true;
      } catch (err: any) {
        if (err.name !== "AbortError") {
          console.error("Erro ao buscar produtos:", err);
          setError(err.message ?? "Erro desconhecido");
        }
      } finally {
        setLoading(false);
        inFlightRef.current = false;
      }
    };

    fetchProducts();

    return () => {
      // cleanup → abortar requisição e resetar flags para próximo mount
      controller.abort();
      inFlightRef.current = false;
      fetchedRef.current = false;
    };
  }, []);

  /* -------------- ANIMAÇÃO -------------- */
  useEffect(() => {
    if (items.length === 0) return;
    const els = document.querySelectorAll<HTMLElement>(".shop-item");
    anime({
      targets: els,
      opacity: [0, 1],
      translateY: [100, 0],
      easing: "easeOutExpo",
      duration: 1200,
      delay: anime.stagger(200),
    });
  }, [items]);

  /* ---------------- UI ---------------- */
  if (loading && items.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <WavyLoader />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-red-500 text-lg">{error}</p>
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
    <div className="min-h-screen flex flex-col">
      <Header isHome={false} />

      <main className="flex-1 pt-20 pb-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 max-w-7xl mx-auto px-4">
          {items.map((item, i) => (
            <div
              key={item._id}
              className="shop-item relative cursor-pointer overflow-hidden"
              style={{
                opacity: 0,
                boxShadow: "rgba(0,0,0,0.05) 0px 1px 2px 0px",
                borderRadius: 4,
              }}
              onMouseEnter={() => setHoverIdx(i)}
              onMouseLeave={() => setHoverIdx(null)}
              onClick={() => router.push(`/product/${item._id}`)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) =>
                e.key === "Enter" && router.push(`/product/${item._id}`)
              }
              aria-label={`Visitar página do produto ${item.name}`}
            >
              <div className="relative w-full aspect-[4/5]">
                <Image
                  src={item.imageUrl}
                  alt={item.name}
                  fill
                  unoptimized
                  className="object-contain transition-opacity duration-1000 ease-in-out"
                  style={{ opacity: hoverIdx === i ? 0 : 1 }}
                />
                <Image
                  src={item.hoverImageUrl}
                  alt={`${item.name} - Hover`}
                  fill
                  unoptimized
                  className="object-cover absolute top-0 left-0 transition-opacity duration-1000 ease-in-out"
                  style={{ opacity: hoverIdx === i ? 1 : 0 }}
                />
              </div>

              <div
                className={`absolute bottom-2 right-2 text-right z-10 ${
                  hoverIdx === i ? "text-white" : "text-black"
                }`}
              >
                <p className="font-bold leading-5">{item.name}</p>
                <p>R$ {item.price.toFixed(2)}</p>
                <p className="text-xs mt-1">
                  {item.sizes.map((s) => s.size).join(", ")}
                </p>
              </div>
            </div>
          ))}
        </div>
      </main>

      <Footer isHome={false} />
    </div>
  );
}
