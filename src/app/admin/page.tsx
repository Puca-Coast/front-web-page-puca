"use client";

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import Image from 'next/image';
import { toast } from 'react-toastify';
import { productService } from '@/lib/services/api/productService';
import AdminProductModal from '@/components/features/admin/AdminProductModal';
import { lookbookService } from '@/lib/services/api/lookbookService';
import { getCookie } from '@/lib/utils/cookies';

interface OrderStats {
  totalOrders: number;
  totalRevenue: number;
  recentOrders: number;
  recentRevenue: number;
  ordersByStatus: Array<{ _id: string; count: number; totalValue: number }>;
  topProducts: Array<{ _id: string; totalSold: number; revenue: number }>;
}

interface Order {
  _id: string;
  orderNumber: string;
  status: string;
  total: number;
  user: { email: string };
  items: any[];
  createdAt: string;
  shipping?: {
    trackingCode?: string;
  };
}

interface ProductData {
  _id: string;
  name: string;
  description: string;
  price: number;
  category?: string;
  stockBySize: Array<{ size: string; stock: number }>;
  imageUrl: string;
  hoverImageUrl: string;
  createdAt: string;
}

interface UserData {
  _id: string;
  email: string;
  role: string;
  createdAt: string;
  lastLogin?: string;
  active: boolean;
  orderCount: number;
}

