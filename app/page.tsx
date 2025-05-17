"use client";

import React, { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import HomeWithIntro from "@/components/Home/HomeWithIntro";
import HomeWithoutIntro from "@/components/Home/HomeWithoutIntro";

export default function Home() {
  const searchParams = useSearchParams();
  const skipIntro = searchParams?.get('skipIntro');
  const shouldSkipIntro = skipIntro === "true";
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return <div className="w-screen h-screen flex items-center justify-center bg-black text-white">Carregando...</div>;
  }

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
