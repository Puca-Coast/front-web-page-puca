"use client";

import React from "react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import ProductDetail from "@/components/features/products/ProductDetail";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

interface ProductParams {
  params: {
    id: string;
  }
}

// Esta função é executada durante o build para gerar todas as variantes estáticas desta página
export async function generateStaticParams() {
  // Como estamos usando SSG e não temos acesso à API no build time do Netlify,
  // vamos definir alguns IDs de produtos fixos para gerar páginas estáticas
  return [
    { id: '1' },
    { id: '2' },
    { id: '3' },
    { id: '4' },
    { id: '5' },
    // Adicione mais IDs conforme necessário
  ];
}

export default function ProductPage({ params }: ProductParams) {
  return (
    <div className="flex flex-col min-h-screen">
      <Header isHome={false} />
      <main className="flex-grow">
        <ProductDetail productId={params.id} />
      </main>
      <Footer isHome={false} />
      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
} 