"use client";
import React, { useEffect } from "react";
import anime from "animejs/lib/anime.js";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

export default function ExchangeReturnPage() {
  useEffect(() => {
    // Animation for page elements
    anime.timeline()
      .add({
        targets: '.page-title',
        opacity: [0, 1],
        translateY: [30, 0],
        easing: 'easeOutExpo',
        duration: 1000,
      })
      .add({
        targets: '.policy-section',
        opacity: [0, 1],
        translateY: [30, 0],
        easing: 'easeOutExpo',
        duration: 800,
        delay: anime.stagger(200),
      }, '-=500');
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header isHome={false} />
      
      <main className="flex-1 w-full max-w-4xl mx-auto px-4 pt-24 pb-10">
        <h1 className="page-title text-4xl font-bold mb-12 text-center">Política de Troca e Devolução</h1>
        
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          {/* Introduction */}
          <section className="policy-section p-8 border-b border-gray-100">
            <h2 className="text-2xl font-semibold mb-4">Nosso Compromisso</h2>
            <p className="text-gray-700 mb-4">
              Na Puca Coast, valorizamos a sua satisfação e confiança. Por isso, oferecemos uma política de trocas e devoluções transparente 
              e justa, garantindo que você esteja completamente satisfeito com sua compra.
            </p>
            <p className="text-gray-700">
              Nossa política segue as normas do Código de Defesa do Consumidor e está descrita em detalhes abaixo.
            </p>
          </section>
          
          {/* Exchanges */}
          <section className="policy-section p-8 border-b border-gray-100">
            <h2 className="text-2xl font-semibold mb-4">Trocas</h2>
            <h3 className="text-lg font-medium mt-6 mb-3">Prazo para Solicitação</h3>
            <p className="text-gray-700 mb-4">
              Você tem até <strong>30 dias corridos</strong>, contados a partir da data de entrega, para solicitar a troca de qualquer produto.
            </p>
            
            <h3 className="text-lg font-medium mt-6 mb-3">Condições para Troca</h3>
            <ul className="list-disc pl-5 text-gray-700 space-y-2">
              <li>O produto deve estar em perfeitas condições, sem sinais de uso;</li>
              <li>Deve estar acompanhado da etiqueta original;</li>
              <li>Deve estar na embalagem original, sem danos;</li>
              <li>Você deve apresentar a nota fiscal da compra.</li>
            </ul>
            
            <h3 className="text-lg font-medium mt-6 mb-3">Como Solicitar Troca</h3>
            <ol className="list-decimal pl-5 text-gray-700 space-y-2">
              <li>Entre em contato conosco através do e-mail <a href="mailto:trocas@pucacoast.com" className="text-teal-600 hover:underline">trocas@pucacoast.com</a>;</li>
              <li>Informe o número do pedido e o motivo da troca;</li>
              <li>Nossa equipe fornecerá um código de autorização para devolução;</li>
              <li>Envie o produto para o endereço informado no e-mail de autorização.</li>
            </ol>
          </section>
          
          {/* Returns */}
          <section className="policy-section p-8 border-b border-gray-100">
            <h2 className="text-2xl font-semibold mb-4">Devoluções</h2>
            <h3 className="text-lg font-medium mt-6 mb-3">Prazo para Desistência (Direito de Arrependimento)</h3>
            <p className="text-gray-700 mb-4">
              Conforme o Código de Defesa do Consumidor, você tem até <strong>7 dias corridos</strong> após o recebimento do produto para exercer 
              seu direito de arrependimento em compras realizadas pela internet.
            </p>
            
            <h3 className="text-lg font-medium mt-6 mb-3">Condições para Devolução</h3>
            <ul className="list-disc pl-5 text-gray-700 space-y-2">
              <li>O produto deve estar em perfeitas condições, sem sinais de uso;</li>
              <li>Deve estar acompanhado de todos os acessórios e brindes;</li>
              <li>Deve estar na embalagem original, sem danos;</li>
              <li>Você deve apresentar a nota fiscal da compra.</li>
            </ul>
            
            <h3 className="text-lg font-medium mt-6 mb-3">Reembolso</h3>
            <p className="text-gray-700 mb-4">
              Após a aprovação da devolução, o reembolso será realizado em até 10 dias úteis, pelo mesmo meio de pagamento utilizado na compra:
            </p>
            <ul className="list-disc pl-5 text-gray-700 space-y-2">
              <li>Cartão de crédito: o estorno será realizado na próxima fatura ou na seguinte;</li>
              <li>PIX ou boleto: o valor será devolvido via transferência bancária;</li>
              <li>O valor do frete de envio não será reembolsado, exceto em casos de produtos com defeito.</li>
            </ul>
          </section>
          
          {/* Defective Products */}
          <section className="policy-section p-8 border-b border-gray-100">
            <h2 className="text-2xl font-semibold mb-4">Produtos com Defeito</h2>
            <p className="text-gray-700 mb-4">
              Se você recebeu um produto com defeito, siga estas orientações:
            </p>
            <ol className="list-decimal pl-5 text-gray-700 space-y-2">
              <li>Entre em contato em até 7 dias após o recebimento;</li>
              <li>Envie fotos claras do defeito para <a href="mailto:trocas@pucacoast.com" className="text-teal-600 hover:underline">trocas@pucacoast.com</a>;</li>
              <li>Após análise, forneceremos as instruções para devolução;</li>
              <li>Você pode optar por troca, reparo ou reembolso integral (incluindo frete).</li>
            </ol>
          </section>
          
          {/* Customer Service */}
          <section className="policy-section p-8">
            <h2 className="text-2xl font-semibold mb-4">Atendimento ao Cliente</h2>
            <p className="text-gray-700 mb-6">
              Para dúvidas adicionais sobre nossa política de trocas e devoluções, entre em contato com nossa equipe:
            </p>
            <div className="bg-gray-50 p-6 rounded-md flex flex-col sm:flex-row justify-between items-center">
              <div>
                <p className="font-medium">E-mail:</p>
                <a href="mailto:contato@pucacoast.com" className="text-teal-600 hover:underline">contato@pucacoast.com</a>
              </div>
              <div className="mt-4 sm:mt-0">
                <p className="font-medium">Telefone:</p>
                <p className="text-gray-700">(71) 99999-9999</p>
              </div>
              <div className="mt-4 sm:mt-0">
                <p className="font-medium">Horário de Atendimento:</p>
                <p className="text-gray-700">Seg-Sex: 9h às 18h</p>
              </div>
            </div>
          </section>
        </div>
      </main>

      <Footer isHome={false} />
    </div>
  );
} 