// components/Footer.js
"use client"; // Torna este componente um Client Component

import React from "react";
import "@/styles/footerStyle.css";
import Link from "next/link";
import { ROUTES } from "@/config/environment";
import { FaFacebook, FaInstagram, FaTwitter } from 'react-icons/fa';

export default function Footer() {
  return (
    <footer
      className="z-10 bg-white shadow group transition duration-500 w-full border-t-2 border-black"
    >
      <div className="w-full mx-auto max-w-screen-xl p-4 md:py-6">
        {/* Main Footer Content */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between footerContent gap-4">
          {/* Left side - Logo & Copyright */}
          <div className="flex flex-col items-center md:items-start mb-4 md:mb-0">
            <Link href="/" className="font-bold text-lg mb-2 md:mb-3">PUCA COAST</Link>
            <span className="text-sm text-teal-500 text-center md:text-left">
              © 2025{" "}
              <Link href="/" className="hover:underline">
                Puca Coast™
              </Link>
              . All Rights Reserved.
            </span>
          </div>
          
          {/* Middle - Navigation Links */}
          <div className="flex flex-col mb-4 md:mb-0">
            <h3 className="font-medium mb-2 text-center md:text-left">Links</h3>
            <ul className="flex flex-col text-sm font-medium text-teal-500">
              <li className="mb-1">
                <Link href="/privacy" className="hover:underline">
                  Termos e Condições
                </Link>
              </li>
              <li className="mb-1">
                <Link href="/contact" className="hover:underline">
                  Contato
                </Link>
              </li>
              <li className="mb-1">
                <Link href="/exchange-return" className="hover:underline">
                  Troca e Devolução
                </Link>
              </li>
            </ul>
          </div>
          
          {/* Right side - Social Media */}
          <div className="flex flex-col items-center md:items-end">
            <h3 className="font-medium mb-2">Siga-nos</h3>
            <div className="flex space-x-4">
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="text-gray-500 hover:text-black transition-colors">
                <FaInstagram size={20} />
              </a>
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="text-gray-500 hover:text-black transition-colors">
                <FaFacebook size={20} />
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" aria-label="Twitter" className="text-gray-500 hover:text-black transition-colors">
                <FaTwitter size={20} />
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
