"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import Image from 'next/image';
import Link from 'next/link';

// Force dynamic rendering to avoid prerendering issues with useSearchParams
export const dynamic = 'force-dynamic';

interface OrderDetails {
  orderNumber: string;
  status: string;
  total: number;
  items: any[];
  shippingAddress: any;
  payment: any;
  shipping: any;
  createdAt: string;
  estimatedDelivery?: string;
}

export default function OrderConfirmationPage() {
  const [mounted, setMounted] = useState(false);
  const [order, setOrder] = useState<OrderDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [orderNumber, setOrderNumber] = useState<string | null>(null);
  
  const router = useRouter();
  
  useEffect(() => {
    setMounted(true);
    
    // Get order number from URL after mounting
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const orderId = params.get('orderNumber');
      setOrderNumber(orderId);
    }
  }, []);

  useEffect(() => {
    if (!mounted || !orderNumber) return;

    fetchOrderDetails();
  }, [mounted, orderNumber]);

  const fetchOrderDetails = async () => {
    if (!orderNumber) {
      setError('Número do pedido não encontrado');
      setLoading(false);
      return;
    }
    
    try {
      const token = localStorage.getItem('authToken');
      const apiUrl = typeof window !== 'undefined' ? 
        window.location.origin.includes('localhost') ? 'http://localhost:3000' : 'https://puca-api.vercel.app' :
        'http://localhost:3000';
        
      const response = await fetch(`${apiUrl}/api/orders/track/${orderNumber}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const result = await response.json();

      if (result.success) {
        setOrder(result.data);
      } else {
        setError('Pedido não encontrado');
      }
    } catch (error) {
      console.error('Erro ao buscar detalhes do pedido:', error);
      setError('Erro ao carregar detalhes do pedido');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'text-yellow-600 bg-yellow-50';
      case 'confirmed': return 'text-green-600 bg-green-50';
      case 'processing': return 'text-blue-600 bg-blue-50';
      case 'shipped': return 'text-indigo-600 bg-indigo-50';
      case 'delivered': return 'text-green-700 bg-green-100';
      case 'cancelled': return 'text-red-600 bg-red-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending': return 'Aguardando Pagamento';
      case 'confirmed': return 'Pedido Confirmado';
      case 'processing': return 'Preparando Envio';
      case 'shipped': return 'Enviado';
      case 'delivered': return 'Entregue';
      case 'cancelled': return 'Cancelado';
      default: return status;
    }
  };

  if (!mounted || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black"></div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header isHome={false} />
        <main className="pt-32 pb-16">
          <div className="max-w-2xl mx-auto px-4 text-center">
            <div className="bg-white p-8 rounded-lg shadow-sm">
              <div className="text-red-500 text-5xl mb-4">⚠</div>
              <h1 className="text-2xl font-bold text-gray-900 mb-4">
                {error || 'Pedido não encontrado'}
              </h1>
              <p className="text-gray-600 mb-6">
                Não conseguimos encontrar os detalhes do seu pedido.
              </p>
              <Link
                href="/shop"
                className="inline-block bg-black text-white px-6 py-3 rounded-md hover:bg-gray-800 transition"
              >
                Voltar às Compras
              </Link>
            </div>
          </div>
        </main>
        <Footer isHome={false} />
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
      <Header isHome={false} />
      
      <main className="pt-32 pb-16">
        <div className="max-w-4xl mx-auto px-4">
          
          {/* Success Animation */}
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="text-center mb-8"
          >
            <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Pedido Confirmado!
            </h1>
            <p className="text-gray-600 text-lg">
              Obrigado pela sua compra. Seu pedido foi recebido e está sendo processado.
            </p>
          </motion.div>
          
          {/* Order Summary Card */}
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="bg-white rounded-lg shadow-sm p-6 mb-6"
          >
            <div className="border-b pb-4 mb-4">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">
                    Pedido #{order.orderNumber}
                  </h2>
                  <p className="text-gray-500 text-sm">
                    Realizado em {new Date(order.createdAt).toLocaleDateString('pt-BR', {
                      day: '2-digit',
                      month: 'long',
                      year: 'numeric'
                    })}
                  </p>
            </div>
                <div className="mt-2 sm:mt-0">
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
                    {getStatusText(order.status)}
              </span>
            </div>
            </div>
          </div>
          
            {/* Progress Steps */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-2">
                {['pending', 'confirmed', 'processing', 'shipped', 'delivered'].map((step, index) => {
                  const currentIndex = ['pending', 'confirmed', 'processing', 'shipped', 'delivered'].indexOf(order.status);
                  const isCompleted = index <= currentIndex;
                  const isCurrent = index === currentIndex;
                  
                  return (
                    <div key={step} className="flex items-center">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                        isCompleted ? 'bg-green-500 text-white' : 
                        isCurrent ? 'bg-blue-500 text-white' : 
                        'bg-gray-200 text-gray-500'
                      }`}>
                        {isCompleted && !isCurrent ? '✓' : index + 1}
                </div>
                      {index < 4 && (
                        <div className={`h-1 w-16 mx-2 ${
                          index < currentIndex ? 'bg-green-500' : 'bg-gray-200'
                        }`} />
                      )}
                </div>
                  );
                })}
              </div>
              <div className="flex items-center justify-between text-xs text-gray-500">
                <span>Pedido</span>
                <span>Confirmado</span>
                <span>Preparando</span>
                <span>Enviado</span>
                <span>Entregue</span>
                </div>
              </div>
              
            {/* Order Items */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900">Itens do Pedido</h3>
              {order.items?.map((item, index) => (
                <div key={index} className="flex items-center py-4 border-b last:border-b-0">
                  <div className="relative w-16 h-16 flex-shrink-0 bg-gray-100 rounded-md overflow-hidden">
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      className="object-cover"
                      sizes="64px"
                    />
                  </div>
                  <div className="ml-4 flex-1">
                    <h4 className="text-sm font-medium text-gray-900">{item.name}</h4>
                    <p className="text-sm text-gray-500">Tamanho: {item.size}</p>
                    <p className="text-sm text-gray-500">Quantidade: {item.quantity}</p>
                  </div>
                  <div className="text-sm font-medium text-gray-900">
                    R$ {(item.price * item.quantity).toFixed(2)}
                </div>
                </div>
              ))}
            </div>

            {/* Order Total */}
            <div className="mt-6 pt-4 border-t">
              <div className="flex justify-between text-lg font-semibold">
                <span>Total</span>
                <span>R$ {order.total?.toFixed(2) || '0.00'}</span>
              </div>
            </div>
          </motion.div>

          {/* Tracking Information */}
          {order.shipping?.trackingCode && (
            <motion.div
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="bg-white rounded-lg shadow-sm p-6 mb-6"
            >
              <h3 className="text-lg font-medium text-gray-900 mb-4">Rastreamento</h3>
              <div className="bg-gray-50 p-4 rounded-md">
                <p className="text-sm text-gray-600 mb-2">Código de Rastreamento:</p>
                <p className="text-lg font-mono text-gray-900 mb-3">{order.shipping.trackingCode}</p>
                {order.shipping.trackingUrl && (
                  <a
                    href={order.shipping.trackingUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center text-blue-600 hover:text-blue-800 text-sm font-medium"
                  >
                    Rastrear no site dos Correios
                    <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </a>
                )}
          </div>
            </motion.div>
          )}

          {/* Actions */}
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Link
              href="/shop"
              className="inline-flex items-center justify-center px-6 py-3 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50 transition font-medium"
            >
              Continuar Comprando
            </Link>
            <Link
              href="/auth/profile"
              className="inline-flex items-center justify-center px-6 py-3 bg-black text-white rounded-md hover:bg-gray-800 transition font-medium"
            >
              Ver Meus Pedidos
            </Link>
          </motion.div>

        </div>
      </main>
      
      <Footer isHome={false} />
    </div>
  );
} 