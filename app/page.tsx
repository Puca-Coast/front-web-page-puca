// app/page.tsx
"use client";

import React from "react";
import { useSearchParams } from "next/navigation";
import HomeWithIntro from "@/components/Home/HomeWithIntro";
import HomeWithoutIntro from "@/components/Home/HomeWithoutIntro";

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
