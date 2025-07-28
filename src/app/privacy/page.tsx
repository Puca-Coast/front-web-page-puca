"use client";

import React from "react";
import PageLayout from "@/layouts/PageLayout";

export default function Privacy() {
  return (
    <PageLayout>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
      
      <main className="flex-1 px-4 py-8 pt-32">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white p-8 rounded-lg shadow-lg">
            <h1 className="text-4xl font-bold text-gray-900 mb-8">
              Política de Privacidade
            </h1>
            
            <div className="prose prose-lg max-w-none">
              <p className="text-gray-600 mb-6">
                Última atualização: 18 de Julho de 2025
              </p>
              
              <section className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  1. Informações que Coletamos
                </h2>
                <p className="text-gray-600 mb-4">
                  Coletamos informações que você nos fornece diretamente, como quando cria uma conta, 
                  faz uma compra ou entra em contato conosco. Isso pode incluir:
                </p>
                <ul className="list-disc list-inside text-gray-600 mb-4 ml-4">
                  <li>Nome, endereço de email e informações de contato</li>
                  <li>Informações de pagamento e endereço de entrega</li>
                  <li>Histórico de compras e preferências</li>
                  <li>Comunicações conosco</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  2. Como Usamos suas Informações
                </h2>
                <p className="text-gray-600 mb-4">
                  Usamos suas informações para:
                </p>
                <ul className="list-disc list-inside text-gray-600 mb-4 ml-4">
                  <li>Processar e gerenciar seus pedidos</li>
                  <li>Fornecer suporte ao cliente</li>
                  <li>Enviar comunicações sobre produtos e promoções</li>
                  <li>Melhorar nossos serviços</li>
                  <li>Cumprir obrigações legais</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  3. Compartilhamento de Informações
                </h2>
                <p className="text-gray-600 mb-4">
                  Não vendemos, alugamos ou compartilhamos suas informações pessoais com terceiros, 
                  exceto nas seguintes situações:
                </p>
                <ul className="list-disc list-inside text-gray-600 mb-4 ml-4">
                  <li>Com prestadores de serviços que nos ajudam a operar nosso negócio</li>
                  <li>Para cumprir obrigações legais</li>
                  <li>Com seu consentimento explícito</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  4. Segurança das Informações
                </h2>
                <p className="text-gray-600 mb-4">
                  Implementamos medidas de segurança técnicas e organizacionais apropriadas para 
                  proteger suas informações pessoais contra acesso não autorizado, alteração, 
                  divulgação ou destruição.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  5. Seus Direitos
                </h2>
                <p className="text-gray-600 mb-4">
                  Você tem o direito de:
                </p>
                <ul className="list-disc list-inside text-gray-600 mb-4 ml-4">
                  <li>Acessar suas informações pessoais</li>
                  <li>Corrigir informações imprecisas</li>
                  <li>Solicitar a exclusão de suas informações</li>
                  <li>Retirar seu consentimento a qualquer momento</li>
                  <li>Fazer uma reclamação com a autoridade de proteção de dados</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  6. Cookies e Tecnologias Similares
                </h2>
                <p className="text-gray-600 mb-4">
                  Usamos cookies e tecnologias similares para melhorar sua experiência em nosso site, 
                  analisar o tráfego e personalizar conteúdo. Você pode controlar o uso de cookies 
                  através das configurações do seu navegador.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  7. Alterações nesta Política
                </h2>
                <p className="text-gray-600 mb-4">
                  Podemos atualizar esta política de privacidade periodicamente. Notificaremos você 
                  sobre mudanças significativas através de nosso site ou por email.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  8. Contato
                </h2>
                <p className="text-gray-600 mb-4">
                  Se você tiver dúvidas sobre esta política de privacidade ou sobre como tratamos 
                  suas informações pessoais, entre em contato conosco:
                </p>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-gray-600">
                    <strong>Email:</strong> privacidade@pucacoast.com.br<br />
                    <strong>Telefone:</strong> (71) 99125-8688<br />
                    <strong>Endereço:</strong> Salvador, Bahia - Brasil
                  </p>
                </div>
              </section>
            </div>
          </div>
        </div>
      </main>
      </div>
    </PageLayout>
  );
}
