"use client";

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import Link from 'next/link';

const OrderConfirmationPage = () => {
  const router = useRouter();
  const [orderNumber, setOrderNumber] = useState('');
  
  useEffect(() => {
    // Gera um número de pedido aleatório
    const randomOrderNumber = Math.floor(Math.random() * 1000000).toString().padStart(6, '0');
    setOrderNumber(randomOrderNumber);
    
    // Em um aplicativo real, você obteria os detalhes do pedido da API
  }, []);
  
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header isHome={false} />
      
      <main className="flex-grow container mx-auto px-4 py-12 md:py-16">
        <div className="max-w-2xl mx-auto bg-white p-6 md:p-8 rounded-lg shadow-sm">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            
            <h1 className="text-2xl md:text-3xl font-bold mb-2">Pedido Confirmado!</h1>
            <p className="text-gray-600">
              Obrigado pela sua compra. Um e-mail de confirmação foi enviado para o seu endereço de e-mail.
            </p>
          </div>
          
          <div className="border-t border-b py-4 my-6">
            <div className="flex justify-between items-center mb-2">
              <span className="text-gray-600">Número do Pedido</span>
              <span className="font-semibold">{`#${orderNumber}`}</span>
            </div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-gray-600">Data</span>
              <span>{new Date().toLocaleDateString('pt-BR')}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Status</span>
              <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-xs font-medium">
                Processando
              </span>
            </div>
          </div>
          
          <div className="mb-6">
            <h2 className="text-lg font-semibold mb-3">Informações de Entrega</h2>
            <p className="text-gray-700 mb-1">Endereço de entrega:</p>
            <p className="text-gray-600">
              Rua Exemplo, 123<br />
              Bairro, Cidade - UF<br />
              CEP: 00000-000
            </p>
          </div>
          
          <div className="mb-6">
            <h2 className="text-lg font-semibold mb-3">Método de Pagamento</h2>
            <div className="flex items-center">
              <div className="w-10 h-6 bg-gray-200 rounded mr-3"></div>
              <span className="text-gray-600">Cartão de Crédito (final 1234)</span>
            </div>
          </div>
          
          <div className="mb-8">
            <h2 className="text-lg font-semibold mb-4">Rastreamento de Pedido</h2>
            <div className="relative">
              <div className="absolute left-3 top-0 ml-px h-full w-0.5 bg-gray-200"></div>
              
              <div className="relative flex items-start mb-6">
                <div className="h-6 w-6 rounded-full bg-green-500 flex items-center justify-center -ml-3.5 z-10">
                  <svg className="h-3 w-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-4">
                  <h3 className="font-medium">Pedido Confirmado</h3>
                  <p className="text-sm text-gray-500">{new Date().toLocaleDateString('pt-BR')}</p>
                </div>
              </div>
              
              <div className="relative flex items-start mb-6">
                <div className="h-6 w-6 rounded-full bg-gray-200 flex items-center justify-center -ml-3.5 z-10">
                  <div className="h-2 w-2 rounded-full bg-gray-400"></div>
                </div>
                <div className="ml-4">
                  <h3 className="font-medium text-gray-500">Em Processamento</h3>
                  <p className="text-sm text-gray-500">Em breve</p>
                </div>
              </div>
              
              <div className="relative flex items-start">
                <div className="h-6 w-6 rounded-full bg-gray-200 flex items-center justify-center -ml-3.5 z-10">
                  <div className="h-2 w-2 rounded-full bg-gray-400"></div>
                </div>
                <div className="ml-4">
                  <h3 className="font-medium text-gray-500">Enviado</h3>
                  <p className="text-sm text-gray-500">Pendente</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="flex flex-col md:flex-row md:space-x-4">
            <Link href="/shop" className="bg-black text-white py-3 px-4 rounded-md text-center hover:bg-gray-800 transition-colors mb-4 md:mb-0 md:flex-1">
              Continuar Comprando
            </Link>
            <button className="border border-gray-300 text-gray-700 py-3 px-4 rounded-md text-center hover:bg-gray-50 transition-colors md:flex-1">
              Ver Detalhes do Pedido
            </button>
          </div>
        </div>
      </main>
      
      <Footer isHome={false} />
    </div>
  );
};

export default OrderConfirmationPage; 