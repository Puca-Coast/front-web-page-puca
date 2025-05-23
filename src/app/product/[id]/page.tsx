import React from "react";
import ProductPageClient from "@/components/features/products/ProductPageClient";

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
  return <ProductPageClient id={params.id} />;
} 