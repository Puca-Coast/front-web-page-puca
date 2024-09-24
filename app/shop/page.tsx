// src/app/shop/page.tsx

"use client";

import React, { useEffect, useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useRouter } from "next/navigation";
import anime from "animejs";
import Image from "next/image";

interface Item {
  imageUrl: string;
  hoverImageUrl: string;
  name: string;
  price: string;
}

export default function Shop() {
  const [items, setItems] = useState<Item[]>([]);
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);
  const router = useRouter();

  // Simulação de chamada de API para buscar itens
  useEffect(() => {
    // Simula uma chamada de API com atraso de 1 segundo
    const fetchItems = async () => {
      const fetchedItems: Item[] = [
        {
          imageUrl: "/assets/photo1.jpg",
          hoverImageUrl: "/assets/photo2.jpg",
          name: "Modelo 1",
          price: "R$99,99",
        },
        {
          imageUrl: "/assets/photo3.jpg",
          hoverImageUrl: "/assets/photo4.jpg",
          name: "Modelo 2",
          price: "R$149,99",
        },
        {
          imageUrl: "/assets/photo2.jpg",
          hoverImageUrl: "/assets/photo1.jpg",
          name: "Modelo 3",
          price: "R$199,99",
        },
        {
          imageUrl: "/assets/photo4.jpg",
          hoverImageUrl: "/assets/photo3.jpg",
          name: "Modelo 4",
          price: "R$249,99",
        },
        {
          imageUrl: "/assets/photo1.jpg",
          hoverImageUrl: "/assets/photo2.jpg",
          name: "Modelo 5",
          price: "R$299,99",
        },
        {
          imageUrl: "/assets/photo3.jpg", // Corrigido para evitar repetição
          hoverImageUrl: "/assets/photo4.jpg",
          name: "Modelo 6",
          price: "R$349,99",
        },
      ];
      // Simula atraso
      await new Promise((resolve) => setTimeout(resolve, 300));
      setItems(fetchedItems);
    };

    fetchItems();
  }, []);

  // Aplicação das animações com anime.js após os itens serem carregados
  useEffect(() => {
    if (items.length === 0) return; // Não anima se não houver itens

    // Seleciona todos os elementos com a classe 'shop-item'
    const shopItems = document.querySelectorAll<HTMLElement>(".shop-item");

    anime({
      targets: shopItems,
      opacity: [0, 1],
      translateY: [100, 0],
      easing: "easeOutExpo",
      duration: 1200,
      delay: anime.stagger(200, { start: 0 }), // Atraso progressivo de 200ms, iniciando após 500ms
    });
  }, [items]);

  return (
    <>
      <div className="h-full w-full flex flex-col">
      <Header isHome={false} />
        <div className="h-full flex flex-wrap overflow-scroll pt-10 image-section">
          {items.map((item, index) => (
            <div
              key={index}
              onMouseEnter={() => setHoverIndex(index)}
              onMouseLeave={() => setHoverIndex(null)}
              className={`shop-item h-4/6 border border-gray-100 ${
                index % 3 === 1 ? "mx-auto" : ""
              } mb-12 relative cursor-pointer drop-shadow-sm`}
              style={{ width: "30%" }}
              onClick={() => router.push("/product")}
              role="button"
              tabIndex={0}
              aria-label={`Visitar página do produto ${item.name}`}
              onKeyPress={(e) => {
                if (e.key === "Enter") router.push("/product");
              }}
            >
              {/* Imagem de fundo padrão */}
              <Image
                src={item.imageUrl}
                alt={item.name}
                layout="fill"
                objectFit="cover"
                className="rounded-md transition-opacity duration-1000 ease-in-out"
                style={{
                  opacity: hoverIndex === index ? 0 : 1,
                }}
                loading="lazy"
              />
              {/* Imagem de hover */}
              <Image
                src={item.hoverImageUrl}
                alt={`${item.name} - Hover`}
                layout="fill"
                objectFit="cover"
                className="rounded-md transition-opacity duration-1000 ease-in-out"
                style={{
                  opacity: hoverIndex === index ? 1 : 0,
                }}
                loading="lazy"
              />
              {/* Película escura */}
              <div
                style={{
                  position: "absolute",
                  width: "100%",
                  height: "100%",
                  backgroundColor: "black",
                  transition: "opacity 1s ease-in-out",
                  opacity: hoverIndex === index ? 0 : 0.5,
                }}
                className="pelicula-escura"
              ></div>
              {/* Texto do nome e preço */}
              <div className="absolute bottom-0 left-0 pr-10 pb-6 text-white w-full text-right">
                <p className="font-bold">{item.name}</p>
                <p>{item.price}</p>
              </div>
            </div>
          ))}
        </div>
        <Footer isHome={false} />
      </div>

      {/* <div className="preloader fixed inset-0 flex items-center justify-center bg-white z-50">
        <div className="loader">Loading...</div>
      </div> 
      {/* ToastContainer para notificações, caso necessário */}
      {/* <ToastContainer position="top-right" autoClose={3000} hideProgressBar /> */}
    </>
  );
}
