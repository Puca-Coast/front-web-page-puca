"use client";

import React from "react";
import { useCart } from "@/contexts/CartContext";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";

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
              <h2 className="text-2xl font-semibold">Carrinho</h2>
              <button onClick={onClose} aria-label="Fechar carrinho">
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
                <p className="text-center text-gray-500">Seu carrinho está vazio.</p>
              ) : (
                <div>
                  {cartItems.map((item) => (
                    <div key={`${item.id}-${item.size}`} className="flex items-center mb-4">
                      <div className="relative w-16 h-16 flex-shrink-0">
                        <Image
                          src={item.imageUrl}
                          alt={item.name}
                          fill
                          className="object-cover rounded-md"
                          loading="lazy"
                          placeholder="blur"
                          blurDataURL="/assets/placeholder.png" // Substitua pelo caminho da sua imagem placeholder
                        />
                      </div>
                      <div className="ml-4 flex-1">
                        <h3 className="text-lg font-medium">{item.name}</h3>
                        {item.size && <p className="text-gray-600">Tamanho: {item.size}</p>}
                        <p className="text-gray-600">R$ {item.price.toFixed(2)}</p>
                        <div className="flex items-center mt-2">
                          <button
                            onClick={() => updateQuantity(item.id, item.size, item.quantity - 1)}
                            className="px-2 py-1 bg-gray-200 text-gray-700 rounded-l"
                            aria-label={`Diminuir quantidade de ${item.name}`}
                          >
                            -
                          </button>
                          <span className="px-4 py-1 border-t border-b">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.id, item.size, item.quantity + 1)}
                            className="px-2 py-1 bg-gray-200 text-gray-700 rounded-r"
                            aria-label={`Aumentar quantidade de ${item.name}`}
                          >
                            +
                          </button>
                        </div>
                      </div>
                      <button
                        onClick={() => removeFromCart(item.id, item.size)}
                        className="ml-4 text-red-500"
                        aria-label={`Remover ${item.name} do carrinho`}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  ))}

                  <div className="mt-6">
                    <div className="flex justify-between items-center">
                      <span className="text-xl font-semibold">Total:</span>
                      <span className="text-xl font-semibold">R$ {getTotal().toFixed(2)}</span>
                    </div>
                    <button
                      onClick={() => {
                        // Implementar a lógica de finalização de compra
                        alert("Compra finalizada!");
                        clearCart();
                        onClose();
                      }}
                      className="w-full mt-4 bg-teal-500 text-white py-2 rounded-md hover:bg-teal-600 transition"
                    >
                      Finalizar Compra
                    </button>
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
