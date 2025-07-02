"use client";
import React, { useEffect } from "react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import anime from "animejs/lib/anime.js";

export default function ContactPage() {
  useEffect(() => {
    // Animation for page elements
    anime.timeline()
      .add({
        targets: '.hero-section',
        opacity: [0, 1],
        translateY: [50, 0],
        easing: 'easeOutExpo',
        duration: 1200,
      })
      .add({
        targets: '.contact-form',
        opacity: [0, 1],
        translateY: [50, 0],
        easing: 'easeOutExpo',
        duration: 800,
      }, '-=800')
      .add({
        targets: '.contact-info',
        opacity: [0, 1],
        translateY: [50, 0],
        easing: 'easeOutExpo',
        duration: 800,
      }, '-=600');
  }, []);

  const handleSubmit = (e: any) => {
    e.preventDefault();
    // Form submission logic would go here
    alert('Mensagem enviada! Entraremos em contato em breve.');
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header isHome={false} />
      
      <main className="puca-page-content pb-16">
        <div className="max-w-7xl mx-auto px-4">
          {/* Hero Section */}
          <div className="hero-section mb-12 text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 tracking-tight">Fale Conosco</h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Estamos aqui para ajudar. Envie-nos uma mensagem e retornaremos o mais breve possível.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {/* Contact Form */}
            <div className="contact-form bg-white p-8 rounded-lg shadow-sm">
              <h2 className="text-2xl font-semibold mb-6">Envie uma Mensagem</h2>
              <form onSubmit={handleSubmit}>
                <div className="mb-4">
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                    Nome
                  </label>
                  <input
                    type="text"
                    id="name"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                    required
                  />
                </div>
                
                <div className="mb-4">
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                    E-mail
                  </label>
                  <input
                    type="email"
                    id="email"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                    required
                  />
                </div>
                
                <div className="mb-4">
                  <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">
                    Assunto
                  </label>
                  <input
                    type="text"
                    id="subject"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>
                
                <div className="mb-6">
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                    Mensagem
                  </label>
                  <textarea
                    id="message"
                    rows={5}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                    required
                  ></textarea>
                </div>
                
                <button
                  type="submit"
                  className="w-full bg-teal-600 text-white py-2 px-4 rounded-md hover:bg-teal-700 transition duration-300"
                >
                  Enviar Mensagem
                </button>
              </form>
            </div>

            {/* Contact Info */}
            <div className="contact-info">
              <div className="bg-white p-8 rounded-lg shadow-sm mb-6">
                <h2 className="text-2xl font-semibold mb-6">Informações de Contato</h2>
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-medium mb-1">Endereço</h3>
                    <p className="text-gray-600">Av. Tancredo Neves, 620<br />Salvador - BA, 41820-020</p>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-medium mb-1">E-mail</h3>
                    <a href="mailto:contato@pucacoast.com" className="text-teal-600 hover:underline">
                      contato@pucacoast.com
                    </a>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-medium mb-1">Telefone</h3>
                    <p className="text-gray-600">(71) 99999-9999</p>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-medium mb-1">Horário de Atendimento</h3>
                    <p className="text-gray-600">Segunda a Sexta: 09:00 - 18:00<br />Sábado: 10:00 - 14:00</p>
                  </div>
                </div>
              </div>
              
              {/* Social Media Section */}
              <div className="bg-white p-8 rounded-lg shadow-sm">
                <h2 className="text-2xl font-semibold mb-6">Redes Sociais</h2>
                <p className="text-gray-600 mb-4">Siga-nos para ficar por dentro das novidades, lançamentos e promoções.</p>
                <div className="flex space-x-4">
                  <a 
                    href="https://instagram.com" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="bg-gradient-to-r from-purple-500 to-pink-500 text-white p-2 rounded-full hover:scale-110 transition duration-300"
                  >
                    Instagram
                  </a>
                  <a 
                    href="https://facebook.com" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="bg-blue-600 text-white p-2 rounded-full hover:scale-110 transition duration-300"
                  >
                    Facebook
                  </a>
                  <a 
                    href="https://twitter.com" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="bg-blue-400 text-white p-2 rounded-full hover:scale-110 transition duration-300"
                  >
                    Twitter
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer isHome={false} />
    </div>
  );
} 