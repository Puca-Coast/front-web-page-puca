"use client";

import React from "react";
import { useSearchParams } from "next/navigation";
import Home from "@/components/features/home/Home";

export default function HomePage() {
  const searchParams = useSearchParams();
  const skipIntro = searchParams?.get('skipIntro');
  const shouldSkipIntro = skipIntro === "true";

  console.log("Página Principal Renderizada");
  console.log("skipIntro:", skipIntro);
  console.log("shouldSkipIntro:", shouldSkipIntro);

  return <Home showIntro={!shouldSkipIntro} />;
} 