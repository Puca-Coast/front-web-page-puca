"use client";

import React from "react";
import dynamic from "next/dynamic";
import Home from "@/components/features/home/Home";

// Componente que vai ser carregado dinamicamente 
const DynamicHomeContent = dynamic(
  () => import('@/components/features/home/HomeContent'),
  { 
    ssr: false,
    loading: () => <div className="min-h-screen flex items-center justify-center">Carregando...</div>
  }
);

export default function HomePage() {
  return <DynamicHomeContent />;
} 