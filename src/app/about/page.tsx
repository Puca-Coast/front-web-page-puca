"use client";
import React, { useEffect } from "react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Image from "next/image";
import anime from "animejs/lib/anime.js";

export default function About() {

  useEffect(() => {
    // Animação de entrada suave
    anime.timeline()
      .add({
        targets: '.image-section',
        opacity: [0, 1],
        translateY: [100, 0],
        easing: 'easeOutExpo',
        duration: 1200,
      })
      .add({
        targets: '.text-section h1',
        opacity: [0, 1],
        translateY: [50, 0],
        easing: 'easeOutExpo',
        duration: 800,
      }, '-=800')
      .add({
        targets: '.text-section p',
        opacity: [0, 1],
        translateY: [50, 0],
        easing: 'easeOutExpo',
        duration: 800,
      }, '-=600')
      .add({
        targets: '.social-icons a',
        opacity: [0, 1],
        translateY: [20, 0],
        easing: 'easeOutExpo',
        duration: 500,
        delay: anime.stagger(100),
      }, '-=400');

    // Animação do preloader
    anime({
      targets: '.preloader',
      opacity: [1, 0],
      duration: 1500,
      easing: 'easeInOutQuad',
      complete: function(anim) {
        document.querySelector('.preloader').style.display = 'none';
      }
    });

  }, []);

  return (
    <>
      <div className="min-h-screen flex flex-col bg-gray-100">
        <Header isHome={false}></Header>
        <div className="preloader fixed inset-0 bg-white flex items-center justify-center z-50">
        </div>
        <div className="flex flex-col lg:flex-row items-center justify-center flex-1 py-20 px-8 lg:px-40">
          {/* Seção da Imagem */}
          <div className="image-section lg:w-1/2 w-full flex justify-center lg:justify-end mb-10 lg:mb-0">
            <Image 
              src="/assets/photo4.jpg" 
              alt="Sobre nós" 
              width={400} 
              height={600} 
              className="object-cover rounded-md"
            />
          </div>

          {/* Seção de Texto */}
          <div className="text-section lg:w-1/2 w-full lg:pl-16 text-center lg:text-left">
            <h1 className="text-6xl font-bold tracking-widest mb-6">ABOUT US</h1>
            <p className="text-lg leading-relaxed text-gray-600 mb-6">
              A Puca Coast surge da vontade de representar o litoral baiano no contexto do streetwear, 
              buscando inspiração em vários momentos do cotidiano que se refletem desde à logo, às estampas e ensaios, 
              até a forma de se comunicar com os clientes. O contato com a natureza, vida na praia e a prática de esportes nos movem.
            </p>
            {/* Ícones de Redes Sociais */}
            <div className="social-icons flex justify-center lg:justify-start space-x-4">
              <a href="#"><img src="/assets/twitter.png" alt="Twitter" className="w-6 h-6" /></a>
              <a href="#"><img src="/assets/instagram.png" alt="Instagram" className="w-6 h-6" /></a>
            </div>
          </div>
        </div>
        <Footer isHome={false}></Footer>
      </div>

      <style jsx>{`
        /* Estilo inicial para garantir que os elementos comecem invisíveis */
        .image-section, .text-section h1, .text-section p, .social-icons a {
          opacity: 0;
          transform: translateY(100px);
        }

        /* Parallax na seção da imagem */
        .image-section {
          background-attachment: fixed;
        }

        /* Hover suave nos ícones de redes sociais */
        .social-icons a:hover {
          transform: scale(1.2);
          transition: transform 0.3s ease, color 0.3s ease;
        }

        .social-icons a:hover img {
          filter: brightness(1.2);
        }

        /* Scroll suave */
        html {
          scroll-behavior: smooth;
        }
        
        /* Preloader */
        .preloader {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #fff;
          z-index: 9999;
        }
      `}</style>
    </>
  );
}
