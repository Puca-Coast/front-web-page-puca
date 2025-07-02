"use client";

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import Image from 'next/image';
import Link from 'next/link';
import { toast } from 'react-toastify';
import { getCookie } from '@/lib/utils/cookies';

interface Order {
  _id: string;
  orderNumber: string;
  status: string;
  total: number;
  items: any[];
  createdAt: string;
  shipping?: {
    trackingCode?: string;
    trackingUrl?: string;
  };
}

interface UserProfile {
  email: string;
  createdAt: string;
  lastLogin?: string;
}

export default function ProfilePage() {
  const { user, logout, isLoading: authLoading } = useAuth() as any;
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('orders');
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
      return;
    }

    if (user) {
      fetchUserData();
    }
  }, [user, authLoading]);

  const fetchUserData = async () => {
    try {
      // Tenta obter o token de forma resiliente
      const token = getCookie('token') || localStorage.getItem('authToken');
      const apiUrl = typeof window !== 'undefined' ? 
        window.location.origin.includes('localhost') ? 'http://localhost:3000' : 'https://puca-api.vercel.app' :
        'http://localhost:3000';

      // Buscar perfil do usuário
      const profileResponse = await fetch(`${apiUrl}/api/auth/profile`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (profileResponse.ok) {
        const profileResult = await profileResponse.json();
        setUserProfile(profileResult.data);
      }

      // Buscar pedidos do usuário
      const ordersResponse = await fetch(`${apiUrl}/api/orders`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (ordersResponse.ok) {
        const ordersResult = await ordersResponse.json();
        setOrders(ordersResult.data);
      }

    } catch (error) {
      console.error('Erro ao buscar dados do usuário:', error);
      toast.error('Erro ao carregar dados');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    toast.success('Logout realizado com sucesso');
    router.push('/');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'confirmed': return 'text-green-600 bg-green-50 border-green-200';
      case 'processing': return 'text-blue-600 bg-blue-50 border-blue-200';
      case 'shipped': return 'text-indigo-600 bg-indigo-50 border-indigo-200';
      case 'delivered': return 'text-green-700 bg-green-100 border-green-300';
      case 'cancelled': return 'text-red-600 bg-red-50 border-red-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending': return 'Aguardando';
      case 'confirmed': return 'Confirmado';
      case 'processing': return 'Preparando';
      case 'shipped': return 'Enviado';
      case 'delivered': return 'Entregue';
      case 'cancelled': return 'Cancelado';
      default: return status;
    }
  };

  const tabs = [
    { 
      id: 'orders', 
      label: 'Meus Pedidos', 
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
        </svg>
      )
    },
    { 
      id: 'profile', 
      label: 'Perfil', 
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
      )
    },
    { 
      id: 'settings', 
      label: 'Configurações', 
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      )
    }
  ];

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
      <Header isHome={false} />
      
      <main className="puca-page-content pb-16">
        <div className="max-w-6xl mx-auto px-4">
          
          {/* Welcome Header */}
          <motion.div
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="mb-8 mt-4"
          >
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Bem-vindo, {userProfile?.email?.split('@')[0] || 'Usuário'}!
            </h1>
            <p className="text-gray-600">
              Gerencie suas informações e acompanhe seus pedidos
            </p>
          </motion.div>

          <div className="flex flex-col lg:flex-row gap-6">
            
            {/* Sidebar Navigation */}
            <motion.div
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.1 }}
              className="lg:w-1/4"
            >
              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="space-y-2">
                  {tabs.map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`w-full flex items-center px-4 py-3 rounded-md text-left transition-all duration-200 ${
                        activeTab === tab.id
                          ? 'bg-black text-white shadow-md'
                          : 'text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      <span className="mr-3 flex-shrink-0">{tab.icon}</span>
                      {tab.label}
                    </button>
                  ))}
                </div>
                
                <div className="mt-6 pt-6 border-t">
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center px-4 py-3 text-red-600 hover:bg-red-50 rounded-md transition-all duration-200"
                  >
                    <span className="mr-3 flex-shrink-0">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                      </svg>
                    </span>
                    Sair
                  </button>
                </div>
              </div>
            </motion.div>

            {/* Main Content */}
            <motion.div
              initial={{ x: 20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="lg:w-3/4"
            >
              <AnimatePresence mode="wait">
                {/* Orders Tab */}
                {activeTab === 'orders' && (
                  <motion.div
                    key="orders"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="bg-white rounded-lg shadow-sm"
                  >
                    <div className="p-6 border-b">
                      <h2 className="text-xl font-semibold text-gray-900">Meus Pedidos</h2>
                      <p className="text-gray-600 mt-1">
                        Acompanhe o status dos seus pedidos
                      </p>
                    </div>

                    <div className="p-6">
                      {orders.length === 0 ? (
                        <div className="text-center py-12">
                          <div className="text-6xl mb-4">🛍️</div>
                          <h3 className="text-lg font-medium text-gray-900 mb-2">
                            Nenhum pedido encontrado
                          </h3>
                          <p className="text-gray-600 mb-6">
                            Você ainda não fez nenhum pedido. Que tal dar uma olhada na nossa loja?
                          </p>
                          <Link
                            href="/shop"
                            className="inline-block bg-black text-white px-6 py-3 rounded-md hover:bg-gray-800 transition"
                          >
                            Ir às Compras
                          </Link>
                        </div>
                      ) : (
                        <div className="space-y-4">
                          {orders.map((order, index) => (
                            <motion.div
                              key={order._id}
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: index * 0.1 }}
                              className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow"
                            >
                              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4">
                                <div>
                                  <h3 className="font-semibold text-gray-900">
                                    Pedido #{order.orderNumber}
                                  </h3>
                                  <p className="text-sm text-gray-500">
                                    {new Date(order.createdAt).toLocaleDateString('pt-BR', {
                                      day: '2-digit',
                                      month: 'long',
                                      year: 'numeric'
                                    })}
                                  </p>
                                </div>
                                <div className="flex items-center gap-3 mt-2 sm:mt-0">
                                  <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(order.status)}`}>
                                    {getStatusText(order.status)}
                                  </span>
                                  <span className="font-semibold text-gray-900">
                                    R$ {order.total.toFixed(2)}
                                  </span>
                                </div>
                              </div>

                              {/* Order Items Preview */}
                              <div className="flex items-center gap-4 mb-4">
                                {order.items.slice(0, 3).map((item, itemIndex) => (
                                  <div key={itemIndex} className="relative w-12 h-12 bg-gray-100 rounded-md overflow-hidden">
                                    <Image
                                      src={item.image}
                                      alt={item.name}
                                      fill
                                      className="object-cover"
                                      sizes="48px"
                                    />
                                  </div>
                                ))}
                                {order.items.length > 3 && (
                                  <div className="w-12 h-12 bg-gray-200 rounded-md flex items-center justify-center text-xs text-gray-600">
                                    +{order.items.length - 3}
                                  </div>
                                )}
                              </div>

                              <div className="flex flex-col sm:flex-row gap-3">
                                <Link
                                  href={`/order-confirmation?orderNumber=${order.orderNumber}`}
                                  className="flex-1 text-center bg-gray-100 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-200 transition text-sm font-medium"
                                >
                                  Ver Detalhes
                                </Link>
                                {order.shipping?.trackingCode && (
                                  <a
                                    href={order.shipping.trackingUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex-1 text-center bg-black text-white px-4 py-2 rounded-md hover:bg-gray-800 transition text-sm font-medium"
                                  >
                                    Rastrear
                                  </a>
                                )}
                              </div>
                            </motion.div>
                          ))}
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}

                {/* Profile Tab */}
                {activeTab === 'profile' && (
                  <motion.div
                    key="profile"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="bg-white rounded-lg shadow-sm"
                  >
                    <div className="p-6 border-b">
                      <h2 className="text-xl font-semibold text-gray-900">Informações do Perfil</h2>
                      <p className="text-gray-600 mt-1">
                        Suas informações pessoais
                      </p>
                    </div>

                    <div className="p-6">
                      <div className="space-y-6">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Email
                          </label>
                          <div className="bg-gray-50 px-4 py-3 rounded-md">
                            {userProfile?.email}
                          </div>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Membro desde
                          </label>
                          <div className="bg-gray-50 px-4 py-3 rounded-md">
                            {userProfile?.createdAt && new Date(userProfile.createdAt).toLocaleDateString('pt-BR', {
                              day: '2-digit',
                              month: 'long',
                              year: 'numeric'
                            })}
                          </div>
                        </div>

                        {userProfile?.lastLogin && (
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Último login
                            </label>
                            <div className="bg-gray-50 px-4 py-3 rounded-md">
                              {new Date(userProfile.lastLogin).toLocaleDateString('pt-BR', {
                                day: '2-digit',
                                month: 'long',
                                year: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
                            </div>
                          </div>
                        )}

                        <div className="pt-4">
                          <h3 className="text-lg font-medium text-gray-900 mb-4">Estatísticas</h3>
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-lg">
                              <div className="text-2xl font-bold text-blue-600">
                                {orders.length}
                              </div>
                              <div className="text-sm text-blue-800">Pedidos Realizados</div>
                            </div>
                            
                            <div className="bg-gradient-to-br from-green-50 to-green-100 p-4 rounded-lg">
                              <div className="text-2xl font-bold text-green-600">
                                R$ {orders.reduce((total, order) => total + order.total, 0).toFixed(2)}
                              </div>
                              <div className="text-sm text-green-800">Total Gasto</div>
                            </div>
                            
                            <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-4 rounded-lg">
                              <div className="text-2xl font-bold text-purple-600">
                                {orders.filter(order => order.status === 'delivered').length}
                              </div>
                              <div className="text-sm text-purple-800">Pedidos Entregues</div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* Settings Tab */}
                {activeTab === 'settings' && (
                  <motion.div
                    key="settings"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="bg-white rounded-lg shadow-sm"
                  >
                    <div className="p-6 border-b">
                      <h2 className="text-xl font-semibold text-gray-900">Configurações</h2>
                      <p className="text-gray-600 mt-1">
                        Gerencie suas preferências
                      </p>
                    </div>

                    <div className="p-6">
                      <div className="space-y-6">
                        <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                          <div>
                            <h3 className="font-medium text-gray-900">Notificações por Email</h3>
                            <p className="text-sm text-gray-600">
                              Receba atualizações sobre seus pedidos
                            </p>
                          </div>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input type="checkbox" className="sr-only peer" defaultChecked />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-black"></div>
                          </label>
                        </div>

                        <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                          <div>
                            <h3 className="font-medium text-gray-900">Newsletter</h3>
                            <p className="text-sm text-gray-600">
                              Receba ofertas especiais e novidades
                            </p>
                          </div>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input type="checkbox" className="sr-only peer" />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-black"></div>
                          </label>
                        </div>

                        <div className="pt-6 border-t">
                          <h3 className="text-lg font-medium text-gray-900 mb-4">Zona de Perigo</h3>
                          <button 
                            onClick={() => toast.info('Funcionalidade em desenvolvimento')}
                            className="bg-red-50 text-red-600 border border-red-200 px-4 py-2 rounded-md hover:bg-red-100 transition text-sm font-medium"
                          >
                            Excluir Conta
                          </button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </div>
        </div>
      </main>

      <Footer isHome={false} />
    </div>
  );
}
