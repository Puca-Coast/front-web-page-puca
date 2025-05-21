// components/CartButton.tsx

"use client";

import React from "react";
import { useCart } from "@/contexts/CartContext";

interface CartButtonProps {
  onOpen: () => void;
}

const CartButton: React.FC<CartButtonProps> = ({ onOpen }) => {
  const { cartItems } = useCart();

  const totalQuantity = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <button
      onClick={onOpen}
      className="relative p-2 text-gray-700 hover:text-teal-500 transition"
      aria-label="Abrir carrinho de compras"
    >
      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2 9m5-9v9m4-9v9m1-10a1 1 0 00-1-1h-4a1 1 0 00-1 1v1h6V4z"
        />
      </svg>
      {totalQuantity > 0 && (
        <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white bg-red-600 rounded-full">
          {totalQuantity}
        </span>
      )}
    </button>
  );
};

export default CartButton;
