"use client";

import React from "react";
import { useSearchParams } from "next/navigation";
import HomeWithIntro from "@/components/features/home/HomeWithIntro";
import HomeWithoutIntro from "@/components/features/home/HomeWithoutIntro";

export default function Home() {
  const searchParams = useSearchParams();
  const skipIntro = searchParams?.get('skipIntro');
  const shouldSkipIntro = skipIntro === "true";

  console.log("Página Principal Renderizada");
  console.log("skipIntro:", skipIntro);
  console.log("shouldSkipIntro:", shouldSkipIntro);

  return (
    <>
      {shouldSkipIntro ? (
        <HomeWithoutIntro />
      ) : (
        <HomeWithIntro />
      )}
    </>
  );
} 