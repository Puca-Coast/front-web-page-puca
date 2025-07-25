"use client";

import React, { useEffect, useState } from "react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function Collections() {
  const [isVisible, setIsVisible] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // Simular animação de entrada com CSS
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 100);
    
    return () => clearTimeout(timer);
  }, []);

  const handleBackClick = () => {
    router.back();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
      <Header isHome={false} />
      
      <main className="flex-1 px-4 py-8 pt-32">
        <div className="max-w-4xl mx-auto">
          {/* Botão Voltar */}
          <button
            onClick={handleBackClick}
            className="mb-8 flex items-center text-gray-600 hover:text-gray-800 transition-colors"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Voltar
          </button>

          {/* Título */}
          <div className={`text-center mb-12 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Nossas Coleções
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Descubra as últimas tendências em streetwear e moda urbana
            </p>
          </div>

          {/* Grid de Coleções */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Coleção Primavera 2024 */}
            <div className={`bg-white rounded-lg shadow-lg overflow-hidden transition-all duration-1000 delay-200 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
              <div className="relative h-64">
                <Image
                  src="/assets/collections/primavera-2024.jpg"
                  alt="Coleção Primavera 2024"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  Primavera 2024
                </h3>
                <p className="text-gray-600 mb-4">
                  Cores vibrantes e designs ousados para a estação mais colorida do ano.
                </p>
                <button
                  onClick={() => router.push('/lookbook?launch=primavera2024')}
                  className="w-full bg-black text-white py-2 px-4 rounded hover:bg-gray-800 transition-colors"
                >
                  Ver Coleção
                </button>
              </div>
            </div>

            {/* Coleção Inverno 2024 */}
            <div className={`bg-white rounded-lg shadow-lg overflow-hidden transition-all duration-1000 delay-400 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
              <div className="relative h-64">
                <Image
                  src="/assets/collections/inverno-2024.jpg"
                  alt="Coleção Inverno 2024"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  Inverno 2024
                </h3>
                <p className="text-gray-600 mb-4">
                  Estilo urbano com conforto para enfrentar o frio com elegância.
                </p>
                <button
                  onClick={() => router.push('/lookbook?launch=inverno2024')}
                  className="w-full bg-black text-white py-2 px-4 rounded hover:bg-gray-800 transition-colors"
                >
                  Ver Coleção
                </button>
              </div>
            </div>

            {/* Coleção Limitada */}
            <div className={`bg-white rounded-lg shadow-lg overflow-hidden transition-all duration-1000 delay-600 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
              <div className="relative h-64">
                <Image
                  src="/assets/collections/limitada.jpg"
                  alt="Coleção Limitada"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  Coleção Limitada
                </h3>
                <p className="text-gray-600 mb-4">
                  Peças exclusivas e edições especiais para quem busca o diferencial.
                </p>
                <button
                  onClick={() => router.push('/shop')}
                  className="w-full bg-black text-white py-2 px-4 rounded hover:bg-gray-800 transition-colors"
                >
                  Ver Produtos
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer isHome={false} />
    </div>
  );
}
