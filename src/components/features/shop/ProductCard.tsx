// src/components/Shop/ProductCard.tsx

"use client";

import React from "react";
import Image from "next/image";
import { useCart } from "@/contexts/CartContext";

interface Product {
  id: string;
  name: string;
  price: number;
  imageUrl: string;
  quantity: number;
  size: string;
}

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addToCart } = useCart();

  return (
    <div className="bg-white rounded-md shadow-md overflow-hidden">
      <div className="relative w-full h-64">
        <Image
          src={product.imageUrl}
          alt={product.name}
          fill
          className="object-cover"
          loading="lazy"
          placeholder="blur"
          blurDataURL="/assets/placeholder.png" // Substitua pelo caminho da sua imagem placeholder
        />
      </div>
      <div className="p-4">
        <h2 className="text-lg font-semibold mb-2">{product.name}</h2>
        <p className="text-gray-700">R$ {product.price.toFixed(2)}</p>
        <button
          onClick={() => addToCart(product)}
          className="mt-4 w-full bg-teal-500 text-white py-2 rounded-md hover:bg-teal-600 transition"
        >
          Adicionar ao Carrinho
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
