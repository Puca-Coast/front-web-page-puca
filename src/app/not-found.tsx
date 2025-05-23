import React from 'react';
import Link from 'next/link';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

export default function NotFound() {
  return (
    <>
      <Header isHome={false} />
      <div className="min-h-screen flex flex-col items-center justify-center p-5 text-center">
        <h1 className="text-4xl font-bold mb-4">404 - Página não encontrada</h1>
        <p className="text-lg mb-8">
          A página que você está procurando não existe ou foi removida.
        </p>
        <Link 
          href="/"
          className="bg-teal-500 text-white py-3 px-6 rounded-md hover:bg-teal-600 transition"
        >
          Voltar para Home
        </Link>
      </div>
      <Footer isHome={false} />
    </>
  );
} 