"use client";

import React from "react";
import { useCart } from "@/contexts/CartContext";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-toastify";
import Link from "next/link";

interface CartModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const CartModal: React.FC<CartModalProps> = ({ isOpen, onClose }) => {
  const { cartItems, removeFromCart, updateQuantity, getTotal, clearCart } = useCart();

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay */}
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-50 z-40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            className="fixed top-0 right-0 w-full sm:w-96 h-full bg-white z-50 shadow-lg overflow-y-auto"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "tween", duration: 0.3 }}
          >
            <div className="flex justify-between items-center p-4 border-b">
              <h2 className="text-2xl font-semibold">Seu Carrinho</h2>
              <button 
                onClick={onClose} 
                aria-label="Fechar carrinho"
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 text-gray-700"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="p-4">
              {cartItems.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12">
                  <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    className="h-16 w-16 text-gray-300 mb-4" 
                    fill="none" 
                    viewBox="0 0 24 24" 
                    stroke="currentColor"
                  >
                    <path 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      strokeWidth={1.5} 
                      d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" 
                    />
                  </svg>
                  <p className="text-center text-gray-500 mb-2">Seu carrinho está vazio</p>
                  <button 
                    onClick={onClose}
                    className="mt-4 px-4 py-2 bg-black text-white rounded-md hover:bg-gray-800 transition-colors"
                  >
                    Continuar Comprando
                  </button>
                </div>
              ) : (
                <div>
                  <div className="max-h-[calc(100vh-200px)] overflow-y-auto">
                    {cartItems.map((item) => (
                      <motion.div 
                        key={`${item.id}-${item.size}`} 
                        className="flex items-center py-4 border-b"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        <div className="relative w-20 h-20 flex-shrink-0 bg-gray-50 rounded-md overflow-hidden">
                          <Image
                            src={item.imageUrl}
                            alt={item.name}
                            fill
                            className="object-cover"
                            sizes="80px"
                          />
                        </div>
                        <div className="ml-4 flex-1">
                          <h3 className="text-base font-medium line-clamp-1">{item.name}</h3>
                          <div className="flex items-center text-sm text-gray-500 mt-1">
                            <span className="mr-2">Tamanho: {item.size}</span>
                            <span>R$ {item.price.toFixed(2)}</span>
                          </div>
                          <div className="flex items-center mt-2">
                            <button
                              onClick={() => updateQuantity(item.id, item.size, item.quantity - 1)}
                              className="w-8 h-8 flex items-center justify-center bg-gray-100 text-gray-700 rounded-l-md hover:bg-gray-200"
                              aria-label={`Diminuir quantidade de ${item.name}`}
                              disabled={item.quantity <= 1}
                            >
                              -
                            </button>
                            <span className="w-8 h-8 flex items-center justify-center border-t border-b">{item.quantity}</span>
                            <button
                              onClick={() => updateQuantity(item.id, item.size, item.quantity + 1)}
                              className="w-8 h-8 flex items-center justify-center bg-gray-100 text-gray-700 rounded-r-md hover:bg-gray-200"
                              aria-label={`Aumentar quantidade de ${item.name}`}
                            >
                              +
                            </button>
                          </div>
                        </div>
                        <button
                          onClick={() => {
                            removeFromCart(item.id, item.size);
                            toast.info("Item removido do carrinho");
                          }}
                          className="ml-2 p-2 text-gray-400 hover:text-red-500 transition-colors"
                          aria-label={`Remover ${item.name} do carrinho`}
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </motion.div>
                    ))}
                  </div>

                  <div className="mt-6 pt-4 border-t">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-gray-600">Subtotal</span>
                      <span className="font-medium">R$ {getTotal().toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between items-center mb-4">
                      <span className="text-gray-600">Frete</span>
                      <span className="font-medium">{getTotal() > 300 ? "Grátis" : "A calcular"}</span>
                    </div>
                    <div className="flex justify-between items-center text-lg font-semibold mb-6">
                      <span>Total</span>
                      <span>R$ {getTotal().toFixed(2)}</span>
                    </div>
                    
                    <div className="space-y-3">
                      <Link 
                        href="/checkout" 
                        onClick={onClose}
                        className="block w-full bg-black text-white text-center py-3 rounded-md hover:bg-gray-800 transition-colors font-medium"
                      >
                        Ir para checkout
                      </Link>
                      <button
                        onClick={() => {
                          // Implementar a lógica de finalização de compra
                          toast.success("Compra finalizada com sucesso!");
                          clearCart();
                          onClose();
                        }}
                        className="w-full bg-gray-800 text-white py-3 rounded-md hover:bg-gray-700 transition-colors font-medium"
                      >
                        Finalizar Compra Rápida
                      </button>
                      <button
                        onClick={onClose}
                        className="w-full bg-transparent border border-gray-300 text-gray-700 py-3 rounded-md hover:bg-gray-50 transition-colors"
                      >
                        Continuar Comprando
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default CartModal;
