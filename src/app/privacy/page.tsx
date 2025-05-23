"use client";
import React, { useEffect } from "react";
import anime from "animejs/lib/anime.js";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

export default function Privacy() {
  useEffect(() => {
    // Animation for page elements
    anime.timeline()
      .add({
        targets: '.privacy-header',
        opacity: [0, 1],
        translateY: [30, 0],
        easing: 'easeOutExpo',
        duration: 1000,
      })
      .add({
        targets: '.privacy-section',
        opacity: [0, 1],
        translateY: [30, 0],
        easing: 'easeOutExpo',
        duration: 800,
        delay: anime.stagger(150),
      }, '-=500');
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header isHome={false} />
      
      <main className="flex-1 w-full max-w-4xl mx-auto px-4 pt-24 pb-10">
        <div className="privacy-header text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Política de Privacidade</h1>
          <p className="text-gray-600">
            <strong>Última atualização: 15 de Janeiro de 2025</strong>
          </p>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          {/* Introdução */}
          <section className="privacy-section p-8 border-b border-gray-100">
            <h2 className="text-2xl font-semibold mb-4">Introdução</h2>
            <p className="text-gray-700 mb-4">
              A Puca Coast está comprometida em proteger sua privacidade e seus dados pessoais. 
              Esta Política de Privacidade explica como coletamos, usamos, armazenamos e protegemos suas informações 
              quando você acessa nosso site e utiliza nossos serviços.
            </p>
            <p className="text-gray-700">
              Ao utilizar nosso site e serviços, você concorda com os termos descritos nesta política.
            </p>
          </section>
          
          {/* Coleta de Dados */}
          <section className="privacy-section p-8 border-b border-gray-100">
            <h2 className="text-2xl font-semibold mb-4">Coleta de Dados Pessoais</h2>
            <p className="text-gray-700 mb-4">
              No Puca Coast, coletamos informações primariamente fornecidas por você, como:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-gray-50 p-4 rounded-md">
                <h3 className="font-medium mb-2">Informações fornecidas por você:</h3>
                <ul className="list-disc pl-5 text-gray-700 space-y-1">
                  <li>Nome completo</li>
                  <li>Endereço de e-mail</li>
                  <li>Endereço de entrega</li>
                  <li>Informações de pagamento</li>
                  <li>Número de telefone</li>
                </ul>
              </div>
              <div className="bg-gray-50 p-4 rounded-md">
                <h3 className="font-medium mb-2">Dados coletados automaticamente:</h3>
                <ul className="list-disc pl-5 text-gray-700 space-y-1">
                  <li>Endereço IP</li>
                  <li>Informações de navegador</li>
                  <li>Cookies e tecnologias semelhantes</li>
                  <li>Histórico de navegação em nosso site</li>
                  <li>Dados de uso e preferências</li>
                </ul>
              </div>
            </div>
          </section>
          
          {/* Uso de Dados */}
          <section className="privacy-section p-8 border-b border-gray-100">
            <h2 className="text-2xl font-semibold mb-4">Uso dos Dados</h2>
            <p className="text-gray-700 mb-4">
              Utilizamos os dados coletados para proporcionar, manter, proteger e melhorar os serviços oferecidos, 
              bem como para desenvolver novos. Seus dados também são usados para:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-6">
              <div className="border border-gray-200 p-4 rounded-md hover:bg-gray-50 transition duration-300">
                <h3 className="font-medium mb-2">Processar pedidos</h3>
                <p className="text-gray-600 text-sm">Gerenciar suas compras, entregas e devoluções</p>
              </div>
              <div className="border border-gray-200 p-4 rounded-md hover:bg-gray-50 transition duration-300">
                <h3 className="font-medium mb-2">Personalizar experiência</h3>
                <p className="text-gray-600 text-sm">Oferecer conteúdo e recomendações relevantes</p>
              </div>
              <div className="border border-gray-200 p-4 rounded-md hover:bg-gray-50 transition duration-300">
                <h3 className="font-medium mb-2">Marketing</h3>
                <p className="text-gray-600 text-sm">Enviar informações sobre promoções e novos produtos</p>
              </div>
              <div className="border border-gray-200 p-4 rounded-md hover:bg-gray-50 transition duration-300">
                <h3 className="font-medium mb-2">Melhorar serviços</h3>
                <p className="text-gray-600 text-sm">Analisar como você usa nosso site para melhorá-lo</p>
              </div>
              <div className="border border-gray-200 p-4 rounded-md hover:bg-gray-50 transition duration-300">
                <h3 className="font-medium mb-2">Atendimento</h3>
                <p className="text-gray-600 text-sm">Responder suas dúvidas e solicitações</p>
              </div>
              <div className="border border-gray-200 p-4 rounded-md hover:bg-gray-50 transition duration-300">
                <h3 className="font-medium mb-2">Segurança</h3>
                <p className="text-gray-600 text-sm">Proteger nosso site e seus dados contra fraudes</p>
              </div>
            </div>
          </section>
          
          {/* Compartilhamento */}
          <section className="privacy-section p-8 border-b border-gray-100">
            <h2 className="text-2xl font-semibold mb-4">Compartilhamento de Dados</h2>
            <p className="text-gray-700 mb-4">
              Comprometemo-nos a não compartilhar suas informações pessoais com terceiros, exceto em casos específicos:
            </p>
            <ul className="list-disc pl-5 text-gray-700 space-y-2">
              <li>Com parceiros de logística para entrega de produtos;</li>
              <li>Com processadores de pagamento para concluir transações;</li>
              <li>Quando exigido por lei ou ordem judicial;</li>
              <li>Para proteger direitos, propriedade ou segurança da Puca Coast ou de terceiros.</li>
            </ul>
          </section>
          
          {/* Segurança */}
          <section className="privacy-section p-8 border-b border-gray-100">
            <h2 className="text-2xl font-semibold mb-4">Segurança</h2>
            <p className="text-gray-700 mb-4">
              Adotamos medidas de segurança adequadas para proteger seus dados contra acesso não autorizado, 
              alteração, divulgação ou destruição. Estas medidas incluem:
            </p>
            <div className="bg-gray-50 p-6 rounded-md">
              <ul className="list-disc pl-5 text-gray-700 space-y-2">
                <li>Criptografia de dados sensíveis;</li>
                <li>Acesso restrito aos dados em base de necessidade;</li>
                <li>Monitoramento contínuo de sistemas;</li>
                <li>Atualizações regulares de segurança.</li>
              </ul>
            </div>
          </section>
          
          {/* Direitos */}
          <section className="privacy-section p-8 border-b border-gray-100">
            <h2 className="text-2xl font-semibold mb-4">Seus Direitos</h2>
            <p className="text-gray-700 mb-4">
              Você tem o direito de:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-gray-50 p-4 rounded-md">
                <h3 className="font-medium mb-1">Acesso aos dados</h3>
                <p className="text-gray-600 text-sm">Solicitar uma cópia das informações que temos sobre você</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-md">
                <h3 className="font-medium mb-1">Retificação</h3>
                <p className="text-gray-600 text-sm">Corrigir dados imprecisos ou incompletos</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-md">
                <h3 className="font-medium mb-1">Exclusão</h3>
                <p className="text-gray-600 text-sm">Solicitar a remoção de suas informações</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-md">
                <h3 className="font-medium mb-1">Restrição de processamento</h3>
                <p className="text-gray-600 text-sm">Limitar como usamos seus dados</p>
              </div>
            </div>
            <p className="text-gray-700 mt-6">
              Para exercer esses direitos, entre em contato conosco através do e-mail: 
              <a href="mailto:privacidade@pucacoast.com" className="text-teal-600 hover:underline ml-1">
                privacidade@pucacoast.com
              </a>
            </p>
          </section>
          
          {/* Contato */}
          <section className="privacy-section p-8">
            <h2 className="text-2xl font-semibold mb-4">Contato</h2>
            <p className="text-gray-700 mb-6">
              Se você tiver dúvidas ou preocupações sobre nossa Política de Privacidade ou sobre o 
              tratamento de seus dados pessoais, entre em contato conosco:
            </p>
            <div className="bg-teal-50 border border-teal-200 p-6 rounded-md">
              <p className="font-medium mb-2">Puca Coast - Encarregado de Proteção de Dados</p>
              <p className="text-gray-700 mb-1">E-mail: <a href="mailto:privacidade@pucacoast.com" className="text-teal-600 hover:underline">privacidade@pucacoast.com</a></p>
              <p className="text-gray-700 mb-1">Telefone: (71) 99999-9999</p>
              <p className="text-gray-700">Endereço: Av. Tancredo Neves, 620 - Salvador, BA - 41820-020</p>
            </div>
            <p className="text-gray-600 text-sm mt-8 text-center">
              Esta política é efetiva a partir de 15 de Janeiro de 2025.
            </p>
          </section>
        </div>
      </main>

      <Footer isHome={false} />
    </div>
  );
}
