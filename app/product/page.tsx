"use client";

import React, { useEffect, useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Image from "next/image";
import { useRouter, useParams } from "next/navigation";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

interface ProductType {
  _id: string;
  name: string;
  description?: string;
  price: number;
  imageData: string;
  hoverImageData: string;
  stockBySize: { size: string; stock: number }[];
}

const API_BASE_URL = "http://localhost:3000";

export default function Product() {
  const [product, setProduct] = useState<ProductType | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const params = useParams();
  const productId = params?.id;

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      try {
        const res = await fetch(`${API_BASE_URL}/api/products/${productId}`);
        if (!res.ok) throw new Error(`Erro ${res.status}`);
        const data = await res.json();
        if (data.success) {
          setProduct(data.data);
        } else {
          toast.error(data.message || "Erro ao carregar produto.");
        }
      } catch (error) {
        console.error(error);
        toast.error("Erro ao carregar produto.");
      } finally {
        setLoading(false);
      }
    };

    if (productId) {
      fetchProduct();
    }
  }, [productId]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Carregando...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Produto não encontrado.</p>
      </div>
    );
  }

  return (
    <>
      <Header isHome={false} />
      <div className="h-full w-full flex flex-col items-center justify-center py-10 px-4 lg:px-20">
        <div className="flex flex-col lg:flex-row w-full max-w-5xl">
          {/* Seção de Imagem */}
          <div className="w-full lg:w-1/2 flex flex-col items-center">
            <Image
              src={product.imageData}
              alt={product.name}
              width={500}
              height={500}
              className="object-cover rounded-md"
              loading="lazy"
              placeholder="blur"
              blurDataURL="/assets/placeholder.png"
              unoptimized
            />
          </div>
          {/* Seção de Detalhes */}
          <div className="w-full lg:w-1/2 flex flex-col px-8 mt-8 lg:mt-0">
            <h1 className="text-2xl font-bold mb-4">{product.name}</h1>
            <p className="text-sm text-gray-600 mb-2">Código: {product._id}</p>
            <p className="text-lg font-semibold mb-4">R$ {Number(product.price).toFixed(2)}</p>
            {product.stockBySize && product.stockBySize.length > 0 && (
              <div className="mb-4">
                <p className="text-md font-semibold">Estoque por Tamanho:</p>
                <ul className="list-disc ml-6">
                  {product.stockBySize.map((item) => (
                    <li key={item.size}>
                      {item.size}: {item.stock}
                    </li>
                  ))}
                </ul>
              </div>
            )}
            <button
              className="bg-teal-500 text-white py-3 px-6 text-lg flex items-center justify-center rounded-md hover:bg-teal-600 transition"
              onClick={() => {
                toast.success("Produto adicionado ao carrinho!");
              }}
              aria-label="Comprar produto"
            >
              <span className="mr-2">🛒</span> Comprar
            </button>
          </div>
        </div>
      </div>
      <Footer isHome={false} />
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar />
    </>
  );
}
