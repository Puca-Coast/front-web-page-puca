"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import "@/styles/headerStyles.css";
import CartModal from "@/components/features/cart/Cart";
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/contexts/AuthContext";

export default function Header({ isHome }: { isHome: boolean }) {
  const { cartItems } = useCart();
  const { user, isLoading } = useAuth();
  const [isVisible, setIsVisible] = useState(!isHome);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const headerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (isHome) {
      const timer = setTimeout(() => {
        if (headerRef.current) {
          headerRef.current.style.display = "flex";
          setIsVisible(true);
        }
      }, 600);
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
  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  // Determina se o usuário está autenticado baseado no contexto
  const isAuthenticated = !!user && !isLoading;

  return (
    <>
      <div
        ref={headerRef}
        className={`puca-header fixed top-0 left-0 right-0 flex items-center justify-between py-4 px-5 w-full z-30 transition-all duration-500 ease-in-out bg-white border-b-2 border-black ${
          isVisible ? "opacity-100" : "opacity-0"
        }`}
        style={{ display: isHome ? "none" : "flex" }}
      >
        <Link href="/?skipIntro=true">
          <img
            src="/assets/logo_mini.png"
            alt="Logo"
            className="w-24 transform rotate-[-10deg] transition-transform duration-500 hover:rotate-0"
          />
        </Link>
        
        {/* Links de navegação */}
        <div className="hidden md:flex flex-row gap-8">
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
        
        {/* Ícones do usuário (apenas no desktop) */}
        <div className="hidden md:flex items-center text-teal-500 relative">
          <button
            onClick={handleOpenCart}
            className="cursor-pointer relative focus:outline-none"
            aria-label="Abrir carrinho de compras"
          >
            <img
              src="/assets/shoppingbag.svg"
              alt="shoppingbag_icon"
              className="w-6 h-6 transition-transform duration-500 hover:scale-110"
            />
            {cartItems.length > 0 && (
              <div className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-4 h-4 flex items-center justify-center text-xs">
                {cartItems.length}
              </div>
            )}
          </button>
          
          {/* Condicional para mostrar perfil ou login */}
          {isAuthenticated ? (
            <Link href="/auth/profile" className="ml-4" title={`Perfil - ${user.email}`}>
              <img
                src="/assets/User.svg"
                alt="user_icon"
                className="w-6 h-6 transition-transform duration-500 hover:scale-110"
              />
            </Link>
          ) : (
            <Link href="/login" className="ml-4" title="Fazer Login">
              <img
                src="/assets/User.svg"
                alt="user_icon"
                className="w-6 h-6 transition-transform duration-500 hover:scale-110"
              />
            </Link>
          )}
        </div>
        
        {/* Botão do menu móvel */}
        <div className="md:hidden flex items-center">
          <button
            onClick={toggleMenu}
            aria-label="Abrir menu"
            className="focus:outline-none transition-transform duration-500 hover:scale-110"
          >
            <svg
              className="w-8 h-8"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 18"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeWidth="2"
                d="M3 3h18M3 9h18M3 15h18"
              />
            </svg>
          </button>
        </div>
      </div>
      
      {/* Menu móvel */}
      <div
        className={`md:hidden fixed top-0 left-0 w-full h-full bg-white z-20 transform ${
          isMenuOpen ? "translate-x-0" : "translate-x-full"
        } transition-transform duration-500 ease-in-out`}
      >
        <div className="flex items-center justify-between px-5 py-4 border-b-2 border-black">
          <Link href="/?skipIntro=true">
            <img
              src="/assets/logo_mini.png"
              alt="Logo"
              className="w-20 transform rotate-[-10deg]"
            />
          </Link>
          <button
            onClick={toggleMenu}
            className="focus:outline-none"
            aria-label="Fechar menu"
          >
            <svg
              className="w-8 h-8"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path strokeLinecap="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <div className="flex flex-col items-center justify-center mt-10 space-y-6">
          <Link href="/lookbook" onClick={toggleMenu} className="text-2xl font-semibold">
            Lookbook
          </Link>
          <Link href="/shop" onClick={toggleMenu} className="text-2xl font-semibold">
            Shop
          </Link>
          <Link href="/collections" onClick={toggleMenu} className="text-2xl font-semibold">
            Collections
          </Link>
        </div>
        
        {/* Ícones do usuário dentro do menu móvel */}
        <div className="flex justify-center mt-10 space-x-6">
          <button
            onClick={() => {
              handleOpenCart();
              toggleMenu();
            }}
            className="focus:outline-none relative"
            aria-label="Abrir carrinho de compras"
          >
            <img
              src="/assets/shoppingbag.svg"
              alt="shoppingbag_icon"
              className="w-8 h-8 transition-transform duration-500 hover:scale-110"
            />
            {cartItems.length > 0 && (
              <div className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-4 h-4 flex items-center justify-center text-xs">
                {cartItems.length}
              </div>
            )}
          </button>
          
          {isAuthenticated ? (
            <Link href="/auth/profile" onClick={toggleMenu} title={`Perfil - ${user.email}`}>
              <img
                src="/assets/User.svg"
                alt="user_icon"
                className="w-8 h-8 transition-transform duration-500 hover:scale-110"
              />
            </Link>
          ) : (
            <Link href="/login" onClick={toggleMenu} title="Fazer Login">
              <img
                src="/assets/User.svg"
                alt="user_icon"
                className="w-8 h-8 transition-transform duration-500 hover:scale-110"
              />
            </Link>
          )}
        </div>
      </div>
      
      {/* Carrinho Modal */}
      <CartModal isOpen={isCartOpen} onClose={handleCloseCart} />
    </>
  );
}