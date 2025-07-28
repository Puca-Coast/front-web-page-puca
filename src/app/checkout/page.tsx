"use client";

import React, { useState, useEffect, ChangeEvent } from 'react';
import { useRouter } from 'next/navigation';
import { PageLayout } from '@/layouts';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/contexts/AuthContext';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Image from 'next/image';
import Link from 'next/link';
import '@/styles/shoppingCart.css';

// Mercado Pago types
declare global {
  interface Window {
    MercadoPago: any;
  }
}

interface ShippingOption {
  id: number;
  name: string;
  company: {
    name: string;
    picture: string;
  };
  price: number;
  delivery_time: {
    days: number;
  };
}

const CheckoutPage: React.FC = () => {
  const { user, isLoading: authLoading } = useAuth() as any;
  const { cartItems, getTotal, clearCart } = useCart() as any;
  const router = useRouter();
  
  // Estados
  const [address, setAddress] = useState({
    cep: '',
    street: '',
    number: '',
    complement: '',
    neighborhood: '',
    city: '',
    state: '',
  });
  
  const [paymentMethod, setPaymentMethod] = useState('mercadopago');
  const [couponCode, setCouponCode] = useState('');
  const [discount, setDiscount] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [shippingMethod, setShippingMethod] = useState('');
  const [shippingCost, setShippingCost] = useState(0);
  const [currentStep, setCurrentStep] = useState(1);
  const [shippingOptions, setShippingOptions] = useState<ShippingOption[]>([]);
  const [calculatingShipping, setCalculatingShipping] = useState(false);
  const [shippingCalculated, setShippingCalculated] = useState(false);
  const [mercadoPago, setMercadoPago] = useState<any>(null);

  // Initialize Mercado Pago
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://sdk.mercadopago.com/js/v2';
    script.async = true;
    script.onload = () => {
      const mp = new window.MercadoPago(process.env.NEXT_PUBLIC_MERCADOPAGO_PUBLIC_KEY!, {
        locale: 'pt-BR'
      });
      setMercadoPago(mp);
    };
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  // Redirect if not logged in or empty cart
  useEffect(() => {
    if (!authLoading && !user) {
      toast.error("É necessário estar logado para acessar o checkout");
      router.push('/login?redirectTo=/checkout');
    } else if (cartItems.length === 0 && !authLoading) {
      toast.error("Seu carrinho está vazio");
      router.push('/shop');
    }
  }, [user, authLoading, cartItems, router]);

  // Calculate shipping with Melhor Envio
  const calculateShipping = async (cep: string) => {
    if (cep.length !== 9) return;
    
    setCalculatingShipping(true);
    
    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch('/api/shipping/calculate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          from: { postal_code: process.env.NEXT_PUBLIC_ORIGIN_CEP },
          to: { postal_code: cep.replace(/\D/g, '') },
          products: cartItems.map((item: any) => ({
            id: item.id,
            width: 15,
            height: 20,
            length: 10,
            weight: 0.3,
            insurance_value: item.price,
            quantity: item.quantity
          }))
        })
      });

      if (response.ok) {
        const data = await response.json();
        setShippingOptions(data.options);
        setShippingCalculated(true);
        
        // Auto-select cheapest option
        if (data.options.length > 0) {
          const cheapest = data.options.reduce((prev: ShippingOption, curr: ShippingOption) => 
            prev.price < curr.price ? prev : curr
          );
          setShippingMethod(cheapest.id.toString());
          setShippingCost(cheapest.price);
        }
      } else {
        toast.error('Erro ao calcular frete');
      }
    } catch (error) {
      console.error('Erro ao calcular frete:', error);
      toast.error('Erro ao calcular frete');
    } finally {
      setCalculatingShipping(false);
    }
  };

  // Fetch address by CEP
  const fetchAddressByCep = async (cep: string) => {
    try {
      const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
      const data = await response.json();
      
      if (data.erro) {
        toast.error('CEP não encontrado');
        return;
      }
      
      setAddress(prev => ({
        ...prev,
        street: data.logradouro || '',
        neighborhood: data.bairro || '',
        city: data.localidade || '',
        state: data.uf || ''
      }));
      
      calculateShipping(cep);
    } catch (error) {
      console.error('Erro ao buscar CEP:', error);
      toast.error('Erro ao buscar CEP');
    }
  };

  // Handle input changes
  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setAddress(prev => ({ ...prev, [name]: value }));
    
    if (name === 'cep' && value.replace(/\D/g, '').length === 8) {
      fetchAddressByCep(value.replace(/\D/g, ''));
    }
  };

  // Apply coupon
  const applyCoupon = async () => {
    if (!couponCode) {
      toast.error('Digite um código de cupom');
      return;
    }
    
    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch('/api/coupons/validate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ code: couponCode })
      });

      const data = await response.json();
      
      if (data.valid) {
        const discountAmount = (getTotal() * data.discount) / 100;
        setDiscount(discountAmount);
        toast.success(`Cupom aplicado: ${data.discount}% de desconto`);
      } else {
        toast.error('Cupom inválido ou expirado');
      }
    } catch (error) {
      toast.error('Erro ao validar cupom');
    }
  };

  // Create Mercado Pago preference
  const createMercadoPagoPreference = async () => {
    try {
      const token = localStorage.getItem('authToken');
      const selectedShipping = shippingOptions.find(opt => opt.id.toString() === shippingMethod);
      
      const response = await fetch('/api/payments/create-preference', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          items: cartItems.map((item: any) => ({
            id: item.id,
            title: item.name,
            quantity: item.quantity,
            unit_price: item.price,
            currency_id: 'BRL'
          })),
          payer: {
            email: user.email,
            name: user.name
          },
          shipments: {
            cost: selectedShipping?.price || 0,
            mode: 'not_specified'
          },
          back_urls: {
            success: `${window.location.origin}/order-confirmation`,
            failure: `${window.location.origin}/checkout`,
            pending: `${window.location.origin}/order-confirmation`
          },
          auto_return: 'approved',
          shipping_address: address,
          metadata: {
            shipping_method: shippingMethod,
            shipping_company: selectedShipping?.company.name,
            discount: discount,
            coupon: couponCode || null
          }
        })
      });

      const data = await response.json();
      return data.preference;
    } catch (error) {
      console.error('Erro ao criar preferência:', error);
      throw error;
    }
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!shippingMethod) {
      toast.error('Selecione um método de entrega');
      return;
    }
    
    setIsProcessing(true);
    
    try {
      if (paymentMethod === 'mercadopago') {
        // Create preference and redirect to Mercado Pago
        const preference = await createMercadoPagoPreference();
        
        // Save order data in localStorage for confirmation page
        localStorage.setItem('pendingOrder', JSON.stringify({
          items: cartItems,
          shipping: shippingOptions.find(opt => opt.id.toString() === shippingMethod),
          address,
          total: getTotal() + shippingCost - discount
        }));

        // Redirect to Mercado Pago checkout
        window.location.href = preference.init_point;
      } else {
        // Handle other payment methods
        toast.error('Método de pagamento não disponível');
        setIsProcessing(false);
      }
    } catch (error) {
      console.error('Erro ao processar pagamento:', error);
      toast.error('Erro ao processar pagamento. Tente novamente.');
      setIsProcessing(false);
    }
  };

  // Navigation
  const nextStep = () => {
    if (currentStep === 1 && (!address.cep || !address.street || !address.number || !address.city)) {
      toast.error('Preencha todos os campos obrigatórios');
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

  // Calculate totals
  const subtotal = getTotal();
  const selectedShipping = shippingOptions.find(opt => opt.id.toString() === shippingMethod);
  const total = subtotal + (selectedShipping?.price || 0) - discount;

  if (authLoading || !user || cartItems.length === 0) {
    return (
      <PageLayout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-pulse text-center">
            <p className="text-xl font-medium text-gray-600">Carregando...</p>
          </div>
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout>
      <main className="min-h-screen pb-16 pt-8">
        <div className="max-w-6xl mx-auto px-4">
          <h1 className="text-3xl font-bold mb-8">Finalizar Compra</h1>
          
          {/* Breadcrumbs */}
          <nav className="mb-8">
            <ol className="flex items-center space-x-2 text-sm">
              <li><Link href="/" className="text-gray-500 hover:text-gray-700">Home</Link></li>
              <li className="text-gray-400">/</li>
              <li><Link href="/shop" className="text-gray-500 hover:text-gray-700">Loja</Link></li>
              <li className="text-gray-400">/</li>
              <li className="text-black font-medium">Checkout</li>
            </ol>
          </nav>
          
          {/* Progress indicator */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-2">
              <div className={`flex items-center ${currentStep >= 1 ? 'text-black' : 'text-gray-400'}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${currentStep >= 1 ? 'bg-black text-white' : 'bg-gray-200'}`}>1</div>
                <span className="ml-2">Endereço</span>
              </div>
              <div className={`flex items-center ${currentStep >= 2 ? 'text-black' : 'text-gray-400'}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${currentStep >= 2 ? 'bg-black text-white' : 'bg-gray-200'}`}>2</div>
                <span className="ml-2">Entrega</span>
              </div>
              <div className={`flex items-center ${currentStep >= 3 ? 'text-black' : 'text-gray-400'}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${currentStep >= 3 ? 'bg-black text-white' : 'bg-gray-200'}`}>3</div>
                <span className="ml-2">Pagamento</span>
              </div>
            </div>
            <div className="h-2 bg-gray-200 rounded-full">
              <div 
                className="h-full bg-black rounded-full transition-all duration-300"
                style={{ width: `${((currentStep - 1) / 2) * 100}%` }}
              />
            </div>
          </div>
          
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Form */}
            <div className="lg:w-2/3">
              <form onSubmit={(e: React.FormEvent<HTMLFormElement>) => handleSubmit(e)} className="bg-white rounded-lg shadow-lg p-6">
                {/* Step 1: Address */}
                {currentStep === 1 && (
                  <div>
                    <h2 className="text-xl font-semibold mb-4">Endereço de entrega</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">CEP</label>
                        <input
                          type="text"
                          name="cep"
                          value={address.cep}
                          onChange={handleInputChange}
                          onInput={(e) => {
                            let value = e.currentTarget.value.replace(/\D/g, '');
                            if (value.length > 5) {
                              value = value.slice(0, 5) + '-' + value.slice(5, 8);
                            }
                            e.currentTarget.value = value;
                          }}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                          placeholder="00000-000"
                          maxLength={9}
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
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
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
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
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
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                          placeholder="Opcional"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Bairro</label>
                        <input
                          type="text"
                          name="neighborhood"
                          value={address.neighborhood}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
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
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
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
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                          maxLength={2}
                          required
                        />
                      </div>
                    </div>
                  </div>
                )}
                
                {/* Step 2: Shipping */}
                {currentStep === 2 && (
                  <div>
                    <h2 className="text-xl font-semibold mb-4">Opções de entrega</h2>
                    {calculatingShipping ? (
                      <div className="flex justify-center items-center h-32">
                        <div className="animate-spin h-8 w-8 border-4 border-gray-300 border-t-black rounded-full"></div>
                      </div>
                    ) : shippingCalculated && shippingOptions.length > 0 ? (
                      <div className="space-y-3">
                        {shippingOptions.map(option => (
                          <label 
                            key={option.id}
                            className={`border p-4 rounded-lg flex items-center cursor-pointer transition-all ${
                              shippingMethod === option.id.toString() 
                                ? 'border-black bg-gray-50' 
                                : 'border-gray-300 hover:border-gray-400'
                            }`}
                          >
                            <input
                              type="radio"
                              name="shipping"
                              value={option.id}
                              checked={shippingMethod === option.id.toString()}
                              onChange={(e) => {
                                setShippingMethod(e.target.value);
                                setShippingCost(option.price);
                              }}
                              className="sr-only"
                            />
                            <div className="flex-1">
                              <div className="flex items-center gap-2">
                                <h3 className="font-medium">{option.name}</h3>
                                <span className="text-sm text-gray-500">({option.company.name})</span>
                              </div>
                              <p className="text-sm text-gray-600">
                                Entrega em {option.delivery_time.days} dias úteis
                              </p>
                            </div>
                            <div className="font-semibold">
                              R$ {option.price.toFixed(2)}
                            </div>
                          </label>
                        ))}
                      </div>
                    ) : (
                      <p className="text-gray-500 text-center py-8">
                        Informe o CEP para calcular o frete
                      </p>
                    )}
                  </div>
                )}
                
                {/* Step 3: Payment */}
                {currentStep === 3 && (
                  <div>
                    <h2 className="text-xl font-semibold mb-4">Método de pagamento</h2>
                    <div className="space-y-3">
                      <label 
                        className={`border p-4 rounded-lg flex items-center cursor-pointer transition-all ${
                          paymentMethod === 'mercadopago' 
                            ? 'border-black bg-gray-50' 
                            : 'border-gray-300 hover:border-gray-400'
                        }`}
                      >
                        <input
                          type="radio"
                          name="payment"
                          value="mercadopago"
                          checked={paymentMethod === 'mercadopago'}
                          onChange={(e) => setPaymentMethod(e.target.value)}
                          className="sr-only"
                        />
                        <div className="flex-1">
                          <h3 className="font-medium">Mercado Pago</h3>
                          <p className="text-sm text-gray-600">
                            Cartão de crédito, débito, PIX ou boleto
                          </p>
                        </div>
                        <img 
                          src="/assets/payments/mercadopago.svg" 
                          alt="Mercado Pago" 
                          className="h-8"
                        />
                      </label>
                    </div>
                    
                    <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                      <p className="text-sm text-blue-800">
                        <strong>Segurança:</strong> Você será redirecionado para o ambiente seguro do Mercado Pago para finalizar o pagamento.
                      </p>
                    </div>
                    
                    <button 
                      type="submit"
                      disabled={isProcessing}
                      className="w-full mt-6 py-3 px-4 bg-black text-white font-medium rounded-lg hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isProcessing ? (
                        <span className="flex items-center justify-center">
                          <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Processando...
                        </span>
                      ) : (
                        'Ir para o pagamento'
                      )}
                    </button>
                  </div>
                )}
                
                {/* Navigation */}
                <div className="mt-6 flex justify-between">
                  {currentStep > 1 && (
                    <button 
                      type="button"
                      onClick={prevStep}
                      className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      Voltar
                    </button>
                  )}
                  
                  {currentStep < 3 && (
                    <button 
                      type="button"
                      onClick={nextStep}
                      className={`px-6 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors ${
                        currentStep === 1 ? 'ml-auto' : ''
                      }`}
                    >
                      Continuar
                    </button>
                  )}
                </div>
              </form>
            </div>
            
            {/* Order summary */}
            <div className="lg:w-1/3">
              <div className="bg-white rounded-lg shadow-lg p-6 sticky top-24">
                <h2 className="text-xl font-semibold mb-4">Resumo do pedido</h2>
                
                {/* Products */}
                <div className="max-h-64 overflow-y-auto mb-4">
                  {cartItems.map((item: any) => (
                    <div key={`${item.id}-${item.size}`} className="flex py-3 border-b">
                      <div className="relative w-16 h-16 flex-shrink-0 bg-gray-100 rounded overflow-hidden">
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
                
                {/* Coupon */}
                <div className="mb-6">
                  <label className="block text-sm font-medium mb-2">Cupom de desconto</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                      placeholder="Digite o código"
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                    />
                    <button
                      type="button"
                      onClick={applyCoupon}
                      className="px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-700 transition-colors"
                    >
                      Aplicar
                    </button>
                  </div>
                </div>
                
                {/* Totals */}
                <div className="space-y-2 text-sm border-t pt-4">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Subtotal</span>
                    <span>R$ {subtotal.toFixed(2)}</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-gray-600">Frete</span>
                    <span>
                      {selectedShipping ? `R$ ${selectedShipping.price.toFixed(2)}` : '-'}
                    </span>
                  </div>
                  
                  {discount > 0 && (
                    <div className="flex justify-between text-green-600">
                      <span>Desconto</span>
                      <span>-R$ {discount.toFixed(2)}</span>
                    </div>
                  )}
                  
                  <div className="flex justify-between text-lg font-semibold pt-2 border-t">
                    <span>Total</span>
                    <span>R$ {total.toFixed(2)}</span>
                  </div>
                </div>
                
                {/* Security badges */}
                <div className="mt-6 pt-6 border-t">
                  <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                    Pagamento 100% seguro
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                    Seus dados protegidos
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <ToastContainer position="top-right" autoClose={3000} />
    </PageLayout>
  );
};

export default CheckoutPage;