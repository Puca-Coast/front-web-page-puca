"use client";

import React, { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useCart } from "@/app/context/CartContext";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function Product() {
  const [selectedSize, setSelectedSize] = useState("3XL");
  const { addToCart } = useCart();
  const router = useRouter();

  const sizes = ["XS", "S", "M", "L", "XL", "2XL", "3XL"];
  const price = 349.9;

  const handleAddToCart = () => {
    const newItem = {
      id: "56KCET8CR", // Utilize um ID único para o produto
      name: "TRICOT SUFGANG YING YANG BLACK",
      size: selectedSize,
      price: price,
      imageUrl: "/assets/product-main.jpg", // Caminho da imagem principal
    };
    addToCart(newItem);
    toast.success("Item adicionado ao carrinho!");
    // Opcional: Redirecionar para o carrinho
    // router.push("/cart");
  };

  const [mainImage, setMainImage] = useState("/assets/product-main.jpg");

  return (
    <>
      <Header isHome={false} />
      <div className="h-full w-full flex flex-col items-center justify-center py-10 px-4 lg:px-20">
        <div className="flex flex-col lg:flex-row w-full max-w-5xl">
          {/* Image Section */}
          <div className="w-full lg:w-1/2 flex flex-col items-center">
            <Image
              src={mainImage}
              alt="Tricot Sufgang Ying Yang Black"
              width={500}
              height={500}
              className="object-cover rounded-md"
              loading="lazy"
              placeholder="blur"
              blurDataURL="/assets/placeholder.png" // Substitua pelo caminho da sua imagem placeholder
            />
            <div className="flex space-x-2 mt-4">
              {/* Thumbnail Images */}
              <button onClick={() => setMainImage("/assets/product-thumb1.jpg")} aria-label="Ver imagem 1">
                <Image
                  src="/assets/product-thumb1.jpg"
                  alt="Thumbnail 1"
                  width={60}
                  height={60}
                  className="border p-1 cursor-pointer rounded-md"
                  loading="lazy"
                  placeholder="blur"
                  blurDataURL="/assets/placeholder.png"
                />
              </button>
              <button onClick={() => setMainImage("/assets/product-thumb2.jpg")} aria-label="Ver imagem 2">
                <Image
                  src="/assets/product-thumb2.jpg"
                  alt="Thumbnail 2"
                  width={60}
                  height={60}
                  className="border p-1 cursor-pointer rounded-md"
                  loading="lazy"
                  placeholder="blur"
                  blurDataURL="/assets/placeholder.png"
                />
              </button>
              <button onClick={() => setMainImage("/assets/product-thumb3.jpg")} aria-label="Ver imagem 3">
                <Image
                  src="/assets/product-thumb3.jpg"
                  alt="Thumbnail 3"
                  width={60}
                  height={60}
                  className="border p-1 cursor-pointer rounded-md"
                  loading="lazy"
                  placeholder="blur"
                  blurDataURL="/assets/placeholder.png"
                />
              </button>
            </div>
          </div>

          {/* Product Details Section */}
          <div className="w-full lg:w-1/2 flex flex-col px-8 mt-8 lg:mt-0">
            <h1 className="text-2xl font-bold mb-4">TRICOT SUFGANG YING YANG BLACK</h1>
            <p className="text-sm text-gray-600 mb-2">Código: 56KCET8CR</p>
            <p className="text-lg font-semibold mb-4">Selecione o tamanho:</p>
            <div className="flex flex-wrap gap-2 mb-4">
              {sizes.map((size) => (
                <button
                  key={size}
                  onClick={() => setSelectedSize(size)}
                  className={`px-4 py-2 border rounded-md ${
                    selectedSize === size ? "bg-gray-200" : "bg-white"
                  } hover:bg-gray-100 transition`}
                  aria-label={`Selecionar tamanho ${size}`}
                >
                  {size}
                </button>
              ))}
            </div>
            <p className="text-2xl font-bold mb-4">R$ {price.toFixed(2)}</p>
            <button
              className="bg-teal-500 text-white py-3 px-6 text-lg flex items-center justify-center rounded-md hover:bg-teal-600 transition"
              onClick={handleAddToCart}
              aria-label="Adicionar ao carrinho"
            >
              <span className="mr-2">🛒</span> Comprar
            </button>
            <p className="text-sm text-gray-500 mt-2">Estoque: Disponível</p>
          </div>
        </div>
      </div>
      <Footer isHome={false} />
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar />
    </>
  );
}