export default function AdminPanel() {
  const { user, isLoading: authLoading } = useAuth() as any;
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [stats, setStats] = useState<OrderStats | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [users, setUsers] = useState<UserData[]>([]);
  const [products, setProducts] = useState<ProductData[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [lookbookPhotos, setLookbookPhotos] = useState<any[]>([]);
  const [productModalOpen, setProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<ProductData | null>(null);

  useEffect(() => {
    console.log('🔍 Admin page - Estado atual:', { user, authLoading, isAdmin: user?.isAdmin });
    console.log('🔍 Admin page - Token no cookie:', !!getCookie('auth_token'));
    
    // Só fazer verificações quando a autenticação terminar de carregar
    if (!authLoading) {
      console.log('🔍 Admin page - Autenticação carregada, verificando permissões...');
      
      if (!user) {
        console.log('❌ Usuário não autenticado, redirecionando para login');
        toast.error('Acesso negado. Faça login para continuar.');
        router.push('/login?redirectTo=/admin');
        return;
      }
      
      if (!user.isAdmin) {
        console.log('❌ Usuário não é admin, redirecionando para home');
        toast.error('Acesso negado. Área restrita para administradores.');
        router.push('/');
        return;
      }
      
      console.log('✅ Usuário admin válido, buscando dados...');
      // Se chegou aqui, é admin válido - buscar dados
      fetchAdminData();
    } else {
      console.log('⏳ Admin page - Aguardando verificação de autenticação...');
    }
  }, [user, authLoading]); // Removido router das dependências para evitar loops

  const fetchAdminData = async () => {
    try {
      console.log('🔄 Iniciando busca de dados administrativos...');
      const token = getCookie('auth_token');
      console.log('🔑 Token disponível:', !!token);
      
      const apiUrl = typeof window !== 'undefined' ? 
        window.location.origin.includes('localhost') ? 'http://localhost:3000' : 'https://puca-api.vercel.app' :
        'http://localhost:3000';

      console.log('🌐 URL da API:', apiUrl);

      // Buscar estatísticas
      const statsResponse = await fetch(`${apiUrl}/api/orders/admin/stats`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      console.log('📊 Status da resposta de stats:', statsResponse.status);

      if (statsResponse.ok) {
        const statsResult = await statsResponse.json();
        setStats(statsResult.data);
      }

      // Buscar pedidos
      const ordersResponse = await fetch(`${apiUrl}/api/orders/admin/all`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      console.log('📦 Status da resposta de pedidos:', ordersResponse.status);

      if (ordersResponse.ok) {
        const ordersResult = await ordersResponse.json();
        setOrders(ordersResult.data);
      }

      // Buscar usuários
      const usersResponse = await fetch(`${apiUrl}/api/auth/admin/users`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      console.log('👥 Status da resposta de usuários:', usersResponse.status);

      if (usersResponse.ok) {
        const usersResult = await usersResponse.json();
        setUsers(usersResult.data);
      }

      // Buscar produtos
      const productsResponse = await fetch(`${apiUrl}/api/products?limit=50`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      console.log('🛍️ Status da resposta de produtos:', productsResponse.status);

      if (productsResponse.ok) {
        const productsResult = await productsResponse.json();

        // Converte IDs de imagem em URLs completas para exibição
        const mappedProducts = productsResult.data.map((p: any) => ({
          ...p,
          imageUrl: p.imageUrl ? productService.getProductImageUrl(p.imageUrl) : p.image?.url,
          hoverImageUrl: p.hoverImageUrl ? productService.getProductImageUrl(p.hoverImageUrl) : p.hoverImage?.url || (p.image?.url ?? '')
        }));

        setProducts(mappedProducts);
      }

      // Buscar fotos do lookbook
      const lookbookRes = await fetch(`${apiUrl}/api/lookbook/photos?limit=100`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      console.log('📸 Status da resposta do lookbook:', lookbookRes.status);

      if (lookbookRes.ok) {
        const lookbookData = await lookbookRes.json();
        setLookbookPhotos(lookbookData.data || []);
      }

      console.log('✅ Dados administrativos carregados com sucesso');

    } catch (error) {
      console.error('❌ Erro ao buscar dados administrativos:', error);
      toast.error('Erro ao carregar dados administrativos');
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (orderId: string, newStatus: string, trackingCode?: string) => {
    try {
      const token = getCookie('auth_token');
      const apiUrl = typeof window !== 'undefined' ? 
        window.location.origin.includes('localhost') ? 'http://localhost:3000' : 'https://puca-api.vercel.app' :
        'http://localhost:3000';

      const response = await fetch(`${apiUrl}/api/orders/${orderId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          status: newStatus,
          trackingCode,
          note: `Status atualizado para ${newStatus} pelo administrador`
        })
      });

      if (response.ok) {
        toast.success('Status atualizado com sucesso');
        fetchAdminData(); // Recarregar dados
        setShowOrderModal(false);
      } else {
        toast.error('Erro ao atualizar status');
      }
    } catch (error) {
      console.error('Erro ao atualizar status:', error);
      toast.error('Erro ao atualizar status');
    }
  };

  const generateLabel = async (orderId: string) => {
    try {
      const token = getCookie('auth_token');
      const apiUrl = typeof window !== 'undefined' ? 
        window.location.origin.includes('localhost') ? 'http://localhost:3000' : 'https://puca-api.vercel.app' :
        'http://localhost:3000';

      const response = await fetch(`${apiUrl}/api/orders/${orderId}/generate-label`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const result = await response.json();
        toast.success(`Etiqueta gerada! Código: ${result.data.trackingCode}`);
        fetchAdminData(); // Recarregar dados
      } else {
        toast.error('Erro ao gerar etiqueta');
      }
    } catch (error) {
      console.error('Erro ao gerar etiqueta:', error);
      toast.error('Erro ao gerar etiqueta');
    }
  };

  const changeUserRole = async (userId: string, newRole: string) => {
    try {
      const token = getCookie('auth_token');
      const apiUrl = typeof window !== 'undefined' ? 
        window.location.origin.includes('localhost') ? 'http://localhost:3000' : 'https://puca-api.vercel.app' :
        'http://localhost:3000';

      const response = await fetch(`${apiUrl}/api/auth/admin/users/${userId}/role`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ role: newRole })
      });

      if (response.ok) {
        const result = await response.json();
        toast.success(`Role alterado para ${newRole === 'admin' ? 'Administrador' : 'Cliente'} com sucesso`);
        fetchAdminData(); // Recarregar dados
      } else {
        const errorResult = await response.json();
        toast.error(errorResult.message || 'Erro ao alterar role');
      }
    } catch (error) {
      console.error('Erro ao alterar role:', error);
      toast.error('Erro ao alterar role');
    }
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
      id: 'dashboard', 
      label: 'Dashboard', 
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      )
    },
    { 
      id: 'orders', 
      label: 'Pedidos', 
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
        </svg>
      )
    },
    { 
      id: 'products', 
      label: 'Produtos', 
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 011-2h1m-1 4h16" />
        </svg>
      )
    },
    { 
      id: 'lookbook', 
      label: 'Lookbook', 
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      )
    },
    { 
      id: 'users', 
      label: 'Usuários', 
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
        </svg>
      )
    },
    { 
      id: 'analytics', 
      label: 'Analytics', 
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 8v8m-4-5v5m-4-2v2m-2 4h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      )
    }
  ];

  // ===== Handlers de Produtos =====
  const handleViewProduct = (id: string) => {
    router.push(`/product/${id}`);
  };

  const handleEditProduct = (id: string) => {
    const prod = products.find(p => p._id === id) || null;
    setEditingProduct(prod);
    setProductModalOpen(true);
  };

  const handleNewProduct = () => {
    setEditingProduct(null);
    setProductModalOpen(true);
  };

  const handleDeleteProduct = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir este produto? Esta ação é irreversível.')) return;

    // Remoção otimista na interface
    setProducts((prev) => prev.filter((p) => p._id !== id));

    try {
      await productService.deleteProduct(id);
      toast.success('Produto excluído com sucesso');
      fetchAdminData();
    } catch (error: any) {
      console.error('Erro ao excluir produto:', error);
      toast.error(error.message || 'Erro ao excluir produto');
      // Reverter em caso de erro
      fetchAdminData();
    }
  };

  const handleProductModalSaved = () => {
    setProductModalOpen(false);
    fetchAdminData();
  };

  const handleDeleteLookbookPhoto = async (photoId: string) => {
    if (!confirm('Remover esta foto do lookbook?')) return;
    try {
      await lookbookService.deletePhoto(photoId);
      setLookbookPhotos(prev => prev.filter(p => p._id !== photoId));
      toast.success('Foto removida');
    } catch (error: any) {
      console.error('Erro ao remover foto:', error);
      toast.error(error.message || 'Erro ao remover foto');
    }
  };

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
        <div className="max-w-7xl mx-auto px-4">
          
          {/* Admin Header */}
          <motion.div
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="mb-8"
          >
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Painel Administrativo
            </h1>
            <p className="text-gray-600">
              Gerencie pedidos, produtos e visualize estatísticas de vendas
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
                {/* Dashboard Tab */}
                {activeTab === 'dashboard' && (
                  <motion.div
                    key="dashboard"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="space-y-6"
                  >
                    {/* Stats Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                      <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-6 rounded-lg text-white">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-blue-100">Total de Pedidos</p>
                            <p className="text-3xl font-bold">{stats?.totalOrders || 0}</p>
                          </div>
                          <div className="text-4xl opacity-80">📦</div>
                        </div>
                      </div>
                      
                      <div className="bg-gradient-to-br from-green-500 to-green-600 p-6 rounded-lg text-white">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-green-100">Receita Total</p>
                            <p className="text-3xl font-bold">R$ {stats?.totalRevenue?.toFixed(2) || '0.00'}</p>
                          </div>
                          <div className="text-4xl opacity-80">💰</div>
                        </div>
                      </div>
                      
                      <div className="bg-gradient-to-br from-purple-500 to-purple-600 p-6 rounded-lg text-white">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-purple-100">Pedidos (30 dias)</p>
                            <p className="text-3xl font-bold">{stats?.recentOrders || 0}</p>
                          </div>
                          <div className="text-4xl opacity-80">📈</div>
                        </div>
                      </div>
                      
                      <div className="bg-gradient-to-br from-orange-500 to-orange-600 p-6 rounded-lg text-white">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-orange-100">Receita (30 dias)</p>
                            <p className="text-3xl font-bold">R$ {stats?.recentRevenue?.toFixed(2) || '0.00'}</p>
                          </div>
                          <div className="text-4xl opacity-80">💸</div>
                        </div>
                      </div>
                    </div>

                    {/* Orders by Status */}
                    <div className="bg-white rounded-lg shadow-sm p-6">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">Pedidos por Status</h3>
                      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                        {stats?.ordersByStatus?.map((statusData) => (
                          <div key={statusData._id} className="text-center">
                            <div className={`px-3 py-2 rounded-full text-sm font-medium ${getStatusColor(statusData._id)}`}>
                              {getStatusText(statusData._id)}
                            </div>
                            <p className="text-2xl font-bold text-gray-900 mt-2">{statusData.count}</p>
                            <p className="text-sm text-gray-600">R$ {statusData.totalValue?.toFixed(2)}</p>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Top Products */}
                    <div className="bg-white rounded-lg shadow-sm p-6">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">Produtos Mais Vendidos</h3>
                      <div className="space-y-3">
                        {stats?.topProducts?.map((product, index) => (
                          <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                            <div>
                              <p className="font-medium text-gray-900">{product._id}</p>
                              <p className="text-sm text-gray-600">{product.totalSold} unidades vendidas</p>
                            </div>
                            <div className="text-right">
                              <p className="font-semibold text-gray-900">R$ {product.revenue?.toFixed(2)}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}

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
                      <h2 className="text-xl font-semibold text-gray-900">Gerenciar Pedidos</h2>
                      <p className="text-gray-600 mt-1">
                        Visualize e gerencie todos os pedidos da loja
                      </p>
                    </div>

                    <div className="p-6">
                      <div className="overflow-x-auto">
                        <table className="min-w-full">
                          <thead>
                            <tr className="border-b">
                              <th className="text-left py-3 px-2">Pedido</th>
                              <th className="text-left py-3 px-2">Cliente</th>
                              <th className="text-left py-3 px-2">Status</th>
                              <th className="text-left py-3 px-2">Total</th>
                              <th className="text-left py-3 px-2">Data</th>
                              <th className="text-left py-3 px-2">Ações</th>
                            </tr>
                          </thead>
                          <tbody>
                            {orders.map((order) => (
                              <tr key={order._id} className="border-b hover:bg-gray-50">
                                <td className="py-3 px-2">
                                  <div className="font-medium text-gray-900">#{order.orderNumber}</div>
                                  <div className="text-sm text-gray-500">{order.items.length} item(s)</div>
                                </td>
                                <td className="py-3 px-2">
                                  <div className="text-gray-900">{order.user.email}</div>
                                </td>
                                <td className="py-3 px-2">
                                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                                    {getStatusText(order.status)}
                                  </span>
                                </td>
                                <td className="py-3 px-2">
                                  <div className="font-medium text-gray-900">R$ {order.total.toFixed(2)}</div>
                                </td>
                                <td className="py-3 px-2">
                                  <div className="text-gray-600">
                                    {new Date(order.createdAt).toLocaleDateString('pt-BR')}
                                  </div>
                                </td>
                                <td className="py-3 px-2">
                                  <div className="flex space-x-2">
                                    <button
                                      onClick={() => {
                                        setSelectedOrder(order);
                                        setShowOrderModal(true);
                                      }}
                                      className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                                    >
                                      Gerenciar
                                    </button>
                                    {(order.status === 'confirmed' || order.status === 'processing') && !order.shipping?.trackingCode && (
                                      <button
                                        onClick={() => generateLabel(order._id)}
                                        className="text-green-600 hover:text-green-800 text-sm font-medium"
                                      >
                                        Gerar Etiqueta
                                      </button>
                                    )}
                                  </div>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* Lookbook Tab */}
                {activeTab === 'lookbook' && (
                  <motion.div
                    key="lookbook"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="bg-white rounded-lg shadow-sm"
                  >
                    <div className="p-6 border-b">
                      <div className="flex justify-between items-center">
                        <h2 className="text-xl font-semibold text-gray-900">Gerenciar Lookbook</h2>
                        <button className="bg-black text-white px-4 py-2 rounded-md hover:bg-gray-800 transition">
                          <svg className="w-4 h-4 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                          </svg>
                          Adicionar Foto
                        </button>
                      </div>
                    </div>
                    
                    <div className="p-6">
                      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {lookbookPhotos.length === 0 && (
                          <p className="text-gray-500 col-span-full">Nenhuma foto encontrada.</p>
                        )}

                        {lookbookPhotos.map((photo) => (
                          <div key={photo._id} className="relative group">
                            <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
                              <Image
                                src={photo.url}
                                alt={photo.description || 'Lookbook'}
                                fill
                                className="object-cover"
                                sizes="200px"
                              />
                            </div>

                            {/* Overlay com ações */}
                            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                              <button className="text-white mx-1 hover:text-gray-300" onClick={() => window.open(photo.url, '_blank')}>
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.477 0 8.268 2.943 9.542 7-.6 1.963-1.765 3.73-3.342 5.008M15 12h.01" />
                                </svg>
                              </button>
                              <button className="text-white mx-1 hover:text-gray-300" onClick={() => handleDeleteLookbookPhoto(photo._id)}>
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* Products Tab */}
                {activeTab === 'products' && (
                  <motion.div
                    key="products"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="bg-white rounded-lg shadow-sm"
                  >
                    <div className="p-6 border-b">
                      <div className="flex justify-between items-center">
                        <h2 className="text-xl font-semibold text-gray-900">Gerenciar Produtos</h2>
                        <div className="flex space-x-3">
                          <button className="bg-gray-100 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-200 transition">
                            <svg className="w-4 h-4 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.414A1 1 0 013 6.707V4z" />
                            </svg>
                            Filtros
                          </button>
                          <button onClick={handleNewProduct} className="bg-black text-white px-4 py-2 rounded-md hover:bg-gray-800 transition">
                            <svg className="w-4 h-4 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                            </svg>
                            Novo Produto
                          </button>
                        </div>
                      </div>
                    </div>
                    
                    <div className="p-6">
                      <div className="overflow-x-auto">
                        <table className="min-w-full">
                          <thead>
                            <tr className="border-b">
                              <th className="text-left py-3 px-2">Produto</th>
                              <th className="text-left py-3 px-2">Categoria</th>
                              <th className="text-left py-3 px-2">Preço</th>
                              <th className="text-left py-3 px-2">Estoque</th>
                              <th className="text-left py-3 px-2">Status</th>
                              <th className="text-left py-3 px-2">Ações</th>
                            </tr>
                          </thead>
                          <tbody>
                            {products.map((product, index) => (
                              <tr key={product._id} className="border-b hover:bg-gray-50">
                                <td className="py-3 px-2">
                                  <div className="flex items-center space-x-3">
                                    <div className="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center">
                                      <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover rounded-lg" />
                                    </div>
                                    <div>
                                      <div className="font-medium text-gray-900">{product.name}</div>
                                      <div className="text-sm text-gray-500">{product.description}</div>
                                    </div>
                                  </div>
                                </td>
                                <td className="py-3 px-2">
                                  <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">
                                    {product.category}
                                  </span>
                                </td>
                                <td className="py-3 px-2">
                                  <div className="font-medium text-gray-900">R$ {product.price.toFixed(2)}</div>
                                </td>
                                <td className="py-3 px-2">
                                  <div className="flex flex-wrap gap-1">
                                    {product.stockBySize.map(size => (
                                      <span
                                        key={size.size}
                                        className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${size.stock > 0 ? 'bg-gray-100 text-gray-800' : 'bg-red-100 text-red-600'}`}
                                      >
                                        {size.size}: {size.stock}
                                      </span>
                                    ))}
                                  </div>
                                </td>
                                <td className="py-3 px-2">
                                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                    product.stockBySize.some(size => size.stock > 0)
                                      ? 'bg-green-50 text-green-600 border border-green-200'
                                      : 'bg-red-50 text-red-600 border border-red-200'
                                  }`}>
                                    {product.stockBySize.some(size => size.stock > 0) ? 'Em Estoque' : 'Sem Estoque'}
                                  </span>
                                </td>
                                <td className="py-3 px-2">
                                  <div className="flex space-x-2">
                                    <button onClick={() => handleEditProduct(product._id)} className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                                      Editar
                                    </button>
                                    <button onClick={() => handleViewProduct(product._id)} className="text-gray-600 hover:text-gray-800 text-sm font-medium">
                                      Ver
                                    </button>
                                    <button onClick={() => handleDeleteProduct(product._id)} className="text-red-600 hover:text-red-800 text-sm font-medium">
                                      Excluir
                                    </button>
                                  </div>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* Users Tab */}
                {activeTab === 'users' && (
                  <motion.div
                    key="users"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="bg-white rounded-lg shadow-sm"
                  >
                    <div className="p-6 border-b">
                      <div className="flex justify-between items-center">
                        <h2 className="text-xl font-semibold text-gray-900">Gerenciar Usuários</h2>
                        <div className="flex space-x-3">
                          <button className="bg-gray-100 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-200 transition">
                            Exportar Lista
                          </button>
                          <button className="bg-black text-white px-4 py-2 rounded-md hover:bg-gray-800 transition">
                            Convidar Admin
                          </button>
                        </div>
                      </div>
                    </div>
                    
                    <div className="p-6">
                      {loading ? (
                        <div className="flex justify-center py-8">
                          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black"></div>
                        </div>
                      ) : (
                        <div className="overflow-x-auto">
                          <table className="min-w-full">
                            <thead>
                              <tr className="border-b">
                                <th className="text-left py-3 px-2">Usuário</th>
                                <th className="text-left py-3 px-2">Role</th>
                                <th className="text-left py-3 px-2">Pedidos</th>
                                <th className="text-left py-3 px-2">Último Login</th>
                                <th className="text-left py-3 px-2">Status</th>
                                <th className="text-left py-3 px-2">Ações</th>
                              </tr>
                            </thead>
                            <tbody>
                              {users.map((userData, index) => (
                                <tr key={userData._id} className="border-b hover:bg-gray-50">
                                  <td className="py-3 px-2">
                                    <div className="flex items-center space-x-3">
                                      <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                                        <span className="text-sm font-medium text-gray-600">
                                          {userData.email.charAt(0).toUpperCase()}
                                        </span>
                                      </div>
                                      <div className="font-medium text-gray-900">{userData.email}</div>
                                    </div>
                                  </td>
                                  <td className="py-3 px-2">
                                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                      userData.role === 'admin' 
                                        ? 'bg-purple-50 text-purple-600 border border-purple-200'
                                        : 'bg-gray-50 text-gray-600 border border-gray-200'
                                    }`}>
                                      {userData.role === 'admin' ? 'Administrador' : 'Cliente'}
                                    </span>
                                  </td>
                                  <td className="py-3 px-2">
                                    <div className="font-medium text-gray-900">{userData.orderCount} pedidos</div>
                                  </td>
                                  <td className="py-3 px-2">
                                    <div className="text-gray-600">
                                      {userData.lastLogin 
                                        ? new Date(userData.lastLogin).toLocaleDateString('pt-BR')
                                        : 'Nunca'
                                      }
                                    </div>
                                  </td>
                                  <td className="py-3 px-2">
                                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                      userData.active
                                        ? 'bg-green-50 text-green-600 border border-green-200'
                                        : 'bg-red-50 text-red-600 border border-red-200'
                                    }`}>
                                      {userData.active ? 'Ativo' : 'Inativo'}
                                    </span>
                                  </td>
                                  <td className="py-3 px-2">
                                    <div className="flex space-x-2">
                                      <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                                        Ver Perfil
                                      </button>
                                      <button 
                                        onClick={() => changeUserRole(userData._id, userData.role === 'admin' ? 'user' : 'admin')}
                                        className="text-gray-600 hover:text-gray-800 text-sm font-medium"
                                      >
                                        Alterar Role
                                      </button>
                                    </div>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}

                {/* Analytics Tab */}
                {activeTab === 'analytics' && (
                  <motion.div
                    key="analytics"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="space-y-6"
                  >
                    {/* Métricas Avançadas */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="bg-white rounded-lg shadow-sm p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Conversão</h3>
                        <div className="text-3xl font-bold text-green-600 mb-2">2.8%</div>
                        <p className="text-sm text-gray-600">Taxa de conversão média</p>
                        <div className="mt-4 flex items-center text-green-600">
                          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 17l9.2-9.2M17 17V7H7" />
                          </svg>
                          <span className="text-sm">+0.3% este mês</span>
                        </div>
                      </div>

                      <div className="bg-white rounded-lg shadow-sm p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Ticket Médio</h3>
                        <div className="text-3xl font-bold text-blue-600 mb-2">R$ 156</div>
                        <p className="text-sm text-gray-600">Valor médio por pedido</p>
                        <div className="mt-4 flex items-center text-blue-600">
                          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 17l9.2-9.2M17 17V7H7" />
                          </svg>
                          <span className="text-sm">+R$ 12 este mês</span>
                        </div>
                      </div>

                      <div className="bg-white rounded-lg shadow-sm p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Retenção</h3>
                        <div className="text-3xl font-bold text-purple-600 mb-2">68%</div>
                        <p className="text-sm text-gray-600">Clientes que retornaram</p>
                        <div className="mt-4 flex items-center text-purple-600">
                          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 17l9.2-9.2M17 17V7H7" />
                          </svg>
                          <span className="text-sm">+5% este mês</span>
                        </div>
                      </div>
                    </div>

                    {/* Top Categorias */}
                    <div className="bg-white rounded-lg shadow-sm p-6">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">Categorias Mais Vendidas</h3>
                      <div className="space-y-4">
                        {[
                          { name: 'Camisetas', sales: 145, percentage: 35 },
                          { name: 'Moletons', sales: 98, percentage: 24 },
                          { name: 'Calças', sales: 87, percentage: 21 },
                          { name: 'Acessórios', sales: 42, percentage: 10 },
                          { name: 'Jaquetas', sales: 38, percentage: 10 }
                        ].map((category, index) => (
                          <div key={index} className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                              <div className="text-gray-900 font-medium">{category.name}</div>
                              <div className="text-sm text-gray-500">{category.sales} vendas</div>
                            </div>
                            <div className="flex items-center space-x-2">
                              <div className="w-24 bg-gray-200 rounded-full h-2">
                                <div 
                                  className="bg-black h-2 rounded-full" 
                                  style={{ width: `${category.percentage}%` }}
                                ></div>
                              </div>
                              <div className="text-sm text-gray-600 w-8">{category.percentage}%</div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </div>
        </div>
      </main>

      {/* Order Management Modal */}
      <AnimatePresence>
        {showOrderModal && selectedOrder && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
            onClick={() => setShowOrderModal(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-lg max-w-2xl w-full max-h-[80vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6 border-b">
                <h3 className="text-xl font-semibold text-gray-900">
                  Gerenciar Pedido #{selectedOrder.orderNumber}
                </h3>
              </div>
              
              <div className="p-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Status Atual: {getStatusText(selectedOrder.status)}
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {['confirmed', 'processing', 'shipped', 'delivered', 'cancelled'].map((status) => (
                        <button
                          key={status}
                          onClick={() => updateOrderStatus(selectedOrder._id, status)}
                          className={`px-4 py-2 rounded-md text-sm font-medium transition ${
                            selectedOrder.status === status
                              ? 'bg-black text-white'
                              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                          }`}
                        >
                          {getStatusText(status)}
                        </button>
                      ))}
                    </div>
                  </div>

                  {selectedOrder.status === 'shipped' && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Código de Rastreamento
                      </label>
                      <input
                        type="text"
                        placeholder="Digite o código de rastreamento"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black/25"
                        onKeyPress={(e) => {
                          if (e.key === 'Enter') {
                            const trackingCode = (e.target as HTMLInputElement).value;
                            if (trackingCode) {
                              updateOrderStatus(selectedOrder._id, 'shipped', trackingCode);
                            }
                          }
                        }}
                      />
                    </div>
                  )}
                </div>
              </div>

              <div className="p-6 border-t flex justify-end space-x-3">
                <button
                  onClick={() => setShowOrderModal(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition"
                >
                  Cancelar
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Product Modal */}
      <AdminProductModal
        open={productModalOpen}
        product={editingProduct}
        onClose={() => setProductModalOpen(false)}
        onSaved={handleProductModalSaved}
      />

      <Footer isHome={false} />
    </div>
  );
} 