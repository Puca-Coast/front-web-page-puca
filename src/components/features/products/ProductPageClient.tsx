"use client";

import React from "react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import ProductDetail from "@/components/features/products/ProductDetail";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

interface ProductPageClientProps {
  id: string;
}

export default function ProductPageClient({ id }: ProductPageClientProps) {
  return (
    <div className="flex flex-col min-h-screen">
      <Header isHome={false} />
      <main className="flex-grow">
        <ProductDetail productId={id} />
      </main>
      <Footer isHome={false} />
      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
} 