// components/Footer.js
"use client"; // Torna este componente um Client Component

import React, { useEffect, useRef, useState } from "react";
import "../styles/footerStyle.css";

export default function Footer(props) {
  const { isHome = false } = props; // Padrão para false
  const [isVisible, setIsVisible] = useState(!isHome); // Se não for Home, já está visível
  const footerRef = useRef(null);

  useEffect(() => {
    if (isHome) {
      // Define o timer para exibir o footer após 6 segundos
      const timer = setTimeout(() => {
        if (footerRef.current) {
          footerRef.current.style.display = "flex";
          setIsVisible(true);
        }
      }, 6000);

      return () => clearTimeout(timer); // Limpa o timer quando o componente desmonta
    } else {
      // Se não for Home, mostra imediatamente
      if (footerRef.current) {
        footerRef.current.style.display = "flex";
      }
      setIsVisible(true);
    }
  }, [isHome]);

  return (
    <footer
      ref={footerRef}
      className={`z-40 bg-white shadow hover:bg-slate-50 group transition duration-500 fixed ease-in-out bottom-0 w-full border-t-2 border-black transition-opacity ${
        isVisible ? "opacity-100" : "opacity-0"
      }`}
      style={{ display: isHome ? "none" : "flex" }} // Inicia com display none se for Home
    >
      <div className="w-full mx-auto max-w-screen-xl p-4 flex flex-col md:flex-row md:items-center md:justify-between footerContent">
        <span className="text-sm text-teal-500 text-center md:text-left dark:text-teal-500">
          © 2023{" "}
          <a href="https://pucacoast.com/" className="hover:underline">
            Puca Coast™
          </a>
          . All Rights Reserved.
        </span>
        <ul className="flex flex-col md:flex-row flex-wrap items-center mt-3 md:mt-0 text-sm font-medium text-teal-500 dark:text-teal-500">
          <li>
            <a href="/privacy" className="hover:underline mr-4 md:mr-6">
              Termos e Condições
            </a>
          </li>
          <li>
            <a href="#" className="hover:underline mr-4 md:mr-6">
              Contato
            </a>
          </li>
          <li>
            <a href="#" className="hover:underline mr-4 md:mr-6">
              Troca e Devolução
            </a>
          </li>
        </ul>
      </div>
    </footer>
  );
}
