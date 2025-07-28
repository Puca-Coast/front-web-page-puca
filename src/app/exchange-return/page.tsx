"use client";

import React from "react";
import PageLayout from "@/layouts/PageLayout";

export default function ExchangeReturn() {
  return (
    <PageLayout>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
      
      <main className="flex-1 px-4 py-8 pt-32">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Troca e Devolução
            </h1>
            <p className="text-lg text-gray-600">
              Política transparente para sua tranquilidade
            </p>
          </div>

          <div className="bg-white p-8 rounded-lg shadow-lg">
            <div className="prose prose-lg max-w-none">
              <section className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  Política de Troca e Devolução
                </h2>
                <p className="text-gray-600 mb-4">
                  Na PUCA Coast, queremos que você esteja 100% satisfeito com sua compra. 
                  Por isso, oferecemos uma política de troca e devolução simples e transparente.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  Prazo para Troca/Devolução
                </h2>
                <p className="text-gray-600 mb-4">
                  Você tem <strong>30 dias corridos</strong> a partir da data de recebimento 
                  do produto para solicitar troca ou devolução.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  Condições para Troca/Devolução
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-green-50 p-6 rounded-lg border border-green-200">
                    <h3 className="text-lg font-semibold text-green-800 mb-3">
                      ✅ Produto em Condições
                    </h3>
                    <ul className="text-green-700 space-y-2">
                      <li>• Produto sem uso</li>
                      <li>• Embalagem original intacta</li>
                      <li>• Etiquetas e lacres preservados</li>
                      <li>• Sem manchas ou odores</li>
                    </ul>
                  </div>
                  
                  <div className="bg-red-50 p-6 rounded-lg border border-red-200">
                    <h3 className="text-lg font-semibold text-red-800 mb-3">
                      ❌ Produto Não Aceito
                    </h3>
                    <ul className="text-red-700 space-y-2">
                      <li>• Produto usado ou lavado</li>
                      <li>• Embalagem danificada</li>
                      <li>• Etiquetas removidas</li>
                      <li>• Com manchas ou odores</li>
                    </ul>
                  </div>
                </div>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  Como Solicitar Troca/Devolução
                </h2>
                <div className="space-y-4">
                  <div className="flex items-start space-x-4">
                    <div className="w-8 h-8 bg-black text-white rounded-full flex items-center justify-center text-sm font-bold">
                      1
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">Entre em Contato</h3>
                      <p className="text-gray-600">
                        Envie um email para <strong>trocas@pucacoast.com.br</strong> com o número do pedido 
                        e motivo da troca/devolução.
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-4">
                    <div className="w-8 h-8 bg-black text-white rounded-full flex items-center justify-center text-sm font-bold">
                      2
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">Aguarde Aprovação</h3>
                      <p className="text-gray-600">
                        Nossa equipe analisará sua solicitação e entrará em contato em até 48 horas.
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-4">
                    <div className="w-8 h-8 bg-black text-white rounded-full flex items-center justify-center text-sm font-bold">
                      3
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">Envie o Produto</h3>
                      <p className="text-gray-600">
                        Após aprovação, você receberá instruções para envio do produto.
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-4">
                    <div className="w-8 h-8 bg-black text-white rounded-full flex items-center justify-center text-sm font-bold">
                      4
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">Processamento</h3>
                      <p className="text-gray-600">
                        Após recebermos o produto, processaremos sua troca ou devolução em até 5 dias úteis.
                      </p>
                    </div>
                  </div>
                </div>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  Opções de Troca/Devolução
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="border border-gray-200 p-6 rounded-lg">
                    <h3 className="text-xl font-semibold text-gray-900 mb-3">
                      🔄 Troca
                    </h3>
                    <ul className="text-gray-600 space-y-2">
                      <li>• Mesmo produto em outro tamanho</li>
                      <li>• Outro produto do mesmo valor</li>
                      <li>• Produto de valor superior (com complemento)</li>
                    </ul>
                  </div>
                  
                  <div className="border border-gray-200 p-6 rounded-lg">
                    <h3 className="text-xl font-semibold text-gray-900 mb-3">
                      💰 Devolução
                    </h3>
                    <ul className="text-gray-600 space-y-2">
                      <li>• Reembolso integral</li>
                      <li>• Crédito na loja</li>
                      <li>• Estorno no método de pagamento original</li>
                    </ul>
                  </div>
                </div>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  Custos de Envio
                </h2>
                <div className="bg-gray-50 p-6 rounded-lg">
                  <p className="text-gray-600 mb-4">
                    <strong>Produto com Defeito:</strong> Frete por nossa conta
                  </p>
                  <p className="text-gray-600 mb-4">
                    <strong>Arrependimento:</strong> Frete por conta do cliente
                  </p>
                  <p className="text-gray-600">
                    <strong>Produto Errado:</strong> Frete por nossa conta
                  </p>
                </div>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  Produtos Especiais
                </h2>
                <div className="bg-yellow-50 p-6 rounded-lg border border-yellow-200">
                  <h3 className="text-lg font-semibold text-yellow-800 mb-3">
                    ⚠️ Produtos Personalizados
                  </h3>
                  <p className="text-yellow-700">
                    Produtos personalizados ou feitos sob medida não podem ser trocados ou devolvidos, 
                    exceto em caso de defeito de fabricação.
                  </p>
                </div>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  Contato
                </h2>
                <div className="bg-gray-50 p-6 rounded-lg">
                  <p className="text-gray-600 mb-2">
                    <strong>Email:</strong> trocas@pucacoast.com.br
                  </p>
                  <p className="text-gray-600 mb-2">
                    <strong>Telefone:</strong> (71) 99125-8688
                  </p>
                  <p className="text-gray-600">
                    <strong>Horário:</strong> Segunda a Sexta, 9h às 18h
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