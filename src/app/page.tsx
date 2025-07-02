"use client";

import React from "react";
import dynamic from "next/dynamic";
import Home from "@/components/features/home/Home";

// Loading elegante e profissional
const ElegantLoader = () => (
  <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 flex items-center justify-center relative overflow-hidden">
    {/* Background Pattern */}
    <div className="absolute inset-0 opacity-[0.02]">
      <div className="absolute inset-0" style={{
        backgroundImage: `
          linear-gradient(rgba(0,0,0,0.1) 1px, transparent 1px),
          linear-gradient(90deg, rgba(0,0,0,0.1) 1px, transparent 1px)
        `,
        backgroundSize: '40px 40px'
      }} />
    </div>

    {/* Central Loading Container */}
    <div className="relative z-10 flex flex-col items-center">
      {/* Logo animado */}
      <div className="mb-8 animate-pulse">
        <img
          src="/assets/logo_mini.png"
          alt="PUCA"
          className="w-32 h-auto transform rotate-[-10deg] transition-transform duration-1000 hover:rotate-0"
        />
      </div>

      {/* Spinner elegante */}
      <div className="relative">
        {/* Anel externo */}
        <div className="w-16 h-16 border-4 border-gray-200 rounded-full animate-spin border-t-black"></div>
        
        {/* Anel interno */}
        <div className="absolute top-2 left-2 w-12 h-12 border-4 border-gray-100 rounded-full animate-spin border-t-gray-600" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }}></div>
        
        {/* Ponto central */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-2 h-2 bg-black rounded-full animate-pulse"></div>
      </div>

      {/* Texto elegante */}
      <div className="mt-8 text-center">
        <div className="flex items-center space-x-1">
          {['P', 'U', 'C', 'A'].map((letter, index) => (
            <span
              key={letter}
              className="text-2xl font-bold text-gray-800 animate-pulse"
              style={{ 
                animationDelay: `${index * 0.2}s`,
                animationDuration: '1.5s'
              }}
            >
              {letter}
            </span>
          ))}
        </div>
        <p className="text-gray-600 mt-2 animate-fade-in">Streetwear Experience</p>
      </div>

      {/* Barra de progresso animada */}
      <div className="mt-8 w-64 h-1 bg-gray-200 rounded-full overflow-hidden">
        <div className="h-full bg-gradient-to-r from-gray-600 to-black rounded-full animate-slide-progress"></div>
      </div>
    </div>

    <style jsx>{`
      @keyframes slide-progress {
        0% { transform: translateX(-100%); }
        50% { transform: translateX(0%); }
        100% { transform: translateX(100%); }
      }
      
      @keyframes fade-in {
        0% { opacity: 0; transform: translateY(10px); }
        100% { opacity: 1; transform: translateY(0); }
      }
      
      .animate-slide-progress {
        animation: slide-progress 2s ease-in-out infinite;
      }
      
      .animate-fade-in {
        animation: fade-in 1s ease-out 0.5s both;
      }
    `}</style>
  </div>
);

// Componente que vai ser carregado dinamicamente 
const DynamicHomeContent = dynamic(
  () => import('@/components/features/home/HomeContent'),
  { 
    ssr: false,
    loading: ElegantLoader
  }
);

export default function HomePage() {
  return <DynamicHomeContent />;
} 