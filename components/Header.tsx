"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import "../styles/headerStyles.css";
import CartModal from "./Cart/Cart";
import { useCart } from "@/app/context/CartContext";

export default function Header({ isHome }: { isHome: boolean }) {
  const { cartItems } = useCart();
  const [isVisible, setIsVisible] = useState(!isHome);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const headerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isHome) {
      const timer = setTimeout(() => {
        if (headerRef.current) {
          headerRef.current.style.display = "flex";
          setIsVisible(true);
        }
      }, 6000);

      return () => clearTimeout(timer);
    } else {
      if (headerRef.current) {
        headerRef.current.style.display = "flex";
      }
      setIsVisible(true);
    }
  }, [isHome]);

  const handleOpenCart = () => setIsCartOpen(true);
  const handleCloseCart = () => setIsCartOpen(false);

  return (
    <>
      <div
        ref={headerRef}
        className={`flex items-center justify-around py-7 px-5 w-full z-10 hover:bg-slate-50 group transition duration-500 ease-in-out bg-white border-b-2 border-black transition-opacity ${
          isVisible ? "opacity-100" : "opacity-0"
        }`}
        style={{ display: isHome ? "none" : "flex" }}
      >
        <Link href="/?skipIntro=true">
          <img src="/assets/logo_mini.svg" alt="Logo" />
        </Link>
        <div className="flex flex-col md:flex-row gap-4 md:gap-32">
          <Link href="/lookbook" className="headerText">
            Lookbook
          </Link>
          <Link href="/shop" className="headerText">
            Shop
          </Link>
          <Link href="/collections" className="headerText">
            Collections
          </Link>
        </div>
        <div className="flex items-center text-teal-500 group-hover:text-teal-500 transition duration-500 ease-in-out userLinks relative">
          {/* Botão do Carrinho */}
          <button
            onClick={handleOpenCart}
            className="cursor-pointer relative focus:outline-none"
            aria-label="Abrir carrinho de compras"
          >
            <img src="/assets/shoppingbag.svg" alt="shoppingbag_icon" />
            {cartItems.length > 0 && (
              <div className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-4 h-4 flex items-center justify-center text-xs energy-circle">
                {cartItems.length}
              </div>
            )}
          </button>
          {/* Ícone de Usuário */}
          <Link href="/login" className="ml-4">
            <img src="/assets/User.svg" alt="user_icon" />
          </Link>
        </div>
      </div>
      {/* Carrinho Modal */}
      <CartModal isOpen={isCartOpen} onClose={handleCloseCart} />
    </>
  );
}
