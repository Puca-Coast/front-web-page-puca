"use client";

import React, { useState, useEffect, ChangeEvent, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/contexts/AuthContext';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { InputMask } from '@react-input/mask';
import '@/styles/shoppingCart.css';

// Componente do Checkout
const CheckoutPage: React.FC = () => {
  const { user, isLoading: authLoading } = useAuth();
  const { cartItems, getTotal, clearCart } = useCart();
  const router = useRouter();
  
  // Estados para gerenciar o formulário de checkout
  const [address, setAddress] = useState({
    cep: '',
    street: '',
    number: '',
    complement: '',
    neighborhood: '',
    city: '',
    state: '',
  });
  
  const [paymentMethod, setPaymentMethod] = useState('credit-card');
  const [couponCode, setCouponCode] = useState('');
  const [discount, setDiscount] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [shippingMethod, setShippingMethod] = useState('');
  const [shippingCost, setShippingCost] = useState(0);
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  // Redireciona se não estiver logado ou se o carrinho estiver vazio
  useEffect(() => {
    if (!authLoading && !user) {
      toast.error("É necessário estar logado para acessar o checkout");
      router.push('/login');
    } else if (cartItems.length === 0) {
      toast.error("Seu carrinho está vazio");
      router.push('/shop');
    }
  }, [user, authLoading, cartItems, router]);

  // Busca endereço pelo CEP usando a API ViaCEP
  const fetchAddressByCep = async (cep: string) => {
    if (cep.replace(/\D/g, '').length !== 8) return;
    
    setIsLoading(true);
    try {
      const formattedCep = cep.replace(/\D/g, '');
      const response = await fetch(`https://viacep.com.br/ws/${formattedCep}/json/`);
      const data = await response.json();
      
      if (!data.erro) {
        setAddress(prev => ({
          ...prev,
          cep,
          street: data.logradouro,
          neighborhood: data.bairro,
          city: data.localidade,
          state: data.uf,
        }));
        
        // Simulação de cálculo de frete baseado no CEP
        calculateShipping(formattedCep);
      } else {
        toast.error('CEP não encontrado');
      }
    } catch (error) {
      toast.error('Erro ao buscar CEP');
    } finally {
      setIsLoading(false);
    }
  };
  
  // Simulação de cálculo de frete
  const calculateShipping = (cep: string) => {
    // Simulação: diferentes regiões têm fretes diferentes
    const firstDigit = parseInt(cep[0]);
    
    // Limpa opções anteriores
    setShippingMethod('');
    
    // Opções de frete baseadas no "firstDigit" (simulação)
    if (firstDigit >= 0 && firstDigit <= 3) {
      setShippingCost(15.90);
    } else if (firstDigit >= 4 && firstDigit <= 6) {
      setShippingCost(18.90);
    } else {
      setShippingCost(22.90);
    }
    
    // Frete grátis para compras acima de R$ 300
    if (getTotal() > 300) {
      setShippingCost(0);
    }
  };
  
  // Manipuladores de eventos para formulário
  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setAddress(prev => ({ ...prev, [name]: value }));
    
    // Se for o CEP e tiver 8 dígitos, busca o endereço
    if (name === 'cep' && value.replace(/\D/g, '').length === 8) {
      fetchAddressByCep(value);
    }
  };
  
  const applyCoupon = () => {
    // Simulação de aplicação de cupom
    if (!couponCode) {
      toast.error('Digite um código de cupom');
      return;
    }
    
    // Simulação de cupons
    const coupons: Record<string, number> = {
      'WELCOME10': 10,
      'SUMMER20': 20,
      'BLACKFRIDAY': 30
    };
    
    if (coupons[couponCode]) {
      const discountAmount = (getTotal() * coupons[couponCode]) / 100;
      setDiscount(discountAmount);
      toast.success(`Cupom aplicado: ${coupons[couponCode]}% de desconto`);
    } else {
      toast.error('Cupom inválido ou expirado');
    }
  };
  
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    // Validação do formulário
    if (!shippingMethod) {
      toast.error('Selecione um método de entrega');
      return;
    }
    
    if (!paymentMethod) {
      toast.error('Selecione um método de pagamento');
      return;
    }
    
    // Simulação do processamento do pagamento
    setIsProcessing(true);
    
    // Simulando um delay de processamento
    setTimeout(() => {
      toast.success('Pedido realizado com sucesso!');
      clearCart();
      router.push('/order-confirmation');
    }, 2000);
  };
  
  const nextStep = () => {
    if (currentStep === 1 && (!address.cep || !address.street || !address.number || !address.city)) {
      toast.error('Preencha todos os campos de endereço obrigatórios');
      return;
    }
    
    if (currentStep === 2 && !shippingMethod) {
      toast.error('Selecione um método de entrega');
      return;
    }
    
    setCurrentStep(prev => prev + 1);
  };
  
  const prevStep = () => {
    setCurrentStep(prev => prev - 1);
  };
  
  // Calculando valores
  const subtotal = getTotal();
  const total = subtotal + shippingCost - discount;

  // Se estiver carregando ou não tiver usuário ou produtos, mostra mensagem
  if (authLoading || !user || cartItems.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-center">
          <div className="mb-4">
            <svg className="w-16 h-16 mx-auto text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
          </div>
          <p className="text-xl font-medium text-gray-600">Carregando...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="checkout-container">
      <Header isHome={false} />
      
      <main className="checkout-main">
        <h1 className="checkout-heading">Finalizar Compra</h1>
        
        {/* Breadcrumbs */}
        <nav className="mb-8">
          <ol className="flex items-center space-x-2 text-sm">
            <li><a href="/" className="text-gray-500 hover:underline">Home</a></li>
            <li className="text-gray-400">/</li>
            <li><a href="/shop" className="text-gray-500 hover:underline">Loja</a></li>
            <li className="text-gray-400">/</li>
            <li className="text-black font-medium">Checkout</li>
          </ol>
        </nav>
        
        {/* Indicador de progresso */}
        <div className="checkout-progress">
          <div className="step-container">
            <div className={`step ${currentStep >= 1 ? 'text-black' : 'text-gray-400'}`}>
              <div className={`step-bubble ${currentStep >= 1 ? 'bg-black text-white' : 'bg-gray-200'}`}>1</div>
              <span className="step-label">Endereço</span>
            </div>
            <div className={`step ${currentStep >= 2 ? 'text-black' : 'text-gray-400'}`}>
              <div className={`step-bubble ${currentStep >= 2 ? 'bg-black text-white' : 'bg-gray-200'}`}>2</div>
              <span className="step-label">Entrega</span>
            </div>
            <div className={`step ${currentStep >= 3 ? 'text-black' : 'text-gray-400'}`}>
              <div className={`step-bubble ${currentStep >= 3 ? 'bg-black text-white' : 'bg-gray-200'}`}>3</div>
              <span className="step-label">Pagamento</span>
            </div>
          </div>
          <div className="progress-bar">
            <div 
              className="progress-indicator" 
              style={{ width: `${((currentStep - 1) / 2) * 100}%` }}
            />
          </div>
        </div>
        
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Formulário de checkout */}
          <div className="lg:w-2/3 order-2 lg:order-1">
            <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-sm p-6">
              {/* Etapa 1: Endereço */}
              {currentStep === 1 && (
                <div>
                  <h2 className="text-xl font-semibold mb-4">Endereço de entrega</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="md:col-span-1">
                      <label className="block text-sm font-medium text-gray-700 mb-1">CEP</label>
                      <InputMask
                        mask="99999-999"
                        replacement={{ '9': /\d/ }}
                        type="text"
                        name="cep"
                        value={address.cep}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black/25"
                        placeholder="00000-000"
                        required
                      />
                    </div>
                    
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Rua</label>
                      <input
                        type="text"
                        name="street"
                        value={address.street}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black/25"
                        placeholder="Nome da rua"
                        required
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Número</label>
                      <input
                        type="text"
                        name="number"
                        value={address.number}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black/25"
                        placeholder="123"
                        required
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Complemento</label>
                      <input
                        type="text"
                        name="complement"
                        value={address.complement}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black/25"
                        placeholder="Apto, Bloco, etc. (opcional)"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Bairro</label>
                      <input
                        type="text"
                        name="neighborhood"
                        value={address.neighborhood}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black/25"
                        placeholder="Nome do bairro"
                        required
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Cidade</label>
                      <input
                        type="text"
                        name="city"
                        value={address.city}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black/25"
                        placeholder="Nome da cidade"
                        required
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Estado</label>
                      <input
                        type="text"
                        name="state"
                        value={address.state}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black/25"
                        placeholder="UF"
                        required
                      />
                    </div>
                  </div>
                </div>
              )}
              
              {/* Etapa 2: Opções de entrega */}
              {currentStep === 2 && (
                <div>
                  <h2 className="text-xl font-semibold mb-4">Opções de entrega</h2>
                  {isLoading ? (
                    <div className="flex justify-center items-center h-32">
                      <div className="animate-spin h-8 w-8 border-4 border-gray-300 border-t-black rounded-full"></div>
                    </div>
                  ) : shippingCost > 0 ? (
                    <div className="space-y-3">
                      <div 
                        className={`border p-4 rounded-md flex items-center cursor-pointer transition ${shippingMethod === 'standard' ? 'border-black bg-gray-50' : 'hover:bg-gray-50'}`}
                        onClick={() => setShippingMethod('standard')}
                      >
                        <div className="w-6 h-6 rounded-full border mr-3 flex items-center justify-center">
                          {shippingMethod === 'standard' && <div className="w-3 h-3 bg-black rounded-full"></div>}
                        </div>
                        <div className="flex-1">
                          <h3 className="font-medium">Entrega padrão</h3>
                          <p className="text-sm text-gray-500">5-7 dias úteis</p>
                        </div>
                        <div className="font-medium">R$ {shippingCost.toFixed(2)}</div>
                      </div>
                      
                      <div 
                        className={`border p-4 rounded-md flex items-center cursor-pointer transition ${shippingMethod === 'express' ? 'border-black bg-gray-50' : 'hover:bg-gray-50'}`}
                        onClick={() => setShippingMethod('express')}
                      >
                        <div className="w-6 h-6 rounded-full border mr-3 flex items-center justify-center">
                          {shippingMethod === 'express' && <div className="w-3 h-3 bg-black rounded-full"></div>}
                        </div>
                        <div className="flex-1">
                          <h3 className="font-medium">Entrega expressa</h3>
                          <p className="text-sm text-gray-500">2-3 dias úteis</p>
                        </div>
                        <div className="font-medium">R$ {(shippingCost * 1.5).toFixed(2)}</div>
                      </div>
                    </div>
                  ) : (
                    <div 
                      className={`border p-4 rounded-md flex items-center cursor-pointer transition ${shippingMethod === 'free' ? 'border-black bg-gray-50' : 'hover:bg-gray-50'}`}
                      onClick={() => setShippingMethod('free')}
                    >
                      <div className="w-6 h-6 rounded-full border mr-3 flex items-center justify-center">
                        {shippingMethod === 'free' && <div className="w-3 h-3 bg-black rounded-full"></div>}
                      </div>
                      <div className="flex-1">
                        <h3 className="font-medium">Frete grátis</h3>
                        <p className="text-sm text-gray-500">7-10 dias úteis</p>
                      </div>
                      <div className="font-medium text-green-600">R$ 0,00</div>
                    </div>
                  )}
                </div>
              )}
              
              {/* Etapa 3: Pagamento */}
              {currentStep === 3 && (
                <div>
                  <h2 className="text-xl font-semibold mb-4">Método de pagamento</h2>
                  <div className="space-y-3 mb-6">
                    <div 
                      className={`border p-4 rounded-md flex items-center cursor-pointer transition ${paymentMethod === 'credit-card' ? 'border-black bg-gray-50' : 'hover:bg-gray-50'}`}
                      onClick={() => setPaymentMethod('credit-card')}
                    >
                      <div className="w-6 h-6 rounded-full border mr-3 flex items-center justify-center">
                        {paymentMethod === 'credit-card' && <div className="w-3 h-3 bg-black rounded-full"></div>}
                      </div>
                      <div className="flex-1">
                        <h3 className="font-medium">Cartão de crédito</h3>
                      </div>
                      <div className="flex space-x-1">
                        <div className="w-8 h-5 bg-gray-200 rounded"></div>
                        <div className="w-8 h-5 bg-gray-200 rounded"></div>
                        <div className="w-8 h-5 bg-gray-200 rounded"></div>
                      </div>
                    </div>
                    
                    <div 
                      className={`border p-4 rounded-md flex items-center cursor-pointer transition ${paymentMethod === 'pix' ? 'border-black bg-gray-50' : 'hover:bg-gray-50'}`}
                      onClick={() => setPaymentMethod('pix')}
                    >
                      <div className="w-6 h-6 rounded-full border mr-3 flex items-center justify-center">
                        {paymentMethod === 'pix' && <div className="w-3 h-3 bg-black rounded-full"></div>}
                      </div>
                      <div className="flex-1">
                        <h3 className="font-medium">PIX</h3>
                        <p className="text-sm text-gray-500">Pagamento instantâneo</p>
                      </div>
                      <div className="w-8 h-8 bg-gray-200 rounded flex items-center justify-center text-xs">PIX</div>
                    </div>
                    
                    <div 
                      className={`border p-4 rounded-md flex items-center cursor-pointer transition ${paymentMethod === 'boleto' ? 'border-black bg-gray-50' : 'hover:bg-gray-50'}`}
                      onClick={() => setPaymentMethod('boleto')}
                    >
                      <div className="w-6 h-6 rounded-full border mr-3 flex items-center justify-center">
                        {paymentMethod === 'boleto' && <div className="w-3 h-3 bg-black rounded-full"></div>}
                      </div>
                      <div className="flex-1">
                        <h3 className="font-medium">Boleto bancário</h3>
                        <p className="text-sm text-gray-500">Prazo de 1-3 dias úteis</p>
                      </div>
                      <div className="h-5 w-10 bg-gray-200 rounded"></div>
                    </div>
                  </div>
                  
                  {/* Botão de finalizar pedido */}
                  <button 
                    type="submit"
                    disabled={isProcessing}
                    className="w-full py-3 px-4 bg-black text-white font-medium rounded-md hover:bg-gray-800 transition focus:outline-none focus:ring-2 focus:ring-black/50 focus:ring-offset-2 disabled:opacity-70 disabled:cursor-not-allowed"
                  >
                    {isProcessing ? (
                      <div className="flex items-center justify-center">
                        <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full mr-2"></div>
                        Processando...
                      </div>
                    ) : (
                      'Finalizar pedido'
                    )}
                  </button>
                </div>
              )}
              
              {/* Navegação entre etapas */}
              <div className="mt-6 flex justify-between">
                {currentStep > 1 && (
                  <button 
                    type="button"
                    onClick={prevStep}
                    className="px-6 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
                  >
                    Voltar
                  </button>
                )}
                
                {currentStep < 3 && (
                  <button 
                    type="button"
                    onClick={nextStep}
                    className={`px-6 py-2 bg-black text-white rounded-md hover:bg-gray-800 transition ${currentStep === 1 ? 'ml-auto' : ''}`}
                  >
                    Continuar
                  </button>
                )}
              </div>
            </form>
          </div>
          
          {/* Resumo do pedido */}
          <div className="lg:w-1/3 order-1 lg:order-2">
            <div className="bg-white rounded-lg shadow-sm p-6 sticky top-6">
              <h2 className="text-xl font-semibold mb-4">Resumo do pedido</h2>
              
              {/* Lista de produtos */}
              <div className="max-h-64 overflow-y-auto mb-4">
                {cartItems.map(item => (
                  <div key={`${item.id}-${item.size}`} className="flex py-3 border-b">
                    <div className="relative w-16 h-16 flex-shrink-0 bg-gray-50 rounded-md overflow-hidden">
                      <Image
                        src={item.imageUrl}
                        alt={item.name}
                        fill
                        className="object-cover"
                        sizes="64px"
                      />
                    </div>
                    <div className="ml-3 flex-1">
                      <h3 className="text-sm font-medium line-clamp-1">{item.name}</h3>
                      <p className="text-xs text-gray-500">Tamanho: {item.size}</p>
                      <div className="flex justify-between text-sm mt-1">
                        <span>Qtd: {item.quantity}</span>
                        <span className="font-medium">R$ {(item.price * item.quantity).toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              {/* Cupom */}
              <div className="mb-6">
                <h3 className="text-sm font-medium mb-2">Cupom de desconto</h3>
                <div className="flex">
                  <input
                    type="text"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                    placeholder="Digite seu cupom"
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-black/25"
                  />
                  <button
                    type="button"
                    onClick={applyCoupon}
                    className="bg-gray-900 text-white px-4 py-2 rounded-r-md hover:bg-gray-700 transition"
                  >
                    Aplicar
                  </button>
                </div>
              </div>
              
              {/* Totais */}
              <div className="space-y-2 text-sm border-t pt-4">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal</span>
                  <span>R$ {subtotal.toFixed(2)}</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-600">Frete</span>
                  <span>
                    {shippingMethod ? (
                      shippingMethod === 'express' 
                        ? `R$ ${(shippingCost * 1.5).toFixed(2)}` 
                        : `R$ ${shippingCost.toFixed(2)}`
                    ) : (
                      <span className="text-gray-500 italic">Calcular</span>
                    )}
                  </span>
                </div>
                
                {discount > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>Desconto</span>
                    <span>-R$ {discount.toFixed(2)}</span>
                  </div>
                )}
                
                <div className="flex justify-between text-base font-semibold pt-2 border-t">
                  <span>Total</span>
                  <span>R$ {(total + (shippingMethod === 'express' ? shippingCost * 0.5 : 0)).toFixed(2)}</span>
                </div>
              </div>
              
              {/* Políticas e segurança */}
              <div className="mt-6 text-xs text-gray-500 space-y-1">
                <p>Entrega garantida em todo o Brasil</p>
                <p>Pagamento 100% seguro</p>
                <div className="flex space-x-2 mt-2">
                  <div className="w-8 h-5 bg-gray-200 rounded"></div>
                  <div className="w-8 h-5 bg-gray-200 rounded"></div>
                  <div className="w-8 h-5 bg-gray-200 rounded"></div>
                  <div className="w-8 h-5 bg-gray-200 rounded"></div>
                </div>
                <p className="flex items-center gap-1 mt-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                  Ambiente seguro
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <Footer isHome={false} />
      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
};

export default CheckoutPage; 