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