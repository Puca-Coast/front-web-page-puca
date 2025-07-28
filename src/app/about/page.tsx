"use client";

import React, { useEffect, useState } from "react";
import { PageLayout } from "@/layouts";
import Image from "next/image";

export default function About() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Simular animação de entrada com CSS
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 100);
    
    return () => clearTimeout(timer);
  }, []);

  return (
    <PageLayout background="gradient">
      <main className="flex-1 px-4 py-8 pt-8">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col lg:flex-row items-center justify-center gap-12">
            {/* Seção da Imagem */}
            <div className={`lg:w-1/2 w-full flex justify-center lg:justify-end transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
              <Image 
                src="/assets/photo4.jpg" 
                alt="Sobre nós" 
                width={400} 
                height={600} 
                className="object-cover rounded-md shadow-lg"
              />
            </div>

            {/* Seção de Texto */}
            <div className={`lg:w-1/2 w-full lg:pl-16 text-center lg:text-left transition-all duration-1000 delay-200 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
              <h1 className="text-6xl font-bold tracking-widest mb-6">About</h1>
              <p className="text-lg text-gray-600 mb-8">
                A PUCA Coast nasceu da paixão por streetwear e moda urbana. 
                Nossa missão é criar peças únicas que combinam estilo, conforto e atitude.
              </p>
              
              {/* Ícones de Redes Sociais */}
              <div className="flex justify-center lg:justify-start space-x-4">
                <a href="#" className="hover:scale-110 transition-transform duration-300">
                  <img src="/assets/twitter.png" alt="Twitter" className="w-6 h-6" />
                </a>
                <a href="#" className="hover:scale-110 transition-transform duration-300">
                  <img src="/assets/instagram.png" alt="Instagram" className="w-6 h-6" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </main>
    </PageLayout>
  );
}
